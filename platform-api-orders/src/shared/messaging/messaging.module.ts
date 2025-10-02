import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SQSClient } from '@aws-sdk/client-sqs';
import { SNSClient } from '@aws-sdk/client-sns';
import { EventPublisherService } from './event-publisher.service';
import { AppConfig } from '../../config/app.config';

export const SNS_CLIENT = 'SNS_CLIENT';
export const SQS_CLIENT = 'SQS_CLIENT';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: SNS_CLIENT,
      useFactory: (configService: ConfigService<AppConfig, true>) => {
        const awsConfig = configService.get('aws', { infer: true });
        return new SNSClient({
          region: awsConfig.region,
          // In a real K8s environment, credentials would be sourced automatically
          // from the environment via IAM Role for Service Account (IRSA).
          // For local dev, they might come from ~/.aws/credentials.
        });
      },
      inject: [ConfigService],
    },
    {
      provide: SQS_CLIENT,
      useFactory: (configService: ConfigService<AppConfig, true>) => {
        const awsConfig = configService.get('aws', { infer: true });
        return new SQSClient({
          region: awsConfig.region,
        });
      },
      inject: [ConfigService],
    },
    EventPublisherService,
  ],
  exports: [EventPublisherService, SNS_CLIENT, SQS_CLIENT],
})
export class MessagingModule {}