import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

/**
 * Represents the state of a chat room associated with an order.
 * Manages participants and read-only status for authorization.
 * Maps to the 'chat_rooms' table in PostgreSQL.
 *
 * @see REQ-1-015 for chat room lifecycle rules (active vs. read-only).
 * @see SDS for entity mappings.
 */
@Entity({ name: 'chat_rooms' })
export class ChatRoom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'uuid', unique: true })
  orderId: string;

  /**
   * Stores an array of participant user IDs (e.g., customerId, vendorId, riderId).
   * Used for authorization checks on connection and message sending.
   */
  @Column({ type: 'jsonb', default: [] })
  participants: string[];

  /**
   * When true, no new messages can be posted to this room.
   * Triggered by 'order.delivered' or 'order.cancelled' events.
   */
  @Column({ type: 'boolean', default: false })
  isReadonly: boolean;
}