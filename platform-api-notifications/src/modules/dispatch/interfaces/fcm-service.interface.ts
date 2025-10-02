/**
 * @file Defines the contract for a service responsible for sending push notifications
 * via Firebase Cloud Messaging (FCM). This interface acts as a port in the
 * Ports and Adapters architecture, abstracting the specific implementation details
 * of the FCM provider from the core application logic.
 * @version 1.0.0
 * @author Principal Software Engineer
 */

/**
 * Represents the payload for a single push notification.
 * The `data` property can be used to send custom key-value pairs for deep linking
 * or other client-side handling.
 */
export interface FcmNotificationPayload {
  /**
   * The title of the push notification.
   */
  title: string;

  /**
   * The main body text of the push notification.
   */
  body: string;

  /**
   * An optional object containing key-value pairs of custom data to be sent
   * with the notification. This is often used for client-side routing (deep linking).
   *
   * @example
   * {
   *   screen: 'OrderDetail',
   *   orderId: 'uuid-goes-here'
   * }
   */
  data?: { [key: string]: string };
}

/**
 * Interface `IFcmService`
 *
 * Defines the contract for a service that sends push notifications via FCM.
 * This abstraction allows for easier testing and potential swapping of the underlying
 * push notification provider in the future.
 */
export interface IFcmService {
  /**
   * Sends a single push notification to one or more devices.
   *
   * @param deviceTokens - A single FCM registration token or an array of tokens to which the notification will be sent.
   * @param notification - The payload of the notification, including title, body, and optional data.
   * @returns A promise that resolves to `true` if the notification was successfully sent to the FCM gateway,
   *          and `false` otherwise. Note: Successful sending to the gateway does not guarantee delivery to the device.
   *          It handles common errors like invalid tokens gracefully without throwing.
   * @throws May throw an exception for unrecoverable configuration errors or catastrophic failures.
   */
  sendPushNotification(
    deviceTokens: string | string[],
    notification: FcmNotificationPayload,
  ): Promise<boolean>;
}

/**
 * Injection token for the IFcmService.
 * This token is used with NestJS's dependency injection system to provide and inject
 * the FcmService implementation where the IFcmService contract is required.
 *
 * @example
 * constructor(@Inject(FCM_SERVICE) private readonly fcmService: IFcmService) {}
 */
export const FCM_SERVICE = 'IFcmService';