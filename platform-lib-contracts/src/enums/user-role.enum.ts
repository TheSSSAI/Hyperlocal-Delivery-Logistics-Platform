/**
 * @file Defines the enum for all user roles in the three-sided marketplace.
 * @version 1.0.0
 * @since 1.0.0
 * @author Principal Software Engineer
 * @see REQ-1-001
 * @see REQ-1-009
 * @see REQ-1-010
 * @see REQ-1-011
 * @see REQ-1-012
 */

/**
 * Represents the controlled vocabulary for user roles across the system.
 * These roles govern permissions and access control.
 */
export enum UserRole {
  /**
   * A user who places orders.
   */
  Customer = 'customer',

  /**
   * A user who owns a store and fulfills orders.
   */
  Vendor = 'vendor',

  /**
   * A user who performs deliveries.
   */
  Rider = 'rider',

  /**
   * A user with platform-wide management privileges.
   */
  Administrator = 'administrator',
}