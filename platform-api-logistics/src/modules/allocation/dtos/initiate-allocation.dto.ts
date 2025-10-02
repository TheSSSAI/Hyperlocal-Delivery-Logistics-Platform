import {
  IsNotEmpty,
  IsObject,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class GeoJsonPointDto {
  @IsString()
  @IsNotEmpty()
  type: 'Point';

  @IsNotEmpty()
  coordinates: [number, number]; // [longitude, latitude]
}

/**
 * Data Transfer Object used to trigger the rider allocation process.
 * This is typically created from an incoming 'OrderReadyForPickup' event.
 * REQ-1-078: Triggers the rider allocation process.
 */
export class InitiateAllocationDto {
  @IsUUID()
  @IsNotEmpty()
  orderId: string;

  @IsUUID()
  @IsNotEmpty()
  vendorId: string;

  @IsObject()
  @ValidateNested()
  @Type(() => GeoJsonPointDto)
  vendorLocation: GeoJsonPointDto;
}