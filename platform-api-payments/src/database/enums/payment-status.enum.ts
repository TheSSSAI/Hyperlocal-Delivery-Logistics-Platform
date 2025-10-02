export enum PaymentStatus {
  /**
   * Payment has been initiated but not yet completed.
   * This is the initial state when a payment intent is created.
   */
  PENDING = 'pending',

  /**
   * Payment was successful on the gateway, but the confirmation webhook/callback
   * has not been received or processed yet. This state is crucial for the
   * reconciliation process as per REQ-1-057.
   */
  PENDING_CONFIRMATION = 'pending_confirmation',

  /**
   * Payment was successfully completed, captured, and confirmed by the gateway.
   * The order can now proceed.
   */
  SUCCEEDED = 'succeeded',

  /**
   * Payment failed at the gateway due to reasons like incorrect details,
   * insufficient funds, or user cancellation.
   */
  FAILED = 'failed',
}