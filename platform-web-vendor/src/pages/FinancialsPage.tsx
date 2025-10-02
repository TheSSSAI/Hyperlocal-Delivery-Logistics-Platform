import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/shadcn/card';
import { Button } from '@/shared/ui/shadcn/button';
import { Download } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/shadcn/alert';
import { Construction } from 'lucide-react';

/**
 * @file FinancialsPage.tsx
 * @description Page for vendors to view their financial performance and download statements.
 * Fulfills user stories VND-025 and VND-026.
 */

const FinancialsPage: React.FC = () => {
  // Mock data - In a real implementation, this would come from a `useFinancials` hook.
  const kpiData = {
    totalSalesMonth: 125340.50,
    totalOrdersMonth: 452,
    netEarningsMonth: 106539.43,
    lastPayout: 25432.10,
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Financials</h1>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Download Monthly Statement
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Sales (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(kpiData.totalSalesMonth)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Orders (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.totalOrdersMonth}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Net Earnings (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(kpiData.netEarningsMonth)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Last Payout</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(kpiData.lastPayout)}</div>
          </CardContent>
        </Card>
      </div>
      
      <Alert>
        <Construction className="h-4 w-4" />
        <AlertTitle>Under Construction</AlertTitle>
        <AlertDescription>
          Detailed transaction history and reporting charts will be available here soon.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default FinancialsPage;