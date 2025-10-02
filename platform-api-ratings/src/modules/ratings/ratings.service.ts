import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IRatingRepository } from './interfaces/ratings.repository.interface';
import { IRatingsService } from './interfaces/ratings.service.interface';
import { CreateRatingDto } from './dto/create-rating.dto';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { RatingReview } from './entities/rating-review.entity';
import { OrderDeliveredEventDto } from '../events/dto/order-delivered.event.dto';
import { RateableOrder } from './entities/rateable-order.entity';
import { IMessagingService } from '../../shared/messaging/interfaces/messaging.service.interface';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
import { RatingDto, toRatingDto } from './dto/rating.dto';
import { RevieweeType } from '../../common/enums/reviewee-type.enum';
import { RATING_REPOSITORY, MESSAGING_SERVICE } from '../../common/constants/injection-tokens';

@Injectable()
export class RatingsService implements IRatingsService {
  private readonly logger = new Logger(RatingsService.name);

  constructor(
    @Inject(RATING_REPOSITORY)
    private readonly ratingRepository: IRatingRepository,
    @Inject(MESSAGING_SERVICE)
    private readonly messagingService: IMessagingService,
  ) {}

  async submitRating(
    createRatingDto: CreateRatingDto,
    user: AuthenticatedUser,
  ): Promise<RatingDto> {
    this.logger.log(
      `Attempting to submit rating for order ${createRatingDto.orderId} by user ${user.id}`,
    );

    const rateableOrder = await this.ratingRepository.findRateableOrderById(
      createRatingDto.orderId,
    );

    if (!rateableOrder) {
      this.logger.warn(
        `Rating submission failed: Order ${createRatingDto.orderId} not found or not eligible for rating.`,
      );
      throw new NotFoundException('Order not found or not eligible for rating.');
    }

    if (rateableOrder.customerId !== user.id) {
      this.logger.error(
        `Authorization failure: User ${user.id} attempted to rate order ${createRatingDto.orderId} owned by ${rateableOrder.customerId}.`,
      );
      throw new ForbiddenException('You are not authorized to rate this order.');
    }

    if (
      createRatingDto.revieweeType === RevieweeType.VENDOR &&
      rateableOrder.isVendorRated
    ) {
      this.logger.warn(
        `Duplicate rating attempt for vendor on order ${createRatingDto.orderId}`,
      );
      throw new ConflictException(
        'You have already rated the vendor for this order.',
      );
    }

    if (
      createRatingDto.revieweeType === RevieweeType.RIDER &&
      rateableOrder.isRiderRated
    ) {
      this.logger.warn(
        `Duplicate rating attempt for rider on order ${createRatingDto.orderId}`,
      );
      throw new ConflictException(
        'You have already rated the rider for this order.',
      );
    }
    
    // Simple sanitization, a more robust library like DOMPurify would be used in a real scenario if this were rendered as HTML
    const sanitizedReviewText = createRatingDto.reviewText
      ?.replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const newRating = new RatingReview();
    newRating.orderId = createRatingDto.orderId;
    newRating.reviewerId = user.id;
    newRating.revieweeId = createRatingDto.revieweeId;
    newRating.revieweeType = createRatingDto.revieweeType;
    newRating.rating = createRatingDto.rating;
    newRating.reviewText = sanitizedReviewText;

    try {
      const savedRating = await this.ratingRepository.createRatingAndUpdateRateableOrder(newRating);
      
      this.logger.log(
        `Successfully saved rating ${savedRating.ratingReviewId} for order ${savedRating.orderId}`,
      );

      // Asynchronously calculate and publish the new average rating
      // This is a "fire-and-forget" call to not block the user response
      this.calculateAndPublishAverageRating(
        savedRating.revieweeId,
        savedRating.revieweeType as RevieweeType,
      ).catch(err => {
        this.logger.error(`Failed to publish average rating update for reviewee ${savedRating.revieweeId}: ${err.message}`, err.stack);
      });

      return toRatingDto(savedRating);
    } catch (error) {
      this.logger.error(
        `Failed to save rating for order ${createRatingDto.orderId}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Could not save your rating.');
    }
  }

  async addRateableOrder(event: OrderDeliveredEventDto): Promise<void> {
    this.logger.log(`Received OrderDeliveredEvent for order ${event.orderId}. Creating rateable order record.`);

    const rateableOrder = new RateableOrder();
    rateableOrder.orderId = event.orderId;
    rateableOrder.customerId = event.customerId;
    rateableOrder.vendorId = event.vendorId;
    rateableOrder.riderId = event.riderId;
    rateableOrder.isVendorRated = false;
    rateableOrder.isRiderRated = false;
    
    try {
      await this.ratingRepository.createOrUpdateRateableOrder(rateableOrder);
      this.logger.log(`Successfully created or found rateable order record for order ${event.orderId}.`);
    } catch (error) {
      this.logger.error(
        `Failed to create rateable order record for order ${event.orderId}: ${error.message}`,
        error.stack,
      );
      // We do not re-throw here to prevent the SQS message from being retried indefinitely on a non-recoverable DB error.
      // The error is logged for monitoring and potential manual intervention.
    }
  }

  async getRatingsForReviewee(
    revieweeId: string,
    revieweeType: RevieweeType,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResult<RatingDto>> {
    this.logger.log(`Fetching ratings for reviewee ${revieweeId} of type ${revieweeType}`);
    try {
        const paginatedRatings = await this.ratingRepository.findByReviewee(revieweeId, revieweeType, paginationDto);
        return {
            ...paginatedRatings,
            data: paginatedRatings.data.map(toRatingDto),
        };
    } catch (error) {
        this.logger.error(`Failed to fetch ratings for reviewee ${revieweeId}: ${error.message}`, error.stack);
        throw new InternalServerErrorException('Could not retrieve ratings.');
    }
  }

  async getAverageRatingForReviewee(
    revieweeId: string,
    revieweeType: RevieweeType,
  ): Promise<{ average: number; count: number }> {
    this.logger.log(`Calculating average rating for reviewee ${revieweeId} of type ${revieweeType}`);
    try {
        return await this.ratingRepository.getAverageRatingForReviewee(revieweeId, revieweeType);
    } catch (error) {
        this.logger.error(`Failed to calculate average rating for reviewee ${revieweeId}: ${error.message}`, error.stack);
        throw new InternalServerErrorException('Could not calculate average rating.');
    }
  }

  private async calculateAndPublishAverageRating(revieweeId: string, revieweeType: RevieweeType): Promise<void> {
    this.logger.log(`Asynchronously calculating and publishing new average rating for reviewee ${revieweeId}.`);
    
    const { average, count } = await this.getAverageRatingForReviewee(revieweeId, revieweeType);
    
    const eventPayload = {
        revieweeId,
        revieweeType,
        newAverageRating: average,
        newRatingCount: count,
    };

    await this.messagingService.publish('RatingSubmittedEvent', eventPayload);
    this.logger.log(`Published RatingSubmittedEvent for reviewee ${revieweeId}. New average: ${average}, Count: ${count}.`);
  }
}