import { Injectable, Logger } from '@nestjs/common';
import { MoreThan } from 'typeorm';
import { PaymentRepository } from '../../database/repositories/payment.repository';
import { RazorpayService } from '../../shared/razorpay/razorpay.service';
import { EventPublisher } from '../../shared/messaging/event.publisher';
import { PaymentStatus } from '../../database/enums/payment-status.enum';
import { Payment } from '../../database/entities/payment.entity';
import { PaymentSucceededEvent, PaymentFailedEvent } from '../../shared/messaging/events';

const RECONCILIATION_WINDOW_HOURS = 24;

@Injectable()
export class ReconciliationService {
  private readonly logger = new Logger(ReconciliationService.name);

  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly razorpayService: RazorpayService,
    private readonly eventPublisher: EventPublisher,
  ) {}

  /**
   * Fetches payments in a 'pending_confirmation' state and reconciles their
   * status with the payment gateway. This implements REQ-1-058.
   */
  async reconcilePendingPayments(): Promise<void> {
    this.logger.log('Starting payment reconciliation job...');

    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - RECONCILIATION_WINDOW_HOURS);

    let pendingPayments: Payment[];
    try {
      pendingPayments = await this.paymentRepository.find({
        where: {
          status: PaymentStatus.PENDING_CONFIRMATION,
          createdAt: MoreThan(cutoffDate),
        },
      });
    } catch (error) {
        this.logger.error(`Failed to fetch pending payments from database: ${error.message}`, error.stack);
        return;
    }


    if (pendingPayments.length === 0) {
      this.logger.log('No pending payments to reconcile.');
      return;
    }

    this.logger.log(`Found ${pendingPayments.length} payments to reconcile.`);

    for (const payment of pendingPayments) {
      try {
        await this.processSinglePayment(payment);
      } catch (error) {
        // Log the error for the specific payment but continue the loop
        this.logger.error(`Error processing payment ${payment.id}: ${error.message}`, error.stack);
      }
    }

    this.logger.log('Payment reconciliation job finished.');
  }

  private async processSinglePayment(payment: Payment): Promise<void> {
    this.logger.log(`Reconciling payment ${payment.id} (Order: ${payment.orderId})`);
    
    const gatewayPayment = await this.razorpayService.fetchPayment(payment.gatewayTransactionId);

    if (!gatewayPayment) {
        this.logger.warn(`Payment ${payment.id} not found at gateway. Marking as failed.`);
        await this.handleFailedPayment(payment, 'Gateway payment not found');
        return;
    }
    
    // As per Razorpay documentation, 'captured' is the final success state.
    if (gatewayPayment.status === 'captured') {
        this.logger.log(`Payment ${payment.id} is 'captured' at gateway. Marking as succeeded.`);
        await this.handleSuccessfulPayment(payment);
    } 
    // 'failed' is a final failure state.
    else if (gatewayPayment.status === 'failed') {
        this.logger.log(`Payment ${payment.id} is 'failed' at gateway. Marking as failed.`);
        await this.handleFailedPayment(payment, gatewayPayment.error_description || 'Gateway reported failure');
    }
    // Any other status ('created', 'authorized') means it's still in progress or abandoned.
    // We can add logic for stale payments here. E.g., if created > 1hr ago, mark as failed.
    else {
        const paymentAgeHours = (new Date().getTime() - new Date(payment.createdAt).getTime()) / (1000 * 60 * 60);
        if (paymentAgeHours > 1) { // Configurable staleness threshold
            this.logger.warn(`Payment ${payment.id} is stale (status: ${gatewayPayment.status}, age: ${paymentAgeHours.toFixed(2)}h). Marking as failed.`);
            await this.handleFailedPayment(payment, 'Payment abandoned or timed out');
        } else {
            this.logger.log(`Payment ${payment.id} is still in progress at gateway (status: ${gatewayPayment.status}). Will retry later.`);
        }
    }
  }

  private async handleSuccessfulPayment(payment: Payment): Promise<void> {
    payment.status = PaymentStatus.SUCCEEDED;
    await this.paymentRepository.save(payment);
    
    const event = new PaymentSucceededEvent({
        paymentId: payment.id,
        orderId: payment.orderId,
        amount: payment.amount,
        currency: payment.currency,
        gatewayTransactionId: payment.gatewayTransactionId,
        processedAt: new Date(),
    });

    await this.eventPublisher.publish('payment.succeeded', event);
  }

  private async handleFailedPayment(payment: Payment, reason: string): Promise<void> {
    payment.status = PaymentStatus.FAILED;
    await this.paymentRepository.save(payment);

    const event = new PaymentFailedEvent({
        paymentId: payment.id,
        orderId: payment.orderId,
        amount: payment.amount,
        currency: payment.currency,
        reason: reason,
        processedAt: new Date(),
    });

    await this.eventPublisher.publish('payment.failed', event);
  }
}

interface IOrderForCommission {
  id: string;
  vendorId: string;
  subtotal: number;
  currency: string;
}