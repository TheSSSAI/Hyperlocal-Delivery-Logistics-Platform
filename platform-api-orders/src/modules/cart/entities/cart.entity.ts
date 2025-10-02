import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { CartItem } from './cart-item.entity';

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  cartId: string;

  @Index({ unique: true })
  @Column('uuid')
  userId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => CartItem, (item) => item.cart, {
    cascade: true,
    eager: true, // Carts are usually small, eager loading items can be efficient
  })
  items: CartItem[];
}