import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { VendorProfile } from './vendor-profile.entity';

/**
 * Represents a single time slot of operation for a vendor on a specific day of the week.
 * A vendor can have multiple entries for a single day to represent split shifts (e.g., lunch breaks).
 *
 * @see REQ-1-070 - System shall allow vendors to manage their store's availability.
 */
@Entity('vendor_business_hours')
@Index(['vendorProfileId', 'dayOfWeek'])
export class VendorBusinessHour {
  /**
   * The unique identifier for the business hour record.
   */
  @PrimaryGeneratedColumn('uuid')
  businessHourId: string;

  /**
   * The foreign key linking this business hour to a specific vendor profile.
   */
  @Column({ type: 'uuid' })
  vendorProfileId: string;

  /**
   * The VendorProfile entity this business hour record belongs to.
   * Defines the many-to-one relationship.
   */
  @ManyToOne(() => VendorProfile, (vendor) => vendor.businessHours, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vendorProfileId' })
  vendorProfile: VendorProfile;

  /**
   * The day of the week this record applies to.
   * Follows standard convention: 0 for Sunday, 1 for Monday, ..., 6 for Saturday.
   */
  @Column({ type: 'int' })
  dayOfWeek: number;

  /**
   * A flag to indicate if the store is explicitly closed on this day.
   * If true, openingTime and closingTime will be null.
   */
  @Column({ default: false })
  isClosed: boolean;

  /**
   * The opening time for this time slot, in 'HH:mm:ss' format.
   * Nullable to allow for a day to be marked as 'isClosed'.
   */
  @Column({ type: 'time', nullable: true })
  openingTime: string;

  /**
   * The closing time for this time slot, in 'HH:mm:ss' format.
   * Nullable to allow for a day to be marked as 'isClosed'.
   */
  @Column({ type: 'time', nullable: true })
  closingTime: string;
}