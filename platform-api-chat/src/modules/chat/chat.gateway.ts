import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  Logger,
  UseGuards,
  ValidationPipe,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { WsJwtGuard } from './guards/ws-jwt.guard';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dtos/send-message.dto';

// REQ-1-081, REQ-1-015: Core WebSocket gateway for real-time chat.
// REQ-1-092, REQ-1-096: Secured with WSS (via infra) and JWTs (via WsJwtGuard).
// REQ-1-100: Designed for scalability via Redis adapter (configured in main.ts).
@UseGuards(WsJwtGuard)
@WebSocketGateway({
  cors: {
    origin: '*', // In production, this should be a specific list of allowed origins.
  },
  namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(private readonly chatService: ChatService) {}

  /**
   * Handles new client connections.
   * Authenticates the user via WsJwtGuard and authorizes them for the requested order's chat room.
   * @param client The connecting socket client.
   */
  async handleConnection(client: Socket): Promise<void> {
    const user = client.handshake.auth.user;
    const orderId = client.handshake.query.orderId as string;

    if (!orderId) {
      this.logger.warn(
        `Client ${client.id} connection rejected: Missing orderId.`,
      );
      client.emit('error', { message: 'Missing orderId in connection query.' });
      client.disconnect();
      return;
    }

    try {
      const isAuthorized = await this.chatService.authorizeUserForRoom(
        user.userId,
        orderId,
      );

      if (!isAuthorized) {
        throw new ForbiddenException(
          'User is not a participant in this order chat.',
        );
      }

      client.join(orderId);
      this.logger.log(
        `Client ${client.id} (User: ${user.userId}) connected and joined room: ${orderId}`,
      );
    } catch (error) {
      this.logger.error(
        `Authorization failed for User ${user.userId} on room ${orderId}: ${error.message}`,
      );
      client.emit('error', {
        message: 'Authorization failed: ' + error.message,
      });
      client.disconnect();
    }
  }

  /**
   * Handles client disconnections.
   * @param client The disconnecting socket client.
   */
  handleDisconnect(client: Socket): void {
    const user = client.handshake.auth.user;
    this.logger.log(
      `Client ${client.id} (User: ${
        user?.userId || 'unknown'
      }) disconnected.`,
    );
  }

  /**
   * Handles incoming 'sendMessage' events from clients.
   * Persists the message and broadcasts it to the other participants in the room.
   * @param client The client sending the message.
   * @param payload The message payload.
   */
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody(new ValidationPipe()) payload: SendMessageDto,
  ): Promise<void> {
    const user = client.handshake.auth.user;
    const { orderId, messageText } = payload;

    try {
      // Re-authorize to ensure user is still a participant and room is not read-only
      const isAuthorized = await this.chatService.authorizeUserForRoom(
        user.userId,
        orderId,
        true, // check if room is writable
      );

      if (!isAuthorized) {
        throw new ForbiddenException('User cannot send messages to this room.');
      }

      const createdMessage = await this.chatService.createMessage(
        user.userId,
        orderId,
        messageText,
      );

      // Broadcast to all other clients in the room
      client.to(orderId).emit('newMessage', createdMessage);

      this.logger.verbose(
        `Message from User ${user.userId} broadcasted to room ${orderId}`,
      );
    } catch (error) {
      const errorMessage =
        error instanceof ForbiddenException || error instanceof NotFoundException
          ? error.message
          : 'Failed to send message.';

      this.logger.error(
        `Failed to handle 'sendMessage' from User ${user.userId} for room ${orderId}: ${error.message}`,
      );

      // Send a specific error event back to the sender
      client.emit('error', {
        event: 'sendMessage',
        message: errorMessage,
      });
    }
  }
}