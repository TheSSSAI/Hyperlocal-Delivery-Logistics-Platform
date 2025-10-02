/**
 * Represents a domain event that is published when an order is successfully
 * placed and payment is confirmed. Downstream services listen for this event
 * to trigger their respective workflows (e.g., notifying vendors, updating analytics).
 */
export class OrderPlacedEvent {
  public static readonly eventName = 'order.placed';

  constructor(
    public readonly orderId: string,
    public readonly customerId: string,
    public readonly vendorId: string,
    public readonly totalAmount: number,
    public readonly items: {
      productId: string;
      quantity: number;
      priceAtTimeOfOrder: number;
    }[],
    public readonly placedAt: Date,
  ) {}
}