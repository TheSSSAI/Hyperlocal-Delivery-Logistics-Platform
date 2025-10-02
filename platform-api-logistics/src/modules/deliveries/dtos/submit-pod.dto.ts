import {
  IsIn,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export type PodType = 'PHOTO' | 'OTP';

class PodLocationDto {
  @IsLatitude()
  latitude: number;

  @IsLongitude()
  longitude: number;
}

/**
 * REQ-1-074, REQ-1-075: Data Transfer Object for a rider to submit Proof of Delivery.
 */
export class SubmitPodDto {
  @IsString()
  @IsIn(['PHOTO', 'OTP'])
  @IsNotEmpty()
  podType: PodType;

  /**
   * For 'PHOTO', this should be the S3 object key of the uploaded image.
   * For 'OTP', this should be the 4-digit code entered by the rider.
   */
  @IsString()
  @IsNotEmpty()
  podData: string;

  /**
   * REQ-1-075: The GPS coordinates of the rider's device at the moment POD was captured.
   */
  @IsObject()
  @ValidateNested()
  @Type(() => PodLocationDto)
  location: PodLocationDto;
}