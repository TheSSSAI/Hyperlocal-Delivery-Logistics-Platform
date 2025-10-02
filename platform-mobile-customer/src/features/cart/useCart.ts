import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { AppDispatch } from '../../store/store'; // Assuming AppDispatch will be defined in store.ts (Level 4)

import {
  fetchCart,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  selectCart,
  selectCartLoading,
  selectCartError,
  selectCartItems,
  selectCartSubtotal,
  selectCartTotalItems,
  clearCart,
} from './cartSlice';

import { CartItem } from './cart.types';

/**
 * Custom hook for interacting with the shopping cart state.
 * It provides components with the current cart data and functions to modify the cart,
 * abstracting away the underlying Redux logic.
 *
 * @returns An object containing cart state and memoized functions for cart actions.
 */
export const useCart = () => {
  const dispatch = useDispatch<AppDispatch>();

  const cart = useSelector(selectCart);
  const items = useSelector(selectCartItems);
  const isLoading = useSelector(selectCartLoading);
  const error = useSelector(selectCartError);
  const subtotal = useSelector(selectCartSubtotal);
  const totalItems = useSelector(selectCartTotalItems);

  const handleFetchCart = useCallback(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleAddItem = useCallback(
    (item: Omit<CartItem, 'quantity'>) => {
      dispatch(addItemToCart({ ...item, quantity: 1 }));
    },
    [dispatch],
  );

  const handleUpdateQuantity = useCallback(
    (payload: { productId: string; quantity: number }) => {
      dispatch(updateItemQuantity(payload));
    },
    [dispatch],
  );

  const handleRemoveItem = useCallback(
    (productId: string) => {
      dispatch(removeItemFromCart(productId));
    },
    [dispatch],
  );
  
  const handleClearCart = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

  return {
    cart,
    items,
    isLoading,
    error,
    subtotal,
    totalItems,
    fetchCart: handleFetchCart,
    addItem: handleAddItem,
    updateQuantity: handleUpdateQuantity,
    removeItem: handleRemoveItem,
    clearCart: handleClearCart,
  };
};