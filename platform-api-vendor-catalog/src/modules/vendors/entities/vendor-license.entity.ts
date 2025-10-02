import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { VendorProfile } from './vendor-profile.entity';

/**
 * Represents a business or regulatory license associated with a vendor.
 * This entity is crucial for compliance management, ensuring that vendors
 * in regulated categories (e.g., food, pharmaceuticals) are legally permitted to operate.
 *
 * @see REQ-1-025 - System shall provide fields for storing mandatory license information.
 */
@Entity('vendor_licenses')
@Index(['vendorProfileId', 'licenseNumber'], { unique: true })
export class VendorLicense {
  /**
   * The unique identifier for the vendor license record.
   * Uses a UUID to ensure global uniqueness.
   */
  @PrimaryGeneratedColumn('uuid')
  licenseId: string;

  /**
   * The foreign key linking this license to a specific vendor profile.
   */
  @Column({ type: 'uuid' })
  vendorProfileId: string;

  /**
   * The VendorProfile entity this license belongs to.
   * This defines the many-to-one relationship from VendorLicense to VendorProfile.
   * When a VendorProfile is deleted, related licenses should also be removed.
   */
  @ManyToOne(() => VendorProfile, (vendor) => vendor.licenses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vendorProfileId' })
  vendorProfile: VendorProfile;

  /**
   * The official number of the license.
   * e.g., FSSAI license number, GST number.
   */
  @Column({ length: 255 })
  licenseNumber: string;

  /**
   * The date on which the license expires.
   * Storing as 'date' type without time is appropriate for expiry dates.
   *
   * @see REQ-1-025 - Requirement to store license expiry date.
   */
  @Column({ type: 'date' })
  expiryDate: Date;

  /**
   * The timestamp when this license record was created in the system.
   * Automatically managed by TypeORM.
   */
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  /**
   * The timestamp when this license record was last updated.
   * Automatically managed by TypeORM.
   */
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}