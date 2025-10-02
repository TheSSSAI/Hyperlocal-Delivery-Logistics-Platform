import { Injectable, Logger } from '@nestjs/common';
import { DispatchService } from '../../dispatch/services/dispatch.service';
import {
  UserApprovedEventDto,
  UserPiiChangedEventDto,
  UserRejectedEventDto,
} from '@platform/contracts';

/**
 * @class UserEventHandler
 * @description Handles business events originating from the Identity & Access service.
 * This includes sending approval/rejection notifications and critical security alerts for PII changes.
 * Fulfills requirements like REQ-1-046, RDR-003, and VND-003.
 */
@Injectable()
export class UserEventHandler {
  private readonly logger = new Logger(UserEventHandler.name);

  constructor(private readonly dispatchService: DispatchService) {}

  /**
   * @method handleUserApprovedEvent
   * @description Handles the 'UserApproved' event for newly approved vendors and riders.
   * @param {UserApprovedEventDto} event - The event payload.
   */
  public async handleUserApprovedEvent(
    event: UserApprovedEventDto,
  ): Promise<void> {
    this.logger.log(`Handling UserApprovedEvent for user ${event.userId}`);
    try {
      await this.dispatchService.dispatchNotification({
        userId: event.userId,
        templateKey: 'user.approved',
        channels: ['Push', 'SMS'],
        data: {
          userType: event.userType,
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to handle UserApprovedEvent for user ${event.userId}`,
        error.stack,
      );
      throw error; // Re-throw to ensure SQS message is not deleted and can be retried
    }
  }

  /**
   * @method handleUserRejectedEvent
   * @description Handles the 'UserRejected' event for vendors and riders whose registration was denied.
   * @param {UserRejectedEventDto} event - The event payload.
   */
  public async handleUserRejectedEvent(
    event: UserRejectedEventDto,
  ): Promise<void> {
    this.logger.log(`Handling UserRejectedEvent for user ${event.userId}`);
    try {
      await this.dispatchService.dispatchNotification({
        userId: event.userId,
        templateKey: 'user.rejected',
        channels: ['Push', 'SMS'],
        data: {
          userType: event.userType,
          reason: event.reason,
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to handle UserRejectedEvent for user ${event.userId}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * @method handleUserPiiChangedEvent
   * @description Handles the 'UserPiiChanged' event, sending a security alert to the user.
   * Fulfills REQ-1-046.
   * @param {UserPiiChangedEventDto} event - The event payload.
   */
  public async handleUserPiiChangedEvent(
    event: UserPiiChangedEventDto,
  ): Promise<void> {
    this.logger.log(
      `Handling UserPiiChangedEvent for user ${event.userId} and field ${event.changedField}`,
    );
    try {
      // Determine the template key based on the changed field for more specific alerts
      const templateKey =
        event.changedField === 'bank_account'
          ? 'user.pii_change.bank'
          : 'user.pii_change.generic';

      await this.dispatchService.dispatchNotification({
        userId: event.userId,
        templateKey: templateKey,
        channels: ['SMS', 'Push'], // Security alerts should be high-priority channels
        data: {
          changedField: event.changedField.replace('_', ' '),
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to handle UserPiiChangedEvent for user ${event.userId}`,
        error.stack,
      );
      throw error;
    }
  }
}