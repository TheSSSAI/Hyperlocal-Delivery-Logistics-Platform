import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ChatMessage } from './entities/chat-message.entity';
import { ChatRoom } from './entities/chat-room.entity';
import { SendMessageDto } from './dtos/send-message.dto';

@Injectable()
export class ChatRepository {
  private readonly logger = new Logger(ChatRepository.name);

  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(ChatMessage)
    private readonly chatMessageRepository: Repository<ChatMessage>,
  ) {}

  async findRoomByOrderId(orderId: string): Promise<ChatRoom | null> {
    try {
      return await this.chatRoomRepository.findOne({ where: { orderId } });
    } catch (error) {
      this.logger.error(
        `Failed to find chat room for orderId: ${orderId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'An error occurred while fetching chat room data.',
      );
    }
  }

  async findOrCreateRoom(
    orderId: string,
    participants: string[],
  ): Promise<ChatRoom> {
    const existingRoom = await this.findRoomByOrderId(orderId);
    if (existingRoom) {
      return existingRoom;
    }
    return this.createRoom(orderId, participants);
  }

  async createRoom(orderId: string, participants: string[]): Promise<ChatRoom> {
    try {
      const newRoom = this.chatRoomRepository.create({
        orderId,
        participants,
      });
      await this.chatRoomRepository.save(newRoom);
      return newRoom;
    } catch (error) {
      // Catch unique constraint violation error (code 23505 for PostgreSQL)
      if (error.code === '23505') {
        this.logger.warn(
          `Attempted to create a duplicate chat room for orderId: ${orderId}`,
        );
        throw new ConflictException(
          `A chat room for order ${orderId} already exists.`,
        );
      }
      this.logger.error(
        `Failed to create chat room for orderId: ${orderId}`,
        error.stack,
      );
      throw new InternalServerErrorException('Could not create chat room.');
    }
  }

  async updateRoom(
    criteria: FindOptionsWhere<ChatRoom>,
    partialEntity: Partial<ChatRoom>,
  ): Promise<ChatRoom> {
    const room = await this.chatRoomRepository.findOne({ where: criteria });
    if (!room) {
      throw new NotFoundException(
        `Chat room not found with criteria: ${JSON.stringify(criteria)}`,
      );
    }
    Object.assign(room, partialEntity);
    try {
      return await this.chatRoomRepository.save(room);
    } catch (error) {
      this.logger.error(
        `Failed to update chat room ${room.id}`,
        error.stack,
      );
      throw new InternalServerErrorException('Could not update chat room.');
    }
  }

  async saveMessage(
    senderId: string,
    sendMessageDto: SendMessageDto,
  ): Promise<ChatMessage> {
    try {
      const { orderId, messageText, conversationId } = sendMessageDto;
      const newMessage = this.chatMessageRepository.create({
        orderId,
        senderId,
        messageText,
        conversationId,
      });
      return await this.chatMessageRepository.save(newMessage);
    } catch (error) {
      this.logger.error(
        `Failed to save message for orderId: ${sendMessageDto.orderId}`,
        error.stack,
      );
      throw new InternalServerErrorException('Could not save message.');
    }
  }

  async findMessagesByOrderId(orderId: string): Promise<ChatMessage[]> {
    try {
      return await this.chatMessageRepository.find({
        where: { orderId },
        order: { createdAt: 'ASC' },
      });
    } catch (error) {
      this.logger.error(
        `Failed to find messages for orderId: ${orderId}`,
        error.stack,
      );
      throw new InternalServerErrorException('Could not retrieve messages.');
    }
  }

  async deleteMessagesOlderThan(date: Date): Promise<number> {
    try {
      const result = await this.chatMessageRepository
        .createQueryBuilder()
        .delete()
        .where('createdAt < :date', { date })
        .execute();
      const affectedRows = result.affected || 0;
      if (affectedRows > 0) {
        this.logger.log(`Deleted ${affectedRows} old chat messages.`);
      }
      return affectedRows;
    } catch (error) {
      this.logger.error(
        'Failed to delete old chat messages',
        error.stack,
      );
      throw new InternalServerErrorException(
        'An error occurred during chat history cleanup.',
      );
    }
  }
}