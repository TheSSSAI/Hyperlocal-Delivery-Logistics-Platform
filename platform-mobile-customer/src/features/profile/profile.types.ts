import { User } from '../../types/user.types';
import { Address } from '../../types/address.types';

/**
 * @interface UserProfile
 * @description Represents the full user profile data, including addresses.
 * @see REQ-1-009, CUS-006 - Customer profile management.
 */
export interface UserProfile extends User {
  addresses: Address[];
}

/**
 * @interface UpdateProfilePayload
 * @description DTO for updating user's name and email.
 * @see CUS-006
 */
export interface UpdateProfilePayload {
  name: string;
  email: string;
}

/**
 * @interface AddAddressPayload
 * @description DTO for adding a new delivery address.
 * @see CUS-007
 */
export interface AddAddressPayload {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  pincode: string;
  landmark?: string;
  addressType: 'Home' | 'Work' | 'Other';
  location: {
    lat: number;
    lng: number;
  };
}

/**
 * @interface UpdateAddressPayload
 * @description DTO for updating an existing delivery address.
 * @see CUS-008
 */
export type UpdateAddressPayload = Partial<AddAddressPayload>;