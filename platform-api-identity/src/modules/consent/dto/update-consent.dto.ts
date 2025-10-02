import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Represents a single consent item.
 */
class ConsentItemDto {
  @ApiProperty({
    description: 'The unique identifier for the consent type.',
    example: 'promotional_emails',
  })
  @IsNotEmpty()
  @IsString()
  consentType: string;

  @ApiProperty({
    description: 'Whether the user has granted consent for this type.',
    example: true,
  })
  @IsBoolean()
  isGranted: boolean;
}

/**
 * Data Transfer Object for updating a user's data privacy consents.
 * This is used to manage granular consent as required by REQ-1-021 (DPDP Act).
 */
export class UpdateConsentDto {
  @ApiProperty({
    description: 'An array of consent preferences to update.',
    type: [ConsentItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConsentItemDto)
  consents: ConsentItemDto[];
}