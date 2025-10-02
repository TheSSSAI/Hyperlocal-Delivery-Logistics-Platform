/**
 * @file Defines the core TypeScript types and interfaces for the Store Profile feature.
 * This includes business hours, availability, and license information.
 * @version 1.0.0
 * @since 2024-05-24
 */

/**
 * Represents the days of the week, with Sunday as 0.
 */
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Represents a single time slot for a business day (e.g., 9:00 AM to 5:00 PM).
 * Fulfills user story VND-006.
 */
export interface TimeSlot {
  open: string; // HH:mm format, e.g., "09:00"
  close: string; // HH:mm format, e.g., "17:00"
}

/**
 * Represents the business hours for a single day of the week.
 * A day can be closed or have one or more open time slots.
 */
export interface DayHours {
  dayOfWeek: DayOfWeek;
  isClosed: boolean;
  slots: TimeSlot[];
}

/**
 * Represents the master availability status of a vendor's store.
 * Fulfills user story VND-007.
 */
export type StoreAvailabilityStatus = 'ONLINE' | 'OFFLINE';

/**
 * Represents a vendor's business license information.
 * Fulfills user story VND-027.
 */
export interface VendorLicense {
  readonly id: string;
  licenseType: string; // e.g., 'FSSAI', 'GST'
  licenseNumber: string;
  expiryDate: string; // ISO 8601 date string (YYYY-MM-DD)
}

/**
 * Represents the comprehensive profile of a vendor's store.
 * This is the main data structure for the store settings page.
 * Aggregates data from VND-005, VND-006, VND-007, VND-027.
 */
export interface StoreProfile {
  readonly id: string; // vendorId
  storeName: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    latitude: number;
    longitude: number;
  };
  contactPhone: string;
  contactEmail: string;
  availabilityStatus: StoreAvailabilityStatus;
  businessHours: DayHours[];
  licenses: VendorLicense[];
  averageRating: number;
  totalRatings: number;
}

/**
 * Defines the shape of data used in the store profile editing form.
 */
export interface StoreProfileFormValues {
  storeName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  pincode: string;
  contactPhone: string;
  contactEmail: string;
}

/**
 * Defines the shape of data used in the business hours form.
 * This is a more complex type to handle the dynamic form state.
 */
export interface BusinessHoursFormValues {
  hours: DayHours[];
}