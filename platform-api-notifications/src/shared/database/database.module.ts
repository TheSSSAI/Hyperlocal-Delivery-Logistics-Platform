import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DatabaseConfig } from '../../config/database.config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

/**
 * The DatabaseModule is a shared module responsible for configuring and providing
 * the database connection to the rest of the application. It uses TypeORM as the ORM.
 *
 * This module is configured asynchronously to depend on the ConfigModule, ensuring
 * that all necessary environment variables are loaded and validated before a
 * database connection is attempted.
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      /**
       * Factory function to create the TypeORM connection options.
       * It retrieves database configuration from the ConfigService, ensuring
       * a clean separation of concerns and adherence to the 12-factor app methodology.
       * @param configService The injected ConfigService instance.
       * @returns The TypeOrmModuleOptions object for the database connection.
       */
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const dbConfig = configService.get<DatabaseConfig>('database');

        if (!dbConfig) {
          throw new Error('Database configuration is missing!');
        }

        return {
          type: 'postgres',
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.database,
          // Automatically loads entities from all modules.
          // This avoids the need to manually list entities in each forFeature() call.
          autoLoadEntities: true,
          // Naming strategy to convert camelCase entity properties to snake_case table columns.
          namingStrategy: new SnakeNamingStrategy(),
          // 'synchronize' should be set to 'false' in production environments.
          // Migrations should be handled by a separate, controlled process.
          synchronize: dbConfig.synchronize,
          // Enables logging of all executed queries. Useful for debugging in development.
          logging: dbConfig.logging,
          ssl: dbConfig.ssl ? { rejectUnauthorized: false } : false,
        };
      },
    }),
  ],
})
export class DatabaseModule {}