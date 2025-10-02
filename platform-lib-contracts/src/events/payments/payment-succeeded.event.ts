import { BaseEvent, IBaseEvent } from '../../common/base.event';
import { IMoneyContract } from '../../common/money.contract';
import { PaymentMethod } from '../../enums';

/**
 * The name of the event published when a payment is successfully captured by the payment gateway.
 */
export const PAYMENT_SUCCEEDED_EVENT_NAME = 'payment.succeeded';

/**
 * The payload for the PaymentSucceededEvent.
 * Contains details about the confirmed transaction.
 */
export interface IPaymentSucceededPayload {
  /**
   * The unique identifier of the order associated with this payment.
   */
  orderId: string;

  /**
   * The unique transaction ID provided by the payment gateway (e.g., Razorpay).
   */
  paymentGatewayTransactionId: string;

  /**
   * The total amount that was successfully captured.
   */
  amount: IMoneyContract;

  /**
   * The payment method used for the transaction.
   */
  paymentMethod: PaymentMethod;
}

/**
 * Represents the event that is published after the payment gateway confirms a
 * successful payment capture via a webhook or callback. In the order saga, this event
 * typically triggers the transition of an order from a pending payment state to
 * 'PendingVendorAcceptance', initiating the fulfillment process.
 */
export class PaymentSucceededEvent
  extends BaseEvent<IPaymentSucceededPayload>
  implements IBaseEvent<IPaymentSucceededPayload>
{
  public eventName = PAYMENT_SUCCEEDED_EVENT_NAME;
  public eventVersion = '1.0';

  constructor(payload: IPaymentSucceededPayload, correlationId: string) {
    super(payload, correlationId);
  }
}