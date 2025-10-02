import { Module, Global, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';
import Redis from 'ioredis';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: (configService: ConfigService): Redis => {
        const logger = new Logger('RedisModule');
        const redisConfig = configService.get('redis');

        if (!redisConfig) {
          throw new Error('Redis configuration is missing!');
        }

        const client = new Redis({
          host: redisConfig.host,
          port: redisConfig.port,
          password: redisConfig.password,
          lazyConnect: true, // Connect on first command
          maxRetriesPerRequest: 3,
          retryStrategy: (times) => {
            const delay = Math.min(times * 50, 2000);
            logger.warn(`Retrying Redis connection (attempt ${times})...`);
            return delay;
          },
        });

        client.on('connect', () => {
          logger.log('Successfully connected to Redis.');
        });

        client.on('error', (err) => {
          logger.error('Redis connection error:', err);
        });

        return client;
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}