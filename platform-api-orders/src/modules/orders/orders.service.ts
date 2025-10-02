import {
  Injectable,
  Inject,
  Logger,
  HttpException,
  HttpStatus,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import { OrderRepository } from './repositories/order.repository';
import { Order } from './entities/order.entity.ts';
import { OrderItem } from './entities/order-item.entity.ts';
import { OrderEventLog } from './entities/order-event-log.entity.ts';
import { OrderStatus } from './enums/order-status.enum.ts';
import { OrderStateMachineService } from './state-machine/order-state-machine.service.ts';
import { EventPublisherService } from '../../shared/messaging/event-publisher.service.ts';
import { CartService } from '../cart/cart.service.ts';
import { CreateOrderDto } from './dtos/create-order.dto.ts';
import { OrderPlacedEvent } from './events/order-placed.event.ts';
import { Cart } from '../cart/entities/cart.entity.ts';

// Custom Exceptions for clear error handling
export class OrderNotFoundException extends NotFoundException {
  constructor(orderId: string) {
    super(`Order with ID ${orderId} not found`);
  }
}

export class InvalidStateTransitionException extends ConflictException {
  constructor(from: OrderStatus, to: OrderStatus) {
    super(`Cannot transition order from ${from} to ${to}`);
  }
}

export class OutOfStockException extends ConflictException {
  constructor(productIds: string[]) {
    super(`One or more items are out of stock: ${productIds.join(', ')}`);
  }
}

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @Inject(OrderRepository)
    private readonly orderRepository: OrderRepository,
    private readonly orderStateMachine: OrderStateMachineService,
    private readonly eventPublisher: EventPublisherService,
    private readonly cartService: CartService,
    private readonly dataSource: DataSource,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Initiates the order creation Saga.
   * Fetches cart, validates inventory via synchronous call, creates order in PaymentPending,
   * and publishes an event for the Payments service.
   * REQ-1-055, REQ-1-105
   * @param userId - The ID of the customer placing the order.
   * @param createOrderDto - DTO with cart, address, and payment info.
   * @returns The newly created order entity in a pending state.
   */
  public async createOrder(
    userId: string,
    createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    this.logger.log(`Initiating order creation for user: ${userId}`);

    const cart = await this.cartService.getCartByUserId(userId);
    if (!cart || cart.items.length === 0) {
      throw new HttpException('Cart is empty', HttpStatus.BAD_REQUEST);
    }

    // REQ-1-055: Real-time inventory check (synchronous)
    await this.validateInventory(cart);

    const newOrder = new Order();
    newOrder.customerId = userId;
    newOrder.vendorId = cart.vendorId; // Assuming a single-vendor cart
    newOrder.deliveryAddressId = createOrderDto.deliveryAddressId;
    newOrder.paymentMethod = createOrderDto.paymentMethod;
    newOrder.status = OrderStatus.PaymentPending;
    newOrder.vendorInstructions = createOrderDto.vendorInstructions;
    newOrder.riderInstructions = createOrderDto.riderInstructions;
    newOrder.placedAt = new Date();

    let subtotal = 0;
    newOrder.items = cart.items.map(cartItem => {
      const orderItem = new OrderItem();
      orderItem.productId = cartItem.productId;
      orderItem.quantity = cartItem.quantity;
      orderItem.priceAtTimeOfOrder = cartItem.product.price; // Snapshotting the price
      orderItem.productName = cartItem.product.name; // Snapshotting the name
      subtotal += orderItem.priceAtTimeOfOrder * orderItem.quantity;
      return orderItem;
    });

    // These would be calculated by a dedicated pricing/tax service in a real scenario
    newOrder.subtotal = subtotal;
    newOrder.taxes = subtotal * 0.05; // Example 5% tax
    newOrder.deliveryFee = 40.0; // Example flat delivery fee
    newOrder.totalAmount =
      newOrder.subtotal + newOrder.taxes + newOrder.deliveryFee;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let savedOrder: Order;
    try {
      const initialEvent = new OrderEventLog();
      initialEvent.status = OrderStatus.PaymentPending;
      initialEvent.actor = 'System';
      initialEvent.notes = 'Order created, awaiting payment confirmation.';

      savedOrder = await this.orderRepository.saveInTransaction(
        newOrder,
        initialEvent,
        queryRunner,
      );

      await queryRunner.commitTransaction();
      this.logger.log(`Order ${savedOrder.id} created in PaymentPending state.`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `Failed to create order for user ${userId}. Rolled back transaction.`,
        error.stack,
      );
      throw new HttpException(
        'Failed to create order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }

    // Publish event for Payments service to create a payment intent
    await this.eventPublisher.publish('OrderInitiated', {
      orderId: savedOrder.id,
      totalAmount: savedOrder.totalAmount,
      customerId: savedOrder.customerId,
      paymentMethod: savedOrder.paymentMethod,
    });

    return savedOrder;
  }

  /**
   * Saga step: Handles the 'PaymentConfirmed' event.
   * Transitions the order state to PendingVendorAcceptance.
   * REQ-1-056, REQ-1-077
   */
  public async handlePaymentConfirmed(orderId: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await this.orderRepository.findByIdForUpdate(
        orderId,
        queryRunner,
      );
      if (!order) {
        throw new OrderNotFoundException(orderId);
      }

      const canTransition = this.orderStateMachine.canTransition(
        order.status,
        OrderStatus.PendingVendorAcceptance,
      );
      if (!canTransition) {
        throw new InvalidStateTransitionException(
          order.status,
          OrderStatus.PendingVendorAcceptance,
        );
      }

      order.status = OrderStatus.PendingVendorAcceptance;

      const eventLog = new OrderEventLog();
      eventLog.status = OrderStatus.PendingVendorAcceptance;
      eventLog.actor = 'System';
      eventLog.notes = 'Payment confirmed.';

      await this.orderRepository.saveInTransaction(order, eventLog, queryRunner);
      await queryRunner.commitTransaction();

      this.logger.log(
        `Order ${orderId} transitioned to PendingVendorAcceptance.`,
      );

      // Publish OrderPlacedEvent for vendor notification and other downstream services
      const eventPayload = new OrderPlacedEvent(
        order.id,
        order.customerId,
        order.vendorId,
        order.totalAmount,
        order.items.map(i => ({ productId: i.productId, quantity: i.quantity })),
      );
      await this.eventPublisher.publish('OrderPlaced', eventPayload);

    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `Failed to handle payment confirmation for order ${orderId}.`,
        error.stack,
      );
      // In a real saga, we would publish a compensating event (e.g., 'InitiateRefund')
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  
  /**
   * Saga compensating transaction: Handles 'PaymentFailed' event.
   */
  public async handlePaymentFailed(orderId: string, reason: string): Promise<void> {
    await this.updateOrderStatus(orderId, OrderStatus.Cancelled, 'System', `Payment failed: ${reason}`);
  }

  /**
   * Allows an authorized actor to cancel an order, applying business rules for fees.
   * REQ-1-031, REQ-1-032
   */
  public async cancelOrder(
    orderId: string,
    requestingUserId: string,
    actor: 'Customer' | 'Vendor' | 'System' | 'Admin',
    reason: string,
  ): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await this.orderRepository.findByIdForUpdate(
        orderId,
        queryRunner,
      );
      if (!order) {
        throw new OrderNotFoundException(orderId);
      }

      // Ownership check for customers
      if (actor === 'Customer' && order.customerId !== requestingUserId) {
          throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }

      const canTransition = this.orderStateMachine.canTransition(
        order.status,
        OrderStatus.Cancelled,
      );
      if (!canTransition) {
        throw new InvalidStateTransitionException(
          order.status,
          OrderStatus.Cancelled,
        );
      }
      
      const timeSincePlaced = (new Date().getTime() - order.placedAt.getTime()) / 1000;
      let cancellationFee = 0;
      let refundAmount = order.totalAmount;

      // REQ-1-031: Full refund within 60-second grace period
      if (actor === 'Customer' && timeSincePlaced <= 60) {
        cancellationFee = 0;
      }
      // REQ-1-032: Fee applied after rider assignment
      else if (actor === 'Customer' && [OrderStatus.ReadyForPickup, OrderStatus.InTransit].includes(order.status)) {
        cancellationFee = 50; // Example fee, should come from ConfigService
      }

      refundAmount -= cancellationFee;

      order.status = OrderStatus.Cancelled;
      const eventLog = new OrderEventLog();
      eventLog.status = OrderStatus.Cancelled;
      eventLog.actor = actor;
      eventLog.notes = `Cancellation reason: ${reason}. Fee: ${cancellationFee}.`;

      const updatedOrder = await this.orderRepository.saveInTransaction(order, eventLog, queryRunner);
      await queryRunner.commitTransaction();

      this.logger.log(`Order ${orderId} cancelled by ${actor}.`);
      
      // Publish event to trigger refund in Payments service and notify others
      await this.eventPublisher.publish('OrderCancelled', {
        orderId: order.id,
        paymentMethod: order.paymentMethod,
        refundAmount: refundAmount > 0 ? refundAmount : 0,
        cancellationFee,
        actor,
      });

      return updatedOrder;
    } catch (error) {
        await queryRunner.rollbackTransaction();
        this.logger.error(`Failed to cancel order ${orderId}.`, error.stack);
        throw error;
    } finally {
        await queryRunner.release();
    }
  }

  /**
   * Generic private helper for state transitions.
   */
  private async updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    actor: string,
    notes: string,
  ): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await this.orderRepository.findByIdForUpdate(orderId, queryRunner);
      if (!order) {
        throw new OrderNotFoundException(orderId);
      }

      if (!this.orderStateMachine.canTransition(order.status, newStatus)) {
        throw new InvalidStateTransitionException(order.status, newStatus);
      }

      order.status = newStatus;
      const eventLog = new OrderEventLog();
      eventLog.status = newStatus;
      eventLog.actor = actor;
      eventLog.notes = notes;

      const updatedOrder = await this.orderRepository.saveInTransaction(order, eventLog, queryRunner);
      await queryRunner.commitTransaction();

      this.logger.log(`Order ${orderId} transitioned to ${newStatus}.`);
      return updatedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Failed to update order ${orderId} to status ${newStatus}.`, error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Synchronously calls the Vendor & Catalog service to validate inventory.
   * REQ-1-055
   */
  private async validateInventory(cart: Cart): Promise<void> {
    const catalogServiceUrl = this.configService.get<string>(
      'CATALOG_SERVICE_URL',
    );
    if (!catalogServiceUrl) {
      this.logger.error('CATALOG_SERVICE_URL not configured.');
      throw new HttpException(
        'Internal server configuration error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const endpoint = `${catalogServiceUrl}/internal/inventory/check`;
    const payload = {
      items: cart.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    try {
      this.logger.log(`Validating inventory for cart ${cart.id} at ${endpoint}`);
      const response = await firstValueFrom(
        this.httpService.post(endpoint, payload),
      );

      if (response.status !== 200 || !response.data.isAvailable) {
        const unavailableItems = response.data.unavailableItems || [];
        throw new OutOfStockException(unavailableItems.map(i => i.productId));
      }

      this.logger.log(`Inventory validation successful for cart ${cart.id}`);
    } catch (error) {
      this.logger.error(
        `Inventory check failed for cart ${cart.id}.`,
        error.stack,
      );
      if (error instanceof OutOfStockException) {
          throw error;
      }
      throw new HttpException(
        'Could not verify item availability. Please try again later.',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  public async findOrderById(orderId: string, userId: string): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
        throw new OrderNotFoundException(orderId);
    }
    // Simple ownership check
    if (order.customerId !== userId) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return order;
  }
}