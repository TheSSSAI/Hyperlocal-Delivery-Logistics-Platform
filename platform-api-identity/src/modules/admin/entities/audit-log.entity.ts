import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

/**
 * Represents an entry in the immutable audit trail for actions performed by Administrators.
 * This entity is crucial for security, compliance, and operational traceability.
 *
 * Direct implementation of REQ-1-013 and REQ-1-102, providing a detailed, append-only
 * log of all significant administrative actions.
 */
@Entity('audit_logs')
export class AuditLog extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'adminId' })
  admin: User;

  @Column()
  adminId: string;

  @Column({ type: 'varchar', length: 255 })
  action: string; // e.g., 'USER_SUSPEND', 'CONFIG_UPDATE'

  @Column({ type: 'varchar', nullable: true })
  targetEntityType: string; // e.g., 'User', 'Vendor', 'Configuration'

  @Column({ type: 'varchar', nullable: true })
  targetEntityId: string; // e.g., the UUID of the user who was suspended

  @Column({ type: 'jsonb', nullable: true })
  changedData: Record<string, any>; // Stores { oldValue, newValue }

  @Column({ type: 'varchar', nullable: true })
  reason: string;

  @Column({ type: 'varchar', length: 45, nullable: true }) // IPv4/IPv6
  ipAddress: string;

  @CreateDateColumn({ type: 'timestamptz' })
  timestamp: Date;
}