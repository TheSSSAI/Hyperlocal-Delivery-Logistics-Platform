import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { AppHeader } from '@/shared/ui/components/AppHeader'; // From shared UI library
import { SidebarNav } from '@/shared/ui/components/SidebarNav'; // From shared UI library
import { Layout, LayoutContent, LayoutHeader, LayoutSidenav } from '@/shared/ui/components/Layout'; // From shared UI library
import { navItems } from '@/app/config/navItems'; // Assuming nav config is centralized

export const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        navigate('/login');
      }
    });
  };

  return (
    <Layout>
      <LayoutHeader>
        <AppHeader 
          user={{ name: user?.storeName || 'Vendor', email: user?.email || '' }}
          onLogout={handleLogout}
        />
      </LayoutHeader>
      <LayoutSidenav>
        <SidebarNav items={navItems} />
      </LayoutSidenav>
      <LayoutContent>
        <main className="p-4 sm:p-6 lg:p-8">
            <Outlet />
        </main>
      </LayoutContent>
    </Layout>
  );
};