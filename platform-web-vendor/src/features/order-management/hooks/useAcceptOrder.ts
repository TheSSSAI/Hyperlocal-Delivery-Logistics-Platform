import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/shared/api/ApiClient';
import { Order, OrderStatus, PaginatedResponse, ApiClientError } from '@/features/order-management/types';
import { toast } from 'react-hot-toast';

interface AcceptOrderPayload {
  orderId: string;
  preparationTime: string; // e.g., "10-15 min"
}

const acceptOrder = async ({ orderId, preparationTime }: AcceptOrderPayload): Promise<void> => {
  await apiClient.patch(`/orders/${orderId}/accept`, { preparationTime });
};

export const useAcceptOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<void, ApiClientError, AcceptOrderPayload>({
    mutationFn: acceptOrder,
    onMutate: async ({ orderId }) => {
      // Optimistically remove the order from the 'pending' list
      await queryClient.cancelQueries({ queryKey: ['orders', { status: 'pending_vendor_acceptance' }] });

      const previousOrders = queryClient.getQueryData<PaginatedResponse<Order>>(['orders', { status: 'pending_vendor_acceptance' }]);
      
      if (previousOrders) {
        queryClient.setQueryData<PaginatedResponse<Order>>(
          ['orders', { status: 'pending_vendor_acceptance' }],
          {
            ...previousOrders,
            data: previousOrders.data.filter((order) => order.id !== orderId),
            total: previousOrders.total -1,
          }
        );
      }
      return { previousOrders };
    },
    onSuccess: () => {
      toast.success('Order accepted successfully.');
      // Refetch both pending and preparing lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['orders', { status: 'pending_vendor_acceptance' }] });
      queryClient.invalidateQueries({ queryKey: ['orders', { status: 'preparing' }] });
    },
    onError: (error, _variables, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(['orders', { status: 'pending_vendor_acceptance' }], context.previousOrders);
      }
      toast.error(error.response?.data?.message || 'Failed to accept order. It may have been cancelled.');
    },
  });
};