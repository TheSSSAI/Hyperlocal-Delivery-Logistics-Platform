import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { FinancialTransaction } from '../entities/financial-transaction.entity';

/**
 * @description A repository for managing data access to the `financial_transaction` table.
 * This class encapsulates all database query logic for financial transactions,
 * providing a clean API for the service layer. It follows the custom repository
 * pattern for TypeORM.
 * @see REQ-1-082 for the double-entry ledger principle this repository supports.
 */
@Injectable()
export class FinancialTransactionRepository extends Repository<FinancialTransaction> {
  constructor(private dataSource: DataSource) {
    super(FinancialTransaction, dataSource.createEntityManager());
  }

  /**
   * Creates and saves a new financial transaction. This is the primary method
   * for writing to the immutable ledger.
   * @param transactionData - The data for the new transaction.
   * @returns The saved FinancialTransaction entity.
   */
  async createTransaction(
    transactionData: Partial<FinancialTransaction>,
  ): Promise<FinancialTransaction> {
    const newTransaction = this.create(transactionData);
    return this.save(newTransaction);
  }

  /**
   * Finds a transaction by its idempotency key to prevent duplicate entries.
   * @param idempotencyKey - The unique key associated with the transaction.
   * @returns A FinancialTransaction entity if found, otherwise null.
   */
  async findTransactionByIdempotencyKey(
    idempotencyKey: string,
  ): Promise<FinancialTransaction | null> {
    return this.findOne({ where: { idempotencyKey } });
  }

  /**
   * Calculates the current balance for a specific ledger account.
   * It does this by summing all credits and subtracting all debits for the account.
   * @param account - The full ledger account name (e.g., 'platform:commission:revenue').
   * @returns The calculated balance in the smallest currency unit (e.g., paise).
   */
  async getAccountBalance(account: string): Promise<number> {
    const result = await this.createQueryBuilder('ft')
      .select(
        'COALESCE(SUM(CASE WHEN ft.creditAccount = :account THEN ft.amount ELSE 0 END), 0) - COALESCE(SUM(CASE WHEN ft.debitAccount = :account THEN ft.amount ELSE 0 END), 0)',
        'balance',
      )
      .where('ft.creditAccount = :account OR ft.debitAccount = :account', {
        account,
      })
      .getRawOne();

    return parseInt(result.balance, 10) || 0;
  }

  /**
   * Calculates the net balance for a specific user (vendor or rider) within a given period.
   * This is a critical query for the weekly settlement process.
   * For vendors, it calculates: SUM(sales revenue) - SUM(commissions).
   * For riders, it calculates: SUM(earnings) - SUM(COD collected).
   * @param userType - The type of user, 'vendor' or 'rider'.
   * @param userId - The UUID of the user.
   * @param period - An object with `start` and `end` Date objects for the settlement period.
   * @returns The net balance in the smallest currency unit (e.g., paise).
   * @see REQ-1-083, REQ-1-084
   */
  async calculateUserNetBalanceForPeriod(
    userType: 'vendor' | 'rider',
    userId: string,
    period: { start: Date; end: Date },
  ): Promise<number> {
    const creditAccountPattern = `${userType}:${userId}:%`;
    const debitAccountPattern = `${userType}:${userId}:%`;

    const result = await this.createQueryBuilder('ft')
      .select(
        'COALESCE(SUM(CASE WHEN ft.creditAccount LIKE :creditAccountPattern THEN ft.amount ELSE 0 END), 0) - COALESCE(SUM(CASE WHEN ft.debitAccount LIKE :debitAccountPattern THEN ft.amount ELSE 0 END), 0)',
        'netBalance',
      )
      .where('ft.createdAt >= :start AND ft.createdAt <= :end', {
        start: period.start,
        end: period.end,
      })
      .andWhere(
        '(ft.creditAccount LIKE :creditAccountPattern OR ft.debitAccount LIKE :debitAccountPattern)',
        { creditAccountPattern, debitAccountPattern },
      )
      .getRawOne();

    return parseInt(result.netBalance, 10) || 0;
  }

  /**
   * Fetches all transactions for a user within a specified period.
   * Useful for generating financial statements.
   * @param userType - The type of user, 'vendor' or 'rider'.
   * @param userId - The UUID of the user.
   * @param period - An object with `start` and `end` Date objects.
   * @returns An array of FinancialTransaction entities.
   */
  async getTransactionsForUserInPeriod(
    userType: 'vendor' | 'rider',
    userId: string,
    period: { start: Date; end: Date },
  ): Promise<FinancialTransaction[]> {
    const creditAccountPattern = `${userType}:${userId}:%`;
    const debitAccountPattern = `${userType}:${userId}:%`;

    return this.createQueryBuilder('ft')
      .where('ft.createdAt >= :start AND ft.createdAt <= :end', {
        start: period.start,
        end: period.end,
      })
      .andWhere(
        '(ft.creditAccount LIKE :creditAccountPattern OR ft.debitAccount LIKE :debitAccountPattern)',
        { creditAccountPattern, debitAccountPattern },
      )
      .orderBy('ft.createdAt', 'ASC')
      .getMany();
  }
}