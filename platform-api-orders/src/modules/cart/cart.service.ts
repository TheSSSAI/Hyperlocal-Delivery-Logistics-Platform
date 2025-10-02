import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { CartRepository } from './repositories/cart.repository';
import { AddItemDto } from './dtos/add-item.dto';
import { CartDto } from './dtos/cart.dto';
import { plainToInstance } from 'class-transformer';
// import { HttpService } from '@nestjs/axios'; // Would be used for real stock checks

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: CartRepository,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>, // private readonly httpService: HttpService, // Injected for stock validation
  ) {}

  /**
   * Finds a cart for a user or creates a new one if it doesn't exist.
   * @param userId The ID of the user.
   * @returns The user's cart entity.
   */
  async getOrCreateCart(userId: string): Promise<Cart> {
    let cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      this.logger.log(`No cart found for user ${userId}. Creating a new one.`);
      cart = this.cartRepository.create({ userId, items: [] });
      await this.cartRepository.save(cart);
    }
    return cart;
  }

  /**
   * Adds an item to the user's cart or updates its quantity if it already exists.
   * @param userId The ID of the user.
   * @param itemDto The item details to add.
   * @returns The updated cart DTO.
   */
  async addItemToCart(userId: string, itemDto: AddItemDto): Promise<CartDto> {
    const cart = await this.cartRepository.findByUserIdWithItems(userId);
    const cartToUpdate = cart || (await this.getOrCreateCart(userId));

    // --- Real-time Stock & Price Validation ---
    // In a real implementation, we would call the Catalog service here.
    // const product = await this.validateProduct(itemDto.productId);
    // if (itemDto.quantity > product.stock) {
    //   throw new BadRequestException(`Insufficient stock for product ${itemDto.productId}`);
    // }
    this.logger.log(`Adding/updating item ${itemDto.productId} for user ${userId}`);

    const existingItem = cartToUpdate.items.find(
      (item) => item.productId === itemDto.productId,
    );

    if (existingItem) {
      existingItem.quantity += itemDto.quantity;
      // Here we would re-validate against stock:
      // if (existingItem.quantity > product.stock) { ... }
    } else {
      const newItem = this.cartItemRepository.create({
        cart: cartToUpdate,
        productId: itemDto.productId,
        quantity: itemDto.quantity,
        // Price should be fetched from the Catalog service, not trusted from DTO
        // price: product.price
        price: 100, // Placeholder price for now
      });
      cartToUpdate.items.push(newItem);
    }

    cartToUpdate.recalculateTotals();
    const updatedCart = await this.cartRepository.save(cartToUpdate);
    return plainToInstance(CartDto, updatedCart);
  }

  /**
   * Retrieves a user's cart.
   * @param userId The ID of the user.
   * @returns The user's cart DTO, or null if no cart exists.
   */
  async getCart(userId: string): Promise<CartDto | null> {
    const cart = await this.cartRepository.findByUserIdWithItems(userId);
    if (!cart) {
      this.logger.warn(`No cart found for user ${userId} on getCart.`);
      return null;
    }
    cart.recalculateTotals(); // Ensure totals are fresh
    return plainToInstance(CartDto, cart);
  }

  /**
   * Updates the quantity of a specific item in the cart.
   * @param userId The ID of the user.
   * @param cartItemId The ID of the cart item to update.
   * @param quantity The new quantity.
   * @returns The updated cart DTO.
   */
  async updateItemQuantity(
    userId: string,
    cartItemId: string,
    quantity: number,
  ): Promise<CartDto> {
    if (quantity <= 0) {
      return this.removeItemFromCart(userId, cartItemId);
    }

    const cart = await this.cartRepository.findByUserIdWithItems(userId);
    if (!cart) {
      throw new NotFoundException(`Cart for user ${userId} not found.`);
    }

    const itemToUpdate = cart.items.find((item) => item.id === cartItemId);
    if (!itemToUpdate) {
      throw new NotFoundException(`Item ${cartItemId} not found in cart.`);
    }

    // --- Real-time Stock Validation ---
    // const product = await this.validateProduct(itemToUpdate.productId);
    // if (quantity > product.stock) {
    //   throw new BadRequestException(`Insufficient stock. Only ${product.stock} available.`);
    // }

    itemToUpdate.quantity = quantity;
    cart.recalculateTotals();
    const updatedCart = await this.cartRepository.save(cart);
    return plainToInstance(CartDto, updatedCart);
  }

  /**
   * Removes an item completely from the user's cart.
   * @param userId The ID of the user.
   * @param cartItemId The ID of the cart item to remove.
   * @returns The updated cart DTO.
   */
  async removeItemFromCart(
    userId: string,
    cartItemId: string,
  ): Promise<CartDto> {
    const cart = await this.cartRepository.findByUserIdWithItems(userId);
    if (!cart) {
      throw new NotFoundException(`Cart for user ${userId} not found.`);
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter((item) => item.id !== cartItemId);

    if (cart.items.length === initialLength) {
      throw new NotFoundException(`Item ${cartItemId} not found in cart.`);
    }

    cart.recalculateTotals();
    const updatedCart = await this.cartRepository.save(cart);
    return plainToInstance(CartDto, updatedCart);
  }

  /**
   * Clears all items from a user's cart.
   * @param userId The ID of the user.
   * @returns The emptied cart DTO.
   */
  async clearCart(userId: string): Promise<CartDto> {
    const cart = await this.cartRepository.findByUserIdWithItems(userId);
    if (!cart) {
      throw new NotFoundException(`Cart for user ${userId} not found.`);
    }

    // We remove the items through the repository to ensure cascading deletes or other ORM logic is triggered.
    if (cart.items.length > 0) {
      await this.cartItemRepository.remove(cart.items);
    }

    cart.items = [];
    cart.recalculateTotals();

    // The cart entity itself remains, but is now empty.
    const clearedCart = await this.cartRepository.save(cart);
    return plainToInstance(CartDto, clearedCart);
  }

  // private async validateProduct(productId: string): Promise<{price: number, stock: number}> {
  //   try {
  //     const response = await this.httpService.axiosRef.get(`/products/${productId}`);
  //     return response.data;
  //   } catch (error) {
  //     if (error.response?.status === 404) {
  //       throw new NotFoundException(`Product with ID ${productId} not found.`);
  //     }
  //     throw new InternalServerErrorException('Could not validate product information.');
  //   }
  // }
}