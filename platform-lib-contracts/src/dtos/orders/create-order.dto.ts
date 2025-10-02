/**
 * @file Defines the Data Transfer Object for creating a new order.
 * @version 1.0.0
 * @since 1.0.0
 * @author Principal Software Engineer
 * @see REQ-1-052
 * @see REQ-1-053
 */

import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '../../enums/payment-method.enum';

/**
 * DTO for a single item within a new order request.
 */
export class CreateOrderItemDto {
  /**
   * The unique identifier of the product being ordered.
   * @example "prod_a1b2c3d4-e5f6-7890-1234-567890abcdef"
   */
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  /**
   * The quantity of the product being ordered.
   * @example 2
   */
  @IsNotEmpty()
  quantity: number;
}

/**
 * Data Transfer Object for creating a new order. This is the contract for the POST /orders endpoint.
 */
export class CreateOrderDto {
  /**
   * The unique identifier of the vendor from whom the order is being placed.
   * @example "vnd_a1b2c3d4-e5f6-7890-1234-567890abcdef"
   */
  @IsUUID()
  @IsNotEmpty()
  vendorId: string;

  /**
   * The unique identifier of the customer's saved address for delivery.
   * @example "add_a1b2c3d4-e5f6-7890-1234-567890abcdef"
   */
  @IsUUID()
  @IsNotEmpty()
  deliveryAddressId: string;

  /**
   * An array of items included in the order.
   */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  /**
   * The selected payment method for the order.
   * @example PaymentMethod.UPI
   */
  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod: PaymentMethod;

  /**
   * Optional special instructions for the vendor (e.g., 'no onions').
   * @see REQ-1-053
   * @example "Please make it extra spicy."
   */
  @IsOptional()
  @IsString()
  @MaxLength(250)
  vendorInstructions?: string;

  /**
   * Optional special instructions for the rider (e.g., 'leave at front door').
   * @see REQ-1-053
   * @example "Gate code is #1234. Leave at the front desk."
   */
  @IsOptional()
  @IsString()
  @MaxLength(250)
  riderInstructions?: string;
}