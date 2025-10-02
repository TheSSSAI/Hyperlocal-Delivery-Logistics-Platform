import {
  IsDateString,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

/**
 * REQ-1-060: Data Transfer Object for incoming real-time location updates from rider devices.
 * This is the payload for the 'updateLocation' WebSocket event.
 */
export class LocationUpdateDto {
  @IsLatitude()
  @IsNotEmpty()
  latitude: number;

  @IsLongitude()
  @IsNotEmpty()
  longitude: number;

  /**
   * ISO 8601 timestamp of when the location was recorded on the device.
   */
  @IsDateString()
  @IsNotEmpty()
  timestamp: string;

  /**
   * GPS accuracy in meters.
   */
  @IsNumber()
  @IsOptional()
  accuracy?: number;
}