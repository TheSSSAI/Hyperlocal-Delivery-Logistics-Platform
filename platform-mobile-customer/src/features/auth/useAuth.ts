import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { AppDispatch } from '../../store/store'; // Assuming AppDispatch will be defined in store.ts (Level 4)

import {
  requestLoginOtp,
  verifyLoginOtp,
  logoutUser,
  registerUser,
  selectIsAuthenticated,
  selectAuthUser,
  selectAuthLoading,
  selectAuthError,
  clearAuthError,
} from './authSlice';

import { OtpVerificationPayload, RegistrationPayload } from './auth.types';

/**
 * Custom hook to provide a simplified, component-friendly interface to the authentication state and actions.
 * It abstracts away the direct use of Redux's `useSelector` and `useDispatch` in UI components.
 *
 * @returns An object containing authentication state and memoized functions to dispatch auth actions.
 */
export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectAuthUser);
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const handleRequestLoginOtp = useCallback(
    (mobileNumber: string) => {
      return dispatch(requestLoginOtp(mobileNumber));
    },
    [dispatch],
  );

  const handleVerifyLoginOtp = useCallback(
    (payload: OtpVerificationPayload) => {
      return dispatch(verifyLoginOtp(payload));
    },
    [dispatch],
  );

  const handleRegisterUser = useCallback(
    (payload: RegistrationPayload) => {
      // Assuming a registerUser thunk exists for a complete registration flow
      return dispatch(registerUser(payload));
    },
    [dispatch],
  );

  const handleLogout = useCallback(() => {
    return dispatch(logoutUser());
  }, [dispatch]);

  const handleClearAuthError = useCallback(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  return {
    isAuthenticated,
    user,
    isLoading,
    error,
    requestLoginOtp: handleRequestLoginOtp,
    verifyLoginOtp: handleVerifyLoginOtp,
    registerUser: handleRegisterUser,
    logout: handleLogout,
    clearError: handleClearAuthError,
  };
};