/**
 * REQ-1-077: Defines the finite state machine for the order lifecycle managed within the logistics service.
 * This enum represents the status of a DeliveryTask, not the overall order.
 */
export enum DeliveryStatus {
  /**
   * The system is actively searching for and offering the task to riders.
   */
  ALLOCATING = 'ALLOCATING',

  /**
   * A rider has accepted the delivery task.
   */
  ACCEPTED = 'ACCEPTED',

  /**
   * The rider has physically collected the order from the vendor.
   * This status aligns with the 'In Transit' state from the customer's perspective.
   */
  PICKED_UP = 'PICKED_UP',

  /**
   * The rider has arrived at the customer's delivery location.
   */
  ARRIVED_AT_DESTINATION = 'ARRIVED_AT_DESTINATION',

  /**
   * The order has been successfully delivered to the customer and Proof of Delivery is complete.
   */
  DELIVERED = 'DELIVERED',

  /**
   * REQ-1-079: The system failed to assign a rider to the task after the configured number of attempts/timeout.
   */
  ALLOCATION_FAILED = 'ALLOCATION_FAILED',

  /**
   * The delivery task has been cancelled, e.g., because the order was cancelled.
   */
  CANCELLED = 'CANCELLED',
}