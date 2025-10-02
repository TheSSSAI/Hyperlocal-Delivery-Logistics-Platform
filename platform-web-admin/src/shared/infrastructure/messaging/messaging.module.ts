import { Module, Global } from '@nestjs/common';
import { EventPublisherService } from './event-publisher.service';
import { SnsModule } from '../sns/sns.module';
import { ConfigModule } from '@nestjs/config';

/**
 * A global module responsible for providing the EventPublisherService
 * to the entire application. This module encapsulates the configuration
 * and dependencies needed for event publishing, such as the SNS client.
 * Making it global simplifies dependency injection for a cross-cutting
 * concern like eventing.
 */
@Global()
@Module({
  imports: [
    SnsModule, // Provides the SnsService client
    ConfigModule, // Needed by EventPublisherService to get Topic ARNs
  ],
  providers: [EventPublisherService],
  exports: [EventPublisherService],
})
export class MessagingModule {}