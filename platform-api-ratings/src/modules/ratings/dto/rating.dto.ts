import { Expose } from 'class-transformer';

/**
 * Defines the type for the reviewee, which can be a vendor or a rider.
 */
export type RevieweeType = 'vendor' | 'rider';

/**
 * Data Transfer Object for a rating review.
 * This DTO represents the public-facing structure of a rating review
 * when returned by the API.
 */
export class RatingDto {
  /**
   * The unique identifier of the rating review.
   * @example 'b1b5a5b5-1b1b-4b1b-8b1b-1b1b1b1b1b1b'
   */
  @Expose()
  ratingReviewId: string;

  /**
   * The unique identifier of the associated order.
   * @example 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
   */
  @Expose()
  orderId: string;

  /**
   * The unique identifier of the customer who submitted the review.
   * Note: This might be anonymized or omitted in certain contexts.
   * @example 'c1c5a5c5-1c1c-4c1c-8c1c-1c1c1c1c1c1c'
   */
  @Expose()
  reviewerId: string;

  /**
   * The unique identifier of the entity that was reviewed (vendor or rider).
   * @example 'd1d5a5d5-1d1d-4d1d-8d1d-1d1d1d1d1d1d'
   */
  @Expose()
  revieweeId: string;

  /**
   * The type of the entity that was reviewed.
   * @example 'vendor'
   */
  @Expose()
  revieweeType: RevieweeType;

  /**
   * The star rating given (1-5).
   * @example 5
   */
  @Expose()
  rating: number;

  /**
   * The optional text review.
   * @example 'Excellent service!'
   */
  @Expose()
  reviewText: string;

  /**
   * The timestamp when the review was created.
   * @example '2023-10-27T10:00:00.000Z'
   */
  @Expose()
  createdAt: Date;
}