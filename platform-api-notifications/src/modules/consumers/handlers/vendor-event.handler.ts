import { Injectable, Logger } from '@nestjs/common';
import { DispatchService } from '../../dispatch/services/dispatch.service';
import { VendorLicenseExpiryReminderEventDto } from '@platform/contracts/events';
import { Channel } from '@platform/contracts/enums';

@Injectable()
export class VendorEventHandler {
  private readonly logger = new Logger(VendorEventHandler.name);

  constructor(private readonly dispatchService: DispatchService) {}

  public async handleVendorLicenseExpiryReminderEvent(
    event: VendorLicenseExpiryReminderEventDto,
  ): Promise<void> {
    try {
      this.logger.log(
        `Handling VendorLicenseExpiryReminderEvent for vendorId: ${event.vendorId}, days: ${event.daysUntilExpiry}`,
      );

      if (
        !event.vendorId ||
        !event.daysUntilExpiry ||
        !event.licenseType
      ) {
        this.logger.error(
          `Cannot process VendorLicenseExpiryReminderEvent: required fields are missing for event: ${JSON.stringify(
            event,
          )}`,
        );
        return;
      }

      const validIntervals = [30, 15, 7];
      if (!validIntervals.includes(event.daysUntilExpiry)) {
        this.logger.warn(
          `Received VendorLicenseExpiryReminderEvent for a non-standard interval of ${event.daysUntilExpiry} days. Skipping notification.`,
        );
        return;
      }

      const templateKey = `vendor.license.expiry.${event.daysUntilExpiry}d`;

      // Per REQ-1-026, reminders should be highly visible.
      await this.dispatchService.dispatchNotification({
        userId: event.vendorId,
        templateKey,
        data: {
          licenseType: event.licenseType,
          expiryDate: event.expiryDate,
        },
        channels: [Channel.Push, Channel.Sms], // Using SMS as well for high importance
      });
    } catch (error) {
      this.logger.error(
        `Error handling VendorLicenseExpiryReminderEvent for vendorId: ${event.vendorId}`,
        error.stack,
      );
    }
  }
}