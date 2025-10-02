/**
 * @interface ISnsService
 * Defines the contract for the AWS Simple Notification Service (SNS) used for sending SMS messages.
 * This interface abstracts the specific details of the AWS SDK, providing a clean,
 * domain-aligned contract for sending transactional SMS.
 * It serves as the Port for SMS dispatch in a Hexagonal Architecture.
 */
export interface ISnsService {
  /**
   * Sends a transactional SMS message to a single phone number.
   * @param phoneNumber The target phone number in E.164 format.
   *                    Example: '+919876543210'
   * @param message The text content of the SMS message.
   *                The message must be compliant with provider length and content restrictions.
   * @returns A promise that resolves to `true` if the message was successfully published to SNS,
   *          and `false` if a known, non-retriable error occurred (e.g., invalid phone number format).
   * @throws An error for catastrophic failures, such as configuration issues or AWS service unavailability.
   */
  sendSms(phoneNumber: string, message: string): Promise<boolean>;
}