import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SnsService } from '../sns/sns.service';
import { PublishCommand } from '@aws-sdk/client-sns';
import { IEvent } from '../../domain/events/event.interface';

@Injectable()
export class EventPublisherService {
  private readonly logger = new Logger(EventPublisherService.name);
  private readonly userEventsTopicArn: string;

  constructor(
    private readonly snsService: SnsService,
    private readonly configService: ConfigService,
  ) {
    this.userEventsTopicArn = this.configService.get<string>(
      'aws.sns.userEventsTopicArn',
    );
    if (!this.userEventsTopicArn) {
      this.logger.error('User Events Topic ARN is not configured!');
      throw new Error('User Events Topic ARN must be configured.');
    }
  }

  /**
   * Publishes a domain event to the appropriate SNS topic.
   * @param event The domain event to publish.
   * @param correlationId Optional correlation ID for distributed tracing.
   */
  async publish<T extends IEvent>(
    event: T,
    correlationId?: string,
  ): Promise<void> {
    const eventName = event.constructor.name;
    this.logger.log(
      `Publishing event: ${eventName} with correlationId: ${correlationId}`,
    );

    const messagePayload = {
      eventName,
      timestamp: new Date().toISOString(),
      correlationId: correlationId || `event-${Date.now()}`,
      payload: event,
    };

    const command = new PublishCommand({
      TopicArn: this.userEventsTopicArn, // In a larger system, this could be determined dynamically based on event type
      Message: JSON.stringify(messagePayload),
      MessageAttributes: {
        eventName: {
          DataType: 'String',
          StringValue: eventName,
        },
      },
    });

    try {
      const result = await this.snsService.snsClient.send(command);
      this.logger.log(
        `Successfully published event ${eventName}. MessageId: ${result.MessageId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to publish event ${eventName}. Error: ${error.message}`,
        error.stack,
      );
      // In a production system, this could be sent to a Dead-Letter Queue (DLQ)
      // or a more robust retry mechanism could be implemented.
      throw new Error(`Failed to publish event: ${eventName}`);
    }
  }
}