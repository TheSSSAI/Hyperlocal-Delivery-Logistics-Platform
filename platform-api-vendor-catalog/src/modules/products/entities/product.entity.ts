import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  VersionColumn,
} from 'typeorm';
import { VendorProfile } from '../../vendors/entities/vendor-profile.entity';
import { ProductCategory } from './product-category.entity';

/**
 * Represents a single product offered by a vendor.
 * This is a core domain entity for the catalog, fulfilling requirements
 * like REQ-1-006 and REQ-1-068.
 */
@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  productId: string;

  @Index()
  @Column({ type: 'uuid' })
  vendorProfileId: string;

  @ManyToOne(() => VendorProfile, (vendor) => vendor.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vendorProfileId' })
  vendorProfile: VendorProfile;

  @Index()
  @Column({ type: 'uuid' })
  productCategoryId: string;

  @ManyToOne(() => ProductCategory, (category) => category.products, {
    onDelete: 'RESTRICT', // Prevent category deletion if products exist
  })
  @JoinColumn({ name: 'productCategoryId' })
  productCategory: ProductCategory;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  /**
   * The current numerical stock quantity. Critical for inventory management.
   * REQ-1-006, REQ-1-055
   */
  @Column({ type: 'int' })
  stockQuantity: number;

  /**
   * A general availability flag set by the vendor.
   * This is separate from the calculated out-of-stock status.
   */
  @Column({ type: 'boolean', default: true })
  isAvailable: boolean;

  @Column({ type: 'varchar', length: 2048, nullable: true })
  imageUrl: string;

  /**
   * Optimistic concurrency control.
   * This version number is incremented on each update, preventing race conditions
   * during high-concurrency operations like inventory updates (REQ-1-055).
   */
  @VersionColumn()
  version: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  /**
   * For soft-deleting products to maintain historical data integrity in past orders.
   */
  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt?: Date;
}