import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LocationUpdateDto } from '../dtos/location-update.dto';
import { RiderLocationService } from '../services/rider-location.service';
import { Role } from 'src/shared/auth/enums/role.enum';
import { WsJwtAuthGuard } from 'src/shared/auth/guards/ws-jwt-auth.guard';
import { Roles } from 'src/shared/auth/decorators/roles.decorator';

@WebSocketGateway({
  cors: {
    origin: '*', // Configure this properly in production
  },
  namespace: '/tracking',
})
export class TrackingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(TrackingGateway.name);

  constructor(
    private readonly riderLocationService: RiderLocationService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) {
        throw new Error('Authentication token not provided.');
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('auth.jwtSecret'),
      });

      client.data.user = payload;
      const { userId, role, activeOrderId } = payload;
      this.logger.log(`Client connected: ${client.id} - UserID: ${userId} - Role: ${role}`);

      if (role === Role.Rider) {
        client.join(`rider:${userId}`);
      } else if (role === Role.Customer && activeOrderId) {
        // In a real scenario, we'd verify the user owns this order
        client.join(`order:${activeOrderId}`);
        this.logger.log(`Customer ${userId} joined room for order ${activeOrderId}`);
      }
    } catch (error) {
      this.logger.error(`Authentication failed for client ${client.id}: ${error.message}`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.user?.userId;
    this.logger.log(`Client disconnected: ${client.id} - UserID: ${userId || 'N/A'}`);
  }

  @UseGuards(WsJwtAuthGuard)
  @Roles(Role.Rider)
  @SubscribeMessage('updateLocation')
  async handleUpdateLocation(
    @MessageBody() data: LocationUpdateDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const riderId = client.data.user.userId;
    try {
      const activeTask = await this.riderLocationService.processRiderLocationUpdate(riderId, data);
      
      if (activeTask && activeTask.orderId) {
        const payload = {
            lat: data.latitude,
            lng: data.longitude,
            timestamp: data.timestamp,
        };
        // Broadcast the location to the customer's room
        this.server.to(`order:${activeTask.orderId}`).emit('riderLocationUpdate', payload);
      }
    } catch (error) {
      this.logger.error(`Error processing location update for rider ${riderId}: ${error.message}`, error.stack);
      // Optionally emit an error back to the rider
      client.emit('locationUpdateError', { message: 'Failed to process location update.' });
    }
  }

  // Method to be called by other services (e.g., AllocationService)
  public sendTaskOffer(riderId: string, taskDetails: any): void {
    this.logger.log(`Emitting 'newTaskOffer' to rider: ${riderId}`);
    this.server.to(`rider:${riderId}`).emit('newTaskOffer', taskDetails);
  }
}