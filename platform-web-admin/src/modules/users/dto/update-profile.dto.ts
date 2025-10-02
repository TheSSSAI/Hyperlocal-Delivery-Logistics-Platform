import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

/**
 * Data Transfer Object for updating a user's own profile information.
 * All fields are optional to allow for partial updates.
 * Maps to user stories CUS-006 (Customer Profile Management) and RDR-005.
 */
export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @Length(1, 50, { message: 'First name must be between 1 and 50 characters.' })
  firstName?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50, { message: 'Last name must be between 1 and 50 characters.' })
  lastName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  email?: string;
}