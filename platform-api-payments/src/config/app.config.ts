import { registerAs } from '@nestjs/config';
import { IsEnum, IsInt, IsString, Max, Min } from 'class-validator';
import { validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class AppConfigValidator {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsInt()
  @Min(0)
  @Max(65535)
  PORT: number;

  @IsString()
  APP_NAME: string;
}

export const appConfig = registerAs('app', () => {
  const config = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 3004, // Port for Payments Service
    name: process.env.APP_NAME || 'platform-api-payments',
  };

  const validatedConfig = new AppConfigValidator();
  validatedConfig.NODE_ENV = config.nodeEnv as Environment;
  validatedConfig.PORT = config.port;
  validatedConfig.APP_NAME = config.name;

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(`[App Config] Validation failed: ${errors.toString()}`);
  }

  return config;
});