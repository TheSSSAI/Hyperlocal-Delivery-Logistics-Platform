import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { URL } from 'url';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisUrl = new URL(configService.get<string>('REDIS_URL'));
        return {
          connection: {
            host: redisUrl.hostname,
            port: parseInt(redisUrl.port, 10),
            password: redisUrl.password,
          },
        };
      },
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}