import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsUUID, IsString, IsInt, Min, IsNumber, ValidateNested } from 'class-validator';

/**
 * Data Transfer Object for a single item within a shopping cart.
 * REQ-1-052: This DTO represents the itemized breakdown required for the cart display.
 */
export class CartItemDto {
  @Expose()
  @IsUUID()
  @ApiProperty({
    description: 'Unique identifier of the cart item.',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  id: string;

  @Expose()
  @IsUUID()
  @ApiProperty({
    description: 'Unique identifier of the product.',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  productId: string;

  @Expose()
  @IsString()
  @ApiProperty({ description: 'Name of the product.', example: 'Margherita Pizza' })
  productName: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: 'URL of the product image.',
    example: 'https://example.com/images/pizza.jpg',
  })
  productImageUrl: string;

  @Expose()
  @IsInt()
  @Min(1)
  @ApiProperty({ description: 'Quantity of the product in the cart.', example: 2 })
  quantity: number;

  @Expose()
  @IsNumber()
  @Min(0)
  @ApiProperty({ description: 'Price of a single unit of the product.', example: 250.0 })
  unitPrice: number;

  @Expose()
  @IsNumber()
  @Min(0)
  @ApiProperty({ description: 'Total price for this line item (unitPrice * quantity).', example: 500.0 })
  lineTotal: number;
}

/**
 * Data Transfer Object for the entire shopping cart.
 * This represents the complete state of the cart to be sent to the client.
 * REQ-1-052: This DTO provides the full itemized breakdown including totals.
 */
export class CartDto {
  @Expose()
  @IsUUID()
  @ApiProperty({
    description: 'Unique identifier of the cart.',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  id: string;

  @Expose()
  @IsUUID()
  @ApiProperty({
    description: 'Unique identifier of the user who owns the cart.',
    example: '4b07149e-109a-4226-824f-25c65f9c9b3a',
  })
  userId: string;
  
  @Expose()
  @IsUUID()
  @ApiProperty({
    description: 'Unique identifier of the vendor for this cart.',
    example: 'b1f9b8c1-5c3a-4e2a-8b8e-9f0e1a2b3c4d',
  })
  vendorId: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: 'Name of the vendor for this cart.',
    example: 'Pizza Palace',
  })
  vendorName: string;

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  @ApiProperty({
    description: 'List of items in the cart.',
    type: [CartItemDto],
  })
  items: CartItemDto[];

  @Expose()
  @IsNumber()
  @ApiProperty({ description: 'Subtotal of all items in the cart.', example: 750.0 })
  subtotal: number;

  @Expose()
  @IsNumber()
  @ApiProperty({ description: 'Calculated taxes for the cart.', example: 37.5 })
  taxes: number;

  @Expose()
  @IsNumber()
  @ApiProperty({ description: 'Calculated delivery fee for the cart.', example: 40.0 })
  deliveryFee: number;

  @Expose()
  @IsNumber()
  @ApiProperty({ description: 'Total amount payable (subtotal + taxes + deliveryFee).', example: 827.5 })
  totalAmount: number;
}