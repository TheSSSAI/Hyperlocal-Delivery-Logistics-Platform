import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/shadcn/tabs';
import { StoreProfileForm } from '@/features/store-profile/components/StoreProfileForm';
import { BusinessHoursForm } from '@/features/store-profile/components/BusinessHoursForm';
import { CategoryManagement } from '@/features/product-catalog/components/CategoryManagement';
import { Alert, AlertTitle, AlertDescription } from '@/shared/ui/shadcn/alert';
import { Construction } from 'lucide-react';
import { Toaster } from '@/shared/ui/shadcn/toaster';

/**
 * @file SettingsPage.tsx
 * @description A container page for all vendor-configurable settings, such as store profile, business hours, and product categories.
 * Fulfills user stories VND-005, VND-006, VND-008.
 */
const LicenseManagement = () => (
  <Alert>
    <Construction className="h-4 w-4" />
    <AlertTitle>Under Construction</AlertTitle>
    <AlertDescription>The view for License Management is being built.</AlertDescription>
  </Alert>
);

const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Store Profile</TabsTrigger>
          <TabsTrigger value="hours">Business Hours</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="pt-6">
          <StoreProfileForm />
        </TabsContent>

        <TabsContent value="hours" className="pt-6">
          <BusinessHoursForm />
        </TabsContent>

        <TabsContent value="categories" className="pt-6">
          <CategoryManagement />
        </TabsContent>

        <TabsContent value="compliance" className="pt-6">
          <LicenseManagement />
        </TabsContent>
      </Tabs>
      <Toaster />
    </div>
  );
};

export default SettingsPage;