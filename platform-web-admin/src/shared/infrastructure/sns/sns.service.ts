import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SNSClient, PublishCommand, PublishCommandInput } from '@aws-sdk/client-sns';

@Injectable()
export class SnsService {
  private readonly logger = new Logger(SnsService.name);
  private readonly snsClient: SNSClient;
  private readonly senderId: string;

  constructor(private readonly configService: ConfigService) {
    const region = this.configService.get<string>('AWS_REGION');
    this.senderId = this.configService.get<string>('AWS_SNS_SENDER_ID');

    if (!region || !this.senderId) {
        throw new Error('SNS configuration is missing from environment variables.');
    }
    
    this.snsClient = new SNSClient({ region });
  }

  /**
   * Sends an SMS message to a given phone number.
   * @param phoneNumber The recipient's phone number in E.164 format (e.g., +919876543210).
   * @param message The content of the SMS message.
   * @returns The MessageId from the SNS response on success.
   */
  async sendSms(phoneNumber: string, message: string): Promise<string | undefined> {
    const params: PublishCommandInput = {
      PhoneNumber: phoneNumber,
      Message: message,
      MessageAttributes: {
        'AWS.SNS.SMS.SenderID': {
          DataType: 'String',
          StringValue: this.senderId,
        },
        'AWS.SNS.SMS.SMSType': {
          DataType: 'String',
          StringValue: 'Transactional', // Use 'Promotional' for marketing messages
        },
      },
    };

    try {
      this.logger.log(`Sending SMS to ${phoneNumber}`);
      const command = new PublishCommand(params);
      const response = await this.snsClient.send(command);
      this.logger.log(`SMS sent successfully to ${phoneNumber}. Message ID: ${response.MessageId}`);
      return response.MessageId;
    } catch (error) {
      this.logger.error(`Failed to send SMS to ${phoneNumber}`, error);
      // In a production system, you might want to re-throw a custom exception
      // or handle it based on the error type (e.g., for invalid numbers).
      throw error;
    }
  }

  /**
   * Publishes a message to a specific SNS Topic.
   * @param topicArn The ARN of the SNS topic.
   * @param payload The message payload object to be serialized and sent.
   * @param messageGroupId Optional for FIFO topics. A group ID for the message.
   * @param messageDeduplicationId Optional for FIFO topics. A deduplication ID.
   * @returns The MessageId from the SNS response on success.
   */
  async publishToTopic(
    topicArn: string,
    payload: object,
    messageGroupId?: string,
    messageDeduplicationId?: string
  ): Promise<string | undefined> {
      const params: PublishCommandInput = {
          TopicArn: topicArn,
          Message: JSON.stringify(payload),
          MessageGroupId: messageGroupId,
          MessageDeduplicationId: messageDeduplicationId
      };

      try {
          this.logger.log(`Publishing message to topic ${topicArn}`);
          const command = new PublishCommand(params);
          const response = await this.snsClient.send(command);
          this.logger.log(`Message published successfully to ${topicArn}. Message ID: ${response.MessageId}`);
          return response.MessageId;
      } catch(error) {
          this.logger.error(`Failed to publish message to topic ${topicArn}`, error);
          throw error;
      }
  }
}