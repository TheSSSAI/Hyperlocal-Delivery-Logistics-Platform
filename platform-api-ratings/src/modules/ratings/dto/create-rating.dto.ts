import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export enum RevieweeType {
  VENDOR = 'vendor',
  RIDER = 'rider',
}

/**
 * Data Transfer Object for creating a new rating.
 * Used for request body validation in the controller.
 * This contract ensures that all data required to submit a rating is present and correctly formatted.
 * Fulfills requirements from REQ-1-063.
 */
export class CreateRatingDto {
  /**
   * The UUID of the order being rated.
   * @example 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
   */
  @IsUUID()
  orderId: string;

  /**
   * The UUID of the entity being reviewed (either a Vendor's user ID or a Rider's user ID).
   * @example 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6'
   */
  @IsUUID()
  revieweeId: string;

  /**
   * The type of the entity being reviewed. Must be either 'vendor' or 'rider'.
   * @example 'vendor'
   */
  @IsEnum(RevieweeType)
  revieweeType: RevieweeType;

  /**
   * The star rating, an integer from 1 to 5.
   * @example 5
   */
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  /**
   * The optional text review provided by the customer.
   * Limited to 1000 characters.
   * @example 'The food was excellent and arrived hot!'
   */
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  reviewText?: string;
}