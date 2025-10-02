import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  MinLength,
  MaxLength,
} from 'class-validator';

/**
 * Data Transfer Object for creating a new Vendor Profile.
 * This DTO is used to validate the incoming data when a new vendor is created.
 */
export class CreateVendorProfileDto {
  @ApiProperty({
    description: 'The unique identifier of the user associated with this vendor profile.',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'The public-facing name of the vendor store.',
    example: 'Global Bites Kitchen',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  storeName: string;
}