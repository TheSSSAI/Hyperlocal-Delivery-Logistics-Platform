import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for updating a user's profile.
 * As per CUS-006, this allows customers to update their name and email.
 * Mobile number is the primary identifier and cannot be changed here.
 */
export class UpdateProfileDto {
  @ApiProperty({
    description: "The user's first name.",
    example: 'Suresh',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: "The user's last name.",
    example: 'Kumar',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: "The user's email address.",
    example: 'suresh.kumar@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;
}