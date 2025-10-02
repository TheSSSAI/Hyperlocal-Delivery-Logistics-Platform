import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

/**
 * @class DatabaseModule
 * @description A global module responsible for configuring and providing the database connection using TypeORM.
 * It uses an asynchronous factory to inject the ConfigService and retrieve database credentials
 * from environment variables, ensuring that no sensitive information is hardcoded.
 * This module is configured to be global, making the TypeORM connection and repositories
 * available throughout the application without needing to import this module in every feature module.
 */
@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/../../../modules/**/*.entity{.ts,.js}'],
        // In production, migrations should be run explicitly and synchronize should be false.
        // For development, it can be set to true for rapid prototyping.
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        logging: configService.get<string>('NODE_ENV') !== 'production',
        namingStrategy: new SnakeNamingStrategy(),
        extra: {
          // Set a statement timeout to prevent long-running queries from locking up the database
          statement_timeout: 5000,
        },
      }),
    }),
  ],
})
export class DatabaseModule {}