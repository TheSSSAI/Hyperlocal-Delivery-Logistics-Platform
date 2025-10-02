import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '@/shared/ui/MainLayout';
import LoginPage from '@/pages/LoginPage';
import { Spinner } from '@repo/ui/components/ui/spinner';

/**
 * @description
 * Defines the entire routing structure for the vendor web application.
 * It uses route-based code splitting with `React.lazy` to improve initial load performance.
 *
 * @dependencies
 * - `react-router-dom`: For defining routes.
 * - `ProtectedRoute.tsx` (Level 6): To guard authenticated routes.
 * - `MainLayout.tsx` (Level 4): To provide the common application layout (header, sidebar).
 * - All Page Components (Level 5): Lazy-loaded to enable code splitting.
 *
 * @requirements
 * - REQ-1-093 (Performance): Implements code splitting to achieve an LCP of under 2.5 seconds.
 * - REQ-1-010 (Vendor Role): Defines the pages accessible to the authenticated vendor.
 *
 * @returns A React component containing the application's route definitions.
 */

// Lazy load all protected page components for code splitting.
// This ensures that the code for these pages is only downloaded when the user navigates to them.
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const ProductsPage = lazy(() => import('@/pages/ProductsPage'));
const OrdersPage = lazy(() => import('@/pages/OrdersPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const FinancialsPage = lazy(() => import('@/pages/FinancialsPage'));
const RatingsAndReviewsPage = lazy(
  () => import('@/pages/RatingsAndReviewsPage'),
);
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// A fallback component to display while lazy-loaded components are being fetched.
const SuspenseFallback = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <Spinner size="large" />
  </div>
);

const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <Routes>
        {/* Public Route: The login page is accessible to everyone. */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes: All routes nested under this element are protected. */}
        {/* The `ProtectedRoute` component checks for authentication. */}
        {/* If authenticated, it renders an `<Outlet />` which is replaced by the `MainLayout`. */}
        <Route element={<ProtectedRoute />}>
          {/* The `MainLayout` provides the consistent header and sidebar for all protected pages. */}
          {/* It contains its own `<Outlet />` where the specific page components will be rendered. */}
          <Route path="/" element={<MainLayout />}>
            {/* Index route for the main dashboard */}
            <Route index element={<DashboardPage />} />
            {/* Feature-specific routes */}
            <Route path="products" element={<ProductsPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="financials" element={<FinancialsPage />} />
            <Route path="ratings" element={<RatingsAndReviewsPage />} />
            <Route path="settings" element={<SettingsPage />} />

            {/* A catch-all route for any other path, rendering the NotFoundPage. */}
            {/* This must be the last route in the list. */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRouter;