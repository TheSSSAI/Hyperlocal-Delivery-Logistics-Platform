import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { IEventPublisher } from './interfaces/event-publisher.interface';

@Injectable()
export class EventPublisherService implements IEventPublisher {
  private readonly logger = new Logger(EventPublisherService.name);
  private readonly snsClient: SNSClient;
  private readonly topicArns: Map<string, string> = new Map();

  constructor(private readonly configService: ConfigService) {
    const region = this.configService.get<string>('AWS_REGION');
    if (!region) {
      this.logger.error('AWS_REGION is not configured.');
      throw new Error('AWS_REGION is not configured.');
    }
    this.snsClient = new SNSClient({ region });

    // In a real application, these would be fetched from config and be more extensive
    const logisticsEventsTopicArn = this.configService.get<string>(
      'AWS_SNS_LOGISTICS_EVENTS_TOPIC_ARN',
    );
    if (logisticsEventsTopicArn) {
      this.topicArns.set('RiderAssignedEvent', logisticsEventsTopicArn);
      this.topicArns.set('AllocationFailedEvent', logisticsEventsTopicArn);
      this.topicArns.set('DeliveryCompletedEvent', logisticsEventsTopicArn);
      this.topicArns.set('DeliveryStatusUpdatedEvent', logisticsEventsTopicArn);
    } else {
      this.logger.warn(
        'AWS_SNS_LOGISTICS_EVENTS_TOPIC_ARN not set. Event publishing will fail.',
      );
    }

    this.logger.log('EventPublisherService initialized.');
  }

  async publish<T extends object>(
    eventName: string,
    payload: T,
  ): Promise<void> {
    const topicArn = this.topicArns.get(eventName);
    if (!topicArn) {
      const errorMessage = `No SNS topic ARN configured for event: ${eventName}`;
      this.logger.error(errorMessage);
      // Depending on desired strictness, this could throw an error or just log.
      // For system integrity, throwing is safer.
      throw new Error(errorMessage);
    }

    const message = {
      eventName,
      payload,
      timestamp: new Date().toISOString(),
    };

    const command = new PublishCommand({
      TopicArn: topicArn,
      Message: JSON.stringify(message),
      MessageAttributes: {
        eventName: {
          DataType: 'String',
          StringValue: eventName,
        },
      },
    });

    try {
      this.logger.log(
        `Publishing event '${eventName}' to topic ${topicArn}`,
      );
      const result = await this.snsClient.send(command);
      this.logger.log(
        `Successfully published event '${eventName}' with MessageId: ${result.MessageId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to publish event '${eventName}' to SNS: ${error.message}`,
        error.stack,
      );
      // Re-throw to allow the calling service to handle the failure,
      // especially if using Transactional Outbox pattern.
      throw error;
    }
  }
}