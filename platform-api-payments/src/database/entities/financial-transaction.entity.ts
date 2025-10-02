import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Payout } from './payout.entity';

/**
 * Represents a single, immutable transaction in the double-entry ledger.
 * This is the core entity for all financial record-keeping, fulfilling REQ-1-082.
 * Its design prioritizes auditability and efficient aggregation.
 */
@Entity('financial_transactions')
@Index(['debitAccount', 'createdAt'])
@Index(['creditAccount', 'createdAt'])
@Index(['relatedEntityType', 'relatedEntityId'])
export class FinancialTransaction {
  /**
   * Unique identifier for the financial transaction (UUID).
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * The ledger account being debited (e.g., "vendor:123:receivable").
   */
  @Column()
  debitAccount: string;

  /**
   * The ledger account being credited (e.g., "platform:commission:revenue").
   */
  @Column()
  creditAccount: string;

  /**
   * The monetary value of the transaction in the smallest currency unit (e.g., paise).
   * Stored as a bigint to prevent floating-point inaccuracies.
   */
  @Column({ type: 'bigint' })
  amount: number;

  /**
   * The currency of the transaction (e.g., "INR").
   */
  @Column({ length: 3 })
  currency: string;

  /**
   * A human-readable description of the transaction (e.g., "Commission for order ORD-123").
   */
  @Column()
  memo: string;

  /**
   * The type of entity this transaction relates to (e.g., "Order", "Payout").
   */
  @Column({ nullable: true })
  relatedEntityType: string;

  /**
   * The ID of the related entity (e.g., an order UUID or payout UUID).
   */
  @Column({ type: 'uuid', nullable: true })
  relatedEntityId: string;

  /**
   * The payout this transaction is part of, if applicable.
   */
  @ManyToOne(() => Payout, (payout) => payout.financialTransactions, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'payoutId' })
  payout: Payout;
  @Column({ type: 'uuid', nullable: true })
  payoutId: string;

  /**
   * A unique key generated from the transaction's context to prevent duplicate entries.
   */
  @Column({ unique: true })
  idempotencyKey: string;

  /**
   * Stores immutable inputs for auditable calculations, like commission rate and order subtotal.
   * Fulfills auditability requirement of REQ-1-082.
   */
  @Column({ type: 'jsonb', nullable: true })
  metadata: object;

  /**
   * Timestamp of transaction creation. This is append-only.
   */
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}