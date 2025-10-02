import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/shared/api/ApiClient';
import { Category, ApiClientError } from '@/features/product-catalog/types';
import { toast } from 'react-hot-toast';

const fetchCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get<Category[]>('/categories');
  return response.data;
};

export const useCategories = () => {
  return useQuery<Category[], ApiClientError>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5, // Categories are relatively static, so cache for 5 mins
  });
};

// --- Mutations for Category Management ---

const createCategory = async (name: string): Promise<Category> => {
  const response = await apiClient.post<Category>('/categories', { name });
  return response.data;
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<Category, ApiClientError, string>({
    mutationFn: createCategory,
    onSuccess: (newCategory) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success(`Category "${newCategory.name}" created successfully.`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create category.');
    },
  });
};

const updateCategory = async ({ id, name }: { id: string; name: string }): Promise<Category> => {
  const response = await apiClient.patch<Category>(`/categories/${id}`, { name });
  return response.data;
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<Category, ApiClientError, { id: string; name: string }>({
    mutationFn: updateCategory,
    onSuccess: (updatedCategory) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success(`Category "${updatedCategory.name}" updated successfully.`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update category.');
    },
  });
};

const deleteCategory = async (id: string): Promise<void> => {
  await apiClient.delete(`/categories/${id}`);
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<void, ApiClientError, string>({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted successfully.');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete category. It may contain products.');
    },
  });
};