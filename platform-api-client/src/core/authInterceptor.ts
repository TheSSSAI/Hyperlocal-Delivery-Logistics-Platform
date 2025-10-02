import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';
import { ApiClientConfig } from '../types';

let isRefreshing = false;
let failedQueue: ((token: string) => void)[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom(Promise.reject(error));
    } else {
      prom(token as string);
    }
  });

  failedQueue = [];
};

/**
 * Sets up Axios interceptors for handling authentication (JWT injection and refresh token flow).
 * This is the core logic for maintaining a user's session transparently.
 *
 * @param {AxiosInstance} axiosInstance The Axios instance to attach the interceptors to.
 * @param {ApiClientConfig} config The API client configuration containing the tokenProvider and onAuthFailure callback.
 */
export const setupAuthInterceptor = (
  axiosInstance: AxiosInstance,
  config: ApiClientConfig,
): void => {
  const { tokenProvider, onAuthFailure } = config;

  // Request interceptor: Injects the access token into the Authorization header.
  axiosInstance.interceptors.request.use(
    async (requestConfig: InternalAxiosRequestConfig) => {
      // Do not add auth token to refresh token requests
      if (requestConfig.url?.endsWith('/auth/refresh')) {
        return requestConfig;
      }
      const tokens = await tokenProvider.getTokens();
      if (tokens?.accessToken) {
        requestConfig.headers.Authorization = `Bearer ${tokens.accessToken}`;
      }
      return requestConfig;
    },
    error => Promise.reject(error),
  );

  // Response interceptor: Handles 401 Unauthorized errors by attempting to refresh the token.
  axiosInstance.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (!originalRequest) {
        return Promise.reject(error);
      }

      // If the error is not a 401, or it's a 401 for the refresh token endpoint, reject immediately.
      if (
        error.response?.status !== 401 ||
        originalRequest.url?.endsWith('/auth/refresh')
      ) {
        return Promise.reject(error);
      }

      // Prevent retry loops for the same request
      if (originalRequest._retry) {
        // If a retried request fails with 401, it means the new token is also invalid.
        // Trigger the auth failure callback to log the user out.
        await tokenProvider.clearTokens();
        onAuthFailure();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        // If a token refresh is already in progress, queue this request.
        return new Promise(resolve => {
          failedQueue.push(token => {
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
            }
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const tokens = await tokenProvider.getTokens();
        if (!tokens?.refreshToken) {
          // No refresh token available, cannot refresh.
          processQueue(error, null);
          await tokenProvider.clearTokens();
          onAuthFailure();
          return Promise.reject(error);
        }

        // Perform the token refresh call.
        // We use a new, clean axios instance or a direct call to avoid interceptor loops.
        const refreshResponse = await axios.post(
          `${config.baseURL}/auth/refresh`,
          {
            refreshToken: tokens.refreshToken,
          },
        );

        const newTokens = refreshResponse.data;
        await tokenProvider.setTokens(newTokens);

        // Update the Authorization header on the original request.
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${newTokens.accessToken}`;
        }

        // Process all queued requests with the new token.
        processQueue(null, newTokens.accessToken);

        // Retry the original request that failed.
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // The refresh token is invalid or the refresh endpoint failed.
        processQueue(refreshError as AxiosError, null);
        await tokenProvider.clearTokens();
        onAuthFailure(); // Critical: Notify the consuming app to handle logout.
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    },
  );
};