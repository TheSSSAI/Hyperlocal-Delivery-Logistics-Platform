import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SnsService } from '../sns/sns.service';

/**
 * @class EventPublisherService
 * @description Provides a high-level abstraction for publishing domain events to the message bus (AWS SNS).
 * It decouples the application services from the specifics of the messaging infrastructure.
 * This service maps a logical topic key to a physical SNS Topic ARN retrieved from configuration,
 * serializes the event payload, and uses the underlying `SnsService` to publish the message.
 * It includes structured logging for traceability and robust error handling.
 */
@Injectable()
export class EventPublisherService {
  private readonly logger = new Logger(EventPublisherService.name);

  constructor(
    private readonly snsService: SnsService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Publishes a domain event to a specified SNS topic.
   * @param topicKey - The configuration key for the SNS topic ARN (e.g., 'USER_EVENTS_TOPIC_ARN').
   * @param event - The event object to be published. Must be serializable to JSON.
   */
  async publish(topicKey: string, event: object): Promise<void> {
    const topicArn = this.configService.get<string>(topicKey);
    if (!topicArn) {
      this.logger.error(`SNS Topic ARN not found for key: ${topicKey}`);
      // In a production system, you might throw an exception or have a more robust error handling mechanism.
      return;
    }

    const eventName = event.constructor.name;
    const message = JSON.stringify(event);

    this.logger.log(
      `Publishing event '${eventName}' to topic ARN: ${topicArn}`,
    );

    try {
      const messageId = await this.snsService.publish(topicArn, message, {
        eventName: { DataType: 'String', StringValue: eventName },
      });
      this.logger.log(
        `Successfully published event '${eventName}' with Message ID: ${messageId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to publish event '${eventName}' to topic ${topicArn}`,
        error.stack,
      );
      // Depending on the criticality, you might re-throw a custom exception
      // to be handled by an upstream service or rely on monitoring and alerts.
      // For example: throw new EventPublishingException(error);
    }
  }
}