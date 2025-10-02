import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AdminModule } from './modules/admin/admin.module';
import { ConsentModule } from './modules/consent/consent.module';

import { DatabaseModule } from './shared/infrastructure/database/database.module';
import { RedisModule } from './shared/infrastructure/redis/redis.module';
import { CognitoModule } from './shared/infrastructure/cognito/cognito.module';
import { SnsModule } from './shared/infrastructure/sns/sns.module';
import { MessagingModule } from './shared/infrastructure/messaging/messaging.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import appConfig from './config/app.config';

/**
 * The root module of the Identity & Access microservice.
 * This module is responsible for importing all feature and infrastructure modules,
 * and for configuring global providers like exception filters and validation pipes.
 */
@Module({
  imports: [
    // --- Core Configuration ---
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available application-wide
      load: [appConfig], // Loads custom configuration
      // Add validation schema for environment variables if needed
    }),

    // --- Shared Infrastructure Modules ---
    DatabaseModule,
    RedisModule,
    CognitoModule,
    SnsModule,
    MessagingModule,

    // --- Feature Modules ---
    AuthModule,
    UsersModule,
    AdminModule,
    ConsentModule,
  ],
  controllers: [], // No controllers at the root level
  providers: [
    // Register a global exception filter to ensure consistent error responses across all endpoints.
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    // Register a global validation pipe to enforce DTO validation rules on all incoming requests.
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true, // Strips properties that do not have any decorators
        forbidNonWhitelisted: true, // Throws an error if unknown properties are present
        transform: true, // Automatically transforms payloads to be objects typed according to their DTO classes
        transformOptions: {
          enableImplicitConversion: true, // Allows for implicit conversion of types
        },
      }),
    },
  ],
})
export class AppModule {}