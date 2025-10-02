import { Module, Global } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';
import { RedisCacheService } from './redis-cache.service';
import { IRiderLocationCacheService } from './interfaces/rider-location-cache.interface';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: configService.get<string>('REDIS_HOST'),
            port: configService.get<number>('REDIS_PORT'),
          },
          // Time-to-live for cache entries in seconds
          ttl: configService.get<number>('REDIS_TTL', 600),
        });
        return {
          store: () => store,
        };
      },
    }),
  ],
  providers: [
    {
      provide: IRiderLocationCacheService,
      useClass: RedisCacheService,
    },
  ],
  exports: [IRiderLocationCacheService],
})
export class AppCacheModule {}