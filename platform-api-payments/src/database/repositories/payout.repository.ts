import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository, FindOptionsWhere, In } from 'typeorm';
import { Payout } from '../entities/payout.entity';
import { PayoutStatus } from '../enums/payout-status.enum';

/**
 * @class PayoutRepository
 * @description A custom repository for handling all data access logic for the Payout entity.
 * This is used by the settlements service to manage weekly disbursements to vendors and riders.
 */
@Injectable()
export class PayoutRepository extends Repository<Payout> {
  private readonly logger = new Logger(PayoutRepository.name);

  constructor(private dataSource: DataSource) {
    super(Payout, dataSource.createEntityManager());
  }

  /**
   * Creates and persists a new Payout record.
   * @param {Partial<Payout>} payoutData - The data for the new payout.
   * @returns {Promise<Payout>} The newly created Payout entity.
   */
  async createPayout(payoutData: Partial<Payout>): Promise<Payout> {
    const payout = this.create(payoutData);
    return this.save(payout);
  }

  /**
   * Finds a payout by its unique ID.
   * @param {string} id - The UUID of the payout.
   * @returns {Promise<Payout | null>} The found Payout entity or null.
   */
  async findById(id: string): Promise<Payout | null> {
    return this.findOneBy({ id });
  }

  /**
   * Updates the status of a specific payout after an attempt to process it via the gateway.
   * This method is critical for logging the outcome of settlement jobs as per REQ-1-085.
   *
   * @param {string} id - The ID of the payout to update.
   * @param {PayoutStatus} status - The new status of the payout (e.g., SUCCEEDED, FAILED).
   * @param {string} [gatewayTransactionId] - The transaction ID from the payout gateway (e.g., RazorpayX).
   * @param {string} [failureReason] - The reason for failure, if any, returned by the gateway.
   * @returns {Promise<Payout>} The updated Payout entity.
   */
  async updatePayoutStatus(
    id: string,
    status: PayoutStatus,
    gatewayTransactionId?: string,
    failureReason?: string,
  ): Promise<Payout> {
    const payout = await this.findById(id);
    if (!payout) {
      this.logger.error(`Payout with ID ${id} not found for status update.`);
      throw new Error(`Payout with ID ${id} not found.`);
    }

    payout.status = status;
    if (gatewayTransactionId) {
      payout.payoutGatewayTransactionId = gatewayTransactionId;
    }
    if (failureReason) {
      payout.failureReason = failureReason;
    }
    payout.processedAt = new Date();

    return this.save(payout);
  }

  /**
   * Finds all payouts for a given user within a specified settlement period.
   * This can be used to check if a payout for a user in a specific period has already been created,
   * ensuring idempotency of the settlement job.
   *
   * @param {string} userId - The ID of the vendor or rider.
   * @param {Date} periodStart - The start date of the settlement period.
   * @param {Date} periodEnd - The end date of the settlement period.
   * @returns {Promise<Payout[]>} An array of Payout entities for the user in that period.
   */
  async findPayoutsForUserInPeriod(
    userId: string,
    periodStart: Date,
    periodEnd: Date,
  ): Promise<Payout[]> {
    return this.createQueryBuilder('payout')
      .where('payout.userId = :userId', { userId })
      .andWhere('payout.createdAt >= :periodStart', { periodStart })
      .andWhere('payout.createdAt < :periodEnd', { periodEnd })
      .getMany();
  }

  /**
   * Finds a batch of payouts with a specific status, e.g., to retry failed payouts.
   * @param {PayoutStatus[]} statuses - An array of statuses to search for.
   * @param {number} limit - The maximum number of payouts to fetch.
   * @returns {Promise<Payout[]>} An array of Payout entities.
   */
  async findByStatus(
    statuses: PayoutStatus[],
    limit: number,
  ): Promise<Payout[]> {
    const where: FindOptionsWhere<Payout> = {
      status: In(statuses),
    };

    return this.find({
      where,
      take: limit,
      order: {
        createdAt: 'ASC', // Process oldest first
      },
    });
  }
}