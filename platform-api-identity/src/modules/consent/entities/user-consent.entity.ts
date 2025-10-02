import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  BaseEntity,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

/**
 * Represents a specific data processing consent given by a User.
 * This entity allows for granular tracking of consents as required by data privacy regulations.
 *
 * Implements the data model for REQ-1-021 (DPDP Act compliance) and CUS-042,
 * enabling users to view and manage their consent settings.
 */
@Entity('user_consents')
@Unique(['user', 'consentType'])
export class UserConsent extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.consents, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  user: User;

  @Column({ type: 'varchar', length: 255 })
  consentType: string; // e.g., 'promotional_emails', 'personalized_recommendations'

  @Column({ type: 'boolean' })
  isGranted: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  lastActionAt: Date; // Timestamp of the last grant or revoke action
}