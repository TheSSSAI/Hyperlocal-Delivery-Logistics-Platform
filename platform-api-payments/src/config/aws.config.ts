import { registerAs } from '@nestjs/config';
import { IsString, IsOptional } from 'class-validator';
import { validateSync } from 'class-validator';

class AwsConfigValidator {
  @IsString()
  AWS_REGION: string;

  @IsString()
  @IsOptional()
  AWS_ACCESS_KEY_ID?: string;

  @IsString()
  @IsOptional()
  AWS_SECRET_ACCESS_KEY?: string;

  @IsString()
  AWS_ORDER_EVENTS_QUEUE_URL: string;
  
  @IsString()
  AWS_FINANCIAL_EVENTS_TOPIC_ARN: string;
}

export const awsConfig = registerAs('aws', () => {
  const config = {
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    orderEventsQueueUrl: process.env.AWS_ORDER_EVENTS_QUEUE_URL,
    financialEventsTopicArn: process.env.AWS_FINANCIAL_EVENTS_TOPIC_ARN,
  };

  const validatedConfig = new AwsConfigValidator();
  validatedConfig.AWS_REGION = config.region;
  validatedConfig.AWS_ACCESS_KEY_ID = config.accessKeyId;
  validatedConfig.AWS_SECRET_ACCESS_KEY = config.secretAccessKey;
  validatedConfig.AWS_ORDER_EVENTS_QUEUE_URL = config.orderEventsQueueUrl;
  validatedConfig.AWS_FINANCIAL_EVENTS_TOPIC_ARN = config.financialEventsTopicArn;

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(`[AWS Config] Validation failed: ${errors.toString()}`);
  }

  return config;
});