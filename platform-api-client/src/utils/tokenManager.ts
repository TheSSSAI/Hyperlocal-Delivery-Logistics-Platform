import { AuthTokens, TokenProvider } from '../types';

/**
 * @file This file serves as a guide and an example for implementing the TokenProvider interface.
 *
 * CRITICAL ARCHITECTURAL DECISION:
 * The `platform-api-client` library is intentionally decoupled from any specific token
 * storage mechanism. This is to ensure it remains framework-agnostic and can be used in
 * various environments (web, mobile, server-side) without imposing a storage strategy.
 *
 * The consuming application is RESPONSIBLE for providing a concrete implementation of the
 * `TokenProvider` interface. This implementation will handle the actual reading from and
 * writing to storage (e.g., browser localStorage, React Native's SecureStore, cookies, etc.).
 *
 * This approach adheres to the Dependency Inversion Principle, making the library more
 * modular, secure, and easier to test.
 *
 * Below is a non-functional, commented-out example of how a `TokenProvider` might be
 * implemented for a web application using `localStorage`.
 *
 * DO NOT USE THIS IMPLEMENTATION DIRECTLY IN PRODUCTION WITHOUT CONSIDERING SECURITY IMPLICATIONS.
 * For web applications, storing tokens in HttpOnly, SameSite=Strict cookies is generally more secure
 * than `localStorage`. For mobile, use encrypted storage like Keychain (iOS) or Keystore (Android).
 */

/*
// ===================================================================================
// EXAMPLE: localStorage-based TokenProvider for a Web Application
// This is for demonstration purposes only.
// ===================================================================================

const ACCESS_TOKEN_KEY = 'platform_access_token';
const REFRESH_TOKEN_KEY = 'platform_refresh_token';

export class LocalStorageTokenProvider implements TokenProvider {
  public async getTokens(): Promise<{
    accessToken: string | null;
    refreshToken: string | null;
  }> {
    try {
      const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      return { accessToken, refreshToken };
    } catch (error) {
      console.error('Failed to retrieve tokens from localStorage:', error);
      return { accessToken: null, refreshToken: null };
    }
  }

  public async setTokens(tokens: AuthTokens): Promise<void> {
    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    } catch (error) {
      console.error('Failed to store tokens in localStorage:', error);
      // Depending on the application's needs, you might want to re-throw the error
      // or handle it gracefully (e.g., notify the user that their session may not persist).
    }
  }

  public async clearTokens(): Promise<void> {
    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Failed to clear tokens from localStorage:', error);
    }
  }
}

// HOW TO USE IT IN YOUR APPLICATION (e.g., in your main App setup file):
//
// import { createApiClient, LocalStorageTokenProvider } from '@platform/api-client';
//
// const handleAuthFailure = () => {
//   // Logic to log the user out globally
//   console.log('Authentication failed, logging out.');
//   window.location.href = '/login';
// };
//
// const tokenProvider = new LocalStorageTokenProvider();
//
// const apiClient = createApiClient({
//   baseURL: 'https://api.yourdomain.com/api/v1',
//   tokenProvider,
//   onAuthFailure: handleAuthFailure,
// });
//
// export default apiClient; // Export the configured instance for use throughout your app

*/

// This file is intentionally left without a default export, as its purpose is informational.
// The primary exports of the library are managed through `src/index.ts`.