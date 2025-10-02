import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  Query,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { VendorOwnershipGuard } from '../../common/guards/vendor-ownership.guard';
import { Product } from './entities/product.entity';
import { InventoryService } from './inventory.service';
import { InventoryCheckDto } from './dto/inventory-check.dto';

@ApiTags('products')
@Controller()
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly inventoryService: InventoryService
  ) {}

  // Vendor-facing endpoint to create a product for their store
  @Post('vendors/:vendorId/products')
  @UseGuards(JwtAuthGuard, VendorOwnershipGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product for a vendor' })
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully created.',
    type: Product,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(
    @Param('vendorId', ParseUUIDPipe) vendorId: string,
    @Body() createProductDto: CreateProductDto,
  ): Promise<Product> {
    return this.productsService.create(vendorId, createProductDto);
  }

  // Public/Customer-facing endpoint to get products for a vendor
  @Get('vendors/:vendorId/products')
  @ApiOperation({ summary: "Get all products for a specific vendor" })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAllByVendor(
    @Param('vendorId', ParseUUIDPipe) vendorId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Product[]> {
    return this.productsService.findAllByVendor(vendorId, { page, limit });
  }

  // Public/Customer-facing endpoint to get a single product
  @Get('products/:id')
  @ApiOperation({ summary: 'Get a single product by ID' })
  @ApiResponse({ status: 200, description: 'The found product.', type: Product })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }

  // Vendor-facing endpoint to update their own product
  @Patch('products/:id')
  @UseGuards(JwtAuthGuard, VendorOwnershipGuard) // VendorOwnershipGuard needs to check product ownership
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({
    status: 200,
    description: 'The updated product.',
    type: Product,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(id, updateProductDto);
  }

  // Vendor-facing endpoint to delete their own product
  @Delete('products/:id')
  @UseGuards(JwtAuthGuard, VendorOwnershipGuard) // VendorOwnershipGuard needs to check product ownership
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: 204, description: 'Product deleted successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.productsService.remove(id);
  }
  
  // Internal endpoint for Order Service to check inventory
  @Post('internal/inventory/check-availability')
  // This endpoint should be secured by service mesh policies, not public JWTs
  @ApiOperation({ summary: 'Internal: Check stock availability for checkout' })
  @ApiResponse({ status: 200, description: 'Availability check result.' })
  @ApiResponse({ status: 409, description: 'One or more items are out of stock.' })
  async checkAvailability(@Body() inventoryCheckDto: InventoryCheckDto): Promise<{ available: boolean; unavailableItems: string[] }> {
    return this.inventoryService.checkAvailability(inventoryCheckDto.items);
  }
}