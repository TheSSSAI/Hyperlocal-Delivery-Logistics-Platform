import apiClient from './apiClient';
import { RiderProfile, UpdateBankDetailsPayload, UpdateVehicleDetailsPayload, UpdateProfilePayload } from '../shared/types/profile.types';

/**
 * Fetches the complete profile of the currently authenticated rider.
 * @returns A promise that resolves with the rider's profile data.
 * @throws {ApiError} on failure.
 */
const getProfile = async (): Promise<RiderProfile> => {
  const response = await apiClient.get<RiderProfile>('/profile/me');
  return response.data;
};

/**
 * Updates the rider's personal information (name, email).
 * @param payload - The data to be updated.
 * @returns A promise that resolves with the updated rider profile.
 * @throws {ApiError} on failure.
 */
const updateProfile = async (payload: UpdateProfilePayload): Promise<RiderProfile> => {
    const response = await apiClient.patch<RiderProfile>('/profile/me', payload);
    return response.data;
};

/**
 * Updates the rider's vehicle details.
 * This action will likely trigger a re-verification process.
 * @param payload - The new vehicle details.
 * @returns A promise that resolves with the updated rider profile.
 * @throws {ApiError} on failure.
 */
const updateVehicleDetails = async (payload: UpdateVehicleDetailsPayload): Promise<RiderProfile> => {
    const response = await apiClient.put<RiderProfile>('/profile/me/vehicle', payload);
    return response.data;
};

/**
 * Updates the rider's bank account details for payouts.
 * This is a sensitive action and may require additional verification steps.
 * @param payload - The new bank account details.
 * @returns A promise that resolves with the updated rider profile.
 * @throws {ApiError} on failure.
 */
const updateBankDetails = async (payload: UpdateBankDetailsPayload): Promise<RiderProfile> => {
    const response = await apiClient.put<RiderProfile>('/profile/me/bank-details', payload);
    return response.data;
};

/**
 * Sets the rider's availability status (Online/Offline).
 * @param status - The new availability status.
 * @returns A promise that resolves on successful update.
 * @throws {ApiError} if the rider cannot go offline (e.g., during an active task).
 */
const setAvailabilityStatus = async (status: 'Online' | 'Offline'): Promise<void> => {
  await apiClient.patch('/profile/me/availability', { status });
};

export const profileApi = {
  getProfile,
  updateProfile,
  updateVehicleDetails,
  updateBankDetails,
  setAvailabilityStatus,
};