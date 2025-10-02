import { OrderDeliveredEventDto } from '../../events/dto/order-delivered.event.dto';
import { CreateRatingDto } from '../dto/create-rating.dto';
import { RatingDto, RevieweeType } from '../dto/rating.dto';
import { IPaginatedResult, IPaginationOptions } from './ratings.repository.interface';

/**
 * Represents the authenticated user extracted from a JWT.
 */
export interface IAuthenticatedUser {
  id: string;
  roles: string[];
}

/**
 * Defines the contract for the Ratings Service.
 * This interface outlines the business logic for managing ratings and reviews.
 */
export interface IRatingsService {
  /**
   * Processes a new rating submission from a customer.
   * This includes validation, persistence, and triggering post-submission events.
   * @param createRatingDto The rating data submitted by the user.
   * @param user The authenticated user submitting the rating.
   * @returns A promise that resolves to the created RatingDto.
   * @throws {NotFoundException} if the order is not found or not rateable.
   * @throws {ForbiddenException} if the user is not the customer who placed the order.
   * @throws {ConflictException} if a rating for this reviewee and order already exists.
   */
  submitRating(
    createRatingDto: CreateRatingDto,
    user: IAuthenticatedUser,
  ): Promise<RatingDto>;

  /**
   * Retrieves a paginated list of ratings for a specific reviewee (vendor or rider).
   * @param revieweeId The ID of the vendor or rider.
   * @param revieweeType The type of the entity.
   * @param paginationOptions Pagination options (page, limit).
   * @returns A promise that resolves to a paginated result of RatingDto.
   */
  getRatingsFor(
    revieweeId: string,
    revieweeType: RevieweeType,
    paginationOptions: IPaginationOptions,
  ): Promise<IPaginatedResult<RatingDto>>;

  /**
   * Retrieves the average rating and total rating count for a specific reviewee.
   * @param revieweeId The ID of the vendor or rider.
   * @param revieweeType The type of the entity.
   * @returns A promise that resolves to an object with the average and count.
   */
  getAverageRatingFor(
    revieweeId: string,
    revieweeType: RevieweeType,
  ): Promise<{ average: number; count: number }>;

  /**
   * Processes an 'OrderDelivered' event to make an order eligible for rating.
   * This method is triggered by an SQS consumer.
   * @param event The OrderDeliveredEventDto payload.
   * @returns A promise that resolves when the processing is complete.
   */
  processOrderDeliveredEvent(event: OrderDeliveredEventDto): Promise<void>;
}

export const RATINGS_SERVICE_TOKEN = Symbol('IRatingsService');