import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SNSClient,
  PublishCommand,
  PublishCommandInput,
} from '@aws-sdk/client-sns';

/**
 * A generic exception for messaging-related failures.
 */
export class MessagingException extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = 'MessagingException';
  }
}

@Injectable()
export class EventPublisherService {
  private readonly logger = new Logger(EventPublisherService.name);
  private readonly snsClient: SNSClient;
  private readonly topicArn: string;

  constructor(private readonly configService: ConfigService) {
    const region = this.configService.get<string>('aws.region');
    if (!region) {
      throw new Error('AWS region is not configured.');
    }

    this.snsClient = new SNSClient({ region });
    this.topicArn = this.configService.get<string>('aws.snsTopicArn');
    if (!this.topicArn) {
      throw new Error('AWS SNS Topic ARN is not configured.');
    }

    this.logger.log(`EventPublisherService initialized for topic: ${this.topicArn}`);
  }

  /**
   * Publishes a structured event to the configured AWS SNS topic.
   * The event object must have an 'eventName' property which is used
   * as a message attribute for filtering by consumers.
   *
   * @template T The type of the event payload. Must include an 'eventName' string property.
   * @param {T} event The event object to publish.
   * @returns {Promise<string>} The MessageId of the published message.
   * @throws {MessagingException} If publishing to SNS fails.
   */
  async publish<T extends { eventName: string }>(event: T): Promise<string> {
    const eventName = event.eventName;
    this.logger.log(`Publishing event: ${eventName}`);

    try {
      const payload = JSON.stringify(event);

      const params: PublishCommandInput = {
        TopicArn: this.topicArn,
        Message: payload,
        MessageAttributes: {
          eventName: {
            DataType: 'String',
            StringValue: eventName,
          },
        },
      };

      const command = new PublishCommand(params);
      const result = await this.snsClient.send(command);

      if (!result.MessageId) {
        throw new Error('SNS did not return a MessageId.');
      }

      this.logger.log(
        `Event '${eventName}' published successfully with MessageId: ${result.MessageId}`,
      );

      return result.MessageId;
    } catch (error) {
      this.logger.error(
        `Failed to publish event '${eventName}'. Error: ${error.message}`,
        error.stack,
      );
      throw new MessagingException(
        `Failed to publish event '${eventName}' to SNS.`,
        error,
      );
    }
  }
}