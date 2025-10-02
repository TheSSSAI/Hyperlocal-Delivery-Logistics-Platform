import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppConfig } from '../../config/app.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig, true>) => {
        const dbUrl = configService.get('database.url', { infer: true });
        if (!dbUrl) {
          throw new Error('Database URL is not defined in the configuration.');
        }

        return {
          type: 'postgres',
          url: dbUrl,
          entities: [join(__dirname, '/../../**/*.entity{.ts,.js}')],
          // We are using migrations to sync the schema, so this should be false in production.
          // It can be set to true in development environments if needed, but migrations are preferred.
          synchronize: configService.get('NODE_ENV') !== 'production',
          migrations: [join(__dirname, '/../../../db/migrations/*{.ts,.js}')],
          migrationsRun: true,
          logging: configService.get('NODE_ENV') === 'development',
          ssl:
            configService.get('NODE_ENV') === 'production'
              ? { rejectUnauthorized: false }
              : false,
          poolSize: 10,
          keepConnectionAlive: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}