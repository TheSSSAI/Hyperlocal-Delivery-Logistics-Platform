/**
 * @file Defines the enum for Proof of Delivery (POD) methods.
 * @version 1.0.0
 * @since 1.0.0
 * @author Principal Software Engineer
 * @see REQ-1-074
 */

/**
 * Represents the controlled vocabulary for the different methods of Proof of Delivery.
 */
export enum PodType {
  /**
   * Rider takes a photo of the delivered package as proof.
   */
  PhotoCapture = 'photo_capture',

  /**
   * Rider enters a 4-digit One-Time Password provided by the customer.
   */
  OtpConfirmation = 'otp_confirmation',

  /**
   * No proof of delivery is required for this order.
   */
  None = 'none',
}