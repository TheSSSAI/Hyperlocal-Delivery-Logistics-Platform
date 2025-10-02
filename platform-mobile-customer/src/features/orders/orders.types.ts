import { Address } from '../../types/address.types';
import { Product } from '../products/products.types';

/**
 * @enum OrderStatus
 * @description Defines the possible states of an order in its lifecycle.
 * @see REQ-1-077 - Finite state machine for order lifecycle.
 */
export enum OrderStatus {
  PaymentPending = 'Payment Pending',
  PendingVendorAcceptance = 'Pending Vendor Acceptance',
  Accepted = 'Accepted',
  Preparing = 'Preparing',
  ReadyForPickup = 'Ready for Pickup',
  InTransit = 'In Transit',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled',
  AllocationFailed = 'Allocation Failed',
}

/**
 * @interface OrderItem
 * @description Represents a single line item within a placed order.
 */
export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  priceAtTimeOfOrder: number;
}

/**
 * @interface RiderInfo
 * @description Basic information about the rider assigned to an order.
 */
export interface RiderInfo {
  name: string;
  vehicleRegistration?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

/**
 * @interface Order
 * @description Represents a complete order placed by a customer.
 * @see REQ-1-077 - Defines the order lifecycle and its states.
 * @see CUS-039 - Customer views order history.
 */
export interface Order {
  id: string;
  status: OrderStatus;
  vendorId: string;
  vendorName: string;
  customerId: string;
  placedAt: string; // ISO 8601 timestamp
  items: OrderItem[];
  subtotal: number;
  taxes: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'COD' | 'ONLINE';
  deliveryAddress: Address;
  rider?: RiderInfo | null;
  estimatedDeliveryTime?: string; // ISO 8601 timestamp
  vendorInstructions?: string;
  riderInstructions?: string;
  cancellationReason?: string;
}

/**
 * @interface OrderSummary
 * @description A condensed version of an order for list views.
 * @see CUS-039 - Used in the order history list.
 */
export interface OrderSummary {
  id: string;
  vendorName: string;
  placedAt: string;
  total: number;
  status: OrderStatus;
}

/**
 * @interface CreateOrderPayload
 * @description DTO used to create a new order.
 * @see CUS-025, CUS-022 - Data payload for placing an order.
 */
export interface CreateOrderPayload {
  cartId: string;
  deliveryAddressId: string;
  paymentMethod: 'COD' | 'ONLINE';
  vendorInstructions?: string;
  riderInstructions?: string;
  paymentIntentId?: string; // For online payments
}

/**
 * @interface CreateRatingPayload
 * @description DTO for submitting a rating for an order.
 * @see REQ-1-009, CUS-037, CUS-038
 */
export interface CreateRatingPayload {
  orderId: string;
  vendorRating: {
    stars: number;
    review?: string;
  };
  riderRating: {
    stars: number;
    review?: string;
  };
}