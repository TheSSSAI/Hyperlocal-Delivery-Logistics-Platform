import {
  Injectable,
  Logger,
  Inject,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, catchError } from 'rxjs';
import { AxiosError } from 'axios';

import { ChatRepository } from './chat.repository';
import { SendMessageDto } from './dtos/send-message.dto';
import { ChatMessage } from './entities/chat-message.entity';
import { ChatRoom } from './entities/chat-room.entity';
import { OrderAcceptedEvent, OrderFinalizedEvent, RiderAssignedEvent } from './events/order-events.dto';


@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private readonly orderServiceUrl: string;
  private readonly participantCacheTtl: number;

  constructor(
    private readonly chatRepository: ChatRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.orderServiceUrl = this.configService.get<string>('chat.orderServiceUrl');
    this.participantCacheTtl = this.configService.get<number>('chat.participantCacheTtlSeconds', 300);
    if (!this.orderServiceUrl) {
      throw new Error('Order Service URL is not configured.');
    }
  }

  /**
   * Creates and persists a new chat message after validating permissions.
   * @param userId - The ID of the user sending the message.
   * @param sendMessageDto - The DTO containing message details.
   * @returns The created ChatMessage entity.
   * @throws ForbiddenException if the chat room is read-only.
   * @throws NotFoundException if the chat room does not exist.
   */
  async createMessage(
    userId: string,
    sendMessageDto: SendMessageDto,
  ): Promise<ChatMessage> {
    const { orderId, messageText } = sendMessageDto;
    this.logger.log(`Attempting to create message for orderId: ${orderId} by userId: ${userId}`);

    const room = await this.chatRepository.findRoomByOrderId(orderId);

    if (!room) {
      this.logger.warn(`Chat room for orderId ${orderId} not found.`);
      throw new NotFoundException(`Chat room for order ${orderId} not found.`);
    }

    if (room.is_readonly) {
      this.logger.warn(
        `User ${userId} attempted to send a message to a read-only room for orderId ${orderId}.`,
      );
      throw new ForbiddenException('This chat is closed and read-only.');
    }

    if (!room.participants.includes(userId)) {
        this.logger.warn(`User ${userId} is not a participant in the room for orderId ${orderId}`);
        throw new ForbiddenException('You are not a participant in this chat room.');
    }

    const newMessage = new ChatMessage();
    newMessage.order_id = orderId;
    newMessage.sender_id = userId;
    newMessage.message_text = messageText;

    const savedMessage = await this.chatRepository.saveMessage(newMessage);
    this.logger.log(`Message saved with ID: ${savedMessage.id} for orderId: ${orderId}`);
    
    return savedMessage;
  }

  /**
   * Authorizes if a user is a valid participant for an order's chat room.
   * It uses a cache-aside strategy to fetch participant data from the Order service.
   * @param userId - The user ID to authorize.
   * @param orderId - The order ID representing the chat room.
   * @returns A boolean indicating if the user is authorized.
   */
  async authorizeUserForRoom(
    userId: string,
    orderId: string,
  ): Promise<boolean> {
    const cacheKey = `order-participants:${orderId}`;
    let participants: string[] = await this.cacheManager.get<string[]>(cacheKey);

    if (participants) {
      this.logger.debug(`Cache hit for participants of orderId: ${orderId}`);
    } else {
      this.logger.debug(`Cache miss for participants of orderId: ${orderId}. Fetching from Order Service.`);
      try {
        const url = `${this.orderServiceUrl}/internal/orders/${orderId}/participants`;
        const { data } = await firstValueFrom(
          this.httpService.get<{ customerId: string; vendorId: string; riderId: string | null }>(url).pipe(
            catchError((error: AxiosError) => {
              this.logger.error(`Error fetching participants for order ${orderId}: ${error.message}`, error.stack);
              throw new NotFoundException(`Could not retrieve order details for ${orderId}.`);
            }),
          ),
        );

        participants = [data.customerId, data.vendorId];
        if (data.riderId) {
          participants.push(data.riderId);
        }
        
        await this.cacheManager.set(cacheKey, participants, this.participantCacheTtl * 1000); // ttl is in ms
        this.logger.log(`Fetched and cached participants for orderId: ${orderId}`);

      } catch (error) {
        this.logger.error(`Failed to authorize user ${userId} for order ${orderId} due to service error.`, error.stack);
        return false; // Fail-closed security principle
      }
    }

    const isAuthorized = participants.includes(userId);
    if (!isAuthorized) {
      this.logger.warn(`Authorization failed for user ${userId} in room ${orderId}.`);
    }
    return isAuthorized;
  }

  /**
   * Creates a new chat room based on an 'order.accepted' event.
   * @param payload - The event payload from the Order service.
   */
  async createRoomFromEvent(payload: OrderAcceptedEvent): Promise<void> {
    const { orderId, customerId, vendorId } = payload;
    this.logger.log(`Received order.accepted event for orderId: ${orderId}. Creating chat room.`);
    
    const existingRoom = await this.chatRepository.findRoomByOrderId(orderId);
    if (existingRoom) {
        this.logger.warn(`Chat room for orderId ${orderId} already exists. Skipping creation.`);
        return;
    }

    const newRoom = new ChatRoom();
    newRoom.order_id = orderId;
    newRoom.participants = [customerId, vendorId];
    newRoom.is_readonly = false;

    await this.chatRepository.createRoom(newRoom);
    this.logger.log(`Chat room created for orderId: ${orderId}`);
  }

  /**
   * Adds a rider to an existing chat room based on an 'order.rider_assigned' event.
   * @param payload - The event payload containing orderId and riderId.
   */
  async addParticipantToRoomFromEvent(payload: RiderAssignedEvent): Promise<void> {
    const { orderId, riderId } = payload;
    this.logger.log(`Received order.rider_assigned event for orderId: ${orderId}. Adding rider: ${riderId}.`);

    const room = await this.chatRepository.findRoomByOrderId(orderId);
    if (!room) {
        this.logger.error(`Cannot add participant. Chat room for orderId ${orderId} not found.`);
        return; // Or throw an error to be handled by the listener
    }

    if (!room.participants.includes(riderId)) {
        room.participants.push(riderId);
        await this.chatRepository.updateRoom(room);
        this.logger.log(`Rider ${riderId} added to chat room for orderId: ${orderId}`);
        // Invalidate participant cache to force re-fetch on next auth check
        await this.cacheManager.del(`order-participants:${orderId}`);
    } else {
        this.logger.warn(`Rider ${riderId} is already a participant in room for orderId: ${orderId}.`);
    }
  }

  /**
   * Sets a chat room to read-only based on an order finalization event.
   * @param payload - The event payload from the Order service.
   */
  async setRoomReadOnlyFromEvent(payload: OrderFinalizedEvent): Promise<void> {
    const { orderId } = payload;
    this.logger.log(`Received order finalization event for orderId: ${orderId}. Setting room to read-only.`);

    const room = await this.chatRepository.findRoomByOrderId(orderId);
    if (!room) {
      this.logger.warn(`Chat room for orderId ${orderId} not found. Cannot set to read-only.`);
      return;
    }

    if (!room.is_readonly) {
        room.is_readonly = true;
        await this.chatRepository.updateRoom(room);
        this.logger.log(`Chat room for orderId ${orderId} is now read-only.`);
        // Invalidate participant cache as the room rules have changed
        await this.cacheManager.del(`order-participants:${orderId}`);
    } else {
        this.logger.log(`Chat room for orderId ${orderId} was already read-only.`);
    }
  }

  /**
   * Retrieves the full chat history for a specific order.
   * This is intended for use by administrators.
   * @param orderId - The ID of the order.
   * @returns An array of ChatMessage entities.
   */
  async getChatHistory(orderId: string): Promise<ChatMessage[]> {
    this.logger.log(`Fetching chat history for orderId: ${orderId}`);
    return this.chatRepository.findMessagesByOrderId(orderId);
  }
}