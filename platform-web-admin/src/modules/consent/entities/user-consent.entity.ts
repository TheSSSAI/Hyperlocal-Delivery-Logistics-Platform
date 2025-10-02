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
import { User } from '../../users/entities/user.entity';

/**
 * Represents a specific data processing consent given by a user,
 * in compliance with data protection regulations like the DPDP Act, 2023.
 *
 * @see REQ-1-021 - Granular consent options for collection and processing of personal data.
 * @see Identity & Access Service ER Diagram
 */
@Entity('user_consents')
@Index(['userId', 'consentType'], { unique: true })
export class UserConsent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.consents, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  /**
   * A key identifying the type of consent, e.g., 'promotional_emails', 'personalized_recommendations'.
   */
  @Column({ name: 'consent_type', length: 100 })
  consentType: string;

  @Column({ name: 'is_granted', default: false })
  isGranted: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}