import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { MessagingException } from '../../common/exceptions/messaging.exception';

@Injectable()
export class EventPublisher {
  private readonly logger = new Logger(EventPublisher.name);
  private snsClient: SNSClient;
  private readonly region: string;

  constructor(private readonly configService: ConfigService) {
    this.region = this.configService.get<string>('aws.region');
    if (!this.region) {
      throw new Error('AWS region is not configured.');
    }
    this.snsClient = new SNSClient({ region: this.region });
    this.logger.log('EventPublisher initialized.');
  }

  /**
   * Publishes an event to a specified AWS SNS topic.
   * @param topicArn The ARN of the SNS topic to publish to.
   * @param eventName A string identifier for the event type, used for message attributes.
   * @param payload The event data to be published.
   * @returns The message ID of the published event.
   * @throws MessagingException if publishing fails.
   */
  async publish<T>(
    topicArn: string,
    eventName: string,
    payload: T,
  ): Promise<string> {
    this.logger.log(
      `Publishing event '${eventName}' to topic: ${topicArn}`,
    );

    try {
      const command = new PublishCommand({
        TopicArn: topicArn,
        Message: JSON.stringify(payload),
        MessageAttributes: {
          eventName: {
            DataType: 'String',
            StringValue: eventName,
          },
        },
      });

      const response = await this.snsClient.send(command);
      this.logger.log(
        `Event '${eventName}' published successfully with MessageId: ${response.MessageId}`,
      );

      if (!response.MessageId) {
        throw new Error('SNS did not return a MessageId.');
      }
      return response.MessageId;
    } catch (error) {
      this.logger.error(
        `Failed to publish event '${eventName}' to topic ${topicArn}: ${error.message}`,
        error.stack,
      );
      throw new MessagingException(
        `Failed to publish event '${eventName}'.`,
      );
    }
  }
}