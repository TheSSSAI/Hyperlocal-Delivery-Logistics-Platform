import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/shadcn/card';
import { Star } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/shadcn/alert';
import { Construction } from 'lucide-react';

/**
 * @file RatingsAndReviewsPage.tsx
 * @description Page for vendors to view their customer ratings and feedback.
 * Fulfills user story VND-023.
 */

const RatingsAndReviewsPage: React.FC = () => {
    // This is placeholder content. In a real implementation, this page
    // would use a `useRatings` hook to fetch data and would include
    // components for filtering, sorting, and displaying a list of review cards.

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Ratings & Reviews</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Overall Rating</CardTitle>
          <CardDescription>Based on 152 customer reviews</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center space-x-2">
          <div className="text-4xl font-bold">4.7</div>
          <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
        </CardContent>
      </Card>

      <Alert>
        <Construction className="h-4 w-4" />
        <AlertTitle>Under Construction</AlertTitle>
        <AlertDescription>
          The detailed list of individual customer reviews with filtering and sorting options will be displayed here soon.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default RatingsAndReviewsPage;