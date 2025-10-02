import { Module } from '@nestjs/common';
import { ProductsModule } from '../products/products.module';
import { OrderEventsConsumer } from './consumers/order-events.consumer';
import { SqsConsumerService } from 'src/shared/queue/sqs-consumer.service';

/**
 * @module MessagingModule
 * @description This module is responsible for handling incoming asynchronous messages
 * from other microservices, such as order cancellation events, to maintain data consistency.
 */
@Module({
  imports: [
    // Importing ProductsModule to make InventoryService available for dependency
    // injection into the OrderEventsConsumer. This is necessary for reverting stock.
    ProductsModule,
  ],
  providers: [
    // OrderEventsConsumer contains the business logic for handling consumed messages.
    OrderEventsConsumer,
    // SqsConsumerService is a shared service that polls the SQS queue.
    // This could be part of a shared QueueModule in a larger setup.
    SqsConsumerService,
  ],
})
export class MessagingModule {}