import { Injectable, Logger } from '@nestjs/common';
import { PayoutRepository } from '../../database/repositories/payout.repository';
import { FinancialTransactionRepository } from '../../database/repositories/financial-transaction.repository';
import { LedgerService } from '../ledger/ledger.service';
import { CommissionService } from './commission.service';
import { RazorpayService } from '../../shared/razorpay/razorpay.service';
import { EventPublisher } from '../../shared/messaging/event.publisher';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Payout } from '../../database/entities/payout.entity';
import { PayoutStatus } from '../../database/enums/payout-status.enum';
import { PayoutProcessedEvent } from '@platform-contracts/events';
import { ConfigService } from '@nestjs/config';

// DTOs for internal API calls - In a real scenario, these would come from a shared library
interface UserBankDetailsDto {
    accountNumber: string;
    ifscCode: string;
    beneficiaryName: string;
}

interface UserDto {
    id: string;
    userType: 'vendor' | 'rider';
}

@Injectable()
export class SettlementsService {
    private readonly logger = new Logger(SettlementsService.name);
    private readonly BATCH_SIZE = 100;

    // These URLs would be in config
    private readonly VENDOR_API_URL = 'http://platform-api-vendor/internal/active-vendors';
    private readonly RIDER_API_URL = 'http://platform-api-rider/internal/active-riders';
    private readonly IDENTITY_API_URL = 'http://platform-api-ident/internal/users';

