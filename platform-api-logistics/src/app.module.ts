import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { join } from 'path';

import { logisticsConfig } from './config/logistics.config';
import { AllocationModule } from './modules/allocation/allocation.module';
import { TrackingModule } from './modules/tracking/tracking.module';
import { ZonesModule } from './modules/zones/zones.module';
import { DeliveriesModule } from './modules/deliveries/deliveries.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { SharedModule } from './shared/shared.module';
import { DatabaseModule } from './shared/database/database.module';
import { CacheModule } from './shared/cache/cache.module';
import { MapboxModule } from './shared/mapbox/mapbox.module';
import { MessagingModule } from './shared/messaging/messaging.module';

@Module({
  imports: [
    // --- Core Configuration ---
    ConfigModule.forRoot({
      isGlobal: true,
      load: [logisticsConfig],
      envFilePath: ['.env'],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        redact: {
          paths: ['req.headers.authorization', 'req.headers.cookie'],
          censor: '***REDACTED***',
        },
      },
    }),

    // --- Database Configuration ---
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        synchronize: configService.get<boolean>('database.synchronize', false), // Should be false in production
        logging: configService.get<boolean>('database.logging', false),
        migrations: [join(__dirname, '..', 'migrations', '*.{ts,js}')],
        cli: {
          migrationsDir: 'src/migrations',
        },
        extra: {
          // E.g., for connection pooling
          max: 20,
          idleTimeoutMillis: 30000,
        },
      }),
      inject: [ConfigService],
    }),

    // --- Security ---
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 100, // 100 requests per minute per IP
    }),

    // --- Shared Infrastructure Modules ---
    SharedModule,
    DatabaseModule,
    CacheModule,
    MapboxModule,
    MessagingModule,

    // --- Feature Modules (Bounded Contexts) ---
    AllocationModule,
    TrackingModule,
    ZonesModule,
    DeliveriesModule,
    IntegrationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}