import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WsJwtGuard implements CanActivate {
  private readonly logger = new Logger(WsJwtGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType() !== 'ws') {
      return true;
    }

    const client: Socket = context.switchToWs().getClient<Socket>();
    const token = this.extractTokenFromHandshake(client);

    if (!token) {
      this.logger.warn('WebSocket connection attempt without JWT token.');
      this.disconnect(client, 'Authentication token not provided.');
      return false;
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('jwt.secret'),
      });
      // Attach the user payload to the socket object for later use in the gateway
      client['user'] = payload;
    } catch (error) {
      this.logger.warn(`WebSocket JWT validation failed: ${error.message}`);
      this.disconnect(client, `Authentication error: ${error.message}`);
      return false;
    }

    return true;
  }

  private extractTokenFromHandshake(client: Socket): string | undefined {
    const authHeader = client.handshake.headers.authorization;
    if (!authHeader) {
      return undefined;
    }
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
  
  private disconnect(client: Socket, message: string) {
    client.emit('error', new WsException(message));
    client.disconnect();
  }
}