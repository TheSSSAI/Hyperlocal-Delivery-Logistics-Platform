// NOTE: This apiClient is a placeholder for the actual shared library client.
import { apiClient } from '../../services/apiClient';
import { Address } from '../../types/address.types';
import {
  UserProfile,
  UpdateProfilePayload,
  AddAddressPayload,
  UpdateAddressPayload,
} from './profile.types';

/**
 * @class ProfileService
 * @description Provides methods for managing the user's profile and addresses.
 * @see REQ-1-009 - Implements the data interactions for customer profile management.
 */
class ProfileService {
  public async getProfile(): Promise<UserProfile> {
    try {
      const response = await apiClient.get<UserProfile>('/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  public async updateProfile(
    payload: UpdateProfilePayload,
  ): Promise<UserProfile> {
    try {
      const response = await apiClient.put<UserProfile>('/profile', payload);
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  public async getAddresses(): Promise<Address[]> {
    try {
      const response = await apiClient.get<Address[]>('/profile/addresses');
      return response.data;
    } catch (error) {
      console.error('Error fetching addresses:', error);
      throw error;
    }
  }

  public async addAddress(payload: AddAddressPayload): Promise<Address> {
    try {
      const response = await apiClient.post<Address>('/profile/addresses', payload);
      return response.data;
    } catch (error) {
      console.error('Error adding address:', error);
      throw error;
    }
  }

  public async updateAddress(
    addressId: string,
    payload: UpdateAddressPayload,
  ): Promise<Address> {
    try {
      const response = await apiClient.put<Address>(
        `/profile/addresses/${addressId}`,
        payload,
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating address ${addressId}:`, error);
      throw error;
    }
  }

  public async deleteAddress(addressId: string): Promise<void> {
    try {
      await apiClient.delete(`/profile/addresses/${addressId}`);
    } catch (error) {
      console.error(`Error deleting address ${addressId}:`, error);
      throw error;
    }
  }
}

export const profileService = new ProfileService();