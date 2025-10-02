import { useQuery } from '@tanstack/react-query';
import apiClient from '@/shared/api/ApiClient';
import { Product, PaginatedResponse, ApiClientError } from '@/features/product-catalog/types';

interface ProductFilters {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  categoryId?: string;
}

const fetchProducts = async (filters: ProductFilters): Promise<PaginatedResponse<Product>> => {
  const params = new URLSearchParams();
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
  if (filters.search) params.append('search', filters.search);
  if (filters.categoryId) params.append('categoryId', filters.categoryId);

  const response = await apiClient.get<PaginatedResponse<Product>>(`/products?${params.toString()}`);
  return response.data;
};

export const useProducts = (filters: ProductFilters = {}) => {
  return useQuery<PaginatedResponse<Product>, ApiClientError>({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
    keepPreviousData: true, // Useful for pagination
    placeholderData: (previousData) => previousData,
  });
};