import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/shadcn/card';
import { Toaster } from '@/shared/ui/shadcn/toaster';

/**
 * @file LoginPage.tsx
 * @description Renders the login page for vendors. This page is the entry point for unauthenticated users.
 * It uses the useAuth hook to manage authentication state and redirects authenticated users to the dashboard.
 * Fulfills user story VND-004.
 */

const LoginPage: React.FC = () => {
  const { isAuthenticated, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    // While checking authentication status, render nothing or a full-page spinner
    return <div className="flex h-screen w-screen items-center justify-center">Loading...</div>;
  }

  if (isAuthenticated) {
    // If user is already authenticated, redirect them to the main dashboard.
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Vendor Login</CardTitle>
            <CardDescription>Enter your mobile number to receive an OTP</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
};

export default LoginPage;