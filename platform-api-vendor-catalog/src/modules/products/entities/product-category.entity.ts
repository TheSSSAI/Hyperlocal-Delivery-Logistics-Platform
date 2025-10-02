import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Unique,
} from 'typeorm';
import { VendorProfile } from '../../vendors/entities/vendor-profile.entity';
import { Product } from './product.entity';

/**
 * Represents a category for organizing products within a vendor's catalog.
 * A vendor can have multiple categories, and a category belongs to a single vendor.
 * Fulfills REQ-1-068.
 */
@Entity('product_categories')
@Unique(['vendorProfileId', 'name'])
export class ProductCategory {
  @PrimaryGeneratedColumn('uuid')
  productCategoryId: string;

  /**
   * Foreign key to the VendorProfile this category belongs to.
   */
  @Index()
  @Column({ type: 'uuid' })
  vendorProfileId: string;

  /**
   * The vendor profile associated with this category.
   */
  @ManyToOne(() => VendorProfile, (vendor) => vendor.productCategories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vendorProfileId' })
  vendorProfile: VendorProfile;

  @Column({ length: 255 })
  name: string;

  /**
   * The collection of products within this category.
   */
  @OneToMany(() => Product, (product) => product.productCategory)
  products: Product[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}