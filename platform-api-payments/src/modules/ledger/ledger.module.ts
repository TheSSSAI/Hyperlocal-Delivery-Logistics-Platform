import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialTransaction } from '../../database/entities/financial-transaction.entity';
import { FinancialTransactionRepository } from '../../database/repositories/financial-transaction.repository';
import { LedgerService } from './ledger.service';

/**
 * @class LedgerModule
 * @description Encapsulates the core domain of the immutable double-entry ledger.
 * This module provides the LedgerService, which is the sole entry point for
 * recording financial transactions, ensuring all monetary movements are atomic
 * and adhere to accounting principles as per REQ-1-082.
 * It exports the LedgerService so that other modules (Payments, Settlements)
 * can record transactions without needing to know the underlying implementation.
 */
@Module({
  imports: [TypeOrmModule.forFeature([FinancialTransaction])],
  providers: [LedgerService, FinancialTransactionRepository],
  exports: [LedgerService],
})
export class LedgerModule {}