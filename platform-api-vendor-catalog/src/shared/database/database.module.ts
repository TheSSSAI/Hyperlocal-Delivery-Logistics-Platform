import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

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
        database: configService.get<string>('DB_NAME'),
        entities: [join(__dirname, '/../../modules/**/*.entity{.ts,.js}')],
        // synchronize: false is crucial for production. Schema changes should be handled via migrations.
        synchronize: false,
        logging: configService.get<string>('NODE_ENV') === 'development',
        // Migrations
        migrations: [join(__dirname, '/../../../db/migrations/*{.ts,.js}')],
        migrationsTableName: 'migrations',
        // Run migrations automatically on application startup.
        migrationsRun: true,
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}