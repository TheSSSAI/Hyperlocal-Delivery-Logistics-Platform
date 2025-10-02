import axios, { AxiosInstance } from 'axios';
import { DefaultApi, Configuration } from '../api/generated';
import { ApiClientConfig } from '../types';
import { createAxiosInstance } from './axiosInstance';
import { setupAuthInterceptors } from './authInterceptor';

/**
 * Factory function to create and configure a fully-typed API client instance.
 *
 * This function serves as the main entry point for consuming applications. It encapsulates
 * the entire setup process, including Axios instance creation, attachment of authentication
 * interceptors for JWT lifecycle management, and instantiation of the OpenAPI-generated
 * API client.
 *
 * @param {ApiClientConfig} config - The configuration object required for initialization.
 *   This object provides the API base URL, a `tokenProvider` for managing auth tokens,
 *   and an `onAuthFailure` callback to handle unrecoverable authentication errors.
 * @returns {DefaultApi} A fully configured and ready-to-use instance of the DefaultApi client.
 *
 * @example
 * // In your main application setup (e.g., React App)
 * import { createApiClient, TokenProvider } from '@platform/api-client';
 *
 * // Implement a TokenProvider that integrates with your app's storage
 * const myTokenProvider: TokenProvider = {
 *   getTokens: async () => ({
 *     accessToken: localStorage.getItem('accessToken'),
 *     refreshToken: localStorage.getItem('refreshToken'),
 *   }),
 *   setTokens: async (tokens) => {
 *     localStorage.setItem('accessToken', tokens.accessToken);
 *     localStorage.setItem('refreshToken', tokens.refreshToken);
 *   },
 *   clearTokens: async () => {
 *     localStorage.removeItem('accessToken');
 *     localStorage.removeItem('refreshToken');
 *   },
 * };
 *
 * const handleLogout = () => {
 *   // Logic to redirect user to login page
 *   console.log('Authentication failed, logging out.');
 *   window.location.href = '/login';
 * };
 *
 * const apiClient = createApiClient({
 *   baseURL: 'https://api.example.com/api/v1',
 *   tokenProvider: myTokenProvider,
 *   onAuthFailure: handleLogout,
 * });
 *
 * // Now you can use the apiClient throughout your application
 * // apiClient.getOrders().then(orders => console.log(orders));
 */
export const createApiClient = (config: ApiClientConfig): DefaultApi => {
  // Step 1: Validate the provided configuration to ensure critical components are present.
  if (!config || !config.baseURL || !config.tokenProvider || !config.onAuthFailure) {
    throw new Error(
      'ApiClient configuration is invalid. Please provide baseURL, tokenProvider, and onAuthFailure.',
    );
  }

  // Step 2: Create a base Axios instance with the specified baseURL and default settings.
  // This instance will be shared across all API calls made by the client.
  const axiosInstance: AxiosInstance = createAxiosInstance(config.baseURL);

  // Step 3: Set up the authentication interceptors.
  // This is a critical step that injects the logic for automatically handling
  // JWT access token injection, 401 error catching, and the refresh token flow.
  // It modifies the axiosInstance in place.
  setupAuthInterceptors(axiosInstance, config);

  // Step 4: Create a configuration object for the OpenAPI-generated client.
  // While we use our own Axios instance, this object is still required by the
  // generated class constructor. We pass the baseURL for consistency.
  const apiConfiguration = new Configuration({
    basePath: config.baseURL,
  });

  // Step 5: Instantiate the generated DefaultApi client.
  // We pass our configured Configuration object, the base path, and our custom,
  // interceptor-equipped Axios instance. This overrides the default Axios instance
  // that the generated client would otherwise create.
  const apiClient = new DefaultApi(apiConfiguration, config.baseURL, axiosInstance);

  // The returned apiClient is now fully configured and ready for use.
  // All requests made through it will automatically have the Authorization header
  // attached and will handle token refreshes transparently.
  return apiClient;
};