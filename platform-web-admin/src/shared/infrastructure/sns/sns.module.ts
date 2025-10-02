import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SnsService } from './sns.service';

/**
 * Provides and exports the SnsService as a global singleton.
 * This ensures a single, shared instance of the AWS SNS client is used
 * across the application, making it available for dependency injection
 * in any service that needs to send SMS or publish events.
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [SnsService],
  exports: [SnsService],
})
export class SnsModule {}