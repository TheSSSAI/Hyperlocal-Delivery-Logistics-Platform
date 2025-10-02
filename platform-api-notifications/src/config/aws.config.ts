import { registerAs } from '@nestjs/config';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { validateConfig } from '../shared/utils/config.validator';

class AwsConfig {
  @IsString()
  @IsNotEmpty()
  region: string;

  @IsUrl({ require_tld: false })
  @IsNotEmpty()
  sqsQueueUrl: string;
}

export const awsConfig = registerAs('aws', () => {
  const config = {
    region: process.env.AWS_REGION,
    sqsQueueUrl: process.env.AWS_SQS_QUEUE_URL,
  };

  validateConfig(config, AwsConfig);

  return config;
});