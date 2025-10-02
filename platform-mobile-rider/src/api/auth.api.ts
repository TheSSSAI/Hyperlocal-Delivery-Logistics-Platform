import apiClient from './apiClient';
import { IAuthTokens, ILoginRequest, ILoginResponse } from '../shared/types/auth.types';
import { RiderRegistrationData } from '../features/auth/auth.types';

/**
 * Requests a One-Time Password (OTP) for login.
 * @param mobileNumber - The rider's 10-digit mobile number.
 * @returns A promise that resolves on success.
 * @throws {ApiError} on failure.
 */
const requestLoginOtp = async (mobileNumber: string): Promise<void> => {
  await apiClient.post('/auth/login/otp', { mobileNumber, role: 'RIDER' });
};

/**
 * Verifies the OTP and logs in the rider.
 * @param payload - The login request payload containing mobile number and OTP.
 * @returns A promise that resolves with the authentication tokens.
 * @throws {ApiError} on failure.
 */
const verifyLoginOtp = async (payload: ILoginRequest): Promise<ILoginResponse> => {
  const response = await apiClient.post<ILoginResponse>('/auth/login/verify', {
    ...payload,
    role: 'RIDER',
  });
  return response.data;
};

/**
 * Registers a new rider.
 * @param payload - The comprehensive registration data for the new rider.
 * @returns A promise that resolves with authentication tokens upon successful registration.
 * @throws {ApiError} on failure (e.g., duplicate mobile number).
 */
const registerRider = async (payload: RiderRegistrationData): Promise<IAuthTokens> => {
    const response = await apiClient.post<IAuthTokens>('/auth/register/rider', payload);
    return response.data;
};


/**
 * Uses a refresh token to get a new pair of access and refresh tokens.
 * @param refreshToken - The long-lived refresh token.
 * @returns A promise that resolves with new authentication tokens.
 * @throws {ApiError} if the refresh token is invalid or expired.
 */
const refreshToken = async (refreshToken: string): Promise<IAuthTokens> => {
  const response = await apiClient.post<IAuthTokens>('/auth/refresh', { refreshToken });
  return response.data;
};

/**
 * Invalidates the refresh token on the server side upon logout.
 * @param refreshToken - The refresh token to invalidate.
 * @returns A promise that resolves on successful logout.
 */
const logout = async (refreshToken: string): Promise<void> => {
    await apiClient.post('/auth/logout', { refreshToken });
};


export const authApi = {
  requestLoginOtp,
  verifyLoginOtp,
  registerRider,
  refreshToken,
  logout,
};