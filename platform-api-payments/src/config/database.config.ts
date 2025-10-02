import { registerAs } from '@nestjs/config';
import { IsBoolean, IsInt, IsString, Max, Min } from 'class-validator';
import { validateSync } from 'class-validator';

class DatabaseConfigValidator {
  @IsString()
  DB_HOST: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  DB_PORT: number;

  @IsString()
  DB_USERNAME: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_DATABASE: string;

  @IsBoolean()
  DB_SYNCHRONIZE: boolean;

  @IsBoolean()
  DB_LOGGING: boolean;
}

export const databaseConfig = registerAs('database', () => {
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.NODE_ENV === 'development',
  };

  const validatedConfig = new DatabaseConfigValidator();
  validatedConfig.DB_HOST = config.host;
  validatedConfig.DB_PORT = config.port;
  validatedConfig.DB_USERNAME = config.username;
  validatedConfig.DB_PASSWORD = config.password;
  validatedConfig.DB_DATABASE = config.database;
  validatedConfig.DB_SYNCHRONIZE = config.synchronize;
  validatedConfig.DB_LOGGING = config.logging;

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(`[Database Config] Validation failed: ${errors.toString()}`);
  }

  // In production, synchronize should always be false.
  if (process.env.NODE_ENV === 'production' && config.synchronize) {
    console.warn('[Database Config] Warning: DB_SYNCHRONIZE is true in production. It is strongly recommended to set this to false.');
    config.synchronize = false;
  }
  
  return config;
});