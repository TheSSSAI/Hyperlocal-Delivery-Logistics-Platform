import { Injectable } from '@nestjs/common';
import { OrderStatus } from '../enums/order-status.enum';

@Injectable()
export class OrderStateMachineService {
  private readonly transitions: Map<OrderStatus, OrderStatus[]>;

  constructor() {
    this.transitions = new Map<OrderStatus, OrderStatus[]>();
    this.initializeTransitions();
  }

  /**
   * Defines the entire valid state transition graph for an order.
   * This is the single source of truth for the order lifecycle logic.
   * Fulfills REQ-1-077.
   */
  private initializeTransitions(): void {
    // Initial state after creation, pre-payment
    this.transitions.set(OrderStatus.PaymentPending, [
      OrderStatus.PendingVendorAcceptance,
      OrderStatus.Cancelled,
    ]);

    // After payment, waiting for vendor
    this.transitions.set(OrderStatus.PendingVendorAcceptance, [
      OrderStatus.Accepted,
      OrderStatus.Cancelled,
    ]);

    // After vendor acceptance
    this.transitions.set(OrderStatus.Accepted, [
      OrderStatus.Preparing,
      OrderStatus.ReadyForPickup,
      OrderStatus.Cancelled,
    ]);

    // While vendor is preparing
    this.transitions.set(OrderStatus.Preparing, [
      OrderStatus.ReadyForPickup,
      OrderStatus.Cancelled,
    ]);

    // Ready for rider
    this.transitions.set(OrderStatus.ReadyForPickup, [
      OrderStatus.InTransit,
      OrderStatus.AllocationFailed,
      OrderStatus.Cancelled,
    ]);

    // Rider allocation failed, can be retried or cancelled
    this.transitions.set(OrderStatus.AllocationFailed, [
        OrderStatus.ReadyForPickup, // e.g., Admin manually re-triggers allocation
        OrderStatus.Cancelled,
    ]);

    // On the way to customer
    this.transitions.set(OrderStatus.InTransit, [
      OrderStatus.Delivered,
      OrderStatus.Cancelled, // Cancellation might be allowed with a fee
    ]);

    // Terminal states - no further transitions
    this.transitions.set(OrderStatus.Delivered, []);
    this.transitions.set(OrderStatus.Cancelled, []);
  }

  /**
   * Validates if a transition from a given state to another is allowed.
   * @param from The current state of the order.
   * @param to The desired next state for the order.
   * @returns `true` if the transition is valid, otherwise `false`.
   */
  public canTransition(from: OrderStatus, to: OrderStatus): boolean {
    const allowedTransitions = this.transitions.get(from);
    if (!allowedTransitions) {
      return false;
    }
    return allowedTransitions.includes(to);
  }
}