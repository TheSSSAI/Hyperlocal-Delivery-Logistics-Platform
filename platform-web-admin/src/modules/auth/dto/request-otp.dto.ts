import { IsNotEmpty, IsString, Matches } from 'class-validator';

/**
 * Data Transfer Object for requesting an OTP.
 * Used for both registration (CUS-001) and login (CUS-003) flows.
 * Ensures the mobile number is present and correctly formatted for the Indian market.
 * REQ-1-035
 */
export class RequestOtpDto {
  @IsNotEmpty({ message: 'Mobile number is required.' })
  @IsString()
  @Matches(/^[6-9]\d{9}$/, {
    message: 'Must be a valid 10-digit Indian mobile number.',
  })
  mobileNumber: string;
}