import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/shared/api/ApiClient';
import { StoreProfile, BusinessHours, ApiClientError } from '@/features/store-profile/types';
import { toast } from 'react-hot-toast';

// --- Query for fetching store profile ---
const fetchStoreProfile = async (): Promise<StoreProfile> => {
  const response = await apiClient.get<StoreProfile>('/store-profile');
  return response.data;
};

export const useStoreProfile = () => {
  return useQuery<StoreProfile, ApiClientError>({
    queryKey: ['storeProfile'],
    queryFn: fetchStoreProfile,
    staleTime: 1000 * 60 * 15, // Profile data is not highly volatile, cache for 15 mins
  });
};

// --- Mutation for updating store profile ---
const updateStoreProfile = async (profileData: Partial<StoreProfile>): Promise<StoreProfile> => {
  const response = await apiClient.patch<StoreProfile>('/store-profile', profileData);
  return response.data;
};

export const useUpdateStoreProfile = () => {
  const queryClient = useQueryClient();
  return useMutation<StoreProfile, ApiClientError, Partial<StoreProfile>>({
    mutationFn: updateStoreProfile,
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(['storeProfile'], updatedProfile);
      // Or invalidate to force a refetch:
      // queryClient.invalidateQueries({ queryKey: ['storeProfile'] });
      toast.success('Store profile updated successfully.');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update store profile.');
    },
  });
};

// --- Mutation for updating business hours ---
const updateBusinessHours = async (businessHours: BusinessHours[]): Promise<BusinessHours[]> => {
    const response = await apiClient.put<BusinessHours[]>('/store-profile/business-hours', { businessHours });
    return response.data;
};

export const useUpdateBusinessHours = () => {
    const queryClient = useQueryClient();
    return useMutation<BusinessHours[], ApiClientError, BusinessHours[]>({
        mutationFn: updateBusinessHours,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['storeProfile'] });
            toast.success('Business hours updated successfully.');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update business hours.');
        },
    });
}

// --- Mutation for toggling store availability ---
const updateStoreAvailability = async (isOnline: boolean): Promise<{ isOnline: boolean }> => {
    const response = await apiClient.patch<{ isOnline: boolean }>('/store-profile/availability', { isOnline });
    return response.data;
}

export const useUpdateStoreAvailability = () => {
    const queryClient = useQueryClient();
    return useMutation<{ isOnline: boolean }, ApiClientError, boolean>({
        mutationFn: updateStoreAvailability,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['storeProfile'] });
            toast.success(`Your store is now ${data.isOnline ? 'Online' : 'Offline'}.`);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update store status.');
        }
    });
}