/**
 * Defines the finite set of possible statuses for an order throughout its lifecycle.
 * This enum is the single source of truth for the order state machine.
 *
 * @enum {string}
 * @see REQ-1-077 - The system shall manage the order lifecycle using a finite state machine.
 */
export enum OrderStatus {
  /**
   * Initial state when an order is created but payment is not yet confirmed.
   * The order is in a temporary state waiting for payment gateway confirmation.
   */
  PaymentPending = 'PAYMENT_PENDING',

  /**
   * State after successful payment, waiting for the vendor to accept the order.
   * The order has been paid for and is now in the vendor's queue.
   */
  PendingVendorAcceptance = 'PENDING_VENDOR_ACCEPTANCE',

  /**
   * The vendor has acknowledged and accepted the order.
   * This is a transitional state before preparation begins.
   */
  Accepted = 'ACCEPTED',

  /**
   * The vendor is actively preparing the order.
   */
  Preparing = 'PREPARING',

  /**
   * The order is prepared and is awaiting pickup by a delivery rider.
   * This state triggers the rider allocation process.
   */
  ReadyForPickup = 'READY_FOR_PICKUP',

  /**
   * A rider has collected the order from the vendor and is en route to the customer.
   * Live tracking is active during this state.
   */
  InTransit = 'IN_TRANSIT',

  /**
   * The order has been successfully delivered to the customer.
   * This is a final, terminal state.
   */
  Delivered = 'DELIVERED',

  /**
   * The order has been cancelled by the customer, vendor, or system.
   * This is a final, terminal state.
   */
  Cancelled = 'CANCELLED',

  /**
   * The system failed to assign a rider to the order after multiple attempts.
   * Requires administrative intervention. This is an exception state.
   */
  AllocationFailed = 'ALLOCATION_FAILED',
}