import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for requesting an OTP.
 * It contains the mobile number and includes validation.
 *
 * REQ-1-035: The mobile number must be validated to ensure it conforms to
 * Indian mobile number standards (e.g., 10 digits, valid starting digit).
 */
export class RequestOtpDto {
  @ApiProperty({
    description: 'A valid 10-digit Indian mobile number.',
    example: '9876543210',
    pattern: '^[6-9]\\d{9}$',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[6-9]\d{9}$/, {
    message: 'Must be a valid 10-digit Indian mobile number.',
  })
  mobileNumber: string;
}