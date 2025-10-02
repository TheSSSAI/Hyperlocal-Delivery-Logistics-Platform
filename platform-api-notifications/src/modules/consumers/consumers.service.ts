import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  Message,
} from '@aws-sdk/client-sqs';
import { OrderEventHandler } from './handlers/order-event.handler';
import { UserEventHandler } from './handlers/user-event.handler';
import { VendorEventHandler } from './handlers/vendor-event.handler';
import {
  OrderAcceptedEventDto,
  OrderCancelledEventDto,
  OrderDeliveredEventDto,
  OrderPickedUpEventDto,
  OrderReadyForPickupEventDto,
  OrderAllocationFailedEventDto,
  UserPiiChangedEventDto,
  UserApprovedEventDto,
  VendorLicenseExpiryReminderEventDto,
} from '@platform-contracts/events';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ConsumersService implements OnApplicationBootstrap {
  private readonly logger = new Logger(ConsumersService.name);
  private readonly sqsClient: SQSClient;
  private readonly queueUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly orderEventHandler: OrderEventHandler,
    private readonly userEventHandler: UserEventHandler,
    private readonly vendorEventHandler: VendorEventHandler,
  ) {
    this.queueUrl = this.configService.get<string>('aws.sqsQueueUrl');
    this.sqsClient = new SQSClient({
      region: this.configService.get<string>('aws.region'),
    });
    this.logger.log(`SQS Consumer initialized for queue: ${this.queueUrl}`);
  }

  onApplicationBootstrap() {
    this.startPolling();
  }

  private startPolling(): void {
    this.logger.log('Starting SQS polling loop...');
    // This is a simplified long-running poll. In a real-world scenario,
    // you might use a more robust scheduler or worker manager.
    const poll = async () => {
      try {
        await this.processMessages();
      } catch (error) {
        this.logger.error('An error occurred during the polling cycle.', error.stack);
        // Wait before retrying to prevent fast-fail loops
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
      // Continue polling regardless of outcome
      setImmediate(poll);
    };

    poll();
  }

  private async processMessages(): Promise<void> {
    const receiveCommand = new ReceiveMessageCommand({
      QueueUrl: this.queueUrl,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 20, // Enable long polling
      MessageAttributeNames: ['All'],
    });

    try {
      const { Messages } = await this.sqsClient.send(receiveCommand);
      if (!Messages || Messages.length === 0) {
        return;
      }

      this.logger.log(`Received ${Messages.length} messages from SQS.`);

      const processingPromises = Messages.map(message =>
        this.handleMessage(message),
      );
      await Promise.allSettled(processingPromises);
    } catch (error) {
      this.logger.error('Error receiving messages from SQS.', error.stack);
      throw error;
    }
  }

  private async handleMessage(message: Message): Promise<void> {
    const eventType = message.MessageAttributes?.EventType?.StringValue;
    if (!eventType) {
      this.logger.warn(
        `Message ${message.MessageId} is missing EventType attribute. Cannot process.`,
      );
      // In a real system, you might delete such malformed messages or move them to a different queue.
      // For now, we will delete it to prevent queue blockage.
      await this.deleteMessage(message.ReceiptHandle);
      return;
    }

    this.logger.log(`Processing message ${message.MessageId} with event type: ${eventType}`);

    try {
      const body = JSON.parse(message.Body);
      const payload = body.Message ? JSON.parse(body.Message) : body; // Handle SNS wrapping

      await this.routeEvent(eventType, payload);

      // If routing and handling is successful, delete the message
      await this.deleteMessage(message.ReceiptHandle);
      this.logger.log(`Successfully processed and deleted message ${message.MessageId}`);

    } catch (error) {
      this.logger.error(
        `Error processing message ${message.MessageId} for event type ${eventType}. It will be retried.`,
        error.stack,
      );
      // Do NOT delete the message, let SQS visibility timeout handle retry and eventual DLQ
    }
  }

  private async routeEvent(eventType: string, payload: any): Promise<void> {
    switch (eventType) {
      // Order Events
      case 'OrderAccepted':
        await this.orderEventHandler.handleOrderAcceptedEvent(await this.validateDto(OrderAcceptedEventDto, payload));
        break;
      case 'OrderPickedUp':
        await this.orderEventHandler.handleOrderPickedUpEvent(await this.validateDto(OrderPickedUpEventDto, payload));
        break;
      case 'OrderDelivered':
        await this.orderEventHandler.handleOrderDeliveredEvent(await this.validateDto(OrderDeliveredEventDto, payload));
        break;
      case 'OrderCancelled':
        await this.orderEventHandler.handleOrderCancelledEvent(await this.validateDto(OrderCancelledEventDto, payload));
        break;
      case 'OrderReadyForPickup':
          await this.orderEventHandler.handleOrderReadyForPickupEvent(await this.validateDto(OrderReadyForPickupEventDto, payload));
          break;
      case 'OrderAllocationFailed':
          await this.orderEventHandler.handleOrderAllocationFailedEvent(await this.validateDto(OrderAllocationFailedEventDto, payload));
          break;

      // User Events
      case 'UserApproved':
        await this.userEventHandler.handleUserApprovedEvent(await this.validateDto(UserApprovedEventDto, payload));
        break;
      case 'UserPiiChanged':
        await this.userEventHandler.handleUserPiiChangedEvent(await this.validateDto(UserPiiChangedEventDto, payload));
        break;
      
      // Vendor Events
      case 'VendorLicenseExpiryReminder':
        await this.vendorEventHandler.handleVendorLicenseExpiryReminderEvent(await this.validateDto(VendorLicenseExpiryReminderEventDto, payload));
        break;

      default:
        this.logger.warn(`Unknown event type: ${eventType}. Skipping message.`);
        // Note: The main handler will delete this message as no error was thrown.
        // This prevents unknown event types from blocking the queue.
        break;
    }
  }

  private async validateDto<T extends object>(dtoClass: new () => T, payload: any): Promise<T> {
    const instance = plainToInstance(dtoClass, payload);
    const errors = await validate(instance);
    if (errors.length > 0) {
      const errorMessage = `DTO validation failed for ${dtoClass.name}: ${errors.toString()}`;
      this.logger.error(errorMessage, payload);
      throw new Error(errorMessage);
    }
    return instance;
  }

  private async deleteMessage(receiptHandle: string): Promise<void> {
    const deleteCommand = new DeleteMessageCommand({
      QueueUrl: this.queueUrl,
      ReceiptHandle: receiptHandle,
    });
    await this.sqsClient.send(deleteCommand);
  }
}