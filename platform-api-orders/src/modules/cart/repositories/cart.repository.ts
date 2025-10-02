import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart-item.entity';

/**
 * Interface for the cart repository to abstract data access logic.
 */
export interface ICartRepository {
  /**
   * Finds a cart by the user's unique identifier.
   * @param userId The UUID of the user.
   * @returns A promise that resolves to the Cart entity or null if not found.
   */
  findByUserId(userId: string): Promise<Cart | null>;

  /**
   * Creates a new, empty cart for a user.
   * @param userId The UUID of the user.
   * @returns A promise that resolves to the newly created Cart entity.
   */
  create(userId: string): Promise<Cart>;

  /**
   * Saves the state of a cart and its items.
   * @param cart The Cart entity to save.
   * @returns A promise that resolves to the saved Cart entity.
   */
  save(cart: Cart): Promise<Cart>;

  /**
   * Removes a specific item from a cart.
   * @param cartId The UUID of the cart.
   * @param cartItemId The UUID of the cart item to remove.
   * @returns A promise that resolves to the updated Cart entity.
   */
  removeItem(cartId: string, cartItemId: string): Promise<Cart>;

  /**
   * Clears all items from a cart.
   * @param cartId The UUID of the cart.
   * @returns A promise that resolves when the operation is complete.
   */
  clear(cartId: string): Promise<void>;
}

export const CART_REPOSITORY = 'ICartRepository';

@Injectable()
export class PostgresCartRepository implements ICartRepository {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  /**
   * @inheritdoc
   */
  async findByUserId(userId: string): Promise<Cart | null> {
    return this.cartRepository.findOne({
      where: { userId },
      relations: {
        items: true,
      },
    });
  }

  /**
   * @inheritdoc
   */
  async create(userId: string): Promise<Cart> {
    const newCart = this.cartRepository.create({ userId, items: [] });
    return this.cartRepository.save(newCart);
  }

  /**
   * @inheritdoc
   */
  async save(cart: Cart): Promise<Cart> {
    return this.cartRepository.save(cart);
  }

  /**
   * @inheritdoc
   */
  async removeItem(cartId: string, cartItemId: string): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { id: cartId },
      relations: ['items'],
    });

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found.`);
    }

    const itemIndex = cart.items.findIndex((item) => item.id === cartItemId);
    if (itemIndex === -1) {
      throw new NotFoundException(
        `Item with ID ${cartItemId} not found in cart.`,
      );
    }

    const itemToRemove = cart.items[itemIndex];
    await this.cartItemRepository.remove(itemToRemove);

    // Reload the cart to reflect the change
    return this.cartRepository.findOne({
      where: { id: cartId },
      relations: ['items'],
    });
  }

  /**
   * @inheritdoc
   */
  async clear(cartId: string): Promise<void> {
    const cart = await this.cartRepository.findOne({
      where: { id: cartId },
      relations: ['items'],
    });

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found.`);
    }

    if (cart.items && cart.items.length > 0) {
      await this.cartItemRepository.remove(cart.items);
    }
  }
}