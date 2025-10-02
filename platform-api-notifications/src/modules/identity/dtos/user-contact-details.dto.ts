/**
 * @file Defines the Data Transfer Object (DTO) for user contact details.
 * This DTO represents the data structure expected from the Identity & Access microservice
 * when fetching the necessary information to send notifications.
 * @version 1.0.0
 * @author Principal Software Engineer
 */

import { Expose } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';

/**
 * Class `UserContactDetailsDto`
 *
 * Represents the contact details for a user, including their mobile number and
 * any registered device tokens for push notifications. This class uses `class-validator`
 * decorators to ensure that the data received from the Identity service conforms to the
 * expected format, providing a layer of type safety at the application boundary.
 */
export class UserContactDetailsDto {
  /**
   * The unique identifier for the user.
   * Expected to be in UUID format.
   */
  @Expose()
  @IsUUID()
  userId: string;

  /**
   * The user's registered mobile number in E.164 format.
   * This property is optional as a user might not have a mobile number
   * or it may not be required for the requested notification channel.
   * The 'IN' constraint ensures it's a valid Indian phone number.
   *
   * @example '+919876543210'
   */
  @Expose()
  @IsOptional()
  @IsPhoneNumber('IN')
  mobileNumber?: string | null;

  /**
   * An array of FCM (Firebase Cloud Messaging) device tokens registered by the user.
   * This can be an empty array if the user has no registered devices or has
   * disabled push notifications.
   */
  @Expose()
  @IsArray()
  @IsString({ each: true })
  deviceTokens: string[];
}