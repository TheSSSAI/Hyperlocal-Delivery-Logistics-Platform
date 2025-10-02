import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';
import { validateConfig } from '../utils/validate-config';

class RazorpayEnvironmentVariables {
  @IsString()
  RAZORPAY_KEY_ID!: string;

  @IsString()
  RAZORPAY_KEY_SECRET!: string;

  @IsString()
  RAZORPAY_WEBHOOK_SECRET!: string;
}

export const razorpayConfig = registerAs('razorpay', () => {
  const validatedConfig = validateConfig(
    process.env,
    RazorpayEnvironmentVariables,
  );
  return {
    keyId: validatedConfig.RAZORPAY_KEY_ID,
    keySecret: validatedConfig.RAZORPAY_KEY_SECRET,
    webhookSecret: validatedConfig.RAZORPAY_WEBHOOK_SECRET,
  };
});