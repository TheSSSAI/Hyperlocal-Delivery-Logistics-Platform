import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for an incoming "sendMessage" WebSocket event.
 * Enforces validation rules for messages sent by clients.
 *
 * @see REQ-1-081 for chat functionality.
 * @see SDS for DTO specifications.
 */
export class SendMessageDto {
  @ApiProperty({
    description: 'The UUID of the order this message pertains to.',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsUUID()
  orderId: string;

  @ApiProperty({
    description: 'The text content of the message.',
    example: 'Could you please provide the gate code?',
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  messageText: string;
}