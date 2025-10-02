import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { SqsModule } from '@ssut/nestjs-sqs';

import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import razorpayConfig from './config/razorpay.config';
import awsConfig from './config/aws.config';

import { PaymentsModule } from './modules/payments/payments.module';
import { SettlementsModule } from './modules/settlements/settlements.module';
import { LedgerModule } from './modules/ledger/ledger.module';
import { MessagingModule } from './shared/messaging/messaging.module';
import { RazorpayModule } from './shared/razorpay/razorpay.module';

import { Payment } from './database/entities/payment.entity';
import { Payout } from './database/entities/payout.entity';
import { FinancialTransaction } from './database/entities/financial-transaction.entity';

@Module({
  imports: [
    // --- Core Configuration Modules ---
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, razorpayConfig, awsConfig],
      // TODO: Add validation schema if needed for stricter config validation
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        entities: [Payment, Payout, FinancialTransaction],
        synchronize: configService.get<boolean>('database.synchronize'), // Should be false in production
        logging: configService.get<boolean>('database.logging'),
        ssl:
          configService.get<string>('NODE_ENV') === 'production'
            ? { rejectUnauthorized: false }
            : false,
      }),
    }),

    ScheduleModule.forRoot(),

    SqsModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        consumers: [
          // SQS consumers are registered within the MessagingModule's EventConsumer
        ],
        producers: [], // Producers are handled dynamically by the EventPublisher
        region: configService.get<string>('aws.region'),
        credentials: {
          accessKeyId: configService.get<string>('aws.accessKeyId'),
          secretAccessKey: configService.get<string>('aws.secretAccessKey'),
        },
      }),
    }),

    // --- Feature Modules (Bounded Contexts) ---
    LedgerModule,
    PaymentsModule,
    SettlementsModule,

    // --- Shared Infrastructure Modules ---
    MessagingModule,
    RazorpayModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}