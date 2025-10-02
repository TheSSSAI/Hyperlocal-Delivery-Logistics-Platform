import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

@Injectable()
export class SnsService {
  private readonly logger = new Logger(SnsService.name);
  private readonly snsClient: SNSClient;

  constructor(private readonly configService: ConfigService) {
    this.snsClient = new SNSClient({
      region: this.configService.get<string>('aws.region'),
      credentials: {
        accessKeyId: this.configService.get<string>('aws.accessKeyId'),
        secretAccessKey: this.configService.get<string>('aws.secretAccessKey'),
      },
    });
  }

  /**
   * Sends an SMS message to a given phone number.
   * @param phoneNumber The phone number in E.164 format (e.g., +919876543210).
   * @param message The content of the SMS message.
   * @returns The MessageId from the SNS response.
   */
  async sendSms(phoneNumber: string, message: string): Promise<string> {
    const command = new PublishCommand({
      PhoneNumber: phoneNumber,
      Message: message,
      MessageAttributes: {
        'AWS.SNS.SMS.SenderID': {
            DataType: 'String',
            StringValue: this.configService.get<string>('aws.sns.senderId', 'DEFAULT'),
        },
        'AWS.SNS.SMS.SMSType': {
            DataType: 'String',
            StringValue: 'Transactional', // Ensure high deliverability
        },
      }
    });

    try {
      this.logger.log(`Sending SMS to ${phoneNumber}`);
      const response = await this.snsClient.send(command);
      if (!response.MessageId) {
        throw new Error('SNS response did not include a MessageId.');
      }
      this.logger.log(`SMS sent successfully. MessageId: ${response.MessageId}`);
      return response.MessageId;
    } catch (error) {
      this.logger.error(`Failed to send SMS to ${phoneNumber}:`, error.stack);
      // We throw a generic error to be handled by the calling service.
      // The specific AWS SDK error is logged for debugging.
      throw new Error('Failed to send SMS.');
    }
  }
}