import { Module } from '@nestjs/common';
import { SnsModule } from '../sns/sns.module';
import { EventPublisherService } from './event-publisher.service';

/**
 * @module MessagingModule
 * @description This module encapsulates and exports the EventPublisherService,
 * making it available for dependency injection throughout the application.
 * It builds upon the lower-level SnsModule.
 */
@Module({
  imports: [SnsModule],
  providers: [EventPublisherService],
  exports: [EventPublisherService],
})
export class MessagingModule {}