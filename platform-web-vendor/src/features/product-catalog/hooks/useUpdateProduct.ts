import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/shared/api/ApiClient';
import { Product, ProductFormData, ApiClientError } from '@/features/product-catalog/types';
import { toast } from 'react-hot-toast';

const updateProduct = async ({ id, productData }: { id: string; productData: ProductFormData }): Promise<Product> => {
  // Assuming the API client handles multipart/form-data for image uploads
  const formData = new FormData();
  Object.entries(productData).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (key === 'image' && value instanceof File) {
        formData.append(key, value);
      } else if (key !== 'image') {
        formData.append(key, String(value));
      }
    }
  });

  const response = await apiClient.patch<Product>(`/products/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};


export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<Product, ApiClientError, { id: string, productData: ProductFormData }>({
    mutationFn: updateProduct,
    onSuccess: (updatedProduct) => {
      // Invalidate the entire products list to ensure the grid refreshes
      queryClient.invalidateQueries({ queryKey: ['products'] });

      // Optionally, update the specific product's cache entry for instant feedback
      queryClient.setQueryData(['products', updatedProduct.id], updatedProduct);
      
      toast.success(`Product "${updatedProduct.name}" updated successfully.`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update product.');
    },
  });
};

const createProduct = async (productData: ProductFormData): Promise<Product> => {
    const formData = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
        if (value instanceof File) {
            formData.append(key, value);
        } else {
            formData.append(key, String(value));
        }
    });

    const response = await apiClient.post<Product>('/products', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation<Product, ApiClientError, ProductFormData>({
        mutationFn: createProduct,
        onSuccess: (newProduct) => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success(`Product "${newProduct.name}" created successfully.`);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to create product.');
        }
    });
};