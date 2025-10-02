import React, { useEffect, useState } from 'react';
import { useOrders } from '../hooks/useOrders';
import { useNotifications } from '@/app/providers/NotificationProvider';
import { OrderCard } from './OrderCard';
import { OrderDetailModal } from './OrderDetailModal';
import { Order } from '../types';
import { Skeleton } from '@/shared/ui/shadcn/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/shadcn/alert';
import { Terminal } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

/**
 * @file IncomingOrderQueue.tsx
 * @description This component displays a real-time queue of new incoming orders that are pending vendor acceptance.
 * It fetches the initial list via HTTP and then listens for WebSocket events for real-time updates.
 * Fulfills requirements REQ-1-065 and user story VND-016.
 */

export const IncomingOrderQueue: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: initialOrders, isLoading, isError, error } = useOrders({ status: 'pending_vendor_acceptance' });
  const { on, off } = useNotifications();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const handleNewOrder = (newOrder: Order) => {
      // Add the new order to the top of the list in the TanStack Query cache
      queryClient.setQueryData<Order[]>(['orders', { status: 'pending_vendor_acceptance' }], (oldData) => {
        if (!oldData) return [newOrder];
        // Prevent duplicates
        if (oldData.some(order => order.id === newOrder.id)) return oldData;
        return [newOrder, ...oldData];
      });
    };

    const handleOrderCancelled = ({ orderId }: { orderId: string }) => {
       // Remove the cancelled order from the list in the cache
       queryClient.setQueryData<Order[]>(['orders', { status: 'pending_vendor_acceptance' }], (oldData) => {
        if (!oldData) return [];
        return oldData.filter(order => order.id !== orderId);
      });
    }

    on('new_order', handleNewOrder);
    on('order_cancelled', handleOrderCancelled); // Customer cancelled within grace period

    return () => {
      off('new_order', handleNewOrder);
      off('order_cancelled', handleOrderCancelled);
    };
  }, [on, off, queryClient]);

  const handleCardClick = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error Loading Orders</AlertTitle>
        <AlertDescription>{error?.message || 'An unexpected error occurred.'}</AlertDescription>
      </Alert>
    );
  }

  const orders = queryClient.getQueryData<Order[]>(['orders', { status: 'pending_vendor_acceptance' }]) ?? initialOrders ?? [];

  return (
    <div>
      {orders.length === 0 ? (
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>No New Orders</AlertTitle>
          <AlertDescription>You have no new orders at the moment. We'll notify you when one arrives.</AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} onClick={() => handleCardClick(order)} />
          ))}
        </div>
      )}

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          isOpen={!!selectedOrder}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};