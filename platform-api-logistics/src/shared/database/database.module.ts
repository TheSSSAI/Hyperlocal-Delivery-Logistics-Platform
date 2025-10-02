import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

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
        // Auto-loading entities is crucial for a modular application.
        // It finds all files ending with .entity.ts or .entity.js
        entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
        // Synchronize should be false in production. Migrations should be used instead.
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        // Enable logging for debugging purposes if needed
        logging: configService.get<string>('NODE_ENV') === 'development',
        // PostGIS support is native to the 'pg' driver, but entities must use correct column types.
        extra: {
          // You might configure connection pool settings here for production
          // max: 20,
        },
      }),
    }),
  ],
})
export class DatabaseModule {}