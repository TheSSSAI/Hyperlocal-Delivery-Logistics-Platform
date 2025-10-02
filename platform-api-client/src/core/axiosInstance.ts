import axios, { AxiosInstance } from 'axios';

// Default configuration for the Axios instance
const AXIOS_DEFAULT_CONFIG = {
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

/**
 * Creates and configures an Axios instance for making API calls.
 * This factory function allows for consistent client configuration across the application.
 *
 * @param {string} baseURL - The base URL for all API requests (e.g., 'https://api.yourplatform.com/api/v1').
 * @returns {AxiosInstance} A configured Axios instance.
 */
export const createAxiosInstance = (baseURL: string): AxiosInstance => {
  if (!baseURL) {
    throw new Error('A baseURL is required to create an Axios instance.');
  }

  const instance = axios.create({
    ...AXIOS_DEFAULT_CONFIG,
    baseURL,
  });

  // You can add generic interceptors here if they are not related to authentication logic.
  // For example, logging requests and responses in a development environment.
  if (process.env.NODE_ENV === 'development') {
    instance.interceptors.request.use(
      (request) => {
        console.log(
          `[API Request] ${request.method?.toUpperCase()} ${request.url}`,
          {
            headers: request.headers,
            params: request.params,
            data: request.data,
          },
        );
        return request;
      },
      (error) => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
      },
    );

    instance.interceptors.response.use(
      (response) => {
        console.log(`[API Response] ${response.status} ${response.config.url}`, {
          data: response.data,
        });
        return response;
      },
      (error) => {
        if (axios.isAxiosError(error)) {
          console.error(
            `[API Response Error] ${error.response?.status} ${error.config?.url}`,
            {
              message: error.message,
              response: error.response?.data,
            },
          );
        } else {
          console.error('[API Response Error] Non-Axios error', error);
        }
        return Promise.reject(error);
      },
    );
  }

  return instance;
};