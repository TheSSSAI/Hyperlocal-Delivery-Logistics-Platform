import { Inject, Injectable, Logger } from '@nestjs/common';
import { IdentityService } from '../../identity/identity.service';
import { TemplatesService } from '../../templates/templates.service';
import { IFcmService } from '../interfaces/fcm-service.interface';
import { ISnsService } from '../interfaces/sns-service.interface.ts';
import { UserContactDetailsDto } from '../../identity/dtos/user-contact-details.dto';

export type DispatchChannel = 'Push' | 'SMS';

export interface DispatchRequest {
  userId: string;
  templateKey: string;
  data: Record<string, any>;
  channels: DispatchChannel[];
  correlationId?: string;
}

/**
 * @class DispatchService
 * @description Central orchestrator for sending notifications.
 * This service is responsible for fetching user contact details,
 * rendering notification templates, and dispatching messages
 * to the appropriate channel-specific services (FCM for push, SNS for SMS).
 * It acts as the core application logic layer for the notifications microservice.
 */
@Injectable()
export class DispatchService {
  private readonly logger = new Logger(DispatchService.name);

  constructor(
    private readonly identityService: IdentityService,
    private readonly templatesService: TemplatesService,
    @Inject('IFcmService') private readonly fcmService: IFcmService,
    @Inject('ISnsService') private readonly snsService: ISnsService,
  ) {}

  /**
   * Orchestrates the dispatch of a notification based on an internal request.
   * This is the main entry point for the service's business logic.
   * @param {DispatchRequest} request - The structured request to send a notification.
   * @returns {Promise<void>}
   */
  async dispatchNotification(request: DispatchRequest): Promise<void> {
    const { userId, templateKey, data, channels, correlationId } = request;
    const context = { userId, templateKey, correlationId };

    this.logger.log(
      `Starting notification dispatch for user ${userId} with template ${templateKey}`,
      correlationId,
    );

    let contactDetails: UserContactDetailsDto;
    try {
      contactDetails = await this.identityService.getContactDetails(userId);
      if (!contactDetails) {
        this.logger.warn(
          `No contact details found for user ${userId}. Aborting dispatch.`,
          correlationId,
        );
        return;
      }
    } catch (error) {
      this.logger.error(
        `Failed to fetch contact details for user ${userId}: ${error.message}`,
        error.stack,
        correlationId,
      );
      // Hard failure: without contact details, we cannot proceed.
      return;
    }

    const dispatchPromises: Promise<any>[] = [];

    // Handle Push Notifications
    if (channels.includes('Push')) {
      if (contactDetails.deviceTokens && contactDetails.deviceTokens.length > 0) {
        try {
          const pushTemplate = await this.templatesService.render(
            templateKey,
            'Push',
            data,
          );
          if (pushTemplate) {
            contactDetails.deviceTokens.forEach((token) => {
              dispatchPromises.push(
                this.fcmService.sendPushNotification(token, {
                  title: pushTemplate.title,
                  body: pushTemplate.body,
                  data: data, // Pass through original data for deep-linking
                }),
              );
            });
          } else {
            this.logger.warn(
              `Push template not found for key: ${templateKey}`,
              correlationId,
            );
          }
        } catch (error) {
          this.logger.error(
            `Failed to render Push template for key ${templateKey}: ${error.message}`,
            error.stack,
            correlationId,
          );
        }
      } else {
        this.logger.log(
          `User ${userId} has no device tokens for Push notification.`,
          correlationId,
        );
      }
    }

    // Handle SMS Notifications
    if (channels.includes('SMS')) {
      if (contactDetails.mobileNumber) {
        try {
          const smsTemplate = await this.templatesService.render(
            templateKey,
            'SMS',
            data,
          );
          if (smsTemplate) {
            // Note: SNS template from service would only have a body.
            dispatchPromises.push(
              this.snsService.sendSms(
                contactDetails.mobileNumber,
                smsTemplate.body,
              ),
            );
          } else {
            this.logger.warn(
              `SMS template not found for key: ${templateKey}`,
              correlationId,
            );
          }
        } catch (error) {
          this.logger.error(
            `Failed to render SMS template for key ${templateKey}: ${error.message}`,
            error.stack,
            correlationId,
          );
        }
      } else {
        this.logger.log(
          `User ${userId} has no mobile number for SMS notification.`,
          correlationId,
        );
      }
    }

    if (dispatchPromises.length === 0) {
      this.logger.warn(
        `No channels were eligible for dispatch for user ${userId} and template ${templateKey}.`,
        correlationId,
      );
      return;
    }

    const results = await Promise.allSettled(dispatchPromises);
    this.logDispatchResults(results, context);
  }

  /**
   * Logs the outcome of all dispatch attempts for a given notification request.
   * @param {PromiseSettledResult<any>[]} results - The array of results from Promise.allSettled.
   * @param {object} context - Logging context including userId, templateKey, etc.
   * @private
   */
  private logDispatchResults(
    results: PromiseSettledResult<any>[],
    context: { userId: string; templateKey: string; correlationId?: string },
  ): void {
    let successCount = 0;
    let failureCount = 0;

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        if (result.value === true) {
          successCount++;
          this.logger.log(
            `Successfully dispatched notification #${index + 1} for user ${context.userId}`,
            context.correlationId,
          );
        } else {
          failureCount++;
          this.logger.warn(
            `Dispatch attempt #${index + 1} for user ${context.userId} reported failure by the provider.`,
            context.correlationId,
          );
        }
      } else {
        failureCount++;
        this.logger.error(
          `Dispatch attempt #${index + 1} for user ${context.userId} failed with error: ${result.reason}`,
          result.reason?.stack,
          context.correlationId,
        );
      }
    });

    this.logger.log(
      `Dispatch for user ${context.userId} with template ${context.templateKey} completed. Succeeded: ${successCount}, Failed: ${failureCount}.`,
      context.correlationId,
    );
  }
}