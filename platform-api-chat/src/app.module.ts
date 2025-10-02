import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { DatabaseModule } from './shared/database/database.module';
import { RedisModule } from './shared/redis/redis.module';
import { ChatModule } from './modules/chat/chat.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { TemplatesModule } from './modules/templates/templates.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      validationSchema: Joi.object({
        // Application
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(3000),

        // PostgreSQL Database
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),

        // Redis
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        REDIS_PASSWORD: Joi.string().optional().allow(''),

        // JWT & Authentication
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
        COGNITO_USER_POOL_ID: Joi.string().required(),
        COGNITO_REGION: Joi.string().required(),
        COGNITO_CLIENT_ID: Joi.string().required(),

        // AWS SQS/SNS
        AWS_REGION: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        ORDER_EVENTS_SQS_URL: Joi.string().required(),
        
        // Inter-service Communication
        ORDER_SERVICE_URL: Joi.string().uri().required(),
      }),
    }),
    DatabaseModule,
    RedisModule,
    ChatModule,
    IntegrationsModule,
    TemplatesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}