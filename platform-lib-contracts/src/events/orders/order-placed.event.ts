import { BaseEvent, IBaseEvent } from '../../common/base.event';
import { IMoneyContract } from '../../common/money.contract';
import { PaymentMethod } from '../../enums/payment-method.enum';
import { IAddressContract } from '../../common/address.contract';

/**
 * The name of the event published when a customer successfully places an order.
 */
export const ORDER_PLACED_EVENT_NAME = 'order.placed';

/**
 * Represents a single line item within an order placement event.
 */
export interface IOrderPlacedItemPayload {
  productId: string;
  productName: string;
  quantity: number;
  priceAtTimeOfOrder: IMoneyContract;
}

/**
 * The payload for the OrderPlacedEvent.
 * Contains all necessary details about the newly created order.
 */
export interface IOrderPlacedPayload {
  orderId: string;
  customerId: string;
  vendorId: string;
  items: IOrderPlacedItemPayload[];
  totalAmount: IMoneyContract;
  subtotal: IMoneyContract;
  deliveryFee: IMoneyContract;
  taxes: IMoneyContract;
  paymentMethod: PaymentMethod;
  deliveryAddress: IAddressContract;
  vendorInstructions?: string;
  riderInstructions?: string;
}

/**
 * Represents the event that is published after a customer successfully completes
 * the checkout process and an order is created in the 'PendingVendorAcceptance' state.
 * This is a critical event in the order saga, triggering notifications to the vendor,
 * inventory adjustments, and other downstream processes.
 */
export class OrderPlacedEvent
  extends BaseEvent<IOrderPlacedPayload>
  implements IBaseEvent<IOrderPlacedPayload>
{
  public eventName = ORDER_PLACED_EVENT_NAME;
  public eventVersion = '1.0';

  constructor(payload: IOrderPlacedPayload, correlationId: string) {
    super(payload, correlationId);
  }
}