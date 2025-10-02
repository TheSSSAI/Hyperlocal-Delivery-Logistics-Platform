import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  SqsClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  Message,
} from '@aws-sdk/client-sqs';
import { ConfigService } from '@nestjs/config';
import { OrdersService } from '../orders/orders.service';
import { AppConfig } from '../../config/app.config';

@Injectable()
export class SqsConsumerService implements OnModuleInit {
  private readonly logger = new Logger(SqsConsumerService.name);
  private readonly queueUrl: string;

  constructor(
    @Inject('SQS_CLIENT') private readonly sqsClient: SqsClient,
    private readonly configService: ConfigService<AppConfig, true>,
    private readonly ordersService: OrdersService,
  ) {
    this.queueUrl = this.configService.get('aws.sqsQueueUrl', { infer: true });
    if (!this.queueUrl) {
      throw new Error('SQS Queue URL is not configured.');
    }
  }

  onModuleInit() {
    this.logger.log(`Initializing SQS consumer for queue: ${this.queueUrl}`);
    this.startPolling();
  }

  private async startPolling() {
    this.logger.log('Starting SQS polling loop...');
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        const receiveMessageCommand = new ReceiveMessageCommand({
          QueueUrl: this.queueUrl,
          MaxNumberOfMessages: 10,
          WaitTimeSeconds: 20, // Enable long polling
        });

        const { Messages } = await this.sqsClient.send(receiveMessageCommand);

        if (Messages && Messages.length > 0) {
          this.logger.log(`Received ${Messages.length} messages.`);
          await Promise.all(Messages.map((msg) => this.handleMessage(msg)));
        }
      } catch (error) {
        this.logger.error('Error receiving messages from SQS:', error);
        // Avoid tight loop on error by waiting before retrying
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }

  private async handleMessage(message: Message): Promise<void> {
    const correlationId =
      message.MessageAttributes?.['correlationId']?.StringValue ?? 'N/A';
    this.logger.log(
      `[${correlationId}] Processing message: ${message.MessageId}`,
    );

    try {
      if (!message.Body) {
        throw new Error('Message body is empty.');
      }

      // SQS message from an SNS topic has the event payload nested in the 'Message' property
      const snsNotification = JSON.parse(message.Body);
      if (!snsNotification.Message) {
        throw new Error('SNS notification format is invalid.');
      }
      const eventPayload = JSON.parse(snsNotification.Message);
      const eventType = snsNotification.MessageAttributes.EventType.Value;

      this.logger.log(
        `[${correlationId}] Parsed event type: ${eventType} for order: ${eventPayload.orderId}`,
      );

      switch (eventType) {
        case 'PaymentConfirmedEvent':
          await this.ordersService.handlePaymentConfirmed(
            eventPayload.orderId,
            eventPayload,
          );
          break;
        case 'PaymentFailedEvent':
          await this.ordersService.handlePaymentFailed(
            eventPayload.orderId,
            eventPayload.reason,
          );
          break;
        // Add more event handlers as needed
        default:
          this.logger.warn(
            `[${correlationId}] Unhandled event type: ${eventType}`,
          );
          // We still delete unhandled messages to prevent them from blocking the queue.
          // In a real system, they might be moved to another queue for inspection.
          break;
      }

      // If processing is successful, delete the message from the queue
      await this.deleteMessage(message.ReceiptHandle, correlationId);
    } catch (error) {
      this.logger.error(
        `[${correlationId}] Failed to process message ${message.MessageId}. It will be retried. Error:`,
        error.stack,
      );
      // Do NOT delete the message. SQS will make it visible again after the visibility timeout
      // for another processing attempt. If it fails repeatedly, it will go to the DLQ.
    }
  }

  private async deleteMessage(
    receiptHandle: string,
    correlationId: string,
  ): Promise<void> {
    try {
      const deleteMessageCommand = new DeleteMessageCommand({
        QueueUrl: this.queueUrl,
        ReceiptHandle: receiptHandle,
      });
      await this.sqsClient.send(deleteMessageCommand);
      this.logger.log(
        `[${correlationId}] Successfully deleted message with handle: ${receiptHandle}`,
      );
    } catch (error) {
      this.logger.error(
        `[${correlationId}] Error deleting message with handle ${receiptHandle}:`,
        error,
      );
      // This is a critical error to log, as it could lead to reprocessing a message.
    }
  }
}