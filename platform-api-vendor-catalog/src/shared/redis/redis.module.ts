import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          url: configService.get<string>('REDIS_URL'),
          ttl: configService.get<number>('CACHE_TTL', 60000), // Default TTL of 60 seconds
        });
        return {
          store: () => store,
        };
      },
      isGlobal: true, // Make the cache available application-wide
    }),
  ],
  exports: [CacheModule],
})
export class RedisModule {}