import { IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * Data Transfer Object for an administrator suspending a user's account.
 * Enforces that a reason for suspension is always provided.
 * Maps to user story ADM-006.
 */
export class SuspendUserDto {
  @IsNotEmpty({ message: 'A reason for suspension is required.' })
  @IsString()
  @MinLength(10, {
    message: 'Suspension reason must be at least 10 characters long.',
  })
  reason: string;
}