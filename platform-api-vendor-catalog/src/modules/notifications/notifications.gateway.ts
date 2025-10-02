import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { WsJwtAuthGuard } from '../../common/guards/ws-jwt-auth.guard';

interface AuthenticatedSocket extends Socket {
  user: {
    userId: string;
    vendorId: string;
    roles: string[];
  };
}

@WebSocketGateway({
  cors: {
    origin: '*', // Should be restricted in production
  },
  namespace: '/vendor',
})
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  private readonly connectedClients = new Map<string, AuthenticatedSocket>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway Initialized');
  }

  async handleConnection(client: AuthenticatedSocket, ...args: any[]) {
    try {
      const token =
        client.handshake.auth.token || client.handshake.headers['authorization']?.split(' ')[1];
      if (!token) {
        throw new Error('No authentication token found');
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      
      // Attach user payload to the socket instance for future use
      client.user = payload;
      
      // Only allow vendors to connect
      if (!payload.vendorId || !payload.roles.includes('vendor')) {
          throw new Error('User is not a vendor.');
      }

      this.connectedClients.set(payload.vendorId, client);
      client.join(payload.vendorId); // Join a room named after the vendorId

      this.logger.log(`Vendor client connected: ${payload.vendorId} (Socket ID: ${client.id})`);
    } catch (error) {
      this.logger.error(`Authentication failed for client ${client.id}: ${error.message}`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.user && client.user.vendorId) {
      this.connectedClients.delete(client.user.vendorId);
      this.logger.log(`Vendor client disconnected: ${client.user.vendorId} (Socket ID: ${client.id})`);
    } else {
      this.logger.log(`Unauthenticated client disconnected: ${client.id}`);
    }
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('ping')
  handlePing(
    @MessageBody() data: string,
    @ConnectedSocket() client: AuthenticatedSocket,
  ): { event: string; data: string } {
    this.logger.log(`Received ping from ${client.user.vendorId}: ${data}`);
    return { event: 'pong', data: 'pong' };
  }

  /**
   * Sends a notification to a specific vendor.
   * This method is called by other services (e.g., BulkImportService) to push real-time updates.
   * @param vendorId The ID of the vendor to notify.
   * @param event The name of the event to emit.
   * @param data The payload for the event.
   */
  sendNotificationToVendor(vendorId: string, event: string, data: any): boolean {
    const clientSocket = this.connectedClients.get(vendorId);
    if (clientSocket) {
      this.logger.log(`Sending event '${event}' to vendor ${vendorId}`);
      this.server.to(vendorId).emit(event, data);
      return true;
    } else {
      this.logger.warn(`Could not send notification. Vendor ${vendorId} is not connected.`);
      // In a production system, this could be queued to a database for later retrieval.
      return false;
    }
  }
}