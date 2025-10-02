import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  RateableOrder,
} from '../../modules/ratings/entities/rateable-order.entity';
import {
  RatingReview,
} from '../../modules/ratings/entities/rating-review.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction =
          configService.get<string>('NODE_ENV') === 'production';
        const databaseUrl = configService.getOrThrow<string>('DATABASE_URL');

        return {
          type: 'postgres',
          url: databaseUrl,
          entities: [RatingReview, RateableOrder],
          // Best practice: synchronize should be false in production
          synchronize: !isProduction,
          // Auto-load entities is convenient but can be less explicit.
          // Specifying entities directly is safer for microservices.
          autoLoadEntities: false,
          logging: isProduction ? ['error'] : ['query', 'error', 'warn'],
          ssl: isProduction
            ? {
                rejectUnauthorized: false, // Required for some cloud providers like Heroku
              }
            : false,
          // Connection pooling configuration for enterprise-grade performance
          extra: {
            max: configService.get<number>('DB_POOL_SIZE', 20),
            connectionTimeoutMillis: configService.get<number>(
              'DB_CONNECTION_TIMEOUT',
              5000,
            ),
          },
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}