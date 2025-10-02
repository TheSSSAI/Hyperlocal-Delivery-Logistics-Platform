import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RequestOtpDto } from './request-otp.dto';

/**
 * Data Transfer Object for verifying a One-Time Password (OTP).
 * Extends RequestOtpDto to include the mobile number.
 * Used in both registration and login verification flows.
 *
 * This DTO directly supports the verification step of the authentication process
 * as required by REQ-1-035 (Customer Registration) and REQ-1-039 (User Login).
 * The validation rules ensure data integrity before processing by the AuthService.
 */
export class VerifyOtpDto extends RequestOtpDto {
  @ApiProperty({
    description: 'The 6-digit One-Time Password sent to the user\'s mobile number.',
    example: '123456',
    minLength: 6,
    maxLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @Length(6, 6, { message: 'OTP must be exactly 6 digits.' })
  otp: string;
}