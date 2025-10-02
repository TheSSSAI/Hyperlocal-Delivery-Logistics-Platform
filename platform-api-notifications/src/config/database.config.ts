import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { validateConfig } from '../shared/utils/config.validator';

class DatabaseConfig {
  @IsString()
  @IsNotEmpty()
  host: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  port: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  user: string;

  @IsString()
  @IsNotEmpty()
  pass: string;

  @IsBoolean()
  @IsOptional()
  ssl?: boolean;
}

export const databaseConfig = registerAs('database', (): TypeOrmModuleOptions => {
  const config = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    ssl: process.env.DB_SSL === 'true',
  };

  validateConfig(config, DatabaseConfig);

  return {
    type: 'postgres',
    host: config.host,
    port: config.port,
    database: config.name,
    username: config.user,
    password: config.pass,
    autoLoadEntities: true,
    // synchronize should be false in production to prevent accidental data loss.
    // Use migrations instead.
    synchronize: process.env.NODE_ENV !== 'production',
    ssl: config.ssl ? { rejectUnauthorized: false } : false,
    logging: process.env.NODE_ENV === 'development',
  };
});