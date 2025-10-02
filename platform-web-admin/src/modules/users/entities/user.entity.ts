import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { CustomerProfile } from './customer-profile.entity';
import { Address } from './address.entity';
import { UserConsent } from '../../consent/entities/user-consent.entity';
import { AuditLog } from '../../admin/entities/audit-log.entity';

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
  ANONYMIZED = 'anonymized',
}

/**
 * Represents the core User entity in the system, common to all user roles.
 * This is the Aggregate Root for the User context.
 *
 * @see Identity & Access Service ER Diagram
 * @see REQ-1-001 - Three-sided marketplace with distinct user classes.
 * @see REQ-1-009, REQ-1-010, REQ-1-011, REQ-1-012 - User role definitions.
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'cognito_sub', unique: true, nullable: true })
  cognitoSub: string;

  @Index({ unique: true })
  @Column({ name: 'mobile_number', length: 15, unique: true })
  mobileNumber: string;

  @Index({ unique: true, where: '"email" IS NOT NULL' })
  @Column({ length: 255, unique: true, nullable: true })
  email: string | null;

  @Column({
    type: 'enum',
    enum: UserType,
    name: 'user_type',
  })
  userType: UserType;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING_VERIFICATION,
  })
  status: UserStatus;

  @Column({ name: 'last_login_at', type: 'timestamptz', nullable: true })
  lastLoginAt: Date | null;

  @OneToOne(() => CustomerProfile, (profile) => profile.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  customerProfile: CustomerProfile;

  @OneToMany(() => Address, (address) => address.user, {
    cascade: true,
    eager: false,
  })
  addresses: Address[];

  @OneToMany(() => UserConsent, (consent) => consent.user, {
    cascade: true,
    eager: false,
  })
  consents: UserConsent[];

  // This relationship is for when this user is an admin performing an action.
  @OneToMany(() => AuditLog, (auditLog) => auditLog.admin)
  auditLogs: AuditLog[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt: Date | null;
}