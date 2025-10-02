import { Injectable, Logger } from '@nestjs/common';
import { DispatchService } from '../../dispatch/services/dispatch.service';
import {
  OrderAcceptedEventDto,
  OrderAllocationFailedEventDto,
  OrderArrivedAtDestinationEventDto,
  OrderCancelledEventDto,
  OrderDeliveredEventDto,
  OrderPickedUpEventDto,
  OrderReadyForPickupEventDto,
} from '@platform/contracts';

/**
 * @class OrderEventHandler
 * @description Handles all business events originating from the Order Management service.
 * It maps specific order events to notification dispatch requests, fulfilling requirements
 * like REQ-1-073 and CUS-030 by keeping customers informed throughout the order lifecycle.
 */
@Injectable()
export class OrderEventHandler {
  private readonly logger = new Logger(OrderEventHandler.name);

  constructor(private readonly dispatchService: DispatchService) {}

  /**
   * @method handleOrderAcceptedEvent
   * @description Handles the 'OrderAccepted' event, notifying the customer that the vendor is preparing their order.
   * @param {OrderAcceptedEventDto} event - The event payload.
   */
  public async handleOrderAcceptedEvent(
    event: OrderAcceptedEventDto,
  ): Promise<void> {
    this.logger.log(`Handling OrderAcceptedEvent for order ${event.orderId}`);
    try {
      await this.dispatchService.dispatchNotification({
        userId: event.customerId,
        templateKey: 'order.accepted',
        channels: ['Push'],
        data: {
          vendorName: event.vendorName,
          eta: event.estimatedPreparationTime,
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to handle OrderAcceptedEvent for order ${event.orderId}`,
        error.stack,
      );
      throw error; // Re-throw to ensure SQS message is not deleted and can be retried
    }
  }

  /**
   * @method handleOrderReadyForPickupEvent
   * @description Handles the 'OrderReadyForPickup' event, which triggers rider allocation.
   * While this doesn't notify the customer directly, it's a key state.
   * A notification could be added here if UX requires it.
   * @param {OrderReadyForPickupEventDto} event - The event payload.
   */
  public async handleOrderReadyForPickupEvent(
    event: OrderReadyForPickupEventDto,
  ): Promise<void> {
    this.logger.log(
      `Handling OrderReadyForPickupEvent for order ${event.orderId}`,
    );
    // No customer notification is typically sent at this stage, as the next notification is 'PickedUp'.
    // This handler exists for completeness of the event consumption pattern.
  }

  /**
   * @method handleOrderPickedUpEvent
   * @description Handles the 'OrderPickedUp' event, notifying the customer that their order is on the way.
   * Fulfills REQ-1-073.
   * @param {OrderPickedUpEventDto} event - The event payload.
   */
  public async handleOrderPickedUpEvent(
    event: OrderPickedUpEventDto,
  ): Promise<void> {
    this.logger.log(`Handling OrderPickedUpEvent for order ${event.orderId}`);
    try {
      await this.dispatchService.dispatchNotification({
        userId: event.customerId,
        templateKey: 'order.picked_up',
        channels: ['Push'],
        data: {
          riderName: event.riderName,
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to handle OrderPickedUpEvent for order ${event.orderId}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * @method handleOrderArrivedAtDestinationEvent
   * @description Handles the 'OrderArrivedAtDestination' event, notifying the customer of the rider's arrival.
   * Fulfills REQ-1-073.
   * @param {OrderArrivedAtDestinationEventDto} event - The event payload.
   */
  public async handleOrderArrivedAtDestinationEvent(
    event: OrderArrivedAtDestinationEventDto,
  ): Promise<void> {
    this.logger.log(
      `Handling OrderArrivedAtDestinationEvent for order ${event.orderId}`,
    );
    try {
      await this.dispatchService.dispatchNotification({
        userId: event.customerId,
        templateKey: 'order.arrived',
        channels: ['Push'],
        data: {},
      });
    } catch (error) {
      this.logger.error(
        `Failed to handle OrderArrivedAtDestinationEvent for order ${event.orderId}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * @method handleOrderDeliveredEvent
   * @description Handles the 'OrderDelivered' event, confirming delivery and prompting for a rating.
   * Fulfills REQ-1-073 and CUS-030.
   * @param {OrderDeliveredEventDto} event - The event payload.
   */
  public async handleOrderDeliveredEvent(
    event: OrderDeliveredEventDto,
  ): Promise<void> {
    this.logger.log(`Handling OrderDeliveredEvent for order ${event.orderId}`);
    try {
      await this.dispatchService.dispatchNotification({
        userId: event.customerId,
        templateKey: 'order.delivered',
        channels: ['Push'],
        data: {
          vendorName: event.vendorName,
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to handle OrderDeliveredEvent for order ${event.orderId}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * @method handleOrderCancelledEvent
   * @description Handles the 'OrderCancelled' event, informing the customer about the cancellation.
   * @param {OrderCancelledEventDto} event - The event payload.
   */
  public async handleOrderCancelledEvent(
    event: OrderCancelledEventDto,
  ): Promise<void> {
    this.logger.log(`Handling OrderCancelledEvent for order ${event.orderId}`);
    try {
      await this.dispatchService.dispatchNotification({
        userId: event.customerId,
        templateKey: 'order.cancelled',
        channels: ['Push', 'SMS'],
        data: {
          vendorName: event.vendorName,
          reason: event.reason,
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to handle OrderCancelledEvent for order ${event.orderId}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * @method handleOrderAllocationFailedEvent
   * @description Handles the 'OrderAllocationFailed' event, informing the customer about a delay.
   * @param {OrderAllocationFailedEventDto} event - The event payload.
   */
  public async handleOrderAllocationFailedEvent(
    event: OrderAllocationFailedEventDto,
  ): Promise<void> {
    this.logger.log(
      `Handling OrderAllocationFailedEvent for order ${event.orderId}`,
    );
    try {
      await this.dispatchService.dispatchNotification({
        userId: event.customerId,
        templateKey: 'order.allocation_failed',
        channels: ['Push'],
        data: {},
      });
    } catch (error) {
      this.logger.error(
        `Failed to handle OrderAllocationFailedEvent for order ${event.orderId}`,
        error.stack,
      );
      throw error;
    }
  }
}