import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { ProductCategory } from '../../products/entities/product-category.entity';
import { VendorBusinessHour } from './vendor-business-hour.entity';
import { VendorLicense } from './vendor-license.entity';

/**
 * Represents a Vendor Profile entity, the aggregate root for all vendor-related data.
 * Corresponds to the 'VendorProfile' table in the database.
 */
@Entity('vendor_profiles')
export class VendorProfile {
  @PrimaryGeneratedColumn('uuid')
  vendorProfileId: string;

  @Index({ unique: true })
  @Column('uuid')
  userId: string;

  @Column({ length: 100 })
  storeName: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0.0 })
  averageRating: number;

  @Column({ default: 0 })
  ratingCount: number;

  @Column({ default: false })
  isOnline: boolean; // Master availability toggle REQ-1-070

  @Column({ default: true })
  isActive: boolean; // For admin suspension/deactivation

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // --- Relationships ---

  @OneToMany(() => Product, (product) => product.vendorProfile, {
    cascade: false, // Products should be managed independently
  })
  products: Product[];

  @OneToMany(
    () => ProductCategory,
    (productCategory) => productCategory.vendorProfile,
    { cascade: true }, // Categories are owned by the vendor
  )
  productCategories: ProductCategory[];

  @OneToMany(
    () => VendorBusinessHour,
    (businessHour) => businessHour.vendorProfile,
    { cascade: true, eager: true }, // Eager load hours as they are often needed with the profile
  )
  businessHours: VendorBusinessHour[];

  @OneToMany(() => VendorLicense, (license) => license.vendorProfile, {
    cascade: true,
  })
  licenses: VendorLicense[];
}