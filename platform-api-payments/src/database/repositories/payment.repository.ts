import { Injectable, Logger } from '@nestjs/common';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { PaymentEntity } from '../entities/payment.entity.ts';
import { PaymentStatus } from '../enums/payment-status.enum.ts';

export interface IPaymentRepository extends Repository<PaymentEntity> {
  createPayment(
    paymentData: Partial<PaymentEntity>,
  ): Promise<PaymentEntity>;
  findByOrderId(orderId: string): Promise<PaymentEntity | null>;
  findByGatewayTransactionId(
    gatewayTransactionId: string,
  ): Promise<PaymentEntity | null>;
  updateStatusByGatewayTransactionId(
    gatewayTransactionId: string,
    status: PaymentStatus,
  ): Promise<PaymentEntity | null>;
  findPendingConfirmationPayments(olderThanMinutes: number): Promise<PaymentEntity[]>;
}

@Injectable()
export class PaymentRepository
  extends Repository<PaymentEntity>
  implements IPaymentRepository
{
  private readonly logger = new Logger(PaymentRepository.name);

  constructor(private dataSource: DataSource) {
    super(PaymentEntity, dataSource.createEntityManager());
  }

  /**
   * Creates and saves a new payment record in the database.
   * @param paymentData - The initial data for the payment.
   * @returns The newly created PaymentEntity.
   */
  async createPayment(
    paymentData: Partial<PaymentEntity>,
  ): Promise<PaymentEntity> {
    const payment = this.create(paymentData);
    await this.save(payment);
    this.logger.log(`Created payment record for orderId: ${payment.orderId}`);
    return payment;
  }

  /**
   * Finds a single payment record by its associated order ID.
   * @param orderId - The UUID of the order.
   * @returns A PaymentEntity if found, otherwise null.
   */
  async findByOrderId(orderId: string): Promise<PaymentEntity | null> {
    return this.findOne({ where: { orderId } });
  }

  /**
   * Finds a single payment record by the unique transaction ID from the payment gateway.
   * @param gatewayTransactionId - The transaction ID provided by the gateway (e.g., Razorpay).
   * @returns A PaymentEntity if found, otherwise null.
   */
  async findByGatewayTransactionId(
    gatewayTransactionId: string,
  ): Promise<PaymentEntity | null> {
    return this.findOne({ where: { gatewayTransactionId } });
  }

  /**
   * Updates the status of a payment record identified by its gateway transaction ID.
   * This is a critical step in handling payment webhooks.
   * @param gatewayTransactionId - The unique ID from the payment gateway.
   * @param status - The new status to set for the payment.
   * @returns The updated PaymentEntity, or null if not found.
   */
  async updateStatusByGatewayTransactionId(
    gatewayTransactionId: string,
    status: PaymentStatus,
  ): Promise<PaymentEntity | null> {
    const payment = await this.findByGatewayTransactionId(gatewayTransactionId);
    if (!payment) {
      this.logger.warn(
        `Attempted to update status for non-existent payment with gatewayTransactionId: ${gatewayTransactionId}`,
      );
      return null;
    }

    if (payment.status === status) {
      this.logger.log(
        `Payment ${payment.id} is already in status: ${status}. No update needed.`,
      );
      return payment;
    }

    payment.status = status;
    await this.save(payment);
    this.logger.log(
      `Updated payment ${payment.id} (orderId: ${payment.orderId}) to status: ${status}`,
    );
    return payment;
  }
  
  /**
   * Finds all payments that are in the 'pending_confirmation' state and are older than a specified duration.
   * This method is essential for the payment reconciliation job.
   * @param olderThanMinutes - The age in minutes to filter payments by.
   * @returns An array of PaymentEntity records matching the criteria.
   */
  async findPendingConfirmationPayments(olderThanMinutes: number): Promise<PaymentEntity[]> {
    const threshold = new Date();
    threshold.setMinutes(threshold.getMinutes() - olderThanMinutes);

    return this.createQueryBuilder('payment')
      .where('payment.status = :status', { status: PaymentStatus.PENDING_CONFIRMATION })
      .andWhere('payment.createdAt < :threshold', { threshold })
      .getMany();
  }
}