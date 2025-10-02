import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

/**
 * Represents the profile information specific to a User of type 'CUSTOMER'.
 * This entity holds data that is not applicable to other user types like Vendors or Riders.
 *
 * Implements the data model for:
 * - REQ-1-009 (Customer user role permissions)
 * - REQ-1-043 (Customer profile management)
 * - CUS-006 (Customer profile management story)
 */
@Entity('customer_profiles')
export class CustomerProfile extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.customerProfile, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn()
  user: User;

  @Column({ type: 'varchar', length: 255 })
  firstName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lastName: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}