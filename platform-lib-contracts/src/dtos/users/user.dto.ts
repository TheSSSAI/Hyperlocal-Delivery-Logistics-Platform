import { UserRole } from '../../enums/user-role.enum';
import { IAddressContract } from '../../common/address.contract';

// --- Profile DTOs ---
// These interfaces define the shape of the 'profile' object within the UserDto,
// which varies depending on the user's role.

/**
 * Profile data specific to a Customer.
 */
export interface CustomerProfileDto {
  firstName: string;
  lastName: string;
  email?: string;
}

/**
 * Profile data specific to a Vendor.
 */
export interface VendorProfileDto {
  storeName: string;
  contactEmail: string;
  averageRating: number;
  isOnline: boolean;
  address: IAddressContract;
}

/**
 * Profile data specific to a Rider.
 */
export interface RiderProfileDto {
  firstName: string;
  lastName: string;
  isOnline: boolean;
  averageRating: number;
  vehicleDetails?: {
    make: string;
    model: string;
    licensePlate: string;
  };
}

/**
 * Profile data specific to an Administrator.
 */
export interface AdministratorProfileDto {
  firstName: string;
  lastName: string;
  permissionLevel: 'super' | 'standard';
}

/**
 * A union type representing any of the possible user profiles.
 */
export type UserProfile =
  | CustomerProfileDto
  | VendorProfileDto
  | RiderProfileDto
  | AdministratorProfileDto;

/**
 * Represents the public data contract for a user account across the system.
 * This DTO is returned by APIs that need to provide user information. The `profile`
 * property is a discriminated union based on the `role` property.
 */
export class UserDto {
  /**
   * The unique identifier for the user (UUID).
   */
  id: string;

  /**
   * The user's role within the platform, which determines their permissions and profile shape.
   */
  role: UserRole;

  /**
   * The current status of the user's account (e.g., 'active', 'pending_verification', 'suspended').
   */
  status: string;

  /**
   * The user's primary mobile number, used for login and communication.
   * @example '9876543210'
   */
  mobileNumber: string;

  /**
   * A timestamp in ISO 8601 format indicating when the user account was created.
   * @example '2023-10-27T10:00:00Z'
   */
  createdAt: string;

  /**
   * Role-specific profile data for the user. The shape of this object
   * is determined by the `role` property.
   */
  profile: UserProfile;
}