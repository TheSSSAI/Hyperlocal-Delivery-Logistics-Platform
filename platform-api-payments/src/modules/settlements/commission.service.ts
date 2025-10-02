import { Injectable, Logger, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { LedgerService } from '../ledger/ledger.service';
import { AppConfig } from '../../config/app.config';
import { IOrderForCommission } from './interfaces/order-for-commission.interface';
import { Account, AccountType, EntityType } from '../ledger/enums/account.enum';

@Injectable()
export class CommissionService {
  private readonly logger = new Logger(CommissionService.name);

  constructor(
    private readonly ledgerService: LedgerService,
    // @Inject('VENDOR_API_CLIENT') private readonly vendorApiClient: IVendorApiClient, // Assuming this exists for REQ-1-033
    @Inject(AppConfig.KEY)
    private readonly appConfig: ConfigType<typeof AppConfig>,
  ) {}

  /**
   * Calculates and records the platform commission for a delivered order.
   * This is triggered by an 'OrderDelivered' event.
   * @param order - The order details required for commission calculation.
   */
  async calculateAndRecordCommission(order: IOrderForCommission): Promise<void> {
    this.logger.log(`Calculating commission for order ${order.id}`);

    try {
      // Per REQ-1-033, fetch the commission rate respecting the hierarchy.
      // This is a placeholder for a future API call to a Vendor service.
      const commissionRate = await this.getCommissionRateForVendor(order.vendorId);
      
      // Calculations should be done in the smallest currency unit to avoid floating point issues.
      // Assuming order.subtotal is already in the smallest unit (e.g., paise).
      const commissionAmount = Math.round(order.subtotal * (commissionRate / 100));

      if (commissionAmount <= 0) {
        this.logger.log(`Commission for order ${order.id} is zero or less. Skipping ledger entry.`);
        return;
      }
      
      const vendorPayableAccount = `${AccountType.PAYABLE}:${EntityType.VENDOR}:${order.vendorId}`;
      const platformCommissionAccount = `${Account.PLATFORM_COMMISSION_REVENUE}`;

      // This transaction records that a portion of the vendor's earnings is now owed to the platform as commission.
      // The initial sale would have credited the full subtotal to the vendor's payable account.
      // This transaction corrects it by moving the commission part to the platform's revenue account.
      await this.ledgerService.recordTransaction({
        debit: {
          account: vendorPayableAccount,
          amount: commissionAmount,
          memo: `Commission for order ${order.id}`,
        },
        credit: {
          account: platformCommissionAccount,
          amount: commissionAmount,
          memo: `Commission earned from order ${order.id}`,
        },
        currency: order.currency,
        relatedEntityType: 'Order',
        relatedEntityId: order.id,
        idempotencyKey: `commission-${order.id}`,
        metadata: {
          orderId: order.id,
          orderSubtotal: order.subtotal,
          commissionRate: commissionRate,
          calculatedCommission: commissionAmount,
        },
      });

      this.logger.log(`Successfully recorded ${commissionAmount} ${order.currency} commission for order ${order.id}`);

    } catch (error) {
      this.logger.error(`Failed to calculate and record commission for order ${order.id}: ${error.message}`, error.stack);
      // Depending on the event consumer's setup, throwing here might cause a retry.
      throw error;
    }
  }

  /**
   * Fetches the applicable commission rate for a vendor.
   * This method implements the hierarchy: vendor-specific > category-specific > default.
   * @param vendorId - The ID of the vendor.
   * @returns The applicable commission rate as a percentage.
   * 
   * @private This is a placeholder. In a real microservice architecture, this would
   * call an external Vendor service API.
   */
  private async getCommissionRateForVendor(vendorId: string): Promise<number> {
    // In a real system, this would be:
    // try {
    //   const rate = await this.vendorApiClient.getCommissionRate(vendorId);
    //   return rate;
    // } catch (error) {
    //   this.logger.warn(`Could not fetch custom commission rate for vendor ${vendorId}. Falling back to default.`);
    //   return this.appConfig.defaultCommissionRate;
    // }

    this.logger.log(`Using default commission rate for vendor ${vendorId}. Custom rate fetching is not implemented.`);
    return this.appConfig.defaultCommissionRate;
  }
}