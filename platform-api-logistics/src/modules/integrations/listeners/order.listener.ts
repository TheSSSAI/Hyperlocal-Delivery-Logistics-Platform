import { Injectable, Logger } from '@nestjs/common';
import { SqsMessageHandler, SqsConsumerEventHandler } from '@ssut/nestjs-sqs';
import { Message } from '@aws-sdk/client-sqs';
import { IAllocationService } from 'src/modules/allocation/interfaces/allocation.service.interface';
import { InitiateAllocationDto } from 'src/modules/allocation/dtos/initiate-allocation.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class OrderListener {
  private readonly logger = new Logger(OrderListener.name);

  constructor(private readonly allocationService: IAllocationService) {}

  @SqsMessageHandler(process.env.SQS_ORDER_READY_QUEUE_NAME, {
    batch: false,
  })
  public async handleOrderReadyForPickup(message: Message) {
    this.logger.log(`Received SQS message for order ready for pickup. MessageId: ${message.MessageId}`);
    try {
      const body = JSON.parse(message.Body);
      // SNS messages are wrapped. The actual message is in the 'Message' property.
      const payload = JSON.parse(body.Message);

      this.logger.debug(`Parsed payload: ${JSON.stringify(payload)}`);

      const allocationDto = plainToInstance(InitiateAllocationDto, payload);
      const errors = await validate(allocationDto);

      if (errors.length > 0) {
        this.logger.error(
          `Validation failed for InitiateAllocationDto. Errors: ${JSON.stringify(errors)}`,
        );
        // Acknowledge the message to prevent it from going to DLQ for a simple validation error.
        return;
      }

      this.logger.log(`Initiating allocation for Order ID: ${allocationDto.orderId}`);
      await this.allocationService.initiateAllocation(allocationDto);
      this.logger.log(`Successfully initiated allocation for Order ID: ${allocationDto.orderId}`);

    } catch (error) {
      this.logger.error(
        `Failed to process 'OrderReadyForPickup' message. MessageId: ${message.MessageId}. Error: ${error.message}`,
        error.stack,
      );
      // Depending on the error, we might want to throw it to let SQS handle retries/DLQ.
      // For business logic errors (e.g., NoRidersAvailableException), we should not retry.
      // For transient errors (e.g., DB connection), we should throw.
      if (error.name === 'NoRidersAvailableException' || error.name === 'AllocationInProgressException') {
        this.logger.warn(`Business exception caught: ${error.message}. Acknowledging message without retry.`);
      } else {
        // Re-throw for transient infrastructure errors to trigger SQS retry policy
        throw error;
      }
    }
  }

  @SqsConsumerEventHandler('processing_error')
  public onProcessingError(error: Error, message: Message) {
    this.logger.error(
      `SQS Consumer Processing Error. MessageId: ${message.MessageId}. Error: ${error.message}`,
      error.stack,
    );
    // This handler is for errors in the SQS consumer library itself.
    // Logic errors within handleOrderReadyForPickup are handled in its try/catch.
  }
}