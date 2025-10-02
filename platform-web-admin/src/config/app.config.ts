import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.APP_PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Authentication and JWT settings based on REQ-1-040, REQ-1-041, REQ-1-042
  auth: {
    otpExpirySeconds: parseInt(process.env.OTP_EXPIRY_SECONDS, 10) || 300, // 5 minutes
    maxOtpAttempts: parseInt(process.env.MAX_OTP_ATTEMPTS, 10) || 5,
    lockoutDurationMinutes: parseInt(process.env.LOCKOUT_DURATION_MINUTES, 10) || 15,
    otpResendCooldownSeconds: parseInt(process.env.OTP_RESEND_COOLDOWN_SECONDS, 10) || 60,
    
    jwtAccessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
    jwtAccessTokenExpiry: process.env.JWT_ACCESS_TOKEN_EXPIRY || '15m',
    
    jwtRefreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
    jwtRefreshTokenExpiry: process.env.JWT_REFRESH_TOKEN_EXPIRY || '30d',
  },

  // AWS Configuration based on technical requirements
  aws: {
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    cognito: {
      userPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
      clientId: process.env.AWS_COGNITO_CLIENT_ID,
    },
    sns: {
      smsSenderId: process.env.AWS_SNS_SENDER_ID || 'Hyperlocal',
    }
  },

  // Redis configuration for caching and state management
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD,
  },

  // Database configuration
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },

  // Messaging configuration for microservices communication
  messaging: {
    userEventsTopicArn: process.env.MESSAGING_USER_EVENTS_TOPIC_ARN,
  }
}));