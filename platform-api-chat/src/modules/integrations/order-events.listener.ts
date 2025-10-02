import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ChatService } from '../chat/chat.service';
import { IsString, IsUUID, IsArray, validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

// DTOs for event payload validation
class OrderAcceptedEventDto {
  @IsUUID()
  orderId: string;

  @IsArray()
  @IsUUID('all', { each: true })
  participants: string[]; // e.g., [customerId, vendorId]
}

class RiderAssignedEventDto {
  @IsUUID()
  orderId: string;

  @IsUUID()
  riderId: string;
}

class OrderFinalizedEventDto {
  @IsUUID()
  orderId: string;

  @IsString()
  finalStatus: 'DELIVERED' | 'CANCELLED';
}

/**
 * Listens for order lifecycle events from an SQS queue.
 * This component is crucial for decoupling the Chat service from the Order service,
 * allowing chat rooms to be managed based on asynchronous events.
 * Implements REQ-1-015 (lifecycle management) and depends on REQ-1-105 (async communication).
 */
@Controller()
export class OrderEventsListener {
  private readonly logger = new Logger(OrderEventsListener.name);

  constructor(private readonly chatService: ChatService) {}

  private async validatePayload<T extends object>(
    payload: any,
    targetClass: new () => T,
  ): Promise<T> {
    const instance = plainToClass(targetClass, payload);
    const errors = await validate(instance);
    if (errors.length > 0) {
      const errorMessage = `Invalid event payload: ${errors
        .map((err) => Object.values(err.constraints))
        .join(', ')}`;
      this.logger.error(errorMessage);
      throw new Error(errorMessage);
    }
    return instance;
  }

  @MessagePattern('order.accepted')
  async handleOrderAccepted(@Payload() message: any): Promise<void> {
    this.logger.log(
      `Received 'order.accepted' event for Order ID: ${message.orderId}`,
    );
    try {
      const payload = await this.validatePayload(message, OrderAcceptedEventDto);
      await this.chatService.createRoomFromEvent(payload);
    } catch (error) {
      this.logger.error(
        `Failed to process 'order.accepted' event: ${error.message}`,
        error.stack,
      );
      // Let the SQS retry mechanism handle the message. A DLQ should be configured.
      throw error;
    }
  }

  @MessagePattern('order.rider_assigned')
  async handleRiderAssigned(@Payload() message: any): Promise<void> {
    this.logger.log(
      `Received 'order.rider_assigned' event for Order ID: ${message.orderId}`,
    );
    try {
      const payload = await this.validatePayload(message, RiderAssignedEventDto);
      await this.chatService.addParticipantToRoom(
        payload.orderId,
        payload.riderId,
      );
    } catch (error) {
      this.logger.error(
        `Failed to process 'order.rider_assigned' event: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @MessagePattern('order.delivered')
  async handleOrderDelivered(@Payload() message: any): Promise<void> {
    this.logger.log(
      `Received 'order.delivered' event for Order ID: ${message.orderId}`,
    );
    try {
      const payload = await this.validatePayload(message, OrderFinalizedEventDto);
      await this.chatService.setRoomReadOnlyFromEvent(payload);
    } catch (error) {
      this.logger.error(
        `Failed to process 'order.delivered' event: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @MessagePattern('order.cancelled')
  async handleOrderCancelled(@Payload() message: any): Promise<void> {
    this.logger.log(
      `Received 'order.cancelled' event for Order ID: ${message.orderId}`,
    );
    try {
      const payload = await this.validatePayload(message, OrderFinalizedEventDto);
      await this.chatService.setRoomReadOnlyFromEvent(payload);
    } catch (error) {
      this.logger.error(
        `Failed to process 'order.cancelled' event: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}