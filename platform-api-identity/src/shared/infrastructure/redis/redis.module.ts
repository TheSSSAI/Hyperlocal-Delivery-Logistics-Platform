import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { RedisService } from './redis.service';

/**
 * @class RedisModule
 * @description A global module to provide and configure the Redis connection and service.
 * It uses a factory provider to create a singleton instance of the `ioredis` client,
 * configured with credentials from the environment via `ConfigService`.
 * The `RedisService`, which encapsulates interactions with the Redis client, is then
 * provided and exported, making it available for dependency injection throughout the application.
 * Marking the module as global simplifies its usage in other feature modules.
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: (configService: ConfigService): Redis => {
        return new Redis({
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          password: configService.get<string>('REDIS_PASSWORD'),
          // Robust error handling and reconnection strategy
          maxRetriesPerRequest: 3,
          retryStrategy: (times) => {
            const delay = Math.min(times * 50, 2000);
            return delay;
          },
        });
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}