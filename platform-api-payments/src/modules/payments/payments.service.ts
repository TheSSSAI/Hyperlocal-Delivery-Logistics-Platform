import { Injectable, Logger, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentRepository } from '../../database/repositories/payment.repository';
import { RazorpayService } from '../../shared/razorpay/razorpay.service';
import { EventPublisher } from '../../shared/messaging/event.publisher';
import { LedgerService } from '../ledger/ledger.service';
import { CreatePaymentIntentDto } from './dtos/create-payment-intent.dto';
import { PaymentIntentResponseDto } from './dtos/payment-intent-response.dto';
import { Payment } from '../../database/entities/payment.entity';
import { PaymentStatus } from '../../database/enums/payment-status.enum';
import { OrderCancelledEvent, OrderPlacedEvent, PaymentFailedEvent, PaymentSucceededEvent, RefundProcessedEvent } from '@platform-contracts/events';
import { In } from 'typeorm';

@Injectable()
export class PaymentsService {
    private readonly logger = new Logger(PaymentsService.name);
    private readonly currency: string;

    constructor(
        private readonly paymentRepository: PaymentRepository,
        private readonly razorpayService: RazorpayService,
        private readonly eventPublisher: EventPublisher,
        private readonly ledgerService: LedgerService,
        private readonly configService: ConfigService,
    ) {
        this.currency = this.configService.get<string>('app.currency', 'INR');
    }

    /**
     * Creates a payment intent with Razorpay.
     * This is the first step in the payment Saga for an order.
     * REQ-1-090, REQ-1-105
     */
    async createPaymentIntent(createPaymentIntentDto: CreatePaymentIntentDto): Promise<PaymentIntentResponseDto> {
        this.logger.log(`Creating payment intent for orderId: ${createPaymentIntentDto.orderId}`);

        const existingPayment = await this.paymentRepository.findOne({
            where: {
                orderId: createPaymentIntentDto.orderId,
                status: In([PaymentStatus.PENDING, PaymentStatus.SUCCEEDED]),
            }
        });

        if (existingPayment) {
            this.logger.warn(`An active or successful payment intent already exists for orderId: ${createPaymentIntentDto.orderId}`);
            if (existingPayment.gatewayTransactionId) {
                 return new PaymentIntentResponseDto(
                    existingPayment.gatewayTransactionId, 
                    this.razorpayService.getKeyId()
                );
            }
        }

        const payment = this.paymentRepository.create({
            orderId: createPaymentIntentDto.orderId,
            amount: createPaymentIntentDto.amount,
            currency: this.currency,
            status: PaymentStatus.PENDING,
        });
        await this.paymentRepository.save(payment);

        try {
            const razorpayOrder = await this.razorpayService.createOrder({
                amount: payment.amount,
                currency: payment.currency,
                receipt: payment.orderId, // Using orderId as receipt
            });

            payment.gatewayTransactionId = razorpayOrder.id;
            await this.paymentRepository.save(payment);

            this.logger.log(`Successfully created Razorpay order ${razorpayOrder.id} for our order ${payment.orderId}`);

            return new PaymentIntentResponseDto(
                razorpayOrder.id,
                this.razorpayService.getKeyId()
            );

        } catch (error) {
            this.logger.error(`Failed to create Razorpay order for orderId: ${createPaymentIntentDto.orderId}`, error.stack);
            payment.status = PaymentStatus.FAILED;
            await this.paymentRepository.save(payment);
            // Optionally publish a PaymentFailedEvent here if the Saga needs to compensate immediately
            throw new BadRequestException('Could not initiate payment with the payment gateway.');
        }
    }

    /**
     * Handles incoming webhooks from Razorpay.
     * This is typically called from a controller after a guard validates the webhook signature.
     * REQ-1-090, REQ-1-057
     */
    async handlePaymentWebhook(payload: any): Promise<void> {
        const eventType = payload.event;
        const paymentEntity = payload.payload.payment.entity;
        const gatewayTransactionId = paymentEntity.order_id;

        if (!gatewayTransactionId) {
            this.logger.warn(`Webhook received without an order_id. Payload: ${JSON.stringify(payload)}`);
            return;
        }

        const payment = await this.paymentRepository.findOne({ where: { gatewayTransactionId } });

        if (!payment) {
            this.logger.error(`Received webhook for an unknown gatewayTransactionId: ${gatewayTransactionId}`);
            // This might warrant an alert for investigation.
            return;
        }

        // Idempotency check
        if (payment.status === PaymentStatus.SUCCEEDED || payment.status === PaymentStatus.FAILED) {
            this.logger.log(`Payment ${payment.id} already in a terminal state (${payment.status}). Ignoring webhook.`);
            return;
        }

        switch (eventType) {
            case 'payment.captured':
                await this.handleSuccessfulPayment(payment, paymentEntity);
                break;
            case 'payment.failed':
                await this.handleFailedPayment(payment, paymentEntity);
                break;
            default:
                this.logger.log(`Received unhandled Razorpay event type: ${eventType}`);
                break;
        }
    }

