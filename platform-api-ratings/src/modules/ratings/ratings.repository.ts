import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RatingReview } from './entities/rating-review.entity';
import { IRatingRepository } from './interfaces/ratings.repository.interface';
import { CreateRatingDto } from './dto/create-rating.dto';
import { RateableOrder } from './entities/rateable-order.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
import { RatingDto } from './dto/rating.dto';

@Injectable()
export class RatingsRepository implements IRatingRepository {
  private readonly logger = new Logger(RatingsRepository.name);

  constructor(
    @InjectRepository(RatingReview)
    private readonly ratingReviewRepository: Repository<RatingReview>,
    @InjectRepository(RateableOrder)
    private readonly rateableOrderRepository: Repository<RateableOrder>,
  ) {}

  async createRating(
    createRatingDto: CreateRatingDto,
    reviewerId: string,
  ): Promise<RatingReview> {
    this.logger.log(
      `Creating rating for order ${createRatingDto.orderId} by reviewer ${reviewerId}`,
    );
    const newRating = this.ratingReviewRepository.create({
      ...createRatingDto,
      reviewerId,
    });
    return this.ratingReviewRepository.save(newRating);
  }

  async findByReviewee(
    revieweeId: string,
    revieweeType: 'vendor' | 'rider',
    paginationDto: PaginationDto,
  ): Promise<PaginatedResult<RatingDto>> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await this.ratingReviewRepository.findAndCount({
      where: { revieweeId, revieweeType },
      order: { createdAt: 'DESC' },
      take: limit,
      skip,
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async getAverageRatingForReviewee(
    revieweeId: string,
    revieweeType: 'vendor' | 'rider',
  ): Promise<{ average: number; count: number }> {
    this.logger.log(
      `Calculating average rating for ${revieweeType} with ID ${revieweeId}`,
    );

    const result = await this.ratingReviewRepository
      .createQueryBuilder('rating_review')
      .select('AVG(rating_review.rating)', 'average')
      .addSelect('COUNT(rating_review.rating)', 'count')
      .where('rating_review.revieweeId = :revieweeId', { revieweeId })
      .andWhere('rating_review.revieweeType = :revieweeType', { revieweeType })
      .getRawOne();

    // getRawOne returns an object with string values, so they need to be parsed.
    // AVG returns null if there are no rows, so we handle that case.
    const average = result && result.average ? parseFloat(result.average) : 0;
    const count = result && result.count ? parseInt(result.count, 10) : 0;

    return {
      average: parseFloat(average.toFixed(2)), // Round to 2 decimal places
      count,
    };
  }

  async findRateableOrderById(orderId: string): Promise<RateableOrder | null> {
    return this.rateableOrderRepository.findOne({ where: { orderId } });
  }

  async createOrUpdateRateableOrder(order: RateableOrder): Promise<void> {
    // TypeORM's save method performs an "upsert":
    // If the entity has an ID that exists, it updates.
    // If it doesn't, it inserts.
    this.logger.log(`Upserting rateable order: ${order.orderId}`);
    await this.rateableOrderRepository.save(order);
  }

  async findOneByOrderAndReviewer(
    orderId: string,
    reviewerId: string,
    revieweeType: 'vendor' | 'rider',
  ): Promise<RatingReview | null> {
    return this.ratingReviewRepository.findOne({
      where: {
        orderId,
        reviewerId,
        revieweeType,
      },
    });
  }
}