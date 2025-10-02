import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  // Application settings
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  apiPrefix: process.env.API_PREFIX || 'api',

  // JWT settings from REQ-1-040, REQ-1-096
  jwt: {
    secret: process.env.JWT_SECRET,
    accessTokenExpiry: process.env.JWT_ACCESS_TOKEN_EXPIRY || '15m',
    refreshTokenExpiry: process.env.JWT_REFRESH_TOKEN_EXPIRY || '30d',
  },

  // Auth security settings from REQ-1-041, CUS-005
  auth: {
    otpExpirySeconds: parseInt(process.env.OTP_EXPIRY_SECONDS, 10) || 300, // 5 minutes
    maxOtpAttempts: parseInt(process.env.MAX_OTP_ATTEMPTS, 10) || 5,
    lockoutDurationMinutes:
      parseInt(process.env.LOCKOUT_DURATION_MINUTES, 10) || 15,
    otpResendCooldownSeconds:
      parseInt(process.env.OTP_RESEND_COOLDOWN_SECONDS, 10) || 60,
  },

  // AWS configuration from REQ-1-007, REQ-1-090, REQ-1-096
  aws: {
    region: process.env.AWS_REGION || 'ap-south-1',
    cognito: {
      userPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
      clientId: process.env.AWS_COGNITO_CLIENT_ID,
    },
    sns: {
      accessKeyId: process.env.AWS_SNS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SNS_SECRET_ACCESS_KEY,
      region: process.env.AWS_SNS_REGION || 'ap-south-1',
    },
    sqs: {
      queueUrl: process.env.AWS_SQS_QUEUE_URL,
    }
  },

  // Database configuration
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },

  // Redis configuration
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD,
  },
}));