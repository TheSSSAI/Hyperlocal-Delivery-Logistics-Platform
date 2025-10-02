import { storageService } from '../../services/storageService';
import { RequestOtpPayload, VerifyOtpPayload, AuthTokens } from './auth.types';
// Assume apiClient is from a shared library, for now we will mock it.
// import { apiClient } from '@hyperlocal/api-client';

// Mock API Client for demonstration purposes as per SDS
const apiClient = {
  post: async (url: string, data: any): Promise<any> => {
    console.log(`[MockApiClient] POST to ${url} with`, data);
    if (url.endsWith('/auth/register/otp') || url.endsWith('/auth/login/otp')) {
      if (data.mobileNumber === '9876543210') { // Existing user
         return Promise.reject({ response: { status: 409, data: { message: 'User already exists' } } });
      }
      return Promise.resolve({ data: { message: 'OTP sent' } });
    }
    if (url.endsWith('/auth/register/verify') || url.endsWith('/auth/login/verify')) {
        if (data.otp === '123456') {
            return Promise.resolve({
                data: {
                    accessToken: 'mock-access-token',
                    refreshToken: 'mock-refresh-token',
                }
            });
        }
        return Promise.reject({ response: { status: 400, data: { message: 'Invalid OTP' } } });
    }
    if (url.endsWith('/auth/logout')) {
        return Promise.resolve({ data: { message: 'Logged out' } });
    }
    return Promise.reject({ response: { status: 404, data: { message: 'Not Found' } } });
  },
};

class AuthService {
  /**
   * Requests an OTP for registration.
   * @param {RequestOtpPayload} payload - The mobile number for which to request an OTP.
   * @returns {Promise<void>}
   */
  public async requestRegistrationOtp(payload: RequestOtpPayload): Promise<void> {
    await apiClient.post('/auth/register/otp', payload);
  }

  /**
   * Verifies the OTP for registration, creates a user, and returns auth tokens.
   * @param {VerifyOtpPayload} payload - The mobile number and OTP to verify.
   * @returns {Promise<AuthTokens>} The access and refresh tokens.
   */
  public async verifyRegistrationOtp(payload: VerifyOtpPayload): Promise<AuthTokens> {
    const response = await apiClient.post('/auth/register/verify', payload);
    const tokens: AuthTokens = response.data;
    await storageService.setTokens(tokens);
    return tokens;
  }

  /**
   * Requests an OTP for login.
   * @param {RequestOtpPayload} payload - The mobile number for which to request an OTP.
   * @returns {Promise<void>}
   */
  public async requestLoginOtp(payload: RequestOtpPayload): Promise<void> {
    await apiClient.post('/auth/login/otp', payload);
  }

  /**
   * Verifies the OTP for login and returns auth tokens.
   * @param {VerifyOtpPayload} payload - The mobile number and OTP to verify.
   * @returns {Promise<AuthTokens>} The access and refresh tokens.
   */
  public async verifyLoginOtp(payload: VerifyOtpPayload): Promise<AuthTokens> {
    const response = await apiClient.post('/auth/login/verify', payload);
    const tokens: AuthTokens = response.data;
    await storageService.setTokens(tokens);
    return tokens;
  }

  /**
   * Logs the user out by clearing stored tokens.
   * Optionally, it could also call a backend endpoint to invalidate the refresh token.
   * @returns {Promise<void>}
   */
  public async logout(): Promise<void> {
    // Optionally call a backend endpoint to invalidate the refresh token
    // await apiClient.post('/auth/logout', { refreshToken: (await storageService.getTokens())?.refreshToken });
    await storageService.clearTokens();
  }

  /**
   * Checks for existing tokens in storage to initialize the app state.
   * @returns {Promise<AuthTokens | null>} The stored tokens or null if none exist.
   */
  public async getInitialAuthStatus(): Promise<AuthTokens | null> {
    return await storageService.getTokens();
  }
}

export const authService = new AuthService();