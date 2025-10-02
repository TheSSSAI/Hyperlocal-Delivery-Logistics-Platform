import { Product } from '../products/products.types';

/**
 * @interface CartItem
 * @description Represents a single item within the shopping cart.
 * @see CUS-016, CUS-017, CUS-018 - Cart management user stories.
 */
export interface CartItem {
  id: string; // Unique identifier for the cart item instance
  product: Product;
  quantity: number;
  priceAtTimeOfAdd: number; // Price when added, to handle price changes
  vendorId: string;
}

/**
 * @interface Cart
 * @description Represents the customer's entire shopping cart.
 * @see REQ-1-003 - Core functional modules including Cart Management.
 * @see CUS-019 - Customer views detailed cart summary.
 */
export interface Cart {
  items: CartItem[];
  subtotal: number;
  taxes: number;
  deliveryFee: number;
  total: number;
  vendorId?: string | null; // Carts are typically single-vendor
}

/**
 * @interface AddToCartPayload
 * @description DTO for adding an item to the cart.
 */
export interface AddToCartPayload {
  productId: string;
  quantity: number;
}

/**
 * @interface UpdateCartItemQuantityPayload
 * @description DTO for updating an item's quantity in the cart.
 */
export interface UpdateCartItemQuantityPayload {
  cartItemId: string;
  quantity: number;
}

/**
 * @interface RemoveFromCartPayload
 * @description DTO for removing an item from the cart.
 */
export interface RemoveFromCartPayload {
  cartItemId: string;
}