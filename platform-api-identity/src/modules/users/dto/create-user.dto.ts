import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Role } from '../../auth/decorators/roles.decorator';

/**
 * Data Transfer Object for internal service-to-service user creation.
 * This DTO is typically used by the AuthService after successful registration
 * verification to create the user record in the UsersService.
 */
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  mobileNumber: string;

  @IsNotEmpty()
  @IsEnum(Role)
  userType: Role;

  @IsNotEmpty()
  @IsString()
  cognitoSub: string;

  // Optional fields that may be collected during a multi-step registration
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  email?: string;
}