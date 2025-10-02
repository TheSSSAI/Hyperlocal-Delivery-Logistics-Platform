/**
 * @file Defines the enum for supported payment methods.
 * @version 1.0.0
 * @since 1.0.0
 * @author Principal Software Engineer
 * @see REQ-1-054
 */

/**
 * Represents the controlled vocabulary for payment methods supported by the platform.
 */
export enum PaymentMethod {
  /**
   * Unified Payments Interface.
   */
  UPI = 'upi',

  /**
   * Credit or Debit Card.
   */
  Card = 'card',

  /**
   * Cash on Delivery.
   */
  COD = 'cod',
}