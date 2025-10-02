import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { RatingsModule } from '../ratings/ratings.module';
import { ConfigModule } from '@nestjs/config';

/**
 * @module EventsModule
 * @description This module encapsulates all functionality related to handling asynchronous
 * events consumed from the message bus (e.g., AWS SQS). It serves as the primary
 * entry point for choreographed, event-driven workflows initiated by other microservices.
 *
 * @imports {RatingsModule} - Imports the RatingsModule to gain access to the RatingsService,
 *          which is required by the EventsController to process incoming events. This follows
 *          the standard NestJS pattern for sharing services between modules.
 * @imports {ConfigModule} - Imports the ConfigModule to ensure that environment variables are
 *          available if needed by any components within this module's scope, although the
 *          controller primarily relies on services that have configuration injected.
 *
 * @controllers {EventsController} - Registers the EventsController, which contains the
 *                endpoints that act as targets for incoming event messages (e.g., from an SQS
 *                poller/webhook).
 */
@Module({
  imports: [
    RatingsModule, // Importing RatingsModule to make its exported providers (like RatingsService) available for injection.
    ConfigModule,
  ],
  controllers: [EventsController],
  providers: [],
})
export class EventsModule {}