import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisConfig = configService.get('redis');
        if (!redisConfig) {
          throw new Error('Redis configuration is missing!');
        }
        const store = await redisStore({
          url: redisConfig.url,
          ttl: redisConfig.ttl || 300000, // Default TTL: 5 minutes in ms
        });

        return {
          store,
        };
      },
    }),
  ],
  exports: [CacheModule],
})
export class RedisModule {}