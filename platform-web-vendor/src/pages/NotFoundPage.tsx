import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui/shadcn/button';

/**
 * @file NotFoundPage.tsx
 * @description A simple 404 Not Found page for handling unmatched routes.
 */

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-center">
      <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-100">404</h1>
      <p className="mt-4 text-2xl text-gray-600 dark:text-gray-300">Page Not Found</p>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link to="/" className="mt-6">
        <Button>Go Back to Dashboard</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;