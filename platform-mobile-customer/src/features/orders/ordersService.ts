// NOTE: This apiClient is a placeholder for the actual shared library client.
import { apiClient } from '../../services/apiClient';
import {
  Order,
  OrderSummary,
  CreateOrderPayload,
  CreateRatingPayload,
} from './orders.types';

// A placeholder for a paginated result type that will be defined in a shared types library.
interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

/**
 * @class OrdersService
 * @description Provides methods for interacting with order-related backend APIs.
 * It handles creating orders, fetching order history, and submitting ratings.
 * @see REQ-1-003 - Implements Order Placement and Ratings modules.
 */
class OrdersService {
  /**
   * @method createOrder
   * @description Submits the user's cart and checkout details to create a new order.
   * @param {CreateOrderPayload} payload - Data required to place an order.
   * @returns {Promise<Order>} The newly created order object.
   */
  public async createOrder(payload: CreateOrderPayload): Promise<Order> {
    try {
      const response = await apiClient.post<Order>('/orders', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  /**
   * @method getOrderHistory
   * @description Fetches a paginated list of the user's past orders.
   * @returns {Promise<PaginatedResult<OrderSummary>>} A list of order summaries.
   */
  public async getOrderHistory(): Promise<PaginatedResult<OrderSummary>> {
    try {
      const response = await apiClient.get<PaginatedResult<OrderSummary>>(
        '/orders',
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching order history:', error);
      throw error;
    }
  }

  /**
   * @method getOrderDetails
   * @description Fetches the full details for a specific order.
   * @param {string} orderId - The ID of the order to fetch.
   * @returns {Promise<Order>} The full order object.
   */
  public async getOrderDetails(orderId: string): Promise<Order> {
    try {
      const response = await apiClient.get<Order>(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching details for order ${orderId}:`, error);
      throw error;
    }
  }

  /**
   * @method cancelOrder
   * @description Initiates cancellation for an active order.
   * @param {string} orderId - The ID of the order to cancel.
   * @returns {Promise<Order>} The updated order object with 'Cancelled' status.
   */
  public async cancelOrder(orderId: string): Promise<Order> {
    try {
      const response = await apiClient.post<Order>(`/orders/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      console.error(`Error cancelling order ${orderId}:`, error);
      throw error;
    }
  }

  /**
   * @method submitRating
   * @description Submits a rating and review for a completed order.
   * @param {CreateRatingPayload} payload - The rating data for vendor and rider.
   * @returns {Promise<void>}
   */
  public async submitRating(payload: CreateRatingPayload): Promise<void> {
    try {
      await apiClient.post(`/orders/${payload.orderId}/ratings`, payload);
    } catch (error) {
      console.error(`Error submitting rating for order ${payload.orderId}:`, error);
      throw error;
    }
  }
}

export const ordersService = new OrdersService();