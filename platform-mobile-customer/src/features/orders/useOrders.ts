import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { AppDispatch } from '../../store/store'; // Assuming AppDispatch will be defined in store.ts (Level 4)

import {
  fetchOrderHistory,
  fetchOrderDetails,
  createOrder,
  cancelOrder,
  submitRating,
  selectOrderHistory,
  selectActiveOrder,
  selectOrdersLoading,
  selectOrdersError,
  clearActiveOrder,
} from './ordersSlice';
import { CreateOrderPayload, RatingPayload } from './orders.types';

/**
 * Custom hook for managing order-related state and actions.
 * Provides components with access to order history, details of an active order,
 * and functions for creating, cancelling, and rating orders.
 *
 * @returns An object containing order state and memoized functions for order actions.
 */
export const useOrders = () => {
  const dispatch = useDispatch<AppDispatch>();

  const orderHistory = useSelector(selectOrderHistory);
  const activeOrder = useSelector(selectActiveOrder);
  const isLoading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);

  const handleFetchOrderHistory = useCallback(() => {
    dispatch(fetchOrderHistory());
  }, [dispatch]);

  const handleFetchOrderDetails = useCallback(
    (orderId: string) => {
      return dispatch(fetchOrderDetails(orderId));
    },
    [dispatch],
  );

  const handleCreateOrder = useCallback(
    (payload: CreateOrderPayload) => {
      return dispatch(createOrder(payload));
    },
    [dispatch],
  );

  const handleCancelOrder = useCallback(
    (orderId: string) => {
      return dispatch(cancelOrder(orderId));
    },
    [dispatch],
  );

  const handleSubmitRating = useCallback(
    (payload: { orderId: string; ratingData: RatingPayload }) => {
      return dispatch(submitRating(payload));
    },
    [dispatch],
  );
  
  const handleClearActiveOrder = useCallback(() => {
    dispatch(clearActiveOrder());
  }, [dispatch]);

  return {
    orderHistory,
    activeOrder,
    isLoading,
    error,
    fetchOrderHistory: handleFetchOrderHistory,
    fetchOrderDetails: handleFetchOrderDetails,
    createOrder: handleCreateOrder,
    cancelOrder: handleCancelOrder,
    submitRating: handleSubmitRating,
    clearActiveOrder: handleClearActiveOrder,
  };
};