import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

/**
 * A module-level variable to hold the authentication token.
 * This is kept private within the module to prevent direct manipulation.
 * It is managed via setAuthToken and getAuthToken functions.
 */
let authToken: string | null = null;

/**
 * Creates and configures a singleton Axios instance for all HTTP communication
 * with the platform's API Gateway.
 *
 * REQ-1-106: All external access to microservice APIs must be routed through a central API Gateway.
 * REQ-1-092: All client-server communication must use HTTPS.
 * REQ-1-096: Use short-lived JWT access tokens.
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Axios request interceptor.
 * This function is executed before every request made by the apiClient.
 * Its purpose is to dynamically inject the JWT Authorization header.
 */
const authInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
};

// Add the interceptor to the apiClient instance.
apiClient.interceptors.request.use(authInterceptor);

/**
 * Sets or clears the authentication token used for API requests.
 * This function should be called by the authentication context/hook upon login,
 * token refresh, or logout.
 *
 * @param {string | null} token The JWT access token, or null to clear it.
 */
export const setAuthToken = (token: string | null): void => {
  authToken = token;
};

/**
 * Retrieves the current authentication token.
 * Useful for parts of the application that might need to know the token value
 * without having direct access to the auth context (e.g., WebSocket connection).
 *
 * @returns {string | null} The current JWT access token, or null if not set.
 */
export const getAuthToken = (): string | null => {
  return authToken;
};

export default apiClient;