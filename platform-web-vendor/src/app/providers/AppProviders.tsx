import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@/features/auth/hooks/useAuth';
import { NotificationProvider } from '@/app/providers/NotificationProvider';
import { Toaster } from '@repo/ui/components/ui/sonner'; // Assuming shared UI for toast notifications

/**
 * @description
 * Centralized provider component that wraps the entire application with all necessary
 * global context providers. This ensures that services like routing, data caching (TanStack Query),
 * authentication, and real-time notifications are available throughout the component tree.
 *
 * @dependencies
 * - `react-router-dom`: For client-side routing.
 * - `@tanstack/react-query`: For server state management.
 * - `AuthProvider` (Level 2): For managing authentication state.
 * - `NotificationProvider` (Level 2): For managing WebSocket connections.
 * - `@repo/ui/components/ui/sonner`: For displaying global toast notifications.
 *
 * @requirements
 * - REQ-1-096 (JWTs): The QueryClient is configured to handle global 401 errors, triggering a logout.
 * - REQ-1-105 (Microservices Communication): Provides the foundation for TanStack Query and WebSockets.
 * - REQ-1-088 (I18N): An I18n provider would be added here in a future implementation.
 *
 * @returns A composition of all global providers.
 */

// Function to handle global API errors, particularly for authentication.
// This is defined outside the component to be accessible to the QueryClient constructor.
const handleGlobalError = (error: unknown, logout: () => void) => {
  if (
    error &&
    typeof error === 'object' &&
    'response' in error &&
    error.response &&
    typeof error.response === 'object' &&
    'status' in error.response &&
    error.response.status === 401
  ) {
    // If a 401 Unauthorized error is received from any API call,
    // it signifies an expired or invalid session. Trigger a global logout.
    logout();
  }
};

// A small wrapper component is needed to access the `logout` function from the `useAuth` hook,
// which can only be called within a component that is a child of `AuthProvider`.
const QueryProviderWithAuth: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { logout } = useAuth();

  // Create the QueryClient instance with the global error handler.
  // The instance is memoized with useState to prevent re-creation on every render.
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: (failureCount, error) => {
              if (
                error &&
                typeof error === 'object' &&
                'response' in error &&
                error.response &&
                typeof error.response === 'object' &&
                'status' in error.response
              ) {
                const status = error.response.status as number;
                // Do not retry on 4xx client errors (e.g., 401, 403, 404)
                if (status >= 400 && status < 500) {
                  return false;
                }
              }
              // Retry up to 2 times for other errors (e.g., network or 5xx)
              return failureCount < 2;
            },
          },
          mutations: {
            onError: (error) => handleGlobalError(error, logout),
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <BrowserRouter>
      {/* AuthProvider must wrap QueryProvider to make the `logout` function available */}
      <AuthProvider>
        <QueryProviderWithAuth>
          {/* NotificationProvider needs auth context to get the token for the WebSocket connection */}
          <NotificationProvider>
            {children}
            <Toaster position="top-right" richColors />
          </NotificationProvider>
        </QueryProviderWithAuth>
      </AuthProvider>
    </BrowserRouter>
  );
};