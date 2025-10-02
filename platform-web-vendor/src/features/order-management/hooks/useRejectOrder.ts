import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/shared/api/ApiClient';
import { Order, PaginatedResponse, ApiClientError } from '@/features/order-management/types';
import { toast } from 'react-hot-toast';

const rejectOrder = async (orderId: string): Promise<void> => {
  await apiClient.patch(`/orders/${orderId}/reject`);
};

export const useRejectOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<void, ApiClientError, string>({
    mutationFn: rejectOrder,
    onMutate: async (orderId) => {
        // Optimistically remove from the pending list
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
      toast.success('Order rejected.');
      queryClient.invalidateQueries({ queryKey: ['orders', { status: 'pending_vendor_acceptance' }] });
      queryClient.invalidateQueries({ queryKey: ['orders', { status: 'cancelled' }] });
    },
    onError: (error, _variables, context) => {
        if (context?.previousOrders) {
            queryClient.setQueryData(['orders', { status: 'pending_vendor_acceptance' }], context.previousOrders);
        }
      toast.error(error.response?.data?.message || 'Failed to reject order. Please refresh.');
    },
  });
};