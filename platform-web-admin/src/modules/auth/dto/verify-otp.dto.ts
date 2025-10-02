import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { RequestOtpDto } from './request-otp.dto';

/**
 * DTO for verifying a One-Time Password (OTP).
 * Extends RequestOtpDto to include the mobile number.
 *
 * @see CUS-003 - Customer Login with OTP
 * @see RDR-004 - Rider Login with OTP
 * @see VND-004 - Vendor Login with OTP
 * @see CUS-001 - Customer Registration with Mobile Number and OTP Verification
 */
export class VerifyOtpDto extends RequestOtpDto {
  @ApiProperty({
    description: 'The 6-digit One-Time Password sent to the user.',
    example: '123456',
    minLength: 6,
    maxLength: 6,
  })
  @IsNotEmpty({ message: 'OTP is required.' })
  @IsString()
  @Length(6, 6, { message: 'OTP must be 6 digits.' })
  otp: string;
}