import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { ISnsService } from '../interfaces/sns-service.interface';
import { AwsConfig } from 'src/config/aws.config';

@Injectable()
export class SnsService implements ISnsService {
  private readonly logger = new Logger(SnsService.name);
  private readonly awsConfig: AwsConfig;

  constructor(
    @Inject('SNS_CLIENT') private readonly snsClient: SNSClient,
    private readonly configService: ConfigService,
  ) {
    this.awsConfig = this.configService.get<AwsConfig>('aws');
    this.logger.log('SnsService initialized');
  }

  /**
   * Sends an SMS message to a single phone number via AWS SNS.
   * @param phoneNumber The target phone number in E.164 format.
   * @param message The text content of the SMS.
   * @returns A promise that resolves to true on success, false on failure.
   */
  async sendSms(phoneNumber: string, message: string): Promise<boolean> {
    const validatedPhoneNumber = this.normalizePhoneNumber(phoneNumber);
    if (!validatedPhoneNumber) {
      this.logger.warn(`Invalid phone number format provided: ${phoneNumber}. Cannot send SMS.`);
      return false;
    }

    const command = new PublishCommand({
      PhoneNumber: validatedPhoneNumber,
      Message: message,
      MessageAttributes: {
        'AWS.SNS.SMS.SMSType': {
          DataType: 'String',
          StringValue: 'Transactional',
        },
        // Optionally set a sender ID if configured in SNS
        // 'AWS.SNS.SMS.SenderID': {
        //   DataType: 'String',
        //   StringValue: 'MyPlatform',
        // },
      },
    });

    try {
      const response = await this.snsClient.send(command);
      this.logger.log(`Successfully sent SMS to ${validatedPhoneNumber}. Message ID: ${response.MessageId}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send SMS to ${validatedPhoneNumber}.`, error.stack);
      // Specific error handling for AWS SDK errors can be added here
      if (error.name === 'InvalidParameterException') {
        this.logger.error(`SNS rejected the phone number or message parameter.`);
      } else if (error.name === 'ThrottlingException') {
        this.logger.warn(`SNS throttling limit reached. This message may be retried.`);
      }
      return false;
    }
  }

  /**
   * Normalizes an Indian mobile number to the E.164 format required by AWS SNS.
   * @param phoneNumber The phone number string to normalize.
   * @returns The normalized phone number in E.164 format, or null if invalid.
   */
  private normalizePhoneNumber(phoneNumber: string): string | null {
    if (!phoneNumber) {
      return null;
    }

    // Remove all non-digit characters
    const digitsOnly = phoneNumber.replace(/\D/g, '');

    // Case 1: Already in E.164 format for India (+91XXXXXXXXXX)
    if (digitsOnly.startsWith('91') && digitsOnly.length === 12) {
      return `+${digitsOnly}`;
    }

    // Case 2: 10-digit number (XXXXXXXXXX)
    if (digitsOnly.length === 10) {
      // Basic validation for Indian numbers (start with 6, 7, 8, or 9)
      if (/^[6-9]/.test(digitsOnly)) {
        return `+91${digitsOnly}`;
      }
    }

    // Case 3: 11-digit number with leading 0 (0XXXXXXXXXX)
    if (digitsOnly.startsWith('0') && digitsOnly.length === 11) {
      const numberWithoutZero = digitsOnly.substring(1);
      if (/^[6-9]/.test(numberWithoutZero)) {
        return `+91${numberWithoutZero}`;
      }
    }

    this.logger.warn(`Phone number normalization failed for input: ${phoneNumber}`);
    return null;
  }
}