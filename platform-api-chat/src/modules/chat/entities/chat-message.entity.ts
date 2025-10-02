import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

/**
 * Represents a single chat message in the database.
 * Maps to the 'chat_messages' table in PostgreSQL.
 *
 * @see REQ-1-015 for chat permissions and history.
 * @see REQ-1-095 for data retention policy.
 * @see SDS for entity mappings (adapted from DocumentDB to PostgreSQL).
 */
@Entity({ name: 'chat_messages' })
@Index(['orderId', 'createdAt']) // Critical for fetching chat history efficiently
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  orderId: string;

  /**
   * Defines the conversation channel within an order's chat.
   * e.g., 'customer_vendor', 'customer_rider'
   */
  @Column({ type: 'varchar', length: 50 })
  conversationId: string;

  @Column({ type: 'uuid' })
  senderId: string;

  @Column({ type: 'text' })
  messageText: string;

  @CreateDateColumn({ type: 'timestamptz' })
  @Index() // Required for the data retention cleanup job
  createdAt: Date;
}