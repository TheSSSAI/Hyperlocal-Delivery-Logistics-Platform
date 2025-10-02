import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseUUIDPipe,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

import { CartService } from './cart.service.ts';
import { AddItemDto } from './dtos/add-item.dto.ts';
import { CartDto } from './dtos/cart.dto.ts';
import { UpdateItemDto } from './dtos/update-item.dto.ts';
// Assuming JwtAuthGuard is a shared component
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard.ts';

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  private readonly logger = new Logger(CartController.name);

  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: "Get the current user's shopping cart" })
  @ApiResponse({
    status: 200,
    description: "The user's cart.",
    type: CartDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Cart not found for user.' })
  async getCart(@Req() req): Promise<CartDto> {
    const userId = req.user.id; // Extracted from JWT by the guard
    this.logger.log(`Fetching cart for user ${userId}`);
    const cart = await this.cartService.getCartByUserId(userId, true); // Create if not exists
    return this.cartService.mapToDto(cart);
  }

  @Post('items')
  @ApiOperation({ summary: 'Add an item to the cart' })
  @ApiResponse({
    status: 200,
    description: 'Item added successfully, returns the updated cart.',
    type: CartDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 409, description: 'Item is out of stock.' })
  async addItem(
    @Req() req,
    @Body() addItemDto: AddItemDto,
  ): Promise<CartDto> {
    const userId = req.user.id;
    this.logger.log(
      `User ${userId} adding item ${addItemDto.productId} to cart.`,
    );
    const updatedCart = await this.cartService.addItem(userId, addItemDto);
    return this.cartService.mapToDto(updatedCart);
  }

  @Patch('items/:itemId')
  @ApiOperation({ summary: 'Update the quantity of an item in the cart' })
  @ApiParam({ name: 'itemId', description: 'The UUID of the cart item' })
  @ApiResponse({
    status: 200,
    description: 'Item quantity updated successfully, returns the updated cart.',
    type: CartDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 409,
    description: 'Requested quantity exceeds available stock.',
  })
  async updateItemQuantity(
    @Req() req,
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body() updateItemDto: UpdateItemDto,
  ): Promise<CartDto> {
    const userId = req.user.id;
    this.logger.log(
      `User ${userId} updating item ${itemId} quantity to ${updateItemDto.quantity}.`,
    );
    const updatedCart = await this.cartService.updateItemQuantity(
      userId,
      itemId,
      updateItemDto.quantity,
    );
    return this.cartService.mapToDto(updatedCart);
  }

  @Delete('items/:itemId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove an item from the cart' })
  @ApiParam({ name: 'itemId', description: 'The UUID of the cart item' })
  @ApiResponse({
    status: 200,
    description: 'Item removed successfully, returns the updated cart.',
    type: CartDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Item not found in cart.' })
  async removeItem(
    @Req() req,
    @Param('itemId', ParseUUIDPipe) itemId: string,
  ): Promise<CartDto> {
    const userId = req.user.id;
    this.logger.log(`User ${userId} removing item ${itemId} from cart.`);
    const updatedCart = await this.cartService.removeItem(userId, itemId);
    return this.cartService.mapToDto(updatedCart);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Clear all items from the user's cart" })
  @ApiResponse({ status: 204, description: 'Cart cleared successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async clearCart(@Req() req): Promise<void> {
    const userId = req.user.id;
    this.logger.log(`Clearing cart for user ${userId}.`);
    await this.cartService.clearCart(userId);
  }
}