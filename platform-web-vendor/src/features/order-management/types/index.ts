/**
 * @file Defines the core TypeScript types and interfaces for the Order Management feature.
 * These types represent the data structures for orders as viewed by a vendor.
 * @version 1.0.0
 * @since 2024-05-24
 */

/**
 * Represents the possible statuses of an order in its lifecycle.
 * Aligns with REQ-1-077 (Order Lifecycle).
 */
export type OrderStatus =
  | 'PendingVendorAcceptance'
  | 'Accepted'
  | 'Preparing'
  | 'ReadyForPickup'
  | 'InTransit'
  | 'Delivered'
  | 'Cancelled'
  | 'AllocationFailed'
  | 'PaymentPendingConfirmation';

/**
 * Represents a single item within an order.
 * Includes details captured at the time of purchase.
 */
export interface OrderItem {
  readonly id: string;
  readonly productId: string;
  productName: string;
  quantity: number;
  priceAtTimeOfOrder: number;
}

/**
 * Represents customer information relevant to an order for a vendor.
 * PII is limited to what is necessary for fulfillment.
 */
export interface OrderCustomer {
  readonly id: string;
  name: string;
  // Note: Address and phone number are typically scoped to the rider's view,
  // but name is needed for vendor context.
}

/**
 * Represents a complete order entity from the vendor's perspective.
 * This is the primary data structure for the order management dashboard.
 * Fulfills requirements from REQ-1-065 and user story VND-016.
 */
export interface Order {
  readonly id: string;
  status: OrderStatus;
  items: OrderItem[];
  itemCount: number;
  subtotal: number;
  taxes: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: 'Prepaid' | 'CashOnDelivery';
  vendorInstructions?: string | null;
  riderInstructions?: string | null; // May be visible to admin/support via vendor dashboard
  customer: OrderCustomer;
  placedAt: string; // ISO 8601 date string
  acceptanceDeadline?: string; // ISO 8601 date string, for the countdown timer
}

/**
 * Represents the data payload required when a vendor accepts an order.
 * Used in the mutation for accepting an order, fulfilling REQ-1-066 and VND-018.
 */
export interface AcceptOrderPayload {
  preparationTime: string; // e.g., '10-15 min'
}

/**
 * Represents the data payload required when a vendor rejects an order.
 * Fulfills user story VND-019.
 */
export interface RejectOrderPayload {
  reason: string; // Predefined or custom reason for rejection
}

/**
 * Represents an entry in the order's immutable event log.
 * Fulfills REQ-1-077.
 */
export interface OrderEventLog {
  readonly id: string;
  timestamp: string; // ISO 8601 date string
  status: OrderStatus;
  actor: 'Customer' | 'Vendor' | 'Rider' | 'System' | 'Administrator';
  notes?: string;
}