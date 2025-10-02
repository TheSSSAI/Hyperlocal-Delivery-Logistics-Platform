import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { Cart } from './cart.entity';

@Entity('cart_items')
@Index(['cartId', 'productId'], { unique: true })
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  cartId: string;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cartId' })
  cart: Cart;

  @Column('uuid')
  productId: string;

  @Column('uuid')
  vendorId: string;

  @Column('int')
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ length: 255 })
  productName: string;

  @Column({ length: 512, nullable: true })
  productImage: string | null;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}