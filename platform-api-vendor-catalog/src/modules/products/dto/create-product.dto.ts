import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
  Min,
  IsInt,
  IsUUID,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'The name of the product.',
    example: 'Spicy Chicken Ramen',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'A detailed description of the product.',
    example: 'A rich and spicy broth with tender chicken, noodles, and fresh vegetables.',
    maxLength: 500,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    description: 'The price of the product in the base currency unit (e.g., INR).',
    example: 350.0,
    minimum: 0,
    type: 'number',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'The current stock quantity available for the product.',
    example: 50,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  stockQuantity: number;

  @ApiProperty({
    description: 'The UUID of the product category this product belongs to.',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @IsUUID()
  @IsNotEmpty()
  productCategoryId: string;

  @ApiPropertyOptional({
    description: 'URL of the product image.',
    example: 'https://example.com/images/ramen.jpg',
  })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}