import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

/**
 * Enum for the notification channels supported by the system.
 */
export enum NotificationChannel {
  PUSH = 'push',
  SMS = 'sms',
}

/**
 * Represents a notification template stored in the database.
 * This entity allows for dynamic management of notification content without
 * requiring code changes. It aligns with the critical finding in the SDS
 * for a scalable template management system.
 */
@Entity('notification_templates')
export class Template {
  /**
   * The unique identifier for the template record.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * A unique, human-readable key to identify the template.
   * This key is used by the application logic to fetch the correct template.
   * @example 'order.confirmed.push'
   */
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, unique: true })
  templateKey: string;

  /**
   * The communication channel for which this template is designed.
   */
  @Column({
    type: 'enum',
    enum: NotificationChannel,
  })
  channel: NotificationChannel;

  /**
   * The template for the notification's subject or title.
   * This is primarily used for push notifications and emails. Nullable for SMS.
   * Uses Handlebars.js syntax for placeholders, e.g., 'Order {{orderId}} Confirmed!'.
   */
  @Column({ type: 'varchar', length: 512, nullable: true })
  subjectTemplate: string;

  /**
   * The template for the main body/content of the notification.
   * Uses Handlebars.js syntax for placeholders.
   * @example 'Your order from {{vendorName}} is on its way!'
   */
  @Column({ type: 'text' })
  contentTemplate: string;

  /**
   * Timestamp of when the template record was created.
   */
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  /**
   * Timestamp of the last time the template record was updated.
   */
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}