import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { OrdersModule } from '../orders/orders.module';
import { MessagingModule } from '../../shared/messaging/messaging.module';

import { SqsConsumerService } from './sqs-consumer.service';

/**
 * The EventsModule is dedicated to handling incoming asynchronous events from the message bus (AWS SQS).
 * It acts as the primary entry point for messages originating from other microservices,
 * such as payment confirmations, which drive the state of the order lifecycle.
 *
 * @Module
 * @imports OrdersModule - Imports the OrdersModule to make the OrdersService available for dependency injection into the SqsConsumerService.
 * @imports MessagingModule - Provides shared messaging components, such as SQS client configuration.
 * @imports ConfigModule - To access application configuration like queue URLs.
 * @providers SqsConsumerService - The background service that polls the SQS queue and processes messages.
 */
@Module({
  imports: [OrdersModule, MessagingModule, ConfigModule],
  providers: [SqsConsumerService],
})
export class EventsModule {}