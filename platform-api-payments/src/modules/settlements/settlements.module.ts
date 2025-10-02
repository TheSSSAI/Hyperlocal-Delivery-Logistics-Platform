import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payout } from '../../database/entities/payout.entity';
import { PayoutRepository } from '../../database/repositories/payout.repository';
import { FinancialTransaction } from '../../database/entities/financial-transaction.entity';
import { FinancialTransactionRepository } from '../../database/repositories/financial-transaction.repository';
import { SettlementsService } from './settlements.service';
import { CommissionService } from './commission.service';
import { ReconciliationService } from './reconciliation.service';
import { SettlementsScheduler } from './settlements.scheduler';
import { LedgerModule } from '../ledger/ledger.module';
import { RazorpayModule } from '../../shared/razorpay/razorpay.module';
import { MessagingModule } from '../../shared/messaging/messaging.module';
import { PaymentRepository } from '../../database/repositories/payment.repository';
import { Payment } from '../../database/entities/payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payout, FinancialTransaction, Payment]),
    LedgerModule,
    RazorpayModule.forRootAsync(),
    MessagingModule,
  ],
  providers: [
    SettlementsService,
    CommissionService,
    ReconciliationService,
    SettlementsScheduler,
    PayoutRepository,
    FinancialTransactionRepository,
    PaymentRepository,
  ],
  exports: [SettlementsService, CommissionService, ReconciliationService],
})
export class SettlementsModule {}