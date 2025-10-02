/**
 * @file Defines the Data Transfer Object for creating a new user during registration.
 * @version 1.0.0
 * @since 1.0.0
 * @author Principal Software Engineer
 * @see REQ-1-035
 */

import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';
import { UserRole } from '../../enums/user-role.enum';

/**
 * DTO for creating a new user. This contract is used by the registration endpoint.
 */
export class CreateUserDto {
  /**
   * The user's 10-digit Indian mobile number, which serves as their primary identifier.
   * @example "9876543210"
   */
  @IsString()
  @IsNotEmpty()
  @Matches(/^[6-9]\d{9}$/, {
    message: 'Mobile number must be a valid 10-digit Indian mobile number.',
  })
  mobileNumber: string;

  /**
   * The role the user is registering for. This determines the onboarding flow.
   * @example UserRole.Customer
   */
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}