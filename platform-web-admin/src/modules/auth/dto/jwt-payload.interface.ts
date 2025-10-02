import { UserType } from '../../users/entities/user.entity';

/**
 * Defines the shape of the data encoded in the JWT access token.
 * This interface is used by the JwtStrategy to type the validated payload
 * and by NestJS's Request object for type safety in controllers.
 * REQ-1-040, REQ-1-096
 */
export interface JwtPayload {
  /**
   * The subject of the token, which is the user's unique ID (UUID).
   */
  sub: string;

  /**
   * The user's registered mobile number, serving as the username.
   */
  mobileNumber: string;

  /**
   * The role of the user, used for authorization (RBAC).
   */
  userType: UserType;
}