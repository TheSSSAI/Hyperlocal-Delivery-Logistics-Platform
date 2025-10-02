import { Injectable, Logger, InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { FinancialTransaction } from '../../database/entities/financial-transaction.entity';
import { TransactionType } from '../../database/enums/transaction-type.enum';

interface TransactionEntry {
  account: string;
  amount: number;
  memo: string;
  metadata?: Record<string, any>;
}

interface RecordTransactionParams {
  debit: TransactionEntry;
  credit: TransactionEntry;
  currency: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  idempotencyKey: string;
}

@Injectable()
export class LedgerService {
  private readonly logger = new Logger(LedgerService.name);

  constructor(
    @InjectRepository(FinancialTransaction)
    private readonly financialTransactionRepository: Repository<FinancialTransaction>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Records a balanced, double-entry financial transaction. This is the core method for writing to the ledger.
   * It ensures that for every debit, there is a corresponding credit, and the operation is atomic.
   * @param params - The parameters for the transaction.
   * @throws {UnprocessableEntityException} if the debit and credit amounts do not match.
   * @throws {InternalServerErrorException} if the database transaction fails.
   */
  async recordTransaction(params: RecordTransactionParams): Promise<void> {
    const { debit, credit, currency, relatedEntityType, relatedEntityId, idempotencyKey } = params;

    if (debit.amount !== credit.amount) {
      this.logger.error('Debit and Credit amounts do not match.', { idempotencyKey, debit, credit });
      throw new UnprocessableEntityException('Debit and Credit amounts must be equal for a balanced transaction.');
    }
    
    if (debit.amount <= 0) {
        this.logger.error('Transaction amount must be positive.', { idempotencyKey, amount: debit.amount });
        throw new UnprocessableEntityException('Transaction amount must be a positive number.');
    }

    await this.dataSource.transaction(async (manager: EntityManager) => {
      try {
        const existingTransaction = await manager.findOneBy(FinancialTransaction, { idempotencyKey });
        if (existingTransaction) {
          this.logger.warn(`Attempted to record a duplicate transaction with idempotency key: ${idempotencyKey}`);
          return; // Idempotency check passed, do nothing.
        }

        const debitTransaction = manager.create(FinancialTransaction, {
          debitAccount: debit.account,
          creditAccount: null,
          amount: debit.amount,
          currency,
          transactionType: TransactionType.DEBIT,
          memo: debit.memo,
          relatedEntityType,
          relatedEntityId,
          idempotencyKey: `${idempotencyKey}-D`, // Make idempotency key unique for the entry
          metadata: debit.metadata,
        });

        const creditTransaction = manager.create(FinancialTransaction, {
          debitAccount: null,
          creditAccount: credit.account,
          amount: credit.amount,
          currency,
          transactionType: TransactionType.CREDIT,
          memo: credit.memo,
          relatedEntityType,
          relatedEntityId,
          idempotencyKey: `${idempotencyKey}-C`, // Make idempotency key unique for the entry
          metadata: credit.metadata,
        });
        
        // This transaction is a simplified representation. For a true double entry system,
        // we might create two rows or a single row with both accounts. Two rows is more standard.
        await manager.save([debitTransaction, creditTransaction]);

        this.logger.log(`Successfully recorded transaction: ${idempotencyKey}`);

      } catch (error) {
        this.logger.error(`Failed to record transaction for idempotency key ${idempotencyKey}: ${error.message}`, error.stack);
        // This will automatically roll back the transaction
        throw new InternalServerErrorException('Failed to record financial transaction.');
      }
    });
  }

  /**
   * Calculates the current balance for a specific ledger account.
   * @param account - The full account name (e.g., 'payable:vendor:uuid').
   * @returns The balance in the smallest currency unit (e.g., paise).
   */
  async getAccountBalance(account: string): Promise<number> {
    const credits = await this.financialTransactionRepository
      .createQueryBuilder('ft')
      .select('SUM(ft.amount)', 'total')
      .where('ft.creditAccount = :account', { account })
      .getRawOne();
    
    const debits = await this.financialTransactionRepository
      .createQueryBuilder('ft')
      .select('SUM(ft.amount)', 'total')
      .where('ft.debitAccount = :account', { account })
      .getRawOne();

    const totalCredits = parseInt(credits.total, 10) || 0;
    const totalDebits = parseInt(debits.total, 10) || 0;
    
    return totalCredits - totalDebits;
  }
}