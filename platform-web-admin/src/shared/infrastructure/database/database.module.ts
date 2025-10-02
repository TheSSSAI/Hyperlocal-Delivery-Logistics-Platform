import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get('database');
        if (!dbConfig) {
          throw new Error('Database configuration not found');
        }

        return {
          type: 'postgres',
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.database,
          // REQ-1-111 specifies PostgreSQL.
          // In production, you would not use synchronize: true. Use migrations instead.
          synchronize: configService.get('NODE_ENV') !== 'production',
          logging: configService.get('NODE_ENV') === 'development',
          // Automatically loads entities from all modules
          autoLoadEntities: true,
          // Naming strategy to convert camelCase to snake_case for table/column names
          namingStrategy: new SnakeNamingStrategy(),
          // SSL configuration for production environments
          ...(configService.get('NODE_ENV') === 'production' && {
            ssl: {
              rejectUnauthorized: false, // Adjust as per your cloud provider's SSL requirements
            },
          }),
        };
      },
    }),
  ],
})
export class DatabaseModule {}