import { Role } from '../decorators/roles.decorator';

/**
 * Defines the contract for the data encoded within the JWT.
 * This payload is attached to the request object by the JwtStrategy
 * and is available throughout the request lifecycle for authorization.
 *
 * REQ-1-096: Authorization shall be managed via a Role-Based Access Control (RBAC) model.
 * The 'roles' property is essential for this.
 */
export interface JwtPayload {
  /**
   * The subject of the token, which is the user's unique ID (UUID).
   */
  sub: string;

  /**
   * The user's primary identifier, their mobile number.
   */
  mobileNumber: string;

  /**
   * The roles assigned to the user, used for RBAC.
   */
  roles: Role[];
}