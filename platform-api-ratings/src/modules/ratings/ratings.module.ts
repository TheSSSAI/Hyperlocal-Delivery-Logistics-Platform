import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { RatingsController } from './ratings.controller';
import { RatingsService } from './ratings.service';
import { RatingsRepository } from './ratings.repository';
import { RatingReview } from './entities/rating-review.entity';
import { RateableOrder } from './entities/rateable-order.entity';
import {
  IRATING_REPOSITORY_TOKEN,
  IRATINGS_SERVICE_TOKEN,
} from './interfaces/ratings.service.interface';
import { MessagingModule } from '../../shared/messaging/messaging.module';

/**
 * @module RatingsModule
 * @description Encapsulates all functionality related to the ratings and reviews bounded context.
 * It brings together the controller, service, repository, and entity definitions,
 * and configures the necessary dependency injection for the feature.
 */
@Module({
  imports: [
    ConfigModule,
    // Register the entities with TypeORM for this module's scope.
    // This makes the `Repository<RatingReview>` and `Repository<RateableOrder>`
    // available for injection within this module.
    TypeOrmModule.forFeature([RatingReview, RateableOrder]),
    // Import the shared MessagingModule to make its exported providers,
    // like MessagingService, available for injection.
    MessagingModule,
  ],
  // Declare the controllers that are part of this module.
  // NestJS will instantiate these and map their routes.
  controllers: [RatingsController],
  // Declare the providers that will be instantiated by the NestJS injector
  // and that can be shared at least across this module.
  providers: [
    {
      provide: IRATINGS_SERVICE_TOKEN,
      useClass: RatingsService,
    },
    {
      provide: IRATING_REPOSITORY_TOKEN,
      useClass: RatingsRepository,
    },
    // Provide a logger for injection into services and other components.
    Logger,
  ],
})
export class RatingsModule {}