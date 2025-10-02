import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/components/Dialog';
import { Button } from '@/shared/ui/components/Button';
import { useAcceptOrder } from '@/features/order-management/hooks/useAcceptOrder';
import { useToast } from '@/shared/ui/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/shared/api/apiClient'; // Assuming direct use for simple config fetches

interface PreparationTimeModalProps {
  orderId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

// In a real app, this would come from a config service/hook
const usePrepTimeOptions = () => {
  return useQuery({
    queryKey: ['prep-time-options'],
    queryFn: async () => {
        // Mocking the API call as per REQ-FUN-010 defaults
        // In a real scenario, this would be: await apiClient.get('/config/prep-times');
        return ['10-15 min', '15-20 min', '20-30 min'];
    },
    staleTime: Infinity, // These options rarely change
  });
};

export const PreparationTimeModal: React.FC<PreparationTimeModalProps> = ({ orderId, isOpen, onClose }) => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const { data: prepTimeOptions, isLoading: isLoadingOptions } = usePrepTimeOptions();
  const acceptOrderMutation = useAcceptOrder();
  const { toast } = useToast();

  const handleConfirm = () => {
    if (!orderId || !selectedTime) return;

    acceptOrderMutation.mutate({ orderId, preparationTime: selectedTime }, {
      onSuccess: () => {
        toast({ title: 'Order Accepted', description: 'The order is now in preparation.' });
        onClose();
        setSelectedTime(null);
      },
      onError: (error) => {
        toast({
          variant: 'destructive',
          title: 'Failed to accept order',
          description: error.message,
        });
      },
    });
  };

  const handleClose = () => {
    setSelectedTime(null);
    acceptOrderMutation.reset();
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Estimated Preparation Time</DialogTitle>
          <DialogDescription>
            This will be used to calculate the customer's ETA.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-2">
            {isLoadingOptions && <p>Loading options...</p>}
            {prepTimeOptions?.map((time) => (
                <Button
                    key={time}
                    variant="outline"
                    className={cn(
                        "w-full justify-start",
                        selectedTime === time && "border-primary ring-2 ring-primary"
                    )}
                    onClick={() => setSelectedTime(time)}
                >
                    {time}
                </Button>
            ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={acceptOrderMutation.isPending}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedTime || acceptOrderMutation.isPending || isLoadingOptions}>
            {acceptOrderMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};