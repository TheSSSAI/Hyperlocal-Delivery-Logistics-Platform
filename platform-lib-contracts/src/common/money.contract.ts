/**
 * @file Defines a standardized contract for representing monetary values to avoid floating-point inaccuracies.
 * @version 1.0.0
 * @since 1.0.0
 * @author Principal Software Engineer
 */

/**
 * Represents a monetary value, including the amount in the smallest currency unit and the currency code.
 * This structure is used for all financial fields like prices, fees, and totals to ensure precision.
 */
export interface MoneyContract {
  /**
   * The monetary amount in the smallest currency unit (e.g., paise for INR).
   * This must be an integer to avoid floating-point arithmetic errors.
   * @example 15050 (representing ₹150.50)
   */
  amount: number;

  /**
   * The 3-letter ISO 4217 currency code.
   * @example "INR"
   */
  currency: 'INR';
}