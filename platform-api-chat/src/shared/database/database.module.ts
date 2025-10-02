import { Global, Module } from '@nestjs/common';
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
          throw new Error('Database configuration is missing!');
        }
        return {
          type: 'postgres',
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.database,
          autoLoadEntities: true,
          // Set to false in production for safety. Migrations should be run explicitly.
          synchronize: configService.get('NODE_ENV') !== 'production',
          namingStrategy: new SnakeNamingStrategy(),
          logging:
            configService.get('NODE_ENV') === 'development'
              ? ['query', 'error']
              : ['error'],
          ssl:
            configService.get('NODE_ENV') === 'production'
              ? { rejectUnauthorized: false }
              : false,
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}