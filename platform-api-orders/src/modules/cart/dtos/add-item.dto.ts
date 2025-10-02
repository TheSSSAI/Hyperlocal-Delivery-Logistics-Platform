import { IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';

/**
 * Data Transfer Object for adding an item to the shopping cart.
 * This defines the contract for the POST /api/v1/cart/items endpoint.
 * Validation decorators ensure data integrity before the request is processed.
 */
export class AddItemDto {
  /**
   * The UUID of the product to be added to the cart.
   * @example 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
   */
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  /**
   * The quantity of the product to add. Must be a positive integer.
   * @example 2
   */
  @IsInt({ message: 'Quantity must be a whole number.' })
  @Min(1, { message: 'Quantity must be at least 1.' })
  @IsNotEmpty()
  quantity: number;
}