import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/shadcn/tabs';
import { IncomingOrderQueue } from '@/features/order-management/components/IncomingOrderQueue';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/shadcn/alert';
import { Construction } from 'lucide-react';

/**
 * @file OrdersPage.tsx
 * @description The main page for vendors to manage all their orders, categorized by status.
 * It uses a tabbed layout to separate new, in-progress, and completed orders.
 * Fulfills user story VND-016.
 */

const OrdersPage: React.FC = () => {
  // Placeholder components for other order states
  const InProgressOrders = () => (
     <Alert>
      <Construction className="h-4 w-4" />
      <AlertTitle>Under Construction</AlertTitle>
      <AlertDescription>The view for 'In Progress' orders is being built.</AlertDescription>
    </Alert>
  );

  const CompletedOrders = () => (
     <Alert>
      <Construction className="h-4 w-4" />
      <AlertTitle>Under Construction</AlertTitle>
      <AlertDescription>The view for 'Completed' orders is being built.</AlertDescription>
    </Alert>
  );


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
      <Tabs defaultValue="new" className="space-y-4">
        <TabsList>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="preparing">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="new">
          <IncomingOrderQueue />
        </TabsContent>

        <TabsContent value="preparing">
          <InProgressOrders />
        </TabsContent>

        <TabsContent value="completed">
          <CompletedOrders />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrdersPage;