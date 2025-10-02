import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for an outgoing chat message.
 * This defines the public contract sent to clients via WebSocket.
 *
 * @see REQ-1-081 for chat functionality.
 * @see SDS for DTO specifications.
 */
export class ChatMessageDto {
  @Expose()
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    description: 'Unique identifier for the chat message.',
  })
  id: string;

  @Expose()
  @ApiProperty({
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    description: 'The unique identifier of the order this message belongs to.',
  })
  orderId: string;

  @Expose()
  @ApiProperty({
    example: 'b1c2d3e4-f5a6-b7c8-d9e0-f1a2b3c4d5e6',
    description: 'The unique identifier of the user who sent the message.',
  })
  senderId: string;

  @Expose()
  @ApiProperty({
    example: 'Hello, I am near your location.',
    description: 'The text content of the message.',
  })
  messageText: string;

  @Expose()
  @ApiProperty({
    example: '2024-05-24T10:00:00.000Z',
    description: 'The ISO 8601 timestamp when the message was created.',
  })
  createdAt: Date;
}