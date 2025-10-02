import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MessagingService } from './messaging.service';
import { SNSClient } from '@aws-sdk/client-sns';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: SNSClient,
      useFactory: (configService: ConfigService) => {
        return new SNSClient({
          region: configService.getOrThrow<string>('AWS_REGION'),
          // Credentials will be automatically sourced from the environment
          // (e.g., IAM role) in a production EKS setup.
        });
      },
      inject: [ConfigService],
    },
    MessagingService,
  ],
  exports: [MessagingService],
})
export class MessagingModule {}