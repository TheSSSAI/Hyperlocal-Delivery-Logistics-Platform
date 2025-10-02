import { RatingReview } from '../entities/rating-review.entity';
import { RateableOrder } from '../entities/rateable-order.entity';
import { CreateRatingDto } from '../dto/create-rating.dto';
import { PaginatedResult, PaginationDto } from '../dto/rating.dto';

/**
 * Interface for the Ratings Repository.
 * Defines the contract for data access operations related to ratings and reviews.
 * This acts as a port in the Clean/Hexagonal Architecture, abstracting the
 * data persistence mechanism from the core application logic.
 */
export const IRatingRepository = Symbol('IRatingRepository');

export interface IRatingRepository {
  /**
   * Creates a new rating review record in the database.
   * @param createRatingDto - The data transfer object containing the details for the new rating.
   * @param reviewerId - The ID of the user submitting the rating.
   * @returns A promise that resolves to the newly created RatingReview entity.
   */
  create(
    createRatingDto: CreateRatingDto,
    reviewerId: string,
  ): Promise<RatingReview>;

  /**
   * Finds a rating by the order ID and the reviewer ID to check for duplicates.
   * @param orderId The ID of the order.
   * @param reviewerId The ID of the reviewer.
   * @param revieweeType The type of the entity being reviewed ('vendor' or 'rider').
   * @returns A promise that resolves to the existing RatingReview entity or null if not found.
   */
  findByOrderIdAndReviewer(
    orderId: string,
    reviewerId: string,
    revieweeType: 'vendor' | 'rider',
  ): Promise<RatingReview | null>;

  /**
   * Retrieves a paginated list of ratings for a specific reviewee (vendor or rider).
   * @param revieweeId The ID of the vendor or rider.
   * @param paginationDto DTO containing pagination parameters (page, limit).
   * @returns A promise that resolves to a paginated result of RatingReview entities.
   */
  findByReviewee(
    revieweeId: string,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResult<RatingReview>>;

  /**
   * Calculates the average rating and total rating count for a specific reviewee.
   * This should be an efficient aggregate query.
   * @param revieweeId The ID of the vendor or rider.
   * @returns A promise that resolves to an object containing the average and count.
   */
  getAverageRating(revieweeId: string): Promise<{ average: number; count: number }>;

  /**
   * Finds a rateable order by its ID.
   * @param orderId The ID of the order to check.
   * @returns A promise that resolves to the RateableOrder entity or null if not found.
   */
  findRateableOrderById(orderId: string): Promise<RateableOrder | null>;

  /**
   * Creates a new rateable order record. This is typically triggered when an order is delivered.
   * @param rateableOrder The RateableOrder entity to create.
   * @returns A promise that resolves when the operation is complete.
   */
  createRateableOrder(rateableOrder: RateableOrder): Promise<RateableOrder>;

  /**
   * Updates an existing rateable order record, for instance, to mark a rating as completed.
   * @param rateableOrder The RateableOrder entity with updated flags.
   * @returns A promise that resolves to the updated RateableOrder.
   */
  updateRateableOrder(rateableOrder: RateableOrder): Promise<RateableOrder>;
}