import { BaseEvent, IBaseEvent } from '../../common/base.event';
import { UserRole } from '../../enums';

/**
 * The name of the event published when a new user is registered.
 */
export const USER_REGISTERED_EVENT_NAME = 'user.registered';

/**
 * The payload for the UserRegisteredEvent.
 * Contains the core information about the newly created user.
 */
export interface IUserRegisteredPayload {
  /**
   * The unique identifier of the newly registered user.
   */
  userId: string;

  /**
   * The user's registered mobile number.
   */
  mobileNumber: string;

  /**
   * The role assigned to the user upon registration.
   */
  role: UserRole;

  /**
   * The user's email address, if provided during registration.
   */
  email?: string;
}

/**
 * Represents the event that is published whenever a new user of any role
 * (Customer, Vendor, Rider) completes the initial registration process.
 * Downstream services can listen for this event to trigger welcome emails,
 * create associated profiles, or start verification workflows.
 */
export class UserRegisteredEvent
  extends BaseEvent<IUserRegisteredPayload>
  implements IBaseEvent<IUserRegisteredPayload>
{
  public eventName = USER_REGISTERED_EVENT_NAME;
  public eventVersion = '1.0';

  constructor(payload: IUserRegisteredPayload, correlationId: string) {
    super(payload, correlationId);
  }
}