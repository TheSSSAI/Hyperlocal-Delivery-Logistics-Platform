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
} from 'typeorm';
import { User } from './user.entity';

export enum AddressType {
  HOME = 'home',
  WORK = 'work',
  OTHER = 'other',
}

/**
 * Represents a delivery address saved by a user.
 *
 * @see CUS-007 - Customer Adds and Saves a New Delivery Address to Profile
 * @see CUS-008 - Customer Edits Existing Delivery Address
 * @see CUS-009 - Customer Deletes Delivery Address
 * @see Identity & Access Service ER Diagram
 */
@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.addresses, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'address_line_1', length: 255 })
  addressLine1: string;

  @Column({ name: 'address_line_2', length: 255, nullable: true })
  addressLine2: string | null;

  @Column({ length: 255, nullable: true })
  landmark: string | null;

  @Column({ length: 100 })
  city: string;

  @Column({ length: 10 })
  pincode: string;

  @Column({
    type: 'enum',
    enum: AddressType,
    name: 'address_type',
    default: AddressType.HOME,
  })
  addressType: AddressType;

  @Column({ name: 'contact_name', length: 255, nullable: true })
  contactName: string | null;

  @Column({ name: 'contact_phone', length: 15, nullable: true })
  contactPhone: string | null;

  /**
   * Stores the precise geographic location (latitude, longitude) of the address.
   * Requires the PostGIS extension in PostgreSQL.
   */
  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326, // WGS 84 coordinate system
    nullable: false,
  })
  location: string; // Stored in WKT format e.g., 'POINT(-71.060316 48.432044)'

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt: Date | null;
}