    constructor(
        private readonly payoutRepository: PayoutRepository,
        private readonly financialTransactionRepository: FinancialTransactionRepository,
        private readonly ledgerService: LedgerService,
        private readonly razorpayService: RazorpayService,
        private readonly eventPublisher: EventPublisher,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {}

    /**
     * Main entry point for the weekly settlement job.
     * Fetches all active users and processes their settlements in batches.
     * REQ-1-083, REQ-1-084, REQ-1-085, REQ-1-034
     */
    async processWeeklySettlements(period: { start: Date; end: Date }): Promise<void> {
        this.logger.log(`Starting weekly settlement process for period: ${period.start.toISOString()} - ${period.end.toISOString()}`);
        
        try {
            const usersToSettle = await this.fetchAllActiveUsers();
            this.logger.log(`Found ${usersToSettle.length} active users to process for settlement.`);

            for (let i = 0; i < usersToSettle.length; i += this.BATCH_SIZE) {
                const batch = usersToSettle.slice(i, i + this.BATCH_SIZE);
                this.logger.log(`Processing batch ${i / this.BATCH_SIZE + 1} with ${batch.length} users.`);
                await Promise.all(batch.map(user => this._processSettlementForUser(user, period)));
            }

            this.logger.log('Weekly settlement process finished.');
        } catch (error) {
            this.logger.error('A critical error occurred during the settlement process.', error.stack);
        }
    }

    private async _processSettlementForUser(user: UserDto, period: { start: Date; end: Date }): Promise<void> {
        this.logger.log(`Calculating settlement for user ${user.id} (${user.userType})`);
        
        // Idempotency Check: See if a payout for this user/period has already been initiated.
        const existingPayout = await this.payoutRepository.findOne({ where: { userId: user.id, settlementPeriodStart: period.start }});
        if (existingPayout && existingPayout.status !== PayoutStatus.FAILED) {
            this.logger.warn(`Settlement for user ${user.id} for this period already processed or pending. Skipping.`);
            return;
        }

        try {
            const netBalance = await this.calculateUserNetBalance(user, period);

            if (netBalance <= 10000) { // Minimum payout amount is 100 INR (10000 paise)
                this.logger.log(`User ${user.id} has a net balance of ${netBalance / 100}, which is below the minimum payout threshold. Skipping.`);
                return;
            }

            const bankDetails = await this.fetchUserBankDetails(user.id);

            const payout = this.payoutRepository.create({
                userId: user.id,
                amount: netBalance,
                status: PayoutStatus.PENDING,
                currency: 'INR',
                settlementPeriodStart: period.start,
                settlementPeriodEnd: period.end,
            });
            await this.payoutRepository.save(payout);

            // TODO: Implement RazorpayX contact and fund account creation if not exists.
            // For now, assuming fund account exists.
            
            const payoutResponse = await this.razorpayService.initiatePayout({
                fund_account_id: 'acc_id_placeholder', // This should be fetched/created via RazorpayX contacts API
                amount: netBalance,
                currency: 'INR',
                mode: 'IMPS',
                purpose: 'payout',
                queue_if_low_balance: true,
                reference_id: `payout-${payout.id}`,
            });

            payout.status = PayoutStatus.PROCESSING;
            payout.payoutGatewayTransactionId = payoutResponse.id;
            await this.payoutRepository.save(payout);
            
            this.logger.log(`Payout ${payout.id} for user ${user.id} initiated successfully via RazorpayX. Gateway ID: ${payoutResponse.id}`);
            
            // Note: We don't record the ledger transaction until webhook confirmation of success to maintain ledger integrity.
            // Webhook handler for `payout.processed` will complete the flow.
            
        } catch (error) {
            this.logger.error(`Failed to process settlement for user ${user.id}. Error: ${error.message}`, error.stack);
            
            if (existingPayout) {
                 existingPayout.status = PayoutStatus.FAILED;
                 existingPayout.notes = error.message;
                 await this.payoutRepository.save(existingPayout);
            }
            // TODO: Alerting for failed payouts
        }
    }

    private async calculateUserNetBalance(user: UserDto, period: { start: Date; end: Date }): Promise<number> {
        if (user.userType === 'vendor') {
            const vendorRevenueAccount = `vendor:${user.id}:revenue`;
            const vendorCommissionAccount = `vendor:${user.id}:commission`;
            
            const totalRevenue = await this.ledgerService.getAccountBalanceForPeriod(vendorRevenueAccount, period);
            const totalCommission = await this.ledgerService.getAccountBalanceForPeriod(vendorCommissionAccount, period);
            
            return totalRevenue - totalCommission;
        } else if (user.userType === 'rider') {
            const riderEarningsAccount = `rider:${user.id}:earnings`;
            const riderCodAccount = `rider:${user.id}:cod`;

            const totalEarnings = await this.ledgerService.getAccountBalanceForPeriod(riderEarningsAccount, period);
            const totalCodCollected = await this.ledgerService.getAccountBalanceForPeriod(riderCodAccount, period);

            return totalEarnings - totalCodCollected;
        }
        return 0;
    }

    private async fetchAllActiveUsers(): Promise<UserDto[]> {
        try {
            const [vendorsResponse, ridersResponse] = await Promise.all([
                firstValueFrom(this.httpService.get<UserDto[]>(this.VENDOR_API_URL)),
                firstValueFrom(this.httpService.get<UserDto[]>(this.RIDER_API_URL))
            ]);

            const vendors = vendorsResponse.data.map(v => ({...v, userType: 'vendor' as const}));
            const riders = ridersResponse.data.map(r => ({...r, userType: 'rider' as const}));
            
            return [...vendors, ...riders];
        } catch (error) {
            this.logger.error('Failed to fetch active users from internal APIs', error.stack);
            throw new Error('Could not fetch active users for settlement.');
        }
    }

    private async fetchUserBankDetails(userId: string): Promise<UserBankDetailsDto> {
         try {
            const response = await firstValueFrom(this.httpService.get<UserBankDetailsDto>(`${this.IDENTITY_API_URL}/${userId}/bank-details`));
            if (!response.data?.accountNumber) {
                throw new Error('Bank details are incomplete.');
            }
            return response.data;
        } catch (error) {
            this.logger.error(`Failed to fetch bank details for user ${userId}`, error.stack);
            throw new Error(`Bank details not found or invalid for user ${userId}.`);
        }
    }
}