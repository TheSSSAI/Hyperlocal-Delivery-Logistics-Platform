import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';

export class InventoryUpdateDto {
  @ApiProperty({
    description: 'The unique identifier of the product to update.',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    description: 'The quantity to decrement from the current stock. Must be a positive integer.',
    example: 2,
  })
  @IsInt()
  @Min(1)
  quantity: number;
}