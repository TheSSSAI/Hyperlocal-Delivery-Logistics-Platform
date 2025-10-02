import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventPublisher } from './event.publisher';
import { EventConsumer } from './event.consumer';

/**
 * @class MessagingModule
 * @description A global module for handling asynchronous, event-driven communication.
 * It provides singleton instances of EventPublisher (for sending messages to SNS)
 * and EventConsumer (for processing messages from SQS). This centralizes
 * messaging infrastructure and makes it available throughout the application for
 * loose coupling between microservices.
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [EventPublisher, EventConsumer],
  exports: [EventPublisher, EventConsumer],
})
export class MessagingModule {}