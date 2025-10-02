import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderRepository } from './repositories/order.repository';
import { OrderStateMachineService } from './state-machine/order-state-machine.service';

import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderEventLog } from './entities/order-event-log.entity';

import { DatabaseModule } from '../../shared/database/database.module';
import { MessagingModule } from '../../shared/messaging/messaging.module';

/**
 * Encapsulates all components related to the Order bounded context.
 * This module manages the entire lifecycle of an order, including its creation,
 * state transitions, and interactions with other services via events.
 *
 * @Module Decorator registers the module with NestJS's dependency injection container.
 *
 * `imports`:
 * - `DatabaseModule`: Provides shared database connection capabilities.
 * - `MessagingModule`: Provides the `EventPublisherService` for emitting events.
 * - `HttpModule`: Provides NestJS's wrapper around Axios for making synchronous API calls,
 *   specifically for the real-time inventory check required by the order creation saga.
 * - `TypeOrmModule.forFeature`: Registers the `Order`, `OrderItem`, and `OrderEventLog` entities
 *   with TypeORM, making their repositories available for injection within this module's scope.
 *
 * `controllers`:
 * - `OrdersController`: Handles incoming HTTP requests related to orders.
 *
 * `providers`:
 * - `OrdersService`: Contains the core business logic for order management and saga orchestration.
 * - `OrderRepository`: Provides data access methods for the Order aggregate root.
 * - `OrderStateMachineService`: Encapsulates the rules for valid order state transitions.
 *
 * `exports`:
 * - `OrdersService`: Makes the `OrdersService` available for injection into other modules
 *   that import `OrdersModule` (e.g., `EventsModule` for handling SQS messages).
 */
@Module({
  imports: [
    DatabaseModule,
    MessagingModule,
    HttpModule.register({
      timeout: 5000, // 5 second timeout for external calls
      maxRedirects: 5,
    }),
    TypeOrmModule.forFeature([Order, OrderItem, OrderEventLog]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderRepository, OrderStateMachineService],
  exports: [OrdersService],
})
export class OrdersModule {}