import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import * as Joi from 'joi';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AdminModule } from './modules/admin/admin.module';
import { ConsentModule } from './modules/consent/consent.module';
import { DatabaseModule } from './shared/infrastructure/database/database.module';
import { RedisModule } from './shared/infrastructure/redis/redis.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from './modules/auth/guards/roles.guard';
import { appConfig } from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(3000),
        DATABASE_URL: Joi.string().required(),
        REDIS_URL: Joi.string().required(),

        // JWT Configuration
        JWT_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRY: Joi.string().default('15m'),
        JWT_REFRESH_TOKEN_EXPIRY: Joi.string().default('30d'),

        // AWS Configuration
        AWS_REGION: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),

        // AWS Cognito Configuration
        COGNITO_USER_POOL_ID: Joi.string().required(),
        COGNITO_CLIENT_ID: Joi.string().required(),

        // AWS SNS Configuration
        SNS_OTP_SENDER_ID: Joi.string().default('Platfrm'),
        
        // Messaging Configuration
        USER_EVENTS_TOPIC_ARN: Joi.string().required(),

        // Rate Limiting
        THROTTLE_TTL: Joi.number().default(60),
        THROTTLE_LIMIT: Joi.number().default(10),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),

    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),

    // Infrastructure Modules
    DatabaseModule,
    RedisModule,

    // Feature Modules
    AuthModule,
    UsersModule,
    AdminModule,
    ConsentModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true, // Strips properties that do not have any decorators
        forbidNonWhitelisted: true, // Throw an error if non-whitelisted values are provided
        transform: true, // Automatically transform payloads to DTO instances
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      // Secure all endpoints by default. Use @Public() decorator for public routes.
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      // Apply RolesGuard globally to enable @Roles() decorator on all controllers.
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}