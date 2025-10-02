import React from 'react';
import { Order } from '@/features/order-management/types';
import { useOrderDetails } from '@/features/order-management/hooks/useOrders'; // Assuming this hook exists
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/ui/components/Dialog';
import { Button } from '@/shared/ui/components/Button';
import { Skeleton } from '@/shared/ui/components/Skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/components/Alert';
import { Badge } from '@/shared/ui/components/Badge';

interface OrderDetailModalProps {
  orderId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onAccept: (orderId: string) => void;
  onReject: (orderId: string) => void;
}

const LoadingState: React.FC = () => (
    <div className="space-y-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-10 w-full" />
    </div>
);

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ orderId, isOpen, onClose, onAccept, onReject }) => {
  const { data: orderDetails, isLoading, isError, error } = useOrderDetails(orderId, { enabled: !!orderId && isOpen });

  const isPending = orderDetails?.status === 'pending_vendor_acceptance';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Order Details #{orderId?.substring(0, 8)}...</DialogTitle>
          {orderDetails && <DialogDescription>Placed at: {new Date(orderDetails.placedAt).toLocaleString()}</DialogDescription>}
        </DialogHeader>
        
        <div className="max-h-[60vh] overflow-y-auto p-1 pr-4 space-y-6">
            {isLoading && <LoadingState />}
            {isError && (
                 <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error.message}</AlertDescription>
                </Alert>
            )}
            {orderDetails && (
                <>
                <div>
                    <h4 className="font-semibold mb-2">Items</h4>
                    <ul className="divide-y">
                        {orderDetails.items.map(item => (
                            <li key={item.id} className="py-2 flex justify-between">
                                <span>{item.quantity} x {item.productName}</span>
                                <span>₹{(item.priceAtTimeOfOrder * item.quantity).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                
                 <div className="border-t pt-4">
                    <div className="flex justify-between"><span>Subtotal</span><span>₹{orderDetails.subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Taxes</span><span>₹{orderDetails.taxes.toFixed(2)}</span></div>
                    <div className="flex justify-between font-bold text-lg"><span>Total</span><span>₹{orderDetails.totalAmount.toFixed(2)}</span></div>
                 </div>

                {orderDetails.vendorInstructions && (
                    <div>
                        <h4 className="font-semibold">Special Instructions from Customer</h4>
                        <p className="p-3 bg-muted rounded-md">{orderDetails.vendorInstructions}</p>
                    </div>
                )}
                 <div>
                    <h4 className="font-semibold">Payment Method</h4>
                    <Badge variant={orderDetails.paymentMethod === 'COD' ? 'secondary' : 'default'}>
                        {orderDetails.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Prepaid'}
                    </Badge>
                </div>
                </>
            )}
        </div>

        {isPending && orderId && (
            <div className="flex justify-end gap-4 mt-4">
                 <Button variant="destructive" onClick={() => { onReject(orderId); onClose(); }}>Reject</Button>
                 <Button onClick={() => { onAccept(orderId); onClose(); }}>Accept</Button>
            </div>
        )}

      </DialogContent>
    </Dialog>
  );
};