/**
 * @file Defines the core configuration interfaces for the API client.
 * These types provide the contract for initializing the client and handling
 * authentication, ensuring a decoupled and flexible architecture.
 */

/**
 * Represents the pair of authentication tokens used by the system.
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Defines the contract for a token provider.
 * The consuming application (e.g., React, Vue, Angular app) must implement this interface
 * to manage the secure storage and retrieval of authentication tokens. This decouples the
 * API client from the specific storage mechanism (e.g., localStorage, secure mobile storage).
 */
export interface TokenProvider {
  /**
   * Asynchronously retrieves the current authentication tokens.
   * @returns A Promise that resolves to an object containing the accessToken and refreshToken, or null if they don't exist.
   */
  getTokens(): Promise<{
    accessToken: string | null;
    refreshToken: string | null;
  }>;

  /**
   * Asynchronously stores the provided authentication tokens.
   * @param tokens - An object containing the new accessToken and refreshToken to store.
   * @returns A Promise that resolves when the tokens have been successfully stored.
   */
  setTokens(tokens: AuthTokens): Promise<void>;

  /**
   * Asynchronously clears all stored authentication tokens.
   * This is typically called on logout or when the refresh token expires.
   * @returns A Promise that resolves when the tokens have been cleared.
   */
  clearTokens(): Promise<void>;
}

/**
 * Defines the configuration object required by the `apiClientFactory`.
 * This object provides all necessary parameters to initialize a fully functional
 * API client instance for a specific environment and user session.
 */
export interface ApiClientConfig {
  /**
   * The base URL of the API Gateway.
   * Must include the protocol and API version.
   * @example 'https://api.yourdomain.com/api/v1'
   */
  baseURL: string;

  /**
   * An implementation of the `TokenProvider` interface.
   * This object will be used by the auth interceptor to manage token lifecycle.
   */
  tokenProvider: TokenProvider;

  /**
   * A callback function that the API client will invoke when a token refresh fails
   * or authentication is irrevocably lost. The consuming application should use this
   * to trigger a global logout state (e.g., redirect to login page, clear user state).
   */
  onAuthFailure: () => void;
}