import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Not, Repository } from 'typeorm';
import { QueryRunner } from 'typeorm';

import { Order } from '../entities/order.entity';
import { OrderStatusHistory } from '../entities/order-status-history.entity';
import { OrderStatus } from '../enums/order-status.enum';

/**
 * Interface for the order repository to abstract data access logic.
 */
export interface IOrderRepository {
  /**
   * Finds an order by its unique identifier.
   * @param id The UUID of the order.
   * @returns A promise that resolves to the Order entity or null if not found.
   */
  findById(id: string): Promise<Order | null>;

  /**
   * Finds all orders placed by a specific customer.
   * @param customerId The UUID of the customer.
   * @returns A promise that resolves to an array of Order entities.
   */
  findByCustomerId(customerId: string): Promise<Order[]>;

  /**
   * Finds all active orders for a given user (customer, vendor, or rider).
   * Active orders are those not in a terminal state (Delivered, Cancelled).
   * @param userId The UUID of the user.
   * @param userType The role of the user.
   * @returns A promise that resolves to an array of active Order entities.
   */
  findActiveByUserId(
    userId: string,
    userType: 'customer' | 'vendor' | 'rider',
  ): Promise<Order[]>;

  /**
   * Saves an order entity and its corresponding status history event within a single database transaction.
   * @param order The Order entity to save.
   * @param event The OrderStatusHistory entity to save.
   * @param queryRunner The TypeORM QueryRunner managing the transaction.
   * @returns A promise that resolves to the saved Order entity.
   */
  saveInTransaction(
    order: Order,
    event: OrderStatusHistory,
    queryRunner: QueryRunner,
  ): Promise<Order>;
}

export const ORDER_REPOSITORY = 'IOrderRepository';

@Injectable()
export class PostgresOrderRepository implements IOrderRepository {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  /**
   * @inheritdoc
   */
  async findById(id: string): Promise<Order | null> {
    return this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'statusHistory'],
    });
  }

  /**
   * @inheritdoc
   */
  async findByCustomerId(customerId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { customerId },
      order: { createdAt: 'DESC' },
      relations: ['items'],
    });
  }

  /**
   * @inheritdoc
   */
  async findActiveByUserId(
    userId: string,
    userType: 'customer' | 'vendor' | 'rider',
  ): Promise<Order[]> {
    const whereClause: FindOptionsWhere<Order> = {
      status: Not(In([OrderStatus.Delivered, OrderStatus.Cancelled])),
    };

    if (userType === 'customer') {
      whereClause.customerId = userId;
    } else if (userType === 'vendor') {
      whereClause.vendorId = userId;
    } else {
      // For rider, we might need to query a different entity or field in a real scenario
      // Assuming a simple `riderId` field on the order for this implementation.
      // In a real system, this might be on a `DeliveryTask` entity linked to the order.
      // whereClause.riderId = userId;
      // This part is simplified as the Order entity doesn't have a direct riderId.
      // A more complex query involving joins would be needed.
    }

    return this.orderRepository.find({
      where: whereClause,
      order: { createdAt: 'ASC' },
    });
  }

  /**
   * @inheritdoc
   */
  async saveInTransaction(
    order: Order,
    event: OrderStatusHistory,
    queryRunner: QueryRunner,
  ): Promise<Order> {
    // Ensure the event is associated with the order
    event.order = order;

    // Save the status history event first
    await queryRunner.manager.save(OrderStatusHistory, event);

    // Then save the order entity itself (create or update)
    const savedOrder = await queryRunner.manager.save(Order, order);

    return savedOrder;
  }
}