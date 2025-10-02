import { SNSClient } from '@aws-sdk/client-sns';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SnsService } from './sns.service';

/**
 * @class SnsModule
 * @description A global module for providing and configuring the AWS SNS service.
 * Following a similar pattern to other infrastructure modules, it uses a factory provider
 * to create an instance of the `SNSClient` from the AWS SDK. Configuration, such as the AWS region,
 * is injected via the `ConfigService`. The `SnsService`, which abstracts the SDK client,
 * is then provided and exported, making it available for use across the application for sending SMS
 * or publishing to SNS topics.
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: SNSClient,
      useFactory: (configService: ConfigService) => {
        return new SNSClient({
          region: configService.get<string>('AWS_REGION'),
        });
      },
      inject: [ConfigService],
    },
    SnsService,
  ],
  exports: [SnsService],
})
export class SnsModule {}