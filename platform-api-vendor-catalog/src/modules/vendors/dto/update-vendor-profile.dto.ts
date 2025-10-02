import { PartialType } from '@nestjs/swagger';
import { CreateVendorProfileDto } from './create-vendor-profile.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

/**
 * Data Transfer Object for updating an existing Vendor Profile.
 * It extends the CreateVendorProfileDto with all fields being optional.
 * The userId is not updatable and thus excluded.
 */
export class UpdateVendorProfileDto extends PartialType(CreateVendorProfileDto) {
  @ApiPropertyOptional({
    description: 'The public-facing name of the vendor store.',
    example: 'Global Bites Kitchen & Grill',
    minLength: 3,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  storeName?: string;

  // Note: userId is inherited but should not be updatable.
  // The service layer logic must prevent any attempts to change the userId.
  userId?: string;
}