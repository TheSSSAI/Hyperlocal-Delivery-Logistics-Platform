import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SqsModule } from '@ssut/nestjs-sqs';
import { AllocationModule } from '../allocation/allocation.module';
import { OrderListener } from './listeners/order.listener';

@Module({
  imports: [
    AllocationModule,
    SqsModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        consumers: [
          {
            name: configService.get<string>('aws.sqs.orderEventsQueueName'),
            queueUrl: configService.get<string>('aws.sqs.orderEventsQueueUrl'),
            region: configService.get<string>('aws.region'),
            // Add other consumer options as needed, e.g., batch size
          },
        ],
        producers: [], // No producers defined in this module
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [OrderListener],
})
export class IntegrationsModule {}