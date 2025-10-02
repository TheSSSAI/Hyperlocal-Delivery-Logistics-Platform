// NOTE: This apiClient is a placeholder for the actual shared library client.
// It will be properly typed and imported from the shared package at a higher dependency level.
import { apiClient } from '../../services/apiClient';
import {
  Cart,
  AddToCartPayload,
  UpdateCartItemQuantityPayload,
  RemoveFromCartPayload,
} from './cart.types';

/**
 * @class CartService
 * @description Provides methods for interacting with the cart-related backend APIs.
 * This service encapsulates all network logic for cart management, making it
 * easy to use in Redux thunks or other application logic.
 * @see REQ-1-003 - Implements the Cart Management module's data interactions.
 */
class CartService {
  /**
   * @method getCart
   * @description Fetches the current user's cart from the backend.
   * @returns {Promise<Cart>} The user's cart data.
   */
  public async getCart(): Promise<Cart> {
    try {
      const response = await apiClient.get<Cart>('/cart');
      return response.data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  }

  /**
   * @method addItemToCart
   * @description Adds a product to the user's cart.
   * @param {AddToCartPayload} payload - The product ID and quantity to add.
   * @returns {Promise<Cart>} The updated cart data.
   */
  public async addItemToCart(payload: AddToCartPayload): Promise<Cart> {
    try {
      const response = await apiClient.post<Cart>('/cart/items', payload);
      return response.data;
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  }

  /**
   * @method updateCartItemQuantity
   * @description Updates the quantity of an item already in the cart.
   * @param {UpdateCartItemQuantityPayload} payload - The cart item ID and new quantity.
   * @returns {Promise<Cart>} The updated cart data.
   */
  public async updateCartItemQuantity(
    payload: UpdateCartItemQuantityPayload,
  ): Promise<Cart> {
    const { cartItemId, quantity } = payload;
    try {
      const response = await apiClient.patch<Cart>(`/cart/items/${cartItemId}`, {
        quantity,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      throw error;
    }
  }

  /**
   * @method removeItemFromCart
   * @description Removes an item from the cart.
   * @param {RemoveFromCartPayload} payload - The cart item ID to remove.
   * @returns {Promise<Cart>} The updated cart data.
   */
  public async removeItemFromCart(
    payload: RemoveFromCartPayload,
  ): Promise<Cart> {
    const { cartItemId } = payload;
    try {
      const response = await apiClient.delete<Cart>(`/cart/items/${cartItemId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing item from cart:', error);
      throw error;
    }
  }
}

export const cartService = new CartService();