import React from 'react';
import { IncomingOrderQueue } from '@/features/order-management/components/IncomingOrderQueue';
import { StoreAvailabilityToggle } from '@/features/store-profile/components/StoreAvailabilityToggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/shadcn/card';

/**
 * @file DashboardPage.tsx
 * @description The main landing page for authenticated vendors. It provides an at-a-glance overview
 * of the store's status and the most critical information, which is the queue of new incoming orders.
 */
const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <StoreAvailabilityToggle />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main content area for new orders */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>New Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <IncomingOrderQueue />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar area for KPIs or other info */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Today's Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Completed Orders</p>
                <p className="text-2xl font-bold">42</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <p className="text-2xl font-bold">₹12,450.00</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;