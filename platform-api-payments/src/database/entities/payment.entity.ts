import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { PaymentStatus } from '../enums/payment-status.enum';

/**
 * Represents a payment transaction attempt within the system.
 * This entity tracks the state of individual payment transactions, which is crucial
 * for the stateful reconciliation process (REQ-1-057, REQ-1-058).
 */
@Entity('payments')
export class Payment {
  /**
   * Unique identifier for the payment record (UUID).
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * The ID of the order this payment is associated with.
   */
  @Column('uuid')
  @Index()
  orderId: string;

  /**
   * The amount of the payment in the smallest currency unit (e.g., paise for INR).
   * Stored as a bigint to avoid floating-point inaccuracies.
   */
  @Column({ type: 'bigint' })
  amount: number;

  /**
   * The current status of the payment.
   */
  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  /**
   * The unique transaction ID provided by the payment gateway (e.g., Razorpay Order ID).
   * This is crucial for reconciliation.
   */
  @Column({ unique: true })
  @Index()
  gatewayTransactionId: string;

  /**
   * Additional data from the payment gateway, such as payment method details or error messages.
   */
  @Column({ type: 'jsonb', nullable: true })
  gatewayMetadata: object;

  /**
   * Timestamp when the payment record was created.
   */
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  /**
   * Timestamp when the payment record was last updated.
   */
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}