import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

/**
 * Represents a single consent item within the update request.
 */
class ConsentItemDto {
  @IsNotEmpty()
  @IsString()
  consentType: string;

  @IsNotEmpty()
  @IsBoolean()
  isGranted: boolean;
}

/**
 * Data Transfer Object for updating a user's data privacy consents.
 * This structure allows for bulk updates of multiple consent types in a single request.
 * Maps to requirements REQ-1-021 and user story CUS-042.
 */
export class UpdateConsentDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConsentItemDto)
  consents: ConsentItemDto[];
}