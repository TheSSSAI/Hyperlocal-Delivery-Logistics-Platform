import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { OrderStatus } from '../enums/order-status.enum';

@Entity('order_event_logs')
export class OrderEventLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('uuid')
  orderId: string;

  @ManyToOne(() => Order, (order) => order.eventHistory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column({
    type: 'enum',
    enum: OrderStatus,
  })
  status: OrderStatus;

  @Column({
    length: 50,
    comment: "Actor responsible for the change (e.g., 'Customer', 'Vendor', 'System', 'Admin')",
  })
  actor: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Optional notes, e.g., reason for cancellation',
  })
  notes: string | null;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}