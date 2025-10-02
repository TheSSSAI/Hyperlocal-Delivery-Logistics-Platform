import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';
import { UserType } from '../entities/user.entity';

/**
 * Data Transfer Object for creating a new user.
 * This is typically used internally by the AuthService after OTP verification,
 * not directly exposed as a public API endpoint.
 * It contains the minimal required information to create a user record.
 */
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[6-9]\d{9}$/, {
    message: 'Must be a valid 10-digit Indian mobile number.',
  })
  mobileNumber: string;

  @IsNotEmpty()
  @IsEnum(UserType)
  userType: UserType;

  // cognitoSub will be added by the service after creating the user in Cognito.
}