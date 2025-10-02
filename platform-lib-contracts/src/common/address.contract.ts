/**
 * @file Defines the standardized contract for representing physical addresses.
 * @version 1.0.0
 * @since 1.0.0
 * @author Principal Software Engineer
 */

/**
 * Represents a physical address with geocoordinates.
 * Used for customer delivery locations and vendor store addresses.
 */
export interface AddressContract {
  /**
   * The unique identifier for the address, if persisted.
   * @example "add_a1b2c3d4-e5f6-7890-1234-567890abcdef"
   */
  id?: string;

  /**
   * First line of the address, including house number, building name, etc.
   * @example "Flat 5, The Heights"
   */
  addressLine1: string;

  /**
   * Second line of the address, optional.
   * @example "123 Park Street"
   */
  addressLine2?: string;

  /**
   * A nearby landmark to aid in location.
   * @example "Opposite the main post office"
   */
  landmark?: string;

  /**
   * The city.
   * @example "Mumbai"
   */
  city: string;

  /**
   * The postal code.
   * @example "400001"
   */
  pincode: string;

  /**
   * The state or province.
   * @example "Maharashtra"
   */
  state: string;

  /**
   * A label for the address, e.g., 'Home', 'Work'.
   * @example "Home"
   */
  label?: string;

  /**
   * The geographic latitude.
   * @example 19.0760
   */
  latitude: number;

  /**
   * The geographic longitude.
   * @example 72.8777
   */
  longitude: number;
}