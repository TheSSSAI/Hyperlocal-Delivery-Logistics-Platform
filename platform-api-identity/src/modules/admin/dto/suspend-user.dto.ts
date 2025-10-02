import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for suspending a user.
 * ADM-006 requires a mandatory reason for suspension.
 */
export class SuspendUserDto {
  @ApiProperty({
    description: 'The mandatory reason for suspending the user account.',
    example: 'Repeated fraudulent activity.',
    minLength: 10,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  reason: string;
}