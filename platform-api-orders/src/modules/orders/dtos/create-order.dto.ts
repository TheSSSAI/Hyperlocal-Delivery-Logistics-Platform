import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

/**
 * Enum for supported payment methods.
 */
export enum PaymentMethod {
  UPI = 'UPI',
  CARD = 'CARD',
  COD = 'COD',
}

/**
 * Data Transfer Object (DTO) for creating a new order.
 * This class defines the shape of the data expected in the request body
 * for the order creation endpoint. It includes validation decorators
 * from class-validator to enforce data integrity.
 *
 * @see REQ-1-053 - Special instructions fields.
 */
export class CreateOrderDto {
  /**
   * The unique identifier of the customer's cart to be converted into an order.
   * Must be a valid UUID.
   * @example 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
   */
  @IsUUID('4', { message: 'Cart ID must be a valid UUID.' })
  @IsNotEmpty({ message: 'Cart ID is required.' })
  cartId: string;

  /**
   * The unique identifier of the customer's selected delivery address.
   * Must be a valid UUID.
   * @example 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'
   */
  @IsUUID('4', { message: 'Delivery Address ID must be a valid UUID.' })
  @IsNotEmpty({ message: 'Delivery Address ID is required.' })
  deliveryAddressId: string;

  /**
   * The payment method selected by the customer.
   * Must be one of the values defined in the PaymentMethod enum.
   * @example 'UPI'
   */
  @IsEnum(PaymentMethod, { message: 'Invalid payment method provided.' })
  @IsNotEmpty({ message: 'Payment method is required.' })
  paymentMethod: PaymentMethod;

  /**
   * Optional special instructions from the customer for the vendor.
   * Limited to 250 characters.
   * @example 'Please make it extra spicy and pack the sauce separately.'
   */
  @IsOptional()
  @IsString()
  @MaxLength(250, {
    message: 'Vendor instructions cannot exceed 250 characters.',
  })
  vendorInstructions?: string;

  /**
   * Optional special instructions from the customer for the delivery rider.
   * Limited to 250 characters.
   * @example 'Gate code is #1234. Please leave the order at the front door.'
   */
  @IsOptional()
  @IsString()
  @MaxLength(250, {
    message: 'Rider instructions cannot exceed 250 characters.',
  })
  riderInstructions?: string;
}