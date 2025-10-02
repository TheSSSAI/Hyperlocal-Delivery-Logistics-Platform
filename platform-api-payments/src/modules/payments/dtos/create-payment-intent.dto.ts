import {
  IsInt,
  IsString,
  IsUUID,
  Length,
  Min,
} from 'class-validator';

/**
 * Data Transfer Object for creating a payment intent with the payment gateway.
 * Defines the contract for the POST /api/v1/payments/intent endpoint.
 */
export class CreatePaymentIntentDto {
  /**
   * The unique identifier of the order for which the payment is being made.
   * @example '123e4567-e89b-12d3-a456-426614174000'
   */
  @IsUUID()
  orderId: string;

  /**
   * The total amount of the order in the smallest currency unit (e.g., paise for INR).
   * Must be at least 50 (e.g., ₹0.50).
   * @example 15000 (for ₹150.00)
   */
  @IsInt()
  @Min(50)
  amount: number;

  /**
   * The three-letter ISO currency code.
   * @example 'INR'
   */
  @IsString()
  @Length(3, 3)
  currency: string;
}