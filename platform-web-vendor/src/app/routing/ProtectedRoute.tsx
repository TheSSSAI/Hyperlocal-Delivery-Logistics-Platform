import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Spinner } from '@repo/ui/components/ui/spinner'; // Assuming shared UI library has a Spinner

/**
 * @description
 * A route guard component that checks for an authenticated vendor session.
 * It enforces authentication for protected routes within the application.
 *
 * @dependencies
 * - `useAuth` hook (Level 2): To get the current authentication status.
 * - `react-router-dom`: For navigation and rendering child routes.
 *
 * @requirements
 * - REQ-1-010: Enforces access for the 'Vendor' role by checking authentication.
 * - REQ-1-096: Part of the JWT session management flow, ensuring only authenticated users can access protected areas.
 *
 * @returns
 * - A loading spinner while the authentication state is being initialized.
 * - A redirect to the '/login' page if the user is not authenticated.
 * - The child routes (via `<Outlet />`) if the user is authenticated.
 */
const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // While the authentication status is being determined (e.g., on initial app load),
  // display a loading indicator to prevent a flash of the login screen for authenticated users.
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner size="large" />
      </div>
    );
  }

  // If the initial check is complete and the user is not authenticated,
  // redirect them to the login page. The 'replace' prop prevents the login
  // page from being added to the browser's history stack.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If the user is authenticated, render the nested child routes defined within this protected route.
  // The `<Outlet />` component from react-router-dom serves as a placeholder for these child routes.
  return <Outlet />;
};

export default ProtectedRoute;