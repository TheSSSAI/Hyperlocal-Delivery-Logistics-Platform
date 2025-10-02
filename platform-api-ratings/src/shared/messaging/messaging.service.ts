import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SNSClient, PublishCommand, PublishCommandInput, PublishCommandOutput } from '@aws-sdk/client-sns';
import { v4 as uuidv4 } from 'uuid';

/**
 * An abstraction layer for interacting with AWS SNS.
 * This service centralizes the logic for publishing events to SNS topics,
 * making it easy to inject and use throughout the application. It handles
 * client initialization, message formatting with attributes, and error handling.
 */
@Injectable()
export class MessagingService implements OnModuleInit {
  private readonly logger = new Logger(MessagingService.name);
  private snsClient: SNSClient;
  private ratingsTopicArn: string;

  constructor(private readonly configService: ConfigService) {}

  /**
   * Initializes the SNS client and configuration when the module is initialized.
   */
  onModuleInit() {
    const region = this.configService.get<string>('app.aws.region');
    this.ratingsTopicArn = this.configService.get<string>('app.aws.sns.ratingsTopicArn');

    if (!region || !this.ratingsTopicArn) {
        this.logger.error('AWS Region or SNS Topic ARN is not configured. Messaging service will not be available.');
        return;
    }

    this.snsClient = new SNSClient({
      region,
      // Credentials will be automatically picked up from the environment
      // when running in an AWS environment (e.g., EKS with an IAM role).
    });

    this.logger.log('MessagingService initialized and SNS client configured.');
  }

  /**
   * Publishes an event to the configured SNS topic.
   * @param eventName A string identifier for the event type (e.g., 'RatingSubmittedEvent').
   * @param payload The data payload of the event.
   * @param correlationId An optional ID to trace the request across services.
   * @returns A Promise that resolves when the message is published.
   * @throws Error if the SNS client is not initialized or if publishing fails.
   */
  async publish(eventName: string, payload: object, correlationId: string = uuidv4()): Promise<PublishCommandOutput> {
    if (!this.snsClient) {
      const errorMessage = 'SNS client is not initialized. Cannot publish event.';
      this.logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    const messagePayload = {
      metadata: {
        eventName,
        timestamp: new Date().toISOString(),
        correlationId,
      },
      data: payload,
    };

    const params: PublishCommandInput = {
      TopicArn: this.ratingsTopicArn,
      Message: JSON.stringify(messagePayload),
      MessageAttributes: {
        eventName: {
          DataType: 'String',
          StringValue: eventName,
        },
      },
    };

    this.logger.log(`Publishing event '${eventName}' to SNS topic...`, { correlationId });

    try {
      const command = new PublishCommand(params);
      const result = await this.snsClient.send(command);
      this.logger.log(`Successfully published event '${eventName}' with MessageId: ${result.MessageId}`, { correlationId });
      return result;
    } catch (error) {
      this.logger.error(`Failed to publish event '${eventName}' to SNS.`, {
        error: error.message,
        stack: error.stack,
        correlationId,
        topicArn: this.ratingsTopicArn,
      });
      // Re-throw the error to allow the calling service to handle it (e.g., rollback transaction).
      throw error;
    }
  }
}