    /**
     * Initiates a refund for a given order.
     * Triggered by consuming an OrderCancelledEvent.
     * REQ-1-031, REQ-1-032
     */
    public async initiateRefund(orderId: string, amountToRefund: number, reason: string): Promise<void> {
        this.logger.log(`Initiating refund for orderId: ${orderId} with amount: ${amountToRefund}`);
        
        const payment = await this.paymentRepository.findOne({
            where: { orderId, status: PaymentStatus.SUCCEEDED }
        });

        if (!payment) {
            this.logger.error(`Cannot process refund. No successful payment found for orderId: ${orderId}`);
            // Potentially raise an alert for manual investigation
            throw new NotFoundException(`No successful payment found for order ${orderId} to refund.`);
        }

        if (payment.status !== PaymentStatus.SUCCEEDED) {
             this.logger.warn(`Attempted to refund a payment for order ${orderId} that was not successful. Status: ${payment.status}`);
             return; // Or throw an error depending on business rules
        }

        try {
            const refund = await this.razorpayService.initiateRefund(payment.gatewayPaymentId, amountToRefund);
            this.logger.log(`Successfully initiated refund ${refund.id} via Razorpay for order ${orderId}.`);
            
            // Record refund in the ledger
            await this.ledgerService.recordTransaction({
                debitAccount: 'platform:revenue', // Or more specific account
                creditAccount: `customer:${payment.orderId}:refunds`, // A placeholder account for customer refunds
                amount: amountToRefund,
                currency: this.currency,
                memo: `Refund for order ${orderId}. Reason: ${reason}`,
                relatedEntity: { type: 'Order', id: orderId },
                idempotencyKey: `refund-${orderId}-${refund.id}`,
            });

            const refundEvent = new RefundProcessedEvent({
                orderId,
                refundId: refund.id,
                amount: amountToRefund,
                processedAt: new Date(),
            });

            await this.eventPublisher.publish(refundEvent);

        } catch (error) {
            this.logger.error(`Failed to process refund for orderId: ${orderId}. Error: ${error.message}`, error.stack);
            // This is critical. We need to alert operations to handle this manually.
            // TODO: Add alerting mechanism
            throw new BadRequestException(`Failed to process refund for order ${orderId}.`);
        }
    }


    private async handleSuccessfulPayment(payment: Payment, paymentEntity: any): Promise<void> {
        this.logger.log(`Processing successful payment for orderId: ${payment.orderId}`);
        payment.status = PaymentStatus.SUCCEEDED;
        payment.gatewayPaymentId = paymentEntity.id; // This is the payment_id, not order_id
        payment.webhookPayload = paymentEntity;
        
        await this.paymentRepository.save(payment);

        const event = new PaymentSucceededEvent({
            orderId: payment.orderId,
            paymentId: payment.id,
            gatewayPaymentId: payment.gatewayPaymentId,
            amount: payment.amount,
            paidAt: new Date(paymentEntity.created_at * 1000),
        });

        await this.eventPublisher.publish(event);
        this.logger.log(`Published PaymentSucceededEvent for orderId: ${payment.orderId}`);
    }

    private async handleFailedPayment(payment: Payment, paymentEntity: any): Promise<void> {
        this.logger.warn(`Processing failed payment for orderId: ${payment.orderId}`);
        payment.status = PaymentStatus.FAILED;
        payment.gatewayPaymentId = paymentEntity.id;
        payment.webhookPayload = paymentEntity;

        await this.paymentRepository.save(payment);
        
        const event = new PaymentFailedEvent({
            orderId: payment.orderId,
            paymentId: payment.id,
            gatewayPaymentId: payment.gatewayPaymentId,
            reason: paymentEntity.error_description || 'Payment failed at the gateway.',
            failedAt: new Date(),
        });

        await this.eventPublisher.publish(event);
        this.logger.warn(`Published PaymentFailedEvent for orderId: ${payment.orderId}`);
    }
}