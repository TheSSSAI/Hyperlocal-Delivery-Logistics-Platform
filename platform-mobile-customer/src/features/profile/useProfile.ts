import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { AppDispatch } from '../../store/store'; // Assuming AppDispatch will be defined in store.ts (Level 4)

import {
  fetchProfile,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  selectUserProfile,
  selectUserAddresses,
  selectProfileLoading,
  selectProfileError,
  updateConsent,
} from './profileSlice';
import { UserProfile } from '../../types/user.types';
import { Address, AddressPayload } from '../../types/address.types';
import { ConsentPayload } from './profile.types';

/**
 * Custom hook for managing the user's profile and addresses.
 * Provides UI components with user data and functions for CRUD operations on their profile
 * and saved addresses.
 *
 * @returns An object containing profile state and memoized functions for profile actions.
 */
export const useProfile = () => {
  const dispatch = useDispatch<AppDispatch>();

  const profile = useSelector(selectUserProfile);
  const addresses = useSelector(selectUserAddresses);
  const isLoading = useSelector(selectProfileLoading);
  const error = useSelector(selectProfileError);

  const handleFetchProfile = useCallback(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleUpdateProfile = useCallback(
    (profileData: Partial<UserProfile>) => {
      return dispatch(updateProfile(profileData));
    },
    [dispatch],
  );

  const handleAddAddress = useCallback(
    (addressData: AddressPayload) => {
      return dispatch(addAddress(addressData));
    },
    [dispatch],
  );

  const handleUpdateAddress = useCallback(
    (addressData: Partial<Address> & { id: string }) => {
      return dispatch(updateAddress(addressData));
    },
    [dispatch],
  );

  const handleDeleteAddress = useCallback(
    (addressId: string) => {
      return dispatch(deleteAddress(addressId));
    },
    [dispatch],
  );

  const handleUpdateConsent = useCallback(
    (payload: ConsentPayload) => {
      return dispatch(updateConsent(payload));
    },
    [dispatch],
  );

  return {
    profile,
    addresses,
    isLoading,
    error,
    fetchProfile: handleFetchProfile,
    updateProfile: handleUpdateProfile,
    addAddress: handleAddAddress,
    updateAddress: handleUpdateAddress,
    deleteAddress: handleDeleteAddress,
    updateConsent: handleUpdateConsent,
  };
};