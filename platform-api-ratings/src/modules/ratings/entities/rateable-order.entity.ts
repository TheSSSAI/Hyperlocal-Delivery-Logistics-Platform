import { Column, Entity, PrimaryColumn, CreateDateColumn } from 'typeorm';

/**
 * Represents the eligibility of a delivered order to be rated.
 * An instance of this entity is created when an 'OrderDeliveredEvent' is consumed.
 * It acts as a state machine for the rating process of a single order, tracking
 * whether the customer has rated the vendor and/or the rider. This prevents
 * duplicate ratings and provides a clean separation of concerns from the core
 * Order service.
 *
 * This entity was identified as necessary during architectural design to
 * robustly handle the business logic of rating eligibility without needing
 * to query the Order service for every rating submission attempt.
 *
 * @Entity rateable_orders
 */
@Entity('rateable_orders')
export class RateableOrder {
  /**
   * The primary key, which is the unique ID of the order.
   * This ensures a one-to-one relationship between a delivered order
   * and its rateable status.
   * @PrimaryColumn UUID
   */
  @PrimaryColumn('uuid')
  orderId: string;

  /**
   * The ID of the customer who placed the order and is eligible to rate it.
   * Used for authorization checks to ensure only the correct customer can submit a rating.
   * @Column UUID
   */
  @Column({ type: 'uuid' })
  customerId: string;

  /**
   * The ID of the vendor associated with the order.
   * @Column UUID
   */
  @Column({ type: 'uuid' })
  vendorId: string;

  /**
   * The ID of the rider who delivered the order.
   * @Column UUID
   */
  @Column({ type: 'uuid' })
  riderId: string;

  /**
   * A flag to indicate if the customer has submitted a rating for the vendor
   * for this specific order. Defaults to false.
   * @Column Boolean
   */
  @Column({ type: 'boolean', default: false })
  isVendorRated: boolean;

  /**
   * A flag to indicate if the customer has submitted a rating for the rider
   * for this specific order. Defaults to false.
   * @Column Boolean
   */
  @Column({ type: 'boolean', default: false })
  isRiderRated: boolean;

  /**
   * The timestamp when the order became rateable (i.e., when it was delivered).
   * Automatically generated upon creation of this record.
   * @CreateDateColumn
   */
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}