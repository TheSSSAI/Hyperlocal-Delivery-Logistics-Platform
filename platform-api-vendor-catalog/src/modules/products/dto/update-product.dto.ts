import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

/**
 * Data Transfer Object for updating an existing product.
 * It extends the CreateProductDto with all fields being optional for PATCH operations.
 */
export class UpdateProductDto extends PartialType(CreateProductDto) {}