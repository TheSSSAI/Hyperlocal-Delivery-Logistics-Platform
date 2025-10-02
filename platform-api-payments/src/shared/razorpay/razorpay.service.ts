import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Razorpay from 'razorpay';
import { Orders, Payments, Refunds, Subscriptions } from 'razorpay/dist/types/api';
import { PaymentGatewayException } from '../../modules/payments/exceptions/payment-gateway.exception';

// This is a simplified interface for RazorpayX Payouts.
// The official SDK might have more complex types.
interface RazorpayXPayoutRequest {
  account_number: string;
  fund_account_id: string;
  amount: number;
  currency: 'INR';
  mode: 'IMPS' | 'NEFT' | 'RTGS' | 'UPI';
  purpose: 'refund' | 'cashback' | 'payout' | 'salary';
  queue_if_low_balance?: boolean;
  reference_id?: string;
  narration?: string;
  notes?: Record<string, string | number>;
}

@Injectable()
export class RazorpayService {
  private readonly razorpay: Razorpay;
  private readonly webhookSecret: string;
  private readonly logger = new Logger(RazorpayService.name);

  constructor(@Inject(ConfigService) private readonly configService: ConfigService) {
    const keyId = this.configService.get<string>('razorpay.keyId');
    const keySecret = this.configService.get<string>('razorpay.keySecret');
    this.webhookSecret = this.configService.get<string>('razorpay.webhookSecret');

    if (!keyId || !keySecret || !this.webhookSecret) {
      this.logger.error('Razorpay keyId, keySecret, or webhookSecret is not configured.');
      throw new Error('Razorpay configuration is missing.');
    }

    this.razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }

  /**
   * Creates a Razorpay Order (Payment Intent).
   * @param options The order creation request body.
   * @returns The created Razorpay order.
   * @throws PaymentGatewayException on failure.
   */
  async createOrder(options: Orders.RazorpayOrderCreateRequestBody): Promise<Orders.RazorpayOrder> {
    try {
      this.logger.log(`Creating Razorpay order with amount: ${options.amount}`);
      const order = await this.razorpay.orders.create(options);
      this.logger.log(`Successfully created Razorpay order: ${order.id}`);
      return order;
    } catch (error) {
      this.logger.error(`Failed to create Razorpay order: ${error.message}`, error.stack);
      throw new PaymentGatewayException('Failed to create payment order with gateway.', error);
    }
  }

  /**
   * Validates the signature of an incoming webhook.
   * @param rawBody The raw request body as a string.
   * @param signature The value of the 'x-razorpay-signature' header.
   * @returns A boolean indicating if the signature is valid.
   */
  validateWebhookSignature(rawBody: string, signature: string): boolean {
    try {
      const isValid = Razorpay.validateWebhookSignature(rawBody, signature, this.webhookSecret);
      if (!isValid) {
        this.logger.warn('Received a webhook with an invalid signature.');
      }
      return isValid;
    } catch (error) {
      this.logger.error(`Error validating webhook signature: ${error.message}`, error.stack);
      return false;
    }
  }

  /**
   * Fetches payment details from Razorpay.
   * @param paymentId The Razorpay payment ID.
   * @returns The payment entity.
   * @throws PaymentGatewayException on failure.
   */
  async fetchPayment(paymentId: string): Promise<Payments.RazorpayPayment> {
    try {
      this.logger.log(`Fetching payment details for ID: ${paymentId}`);
      const payment = await this.razorpay.payments.fetch(paymentId);
      this.logger.log(`Successfully fetched payment details for ID: ${paymentId}`);
      return payment;
    } catch (error) {
      this.logger.error(`Failed to fetch payment details for ID ${paymentId}: ${error.message}`, error.stack);
      throw new PaymentGatewayException(`Failed to fetch payment details for ID ${paymentId}.`, error);
    }
  }

  /**
   * Captures a pre-authorized payment.
   * @param paymentId The Razorpay payment ID.
   * @param amount The amount to capture (in smallest currency unit).
   * @param currency The currency.
   * @returns The captured payment entity.
   * @throws PaymentGatewayException on failure.
   */
  async capturePayment(paymentId: string, amount: number, currency: string): Promise<Payments.RazorpayPayment> {
    try {
      this.logger.log(`Capturing payment for ID: ${paymentId} with amount: ${amount}`);
      const payment = await this.razorpay.payments.capture(paymentId, amount, currency);
      this.logger.log(`Successfully captured payment for ID: ${paymentId}`);
      return payment;
    } catch (error) {
      this.logger.error(`Failed to capture payment for ID ${paymentId}: ${error.message}`, error.stack);
      throw new PaymentGatewayException(`Failed to capture payment for ID ${paymentId}.`, error);
    }
  }

  /**
   * Initiates a full or partial refund for a payment.
   * @param paymentId The Razorpay payment ID to refund.
   * @param options Refund options, including amount.
   * @returns The created refund entity.
   * @throws PaymentGatewayException on failure.
   */
  async refundPayment(paymentId: string, options: Refunds.RazorpayRefundCreateRequestBody): Promise<Refunds.RazorpayRefund> {
    try {
      this.logger.log(`Initiating refund for payment ID: ${paymentId} with amount: ${options.amount || 'full'}`);
      const refund = await this.razorpay.payments.refund(paymentId, options);
      this.logger.log(`Successfully initiated refund for payment ID ${paymentId}. Refund ID: ${refund.id}`);
      return refund;
    } catch (error) {
      this.logger.error(`Failed to initiate refund for payment ID ${paymentId}: ${error.message}`, error.stack);
      throw new PaymentGatewayException(`Failed to initiate refund for payment ID ${paymentId}.`, error);
    }
  }

  /**
   * Initiates a payout using RazorpayX.
   * NOTE: The standard 'razorpay' package might not directly support RazorpayX Payouts.
   * This method assumes an API structure that could be called via a generic HTTP client
   * or a dedicated RazorpayX SDK if available. For this implementation, we simulate
   * the structure of a payout call.
   * @param payoutData The payout request data.
   * @returns The response from the payout API.
   * @throws PaymentGatewayException on failure.
   */
  async initiatePayout(payoutData: RazorpayXPayoutRequest): Promise<any> {
    // In a real-world scenario, you would use the RazorpayX SDK or make a direct API call.
    // The 'razorpay' package is primarily for the payment gateway.
    // this.razorpay.payouts.create(...) - This is a hypothetical method call.
    try {
      this.logger.log(`Initiating RazorpayX payout for fund account: ${payoutData.fund_account_id} with amount: ${payoutData.amount}`);
      // This is a placeholder for the actual SDK call which might be different.
      const payout = await (this.razorpay as any).payouts.create(payoutData);
      this.logger.log(`Successfully initiated payout. Payout ID: ${payout.id}`);
      return payout;
    } catch (error) {
      this.logger.error(`Failed to initiate RazorpayX payout: ${error.message}`, error.stack);
      throw new PaymentGatewayException('Failed to initiate payout with gateway.', error);
    }
  }
}