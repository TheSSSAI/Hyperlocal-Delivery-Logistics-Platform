import { Module } from '@nestjs/common';
import { ConsumersService } from './consumers.service';
import { OrderEventHandler } from './handlers/order-event.handler';
import { UserEventHandler } from './handlers/user-event.handler';
import { VendorEventHandler } from './handlers/vendor-event.handler';
import { DispatchModule } from '../dispatch/dispatch.module';
import { IdentityModule } from '../identity/identity.module';
import { TemplatesModule } from '../templates/templates.module';
import { AwsSdkModule } from 'nestjs-aws-sdk';
import { Sqs } from 'aws-sdk';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * @module ConsumersModule
 * @description This module encapsulates all functionality related to consuming business events
 * from the platform's message bus (AWS SQS). It is the primary entry point for
 * triggering notifications in response to events occurring in other microservices.
 *
 * @imports {DispatchModule} - Provides the core notification dispatching services (FCM, SNS).
 * @imports {IdentityModule} - Provides the client service to fetch user contact details from the Identity service.
 * @imports {TemplatesModule} - Provides the service for rendering notification templates.
 * @imports {ConfigModule} - Provides access to application configuration.
 *
 * @providers {ConsumersService} - The main background service that continuously polls the SQS queue for new messages.
 * @providers {OrderEventHandler} - A handler dedicated to processing all events related to the order lifecycle.
 * @providers {UserEventHandler} - A handler dedicated to processing events related to user accounts and security.
 * @providers {VendorEventHandler} - A handler dedicated to processing events specific to vendors, such as compliance reminders.
 */
@Module({
  imports: [
    DispatchModule,
    IdentityModule,
    TemplatesModule,
    // Note: ConfigModule is expected to be imported globally in AppModule,
    // but included here for clarity on dependency.
    ConfigModule,
    // AWS SDK module for SQS is configured here.
    // In a real-world scenario, this might be in a shared 'Aws' module.
    AwsSdkModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          credentials: {
            accessKeyId: configService.get<string>('aws.accessKeyId'),
            secretAccessKey: configService.get<string>('aws.secretAccessKey'),
          },
          region: configService.get<string>('aws.region'),
        };
      },
    }),
  ],
  providers: [
    ConsumersService,
    OrderEventHandler,
    UserEventHandler,
    VendorEventHandler,
    {
      provide: Sqs,
      useFactory: () => new Sqs(),
    },
  ],
})
export class ConsumersModule {}