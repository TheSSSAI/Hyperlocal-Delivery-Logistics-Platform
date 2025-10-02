import {
  Entity,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

/**
 * Represents an immutable audit trail entry for actions performed by Administrators.
 *
 * @see REQ-1-013 - Dedicated, immutable audit trail for 'Administrator' role actions.
 * @see Identity & Access Service ER Diagram
 */
@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'admin_id', type: 'uuid' })
  adminId: string;

  /**
   * The administrator who performed the action.
   */
  @ManyToOne(() => User, (user) => user.auditLogs, {
    onDelete: 'SET NULL', // Keep audit log even if admin user is deleted
    nullable: true,
  })
  @JoinColumn({ name: 'admin_id' })
  admin: User;

  @Column({ length: 100 })
  action: string;

  @Column({ name: 'target_entity', length: 100, nullable: true })
  targetEntity: string | null;

  @Column({ name: 'target_id', length: 255, nullable: true })
  targetId: string | null;

  @Column({ type: 'jsonb', name: 'changed_data', nullable: true })
  changedData: Record<string, any> | null;

  @Column({ nullable: true })
  reason: string | null;

  @Column({ name: 'ip_address', length: 45, nullable: true })
  ipAddress: string | null;

  @Column({ name: 'user_agent', nullable: true })
  userAgent: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}