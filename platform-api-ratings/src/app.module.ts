import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { DatabaseModule } from './shared/database/database.module';
import { MessagingModule } from './shared/messaging/messaging.module';
import { RatingsModule } from './modules/ratings/ratings.module';
import { EventsModule } from './modules/events/events.module';
import appConfig from './config/app.config';

/**
 * The root module of the application.
 * This module is responsible for importing and configuring all other modules,
 * setting up global configuration, and establishing database connections.
 * It serves as the composition root for the entire microservice.
 */
@Module({
  imports: [
    // Global Configuration Module:
    // Loads environment variables from .env file, validates them using Joi,
    // and makes them available application-wide through the ConfigService.
    // isGlobal: true ensures that ConfigService is available in all other modules
    // without needing to import ConfigModule again.
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(3000),
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
        AWS_REGION: Joi.string().required().default('ap-south-1'),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_SQS_RATINGS_QUEUE_URL: Joi.string().required(),
        AWS_SNS_RATINGS_TOPIC_ARN: Joi.string().required(),
      }),
      // Ensures that environment variables are validated at application startup.
      // If validation fails, the application will not start.
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),

    // Shared Modules:
    // These modules provide foundational functionalities used across the application.
    DatabaseModule, // Sets up the TypeORM database connection.
    MessagingModule, // Provides services for interacting with AWS SNS/SQS.

    // Feature Modules:
    // These modules encapsulate the core business logic of the microservice.
    RatingsModule, // Handles all RESTful API logic for creating and retrieving ratings.
    EventsModule, // Handles all incoming asynchronous events (e.g., from SQS).
  ],
  // No controllers are defined at the root level. They are encapsulated within feature modules.
  controllers: [],
  // No providers are defined at the root level. They are encapsulated within feature/shared modules.
  providers: [],
})
export class AppModule {}