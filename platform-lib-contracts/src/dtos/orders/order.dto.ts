/**
 * @file Defines the Data Transfer Object for representing a full order.
 * @version 1.0.0
 * @since 1.0.0
 * @author Principal Software Engineer
 */
import { OrderStatus } from '../../enums/order-status.enum';
import { PaymentMethod } from '../../enums/payment-method.enum';
import { AddressContract } from '../../common/address.contract';
import { MoneyContract } from '../../common/money.contract';

/**
 * Represents a single item within a full order DTO.
 */
export class OrderItemDto {
  /** The unique identifier of the product. */
  productId: string;

  /** The name of the product at the time of order. */
  productName: string;

  /** The quantity ordered. */
  quantity: number;

  /** The price of a single unit at the time of order. */
  priceAtTimeOfOrder: MoneyContract;
}

/**
 * Represents the full data contract for an order, typically used in API responses.
 */
export class OrderDto {
  /** The unique identifier for the order. */
  id: string;

  /** The current status of the order. */
  status: OrderStatus;

  /** The ID of the customer who placed the order. */
  customerId: string;

  /** The ID of the vendor fulfilling the order. */
  vendorId: string;

  /** The name of the vendor's store. */
  vendorStoreName: string;

  /** The ID of the rider assigned to the delivery, if applicable. */
  riderId?: string;

  /** The customer's delivery address for this order. */
  deliveryAddress: AddressContract;

  /** An array of items included in the order. */
  items: OrderItemDto[];

  /** The subtotal of all items before taxes and fees. */
  subtotal: MoneyContract;

  /** The calculated taxes for the order. */
  taxes: MoneyContract;

  /** The calculated delivery fee for the order. */
  deliveryFee: MoneyContract;

  /** The final, total amount for the order. */
  totalAmount: MoneyContract;

  /** The payment method used for the order. */
  paymentMethod: PaymentMethod;

  /** Special instructions for the vendor. */
  vendorInstructions?: string;

  /** Special instructions for the rider. */
  riderInstructions?: string;

  /** The ISO 8601 timestamp when the order was placed. */
  placedAt: string;

  /** The estimated time of arrival. */
  estimatedArrivalTime?: string;

  /** The ISO 8601 timestamp when the order was created. */
  createdAt: string;

  /** The ISO 8601 timestamp of the last update. */
  updatedAt: string;
}