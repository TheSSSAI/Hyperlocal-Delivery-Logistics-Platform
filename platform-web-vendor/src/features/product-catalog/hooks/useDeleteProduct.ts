import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/shared/api/ApiClient';
import { ApiClientError } from '@/features/product-catalog/types';
import { toast } from 'react-hot-toast';

const deleteProduct = async (productId: string): Promise<void> => {
  await apiClient.delete(`/products/${productId}`);
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<void, ApiClientError, string>({
    mutationFn: deleteProduct,
    onSuccess: () => {
      toast.success('Product deleted successfully.');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete product. It might be part of an active order.');
    },
  });
};