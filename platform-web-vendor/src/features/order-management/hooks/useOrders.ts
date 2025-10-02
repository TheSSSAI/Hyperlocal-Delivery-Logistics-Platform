import { useQuery } from '@tanstack/react-query';
import apiClient from '@/shared/api/ApiClient';
import { Order, OrderStatus, PaginatedResponse, ApiClientError } from '@/features/order-management/types';

interface OrderFilters {
  status: OrderStatus;
  page?: number;
  pageSize?: number;
}

const fetchOrders = async (filters: OrderFilters): Promise<PaginatedResponse<Order>> => {
  const params = new URLSearchParams();
  params.append('status', filters.status);
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());

  const response = await apiClient.get<PaginatedResponse<Order>>(`/orders?${params.toString()}`);
  return response.data;
};

export const useOrders = (filters: OrderFilters) => {
  return useQuery<PaginatedResponse<Order>, ApiClientError>({
    queryKey: ['orders', filters],
    queryFn: () => fetchOrders(filters),
    // Real-time updates will be handled by WebSockets, but we can refetch periodically as a fallback
    refetchInterval: 1000 * 60, // Refetch every minute
  });
};

const fetchOrderDetails = async (orderId: string): Promise<Order> => {
    if (!orderId) {
        throw new Error('Order ID is required to fetch details.');
    }
    const response = await apiClient.get<Order>(`/orders/${orderId}`);
    return response.data;
}

export const useOrderDetails = (orderId: string) => {
    return useQuery<Order, ApiClientError>({
        queryKey: ['orders', orderId],
        queryFn: () => fetchOrderDetails(orderId),
        enabled: !!orderId, // Only run query if orderId is provided
    });
}