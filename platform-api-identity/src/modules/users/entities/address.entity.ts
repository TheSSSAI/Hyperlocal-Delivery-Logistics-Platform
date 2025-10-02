import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
  BaseEntity,
} from 'typeorm';
import { User } from './user.entity';
import { Point } from 'geojson';

/**
 * Represents a saved delivery address for a User.
 * This entity stores structured address information and its precise geospatial location.
 *
 * Implements the data model needed for:
 * - REQ-1-009 (Customer profile with saved addresses)
 * - REQ-1-043 (Customer profile management allowing multiple addresses)
 * - CUS-007, CUS-008, CUS-009 (CRUD operations for addresses)
 *
 * The 'location' column uses PostGIS for efficient geospatial queries,
 * which is critical for features like finding nearby vendors (CUS-010).
 */
@Entity('addresses')
export class Address extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.addresses, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  user: User;

  @Column()
  addressLine1: string;

  @Column({ nullable: true })
  addressLine2: string;

  @Column({ nullable: true })
  landmark: string;

  @Column()
  city: string;

  @Column()
  pincode: string;

  @Column({ default: 'other' })
  addressType: string; // e.g., 'home', 'work', 'other'

  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326, // WGS 84 standard for GPS coordinates
    nullable: false,
  })
  location: Point;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}