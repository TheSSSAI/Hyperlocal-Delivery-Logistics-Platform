import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

/**
 * Stores profile information specific to users with the 'Customer' role.
 *
 * @see CUS-006 - Customer Profile Management
 * @see Identity & Access Service ER Diagram
 */
@Entity('customer_profiles')
export class CustomerProfile {
  @PrimaryColumn('uuid', { name: 'user_id' })
  userId: string;

  @OneToOne(() => User, (user) => user.customerProfile, {
    primary: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', length: 100, nullable: true })
  lastName: string | null;

  @Column({ name: 'profile_picture_url', nullable: true })
  profilePictureUrl: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}