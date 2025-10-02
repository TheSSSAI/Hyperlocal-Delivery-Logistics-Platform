import { Injectable, Inject, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { MulticastMessage, Notification } from 'firebase-admin/lib/messaging/messaging-api';

import firebaseConfig from '../../../config/firebase.config';
import { IFcmService } from '../interfaces/fcm-service.interface';

@Injectable()
export class FcmService implements IFcmService {
  private readonly logger = new Logger(FcmService.name);

  constructor(
    @Inject(firebaseConfig.KEY)
    private readonly config: ConfigType<typeof firebaseConfig>,
    @Inject('FirebaseAdmin')
    private readonly firebaseAdmin: admin.app.App,
  ) {}

  /**
   * Sends a push notification to a single device.
   * @param deviceToken The FCM registration token of the target device.
   * @param notification The notification payload including title, body, and optional data.
   * @returns A promise that resolves to true on success, false on failure.
   */
  async sendPushNotification(
    deviceToken: string,
    notification: { title: string; body: string; data?: { [key: string]: string } },
  ): Promise<boolean> {
    const message = {
      token: deviceToken,
      notification: {
        title: notification.title,
        body: notification.body,
      },
      data: notification.data,
      android: {
        priority: 'high' as const,
        notification: {
          sound: 'default',
          channelId: this.config.androidChannelId,
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    };

    try {
      this.logger.log(`Attempting to send push notification to token: ${deviceToken.substring(0, 10)}...`);
      const response = await this.firebaseAdmin.messaging().send(message);
      this.logger.log(`Successfully sent push notification. Message ID: ${response}`);
      return true;
    } catch (error) {
      this.handleFcmError(error, deviceToken);
      return false;
    }
  }

  /**
   * Sends a push notification to multiple devices efficiently.
   * @param deviceTokens An array of FCM registration tokens.
   * @param notification The notification payload.
   * @returns A promise that resolves to an object containing successful and failed tokens.
   */
  async sendMulticastNotification(
    deviceTokens: string[],
    notification: Notification & { data?: { [key: string]: string } },
  ): Promise<{ successfulTokens: string[]; failedTokens: string[] }> {
    if (!deviceTokens || deviceTokens.length === 0) {
      this.logger.warn('sendMulticastNotification called with no device tokens.');
      return { successfulTokens: [], failedTokens: [] };
    }

    const message: MulticastMessage = {
      tokens: deviceTokens,
      notification,
      data: notification.data,
      android: {
        priority: 'high' as const,
        notification: {
          sound: 'default',
          channelId: this.config.androidChannelId,
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    };

    try {
      this.logger.log(`Attempting to send multicast notification to ${deviceTokens.length} devices.`);
      const response = await this.firebaseAdmin.messaging().sendEachForMulticast(message);
      
      const successfulTokens: string[] = [];
      const failedTokens: string[] = [];

      response.responses.forEach((resp, idx) => {
        const token = deviceTokens[idx];
        if (resp.success) {
          successfulTokens.push(token);
        } else {
          failedTokens.push(token);
          this.handleFcmError(resp.error, token);
        }
      });
      
      this.logger.log(`Multicast result: ${successfulTokens.length} successful, ${failedTokens.length} failed.`);
      return { successfulTokens, failedTokens };
    } catch (error) {
      this.logger.error(`Failed to send multicast notification: ${error.message}`, error.stack);
      return { successfulTokens: [], failedTokens: deviceTokens };
    }
  }

  /**
   * Handles common FCM errors, logging them appropriately.
   * @param error The error object from the Firebase Admin SDK.
   * @param token The token associated with the error.
   */
  private handleFcmError(error: admin.FirebaseError, token: string): void {
    const partialToken = token.substring(0, 10);
    switch (error.code) {
      case 'messaging/registration-token-not-registered':
        this.logger.warn(`FCM token ${partialToken}... is not registered or invalid. It should be removed from the database.`);
        // In a real application, you would publish an event here to a service
        // responsible for cleaning up invalid device tokens.
        // e.g., this.eventEmitter.emit('fcm.token.invalid', { token });
        break;
      case 'messaging/invalid-argument':
        this.logger.error(`Invalid argument for FCM request for token ${partialToken}...: ${error.message}`, error.stack);
        break;
      case 'messaging/server-unavailable':
      case 'messaging/internal-error':
        this.logger.error(`FCM server is temporarily unavailable for token ${partialToken}...: ${error.message}. This is a retryable error.`, error.stack);
        // The SQS visibility timeout will handle retries at the message level.
        break;
      default:
        this.logger.error(`An unknown FCM error occurred for token ${partialToken}...: ${error.code} - ${error.message}`, error.stack);
        break;
    }
  }
}