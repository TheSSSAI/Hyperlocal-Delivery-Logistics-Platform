import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';

import { appConfig } from './config/app.config';
import { CartModule } from './modules/cart/cart.module';
import { EventsModule } from './modules/events/events.module';
import { OrdersModule } from './modules/orders/orders.module';
import { DatabaseModule } from './shared/database/database.module';
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter';
import { MessagingModule } from './shared/messaging/messaging.module';

/**
 * The root module of the application.
 *
 * This module is responsible for composing the application's dependency graph by importing
 * all feature modules and shared infrastructure modules. It also configures global providers
 * and settings that apply across the entire application.
 *
 * Key responsibilities:
 * - Configures and loads environment variables via `ConfigModule`.
 * - Establishes the primary database connection via `DatabaseModule`.
 * - Initializes messaging infrastructure (SQS/SNS clients) via `MessagingModule`.
 * - Imports core feature modules: `OrdersModule`, `CartModule`, and `EventsModule`.
 * - Registers a global exception filter (`AllExceptionsFilter`) to ensure consistent
 *   error handling and response formatting for all incoming requests.
 */
@Module({
  imports: [
    // --- Global Configuration ---
    // Configures the application to load environment variables from .env files
    // and validates them against the schema defined in app.config.ts.
    // isGlobal: true makes the ConfigService available application-wide without
    // needing to import ConfigModule in every feature module.
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      // Note: Validation is implicitly handled by the loading of the appConfig factory
      // which uses class-validator, but an explicit validationSchema could also be used here.
    }),

    // --- Shared Infrastructure Modules ---
    // Provides the TypeORM database connection and entity repositories to the application.
    DatabaseModule,
    // Provides services for publishing events to SNS and other messaging-related infrastructure.
    MessagingModule,

    // --- Core Feature Modules ---
    // Encapsulates all logic related to order lifecycle management,
    // including the state machine, repositories, and controllers.
    OrdersModule,
    // Encapsulates all logic related to shopping cart management.
    CartModule,
    // Encapsulates the logic for consuming asynchronous events from other services (e.g., Payments).
    EventsModule,
  ],
  controllers: [
    // No controllers are defined at the root level. Controllers are encapsulated
    // within their respective feature modules (e.g., OrdersController in OrdersModule).
  ],
  providers: [
    // --- Global Providers ---
    // Registers a global exception filter. This filter catches all unhandled exceptions
    // across the application and formats them into a standardized JSON response,
    // ensuring consistent error handling as per architectural guidelines.
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}