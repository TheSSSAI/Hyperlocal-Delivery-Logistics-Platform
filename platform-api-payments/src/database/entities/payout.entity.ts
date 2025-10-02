import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { PayoutStatus } from '../enums/payout-status.enum';
import { FinancialTransaction } from './financial-transaction.entity';

/**
 * Represents a payout transaction to a user (Vendor or Rider).
 * This entity logs the outcome of settlement operations, providing an auditable
 * record of all funds disbursed from the platform.
 */
@Entity('payouts')
export class Payout {
  /**
   * Unique identifier for the payout record (UUID).
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * The ID of the user (Vendor or Rider) receiving the payout.
   */
  @Column('uuid')
  @Index()
  userId: string;

  /**
   * The amount of the payout in the smallest currency unit (e.g., paise for INR).
   * Stored as a bigint to avoid floating-point inaccuracies.
   */
  @Column({ type: 'bigint' })
  amount: number;

  /**
   * The currency of the payout (e.g., 'INR').
   */
  @Column({ length: 3 })
  currency: string;

  /**
   * The current status of the payout.
   */
  @Column({
    type: 'enum',
    enum: PayoutStatus,
    default: PayoutStatus.PENDING,
  })
  status: PayoutStatus;

  /**
   * The unique transaction ID provided by the payout gateway (e.g., RazorpayX).
   */
  @Column({ unique: true, nullable: true })
  @Index()
  payoutGatewayTransactionId: string;

  /**
   * Additional data from the payout gateway, such as failure reasons.
   */
  @Column({ type: 'jsonb', nullable: true })
  gatewayMetadata: object;

  /**
   * Timestamp when the payout record was created.
   */
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  /**
   * Timestamp when the payout record was last updated.
   */
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  /**
   * The financial transactions that make up this payout.
   */
  @OneToMany(
    () => FinancialTransaction,
    (transaction) => transaction.payout,
    { cascade: false },
  )
  financialTransactions: FinancialTransaction[];
}