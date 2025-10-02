import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

/**
 * @enum RevieweeType
 * @description Defines the type of entity that can be reviewed.
 */
export enum RevieweeType {
  VENDOR = 'vendor',
  RIDER = 'rider',
}

/**
 * @class RatingReview
 * @description Represents the core domain entity for a single rating and review.
 * This entity is mapped to the "rating_reviews" table in the PostgreSQL database.
 * It stores the feedback provided by a customer for a specific vendor or rider in the context of an order.
 * This directly supports REQ-1-063.
 */
@Entity('rating_reviews')
@Index(['revieweeId', 'revieweeType'], {
  unique: false,
  where: '"deleted_at" IS NULL',
})
export class RatingReview {
  /**
   * @property ratingReviewId
   * @description The unique identifier for the rating review (Primary Key).
   * @type {string}
   */
  @PrimaryGeneratedColumn('uuid')
  ratingReviewId: string;

  /**
   * @property orderId
   * @description The unique identifier of the order this rating is associated with.
   * @type {string}
   */
  @Column({ type: 'uuid' })
  orderId: string;

  /**
   * @property reviewerId
   * @description The unique identifier of the user (customer) who submitted the review.
   * @type {string}
   */
  @Column({ type: 'uuid' })
  reviewerId: string;

  /**
   * @property revieweeId
   * @description The unique identifier of the user or entity (vendor/rider) being reviewed.
   * @type {string}
   */
  @Column({ type: 'uuid' })
  revieweeId: string;

  /**
   * @property revieweeType
   * @description Specifies the type of the entity being reviewed ('vendor' or 'rider').
   * @type {RevieweeType}
   */
  @Column({
    type: 'enum',
    enum: RevieweeType,
  })
  revieweeType: RevieweeType;

  /**
   * @property rating
   * @description The star rating provided by the customer, from 1 to 5.
   * @type {number}
   */
  @Column({ type: 'int' })
  rating: number;

  /**
   * @property reviewText
   * @description The optional text comment provided by the customer. Can be null.
   * @type {string | null}
   */
  @Column({ type: 'text', nullable: true })
  reviewText: string | null;

  /**
   * @property createdAt
   * @description The timestamp of when the review was created. Automatically set by the database.
   * @type {Date}
   */
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}