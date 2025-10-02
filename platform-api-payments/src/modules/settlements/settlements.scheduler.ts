import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { SettlementsService } from './settlements.service';
import { ReconciliationService } from './reconciliation.service';

/**
 * Manages scheduled tasks related to financial settlements and reconciliation.
 * REQ-1-083, REQ-1-084: Triggers weekly settlements.
 * REQ-1-058: Triggers periodic payment reconciliation.
 */
@Injectable()
export class SettlementsScheduler {
  private readonly logger = new Logger(SettlementsScheduler.name);

  constructor(
    private readonly settlementsService: SettlementsService,
    private readonly reconciliationService: ReconciliationService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  @Cron(CronExpression.MONDAY_AT_2AM, {
    name: 'weekly-settlements',
    timeZone: 'Asia/Kolkata',
  })
  async handleWeeklySettlements(): Promise<void> {
    this.logger.log('Starting weekly settlement process...');
    const job = this.schedulerRegistry.getCronJob('weekly-settlements');

    // Basic lock to prevent concurrent runs if the job overruns its schedule.
    if (job.running) {
        this.logger.warn('Weekly settlement job is already running. Skipping this run.');
        return;
    }

    try {
      await this.settlementsService.processWeeklySettlements();
      this.logger.log('Weekly settlement process finished successfully.');
    } catch (error) {
      this.logger.error(
        `An unhandled error occurred during the weekly settlement process: ${error.message}`,
        error.stack,
      );
    }
  }

  @Cron(CronExpression.EVERY_5_MINUTES, {
    name: 'payment-reconciliation',
  })
  async handlePaymentReconciliation(): Promise<void> {
    this.logger.log('Starting payment reconciliation process...');
    const job = this.schedulerRegistry.getCronJob('payment-reconciliation');
    
    if (job.running) {
        this.logger.warn('Payment reconciliation job is already running. Skipping this run.');
        return;
    }

    try {
      await this.reconciliationService.reconcilePendingPayments();
      this.logger.log('Payment reconciliation process finished successfully.');
    } catch (error) {
      this.logger.error(
        `An unhandled error occurred during the payment reconciliation process: ${error.message}`,
        error.stack,
      );
    }
  }
}