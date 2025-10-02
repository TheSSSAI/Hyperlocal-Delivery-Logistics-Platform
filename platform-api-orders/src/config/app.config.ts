import { registerAs } from '@nestjs/config';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  validateSync,
} from 'class-validator';
import { plainToInstance } from 'class-transformer';

/**
 * Defines the application environment types.
 */
enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

/**
 * Configuration schema for application-level settings.
 */
class AppConfig {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment = Environment.Development;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  PORT: number = 3000;
}

/**
 * Configuration schema for database settings.
 */
class DatabaseConfig {
  @IsUrl({ require_tld: false })
  @IsNotEmpty()
  POSTGRES_URL: string;
}

/**
 * Configuration schema for AWS settings.
 */
class AwsConfig {
  @IsString()
  @IsNotEmpty()
  AWS_REGION: string;

  @IsUrl({ protocols: ['http', 'https'] })
  @IsNotEmpty()
  AWS_SQS_QUEUE_URL: string;

  @IsString()
  @IsNotEmpty()
  AWS_SNS_TOPIC_ARN: string;

  @IsString()
  @IsNotEmpty()
  AWS_ACCESS_KEY_ID: string;

  @IsString()
  @IsNotEmpty()
  AWS_SECRET_ACCESS_KEY: string;
}

/**
 * Configuration schema for all environment variables.
 * Combines all specific configuration classes.
 */
class EnvironmentVariables {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment = Environment.Development;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  PORT: number = 3000;

  @IsUrl({ require_tld: false })
  @IsNotEmpty()
  POSTGRES_URL: string;

  @IsString()
  @IsNotEmpty()
  AWS_REGION: string;

  @IsUrl({ protocols: ['http', 'https'] })
  @IsNotEmpty()
  AWS_SQS_QUEUE_URL: string;

  @IsString()
  @IsNotEmpty()
  AWS_SNS_TOPIC_ARN: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional() // Optional for environments using IAM roles (like EKS)
  AWS_ACCESS_KEY_ID?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional() // Optional for environments using IAM roles
  AWS_SECRET_ACCESS_KEY?: string;
}

/**
 * Validates the loaded environment variables against the schema.
 * @param config The configuration object to validate.
 * @returns The validated and transformed configuration object.
 */
export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(`Config validation error: ${errors.toString()}`);
  }
  return validatedConfig;
}

/**
 * Exports the main application configuration using NestJS's registerAs provider.
 * This allows for type-safe access to configuration values throughout the application.
 */
export const appConfig = registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10) || 3000,
}));

/**
 * Exports the database configuration.
 */
export const databaseConfig = registerAs('database', () => ({
  url: process.env.POSTGRES_URL,
}));

/**
 * Exports the AWS services configuration.
 */
export const awsConfig = registerAs('aws', () => ({
  region: process.env.AWS_REGION,
  sqsQueueUrl: process.env.AWS_SQS_QUEUE_URL,
  snsTopicArn: process.env.AWS_SNS_TOPIC_ARN,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
}));