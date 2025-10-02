import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  OneToMany,
  Index,
  BaseEntity,
} from 'typeorm';
import { CustomerProfile } from './customer-profile.entity';
import { Address } from './address.entity';
import { UserConsent } from '../../consent/entities/user-consent.entity';

export enum UserType {
  CUSTOMER = 'customer',
  VENDOR = 'vendor',
  RIDER = 'rider',
  ADMIN = 'admin',
}

export enum UserStatus {
  PENDING_VERIFICATION = 'pending_verification',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  DEACTIVATED = 'deactivated',
  REJECTED = 'rejected',
}

/**
 * Represents the core User entity, acting as the Aggregate Root for the Identity bounded context.
 * This entity stores information common to all user types (Customers, Vendors, Riders, Admins)
 * and serves as the central point for managing identity, status, and relationships to other profile data.
 *
 * This entity is foundational for:
 * - REQ-1-001 (Three-sided marketplace users)
 * - REQ-1-035, REQ-1-036, REQ-1-037 (User registration flows)
 * - REQ-1-039 (OTP Login)
 * - REQ-1-096 (RBAC model via userType)
 * - REQ-1-023 (Data erasure via soft-delete/anonymization)
 */
@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ unique: true, nullable: true })
  cognitoSub: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 15, unique: true })
  mobileNumber: string;

  @Index({ unique: true, where: '"email" IS NOT NULL' })
  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  email: string;

  @Column({
    type: 'enum',
    enum: UserType,
  })
  userType: UserType;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING_VERIFICATION,
  })
  status: UserStatus;

  @OneToOne(() => CustomerProfile, (profile) => profile.user, {
    cascade: true,
    nullable: true,
  })
  customerProfile: CustomerProfile;

  @OneToMany(() => Address, (address) => address.user, {
    cascade: true,
    eager: false, // Lazy load addresses by default
  })
  addresses: Address[];

  @OneToMany(() => UserConsent, (consent) => consent.user, {
    cascade: true,
    eager: false, // Lazy load consents by default
  })
  consents: UserConsent[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt: Date;
}