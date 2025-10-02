import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { ConsumersModule } from './modules/consumers/consumers.module';
import { DispatchModule } from './modules/dispatch/dispatch.module';
import { TemplatesModule } from './modules/templates/templates.module';
import { IdentityModule } from './modules/identity/identity.module';
import { DatabaseModule } from './shared/database/database.module';
import { ObservabilityModule } from './shared/observability/observability.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: Joi.object({
        // Application
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(3000),

        // AWS Configuration
        AWS_REGION: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_SQS_QUEUE_URL: Joi.string().required(),
        AWS_SQS_WAIT_TIME_SECONDS: Joi.number().default(20),
        AWS_SQS_MAX_NUMBER_OF_MESSAGES: Joi.number().min(1).max(10).default(10),

        // Firebase Configuration (from Secrets Manager, passed as env vars)
        FIREBASE_PROJECT_ID: Joi.string().required(),
        FIREBASE_CLIENT_EMAIL: Joi.string().email().required(),
        FIREBASE_PRIVATE_KEY: Joi.string().required(),

        // Database Configuration (for Templates)
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(5432),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),

        // Internal Service Dependencies
        IDENTITY_SERVICE_URL: Joi.string().uri().required(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    ObservabilityModule,
    DatabaseModule,
    ConsumersModule,
    DispatchModule,
    TemplatesModule,
    IdentityModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}