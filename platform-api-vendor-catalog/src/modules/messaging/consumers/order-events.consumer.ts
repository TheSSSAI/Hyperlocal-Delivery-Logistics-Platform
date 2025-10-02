import { Injectable, Logger } from '@nestjs/common';
import { SqsMessageHandler, SqsConsumerEventHandler } from '@ssut/nestjs-sqs';
import * as AWS from 'aws-sdk';
import { InventoryService } from '../../products/inventory.service';
import { OrderCancelledEvent } from '../events/order-cancelled.event';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class OrderEventsConsumer {
  private readonly logger = new Logger(OrderEventsConsumer.name);

  constructor(private readonly inventoryService: InventoryService) {}

  @SqsMessageHandler(/** process.env.ORDER_EVENTS_QUEUE_NAME */'order-events-queue', false)
  public async handleMessage(message: AWS.SQS.Message) {
    this.logger.log(`Received SQS message with ID: ${message.MessageId}`);
    try {
      const messageBody = JSON.parse(message.Body);
      // SNS messages are wrapped; the actual message is in the 'Message' property
      const eventPayload = JSON.parse(messageBody.Message);

      // Assuming a message attribute or payload field indicates the event type
      if (eventPayload.eventType === 'OrderCancelledEvent') {
        const orderCancelledEvent = plainToInstance(
          OrderCancelledEvent,
          eventPayload,
        );
        const errors = await validate(orderCancelledEvent);

        if (errors.length > 0) {
          this.logger.error(
            `Validation failed for OrderCancelledEvent. Errors: ${errors.toString()}`,
            message.Body,
          );
          // Do not requeue, as the message is malformed. It will go to DLQ if configured.
          return;
        }

        this.logger.log(
          `Processing OrderCancelledEvent for order ID: ${orderCancelledEvent.orderId}`,
        );

        const itemsToRevert = orderCancelledEvent.lineItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        }));

        if (itemsToRevert.length > 0) {
          await this.inventoryService.revertStock(itemsToRevert);
          this.logger.log(
            `Stock reverted successfully for order ID: ${orderCancelledEvent.orderId}`,
          );
        } else {
          this.logger.warn(
            `OrderCancelledEvent for order ID: ${orderCancelledEvent.orderId} had no items to revert.`,
          );
        }
      } else {
        this.logger.warn(
          `Received unhandled event type: ${eventPayload.eventType}`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Error processing SQS message ID: ${message.MessageId}. Error: ${error.message}`,
        error.stack,
      );
      // Throw error to allow SQS to handle retries and DLQ
      throw error;
    }
  }

  @SqsConsumerEventHandler('processing_error')
  public onProcessingError(error: Error, message: AWS.SQS.Message) {
    this.logger.error(
      `SQS Consumer Processing Error for message ID ${message.MessageId}: ${error.message}`,
      error.stack,
    );
    // This handler can be used for custom logic on processing errors, like sending alerts.
  }

  @SqsConsumerEventHandler('error')
  public onError(error: Error) {
    this.logger.error(`SQS Consumer Error: ${error.message}`, error.stack);
  }
}