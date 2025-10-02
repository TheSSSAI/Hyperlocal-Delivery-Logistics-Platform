import React from 'react';
import { Order } from '@/features/order-management/types';
import CountdownTimer from './CountdownTimer';
import { Button } from '@/shared/ui/components/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/components/Card';
import { Package, Clock, IndianRupee } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onAccept: (orderId: string) => void;
  onReject: (orderId: string) => void;
  onViewDetails: (order: Order) => void;
  onExpire: (orderId: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onAccept, onReject, onViewDetails, onExpire }) => {

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card className="flex flex-col h-full border-primary border-2 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">New Order</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-1 h-4 w-4" />
          <CountdownTimer
            expiryTimestamp={order.acceptanceTimerExpiry}
            onExpire={() => onExpire(order.id)}
            className="text-base"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-2" onClick={() => onViewDetails(order)} style={{ cursor: 'pointer' }}>
        <div className="text-2xl font-bold">#{order.id.substring(0, 8)}...</div>
        <div className="flex items-center text-muted-foreground">
          <Package className="mr-2 h-4 w-4" />
          <span>{totalItems} item{totalItems > 1 ? 's' : ''}</span>
        </div>
         <div className="flex items-center text-muted-foreground">
          <IndianRupee className="mr-2 h-4 w-4" />
          <span className="font-semibold">{order.totalAmount.toFixed(2)}</span>
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2">
        <Button variant="destructive" onClick={() => onReject(order.id)}>
          Reject
        </Button>
        <Button onClick={() => onAccept(order.id)}>
          Accept
        </Button>
      </CardFooter>
    </Card>
  );
};

export default React.memo(OrderCard);