/**
 * @file Defines the enum for all possible order statuses in the system.
 * @version 1.0.0
 * @since 1.0.0
 * @author Principal Software Engineer
 * @see REQ-1-077
 */

/**
 * Represents the controlled vocabulary for all states in the order lifecycle finite state machine.
 */
export enum OrderStatus {
  /**
   * Initial state where payment is initiated but not yet confirmed by the gateway.
   * As per REQ-1-057.
   */
  PaymentPending = 'payment_pending_confirmation',

  /**
   * Order is paid (or COD) and is waiting for the vendor to accept or reject it.
   * As per REQ-1-056.
   */
  PendingVendorAcceptance = 'pending_vendor_acceptance',

  /**
   * Vendor has accepted the order and will begin preparation.
   * As per REQ-1-077.
   */
  Accepted = 'accepted',

  /**
   * Vendor is actively preparing the order.
   * As per REQ-1-077.
   */
  Preparing = 'preparing',

  /**
   * Order is prepared and is waiting for a rider to be assigned and collect it.
   * This status triggers the rider allocation process.
   * As per REQ-1-077, REQ-1-078.
   */
  ReadyForPickup = 'ready_for_pickup',

  /**
   * Rider has picked up the order and is en route to the customer.
   * Live tracking is active in this state.
   * As per REQ-1-077.
   */
  InTransit = 'in_transit',

  /**
   * Order has been successfully delivered to the customer. This is a terminal state.
   * As per REQ-1-077.
   */
  Delivered = 'delivered',

  /**
   * Order has been cancelled by the customer, vendor, or system. This is a terminal state.
   * As per REQ-1-077.
   */
  Cancelled = 'cancelled',

  /**
   * The system failed to assign a rider to the order after multiple attempts.
   * This state requires administrative intervention.
   * As per REQ-1-079.
   */
  AllocationFailed = 'allocation_failed',
}