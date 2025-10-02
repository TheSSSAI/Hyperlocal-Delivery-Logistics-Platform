import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { environment } from '../config/environment';
import { retrieveToken, saveToken, clearToken } from '../lib/secureStorage';
import { navigationRef } from '../lib/navigationService';
import { AuthStackParamList } from '../navigation/navigation.types';

// Type definition for the token payload
interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

// A flag to prevent multiple concurrent token refresh attempts
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: AxiosError) => void }> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });

  failedQueue = [];
};

const apiClient: AxiosInstance = axios.create({
  baseURL: environment.api.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15-second timeout for requests
});

// Request Interceptor: Injects the access token into the Authorization header
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await retrieveToken('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response Interceptor: Handles token refresh logic for 401 Unauthorized errors
apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = await retrieveToken('refreshToken');
      if (!refreshToken) {
        // No refresh token, navigate to login
        isRefreshing = false;
        clearToken();
        if (navigationRef.isReady()) {
            navigationRef.navigate('Auth', { screen: 'Login' } as AuthStackParamList['Login']);
        }
        return Promise.reject(error);
      }

      try {
        const { data: tokenResponse } = await axios.post<TokenResponse>(
          `${environment.api.baseUrl}/auth/refresh`,
          { refreshToken },
        );

        await saveToken('accessToken', tokenResponse.accessToken);
        await saveToken('refreshToken', tokenResponse.refreshToken);

        if (apiClient.defaults.headers.common) {
            apiClient.defaults.headers.common.Authorization = `Bearer ${tokenResponse.accessToken}`;
        }
        if(originalRequest.headers){
            originalRequest.headers.Authorization = `Bearer ${tokenResponse.accessToken}`;
        }

        processQueue(null, tokenResponse.accessToken);
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        clearToken();
        if (navigationRef.isReady()) {
            navigationRef.navigate('Auth', { screen: 'Login' } as AuthStackParamList['Login']);
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // For other errors, just pass them along
    return Promise.reject(error);
  },
);

export default apiClient;