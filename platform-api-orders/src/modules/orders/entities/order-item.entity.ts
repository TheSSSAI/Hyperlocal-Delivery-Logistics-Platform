import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  orderItemId: string;

  @Index()
  @Column('uuid')
  orderId: string;

  @Index()
  @Column('uuid')
  productId: string;

  @Column('int')
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  priceAtTimeOfOrder: number;

  @Column({ length: 255 })
  productName: string;

  @ManyToOne(() => Order, (order) => order.orderItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order: Order;
}