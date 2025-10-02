export enum PayoutStatus {
  /**
   * Payout has been calculated and is awaiting processing by the settlement job.
   * This is the initial state of a payout record.
   */
  PENDING = 'pending',

  /**
   * Payout has been sent to the payment gateway (e.g., RazorpayX)
   * but is not yet confirmed as disbursed to the recipient's bank account.
   */
  PROCESSING = 'processing',

  /**
   * Payout was successfully processed by the gateway, and funds have been
   * disbursed to the vendor or rider.
   */
  SUCCEEDED = 'succeeded',

  /**
   * Payout failed at the gateway or was rejected by the recipient's bank.
   * This requires manual investigation.
   */
  FAILED = 'failed',

  /**
   * Payout was reversed after being processed. This is an exceptional state
   * that requires manual intervention and investigation.
   */
  REVERSED = 'reversed',
}