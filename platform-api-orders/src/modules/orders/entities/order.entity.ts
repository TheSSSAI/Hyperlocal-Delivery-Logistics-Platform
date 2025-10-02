import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { OrderEventLog } from './order-event-log.entity';
import { OrderStatus } from '../enums/order-status.enum';
import { OrderStateMachineService } from '../state-machine/order-state-machine.service';
import { InvalidStateTransitionException } from '../../../shared/exceptions/invalid-state-transition.exception';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('uuid')
  customerId: string;

  @Index()
  @Column('uuid')
  vendorId: string;

  @Column('uuid')
  deliveryAddressId: string;

  @Index()
  @Column('uuid', { nullable: true })
  riderId: string | null;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: 'Sum of order item prices * quantities',
  })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  taxes: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  deliveryFee: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: 'The final payable amount',
  })
  totalAmount: number;

  @Index()
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PaymentPending,
  })
  status: OrderStatus;

  @Column({ length: 50 })
  paymentMethod: string; // e.g., 'UPI', 'CARD', 'COD'

  @Column({ length: 255, nullable: true })
  paymentGatewayTransactionId: string | null;

  @Column({ type: 'varchar', length: 250, nullable: true })
  vendorInstructions: string | null;

  @Column({ type: 'varchar', length: 250, nullable: true })
  riderInstructions: string | null;

  @Column({ type: 'timestamp with time zone', nullable: true })
  placedAt: Date | null;

  @Column({ type: 'int', default: 0 })
  reconciliationAttempts: number;

  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: ['insert'],
    eager: true,
  })
  items: OrderItem[];

  @OneToMany(() => OrderEventLog, (log) => log.order, {
    cascade: ['insert'],
    eager: false, // Lazy load history to avoid bloating the main entity
  })
  eventHistory: OrderEventLog[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  public transitionTo(
    newStatus: OrderStatus,
    stateMachine: OrderStateMachineService,
    actor: string,
    notes?: string,
  ): OrderEventLog {
    stateMachine.validateTransition(this.status, newStatus);
    this.status = newStatus;

    if (newStatus === OrderStatus.PendingVendorAcceptance && !this.placedAt) {
      this.placedAt = new Date();
    }

    const eventLog = new OrderEventLog();
    eventLog.order = this;
    eventLog.status = newStatus;
    eventLog.actor = actor;
    eventLog.notes = notes || null;

    return eventLog;
  }
}