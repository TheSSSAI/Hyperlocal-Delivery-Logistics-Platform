import React, { useState } from 'react';
import { useStoreProfile } from '@/features/store-profile/hooks/useStoreProfile';
import { useUpdateStoreProfile } from '@/features/store-profile/hooks/useUpdateStoreProfile';
import { Switch } from '@/shared/ui/components/Switch';
import { Label } from '@/shared/ui/components/Label';
import { useToast } from '@/shared/ui/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/components/AlertDialog';
import { Skeleton } from '@/shared/ui/components/Skeleton';

export const StoreAvailabilityToggle: React.FC = () => {
  const { data: storeProfile, isLoading, isError } = useStoreProfile();
  const updateProfileMutation = useUpdateStoreProfile();
  const { toast } = useToast();
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (isLoading) {
    return <Skeleton className="h-10 w-48" />;
  }

  if (isError || !storeProfile) {
    return <div className="text-red-500">Could not load store status.</div>;
  }
  
  const isOnline = storeProfile.isOnline;

  const handleToggle = (checked: boolean) => {
    if (!checked) {
      // If toggling to Offline, show confirmation
      setShowConfirmation(true);
    } else {
      // If toggling to Online, do it directly
      updateStatus(true);
    }
  };

  const updateStatus = (newStatus: boolean) => {
    updateProfileMutation.mutate(
      { isOnline: newStatus },
      {
        onSuccess: () => {
          toast({
            title: 'Success',
            description: `Your store is now ${newStatus ? 'Online' : 'Offline'}.`,
          });
        },
        onError: (error) => {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: `Failed to update status: ${error.message}`,
          });
        },
      }
    );
  };

  const confirmGoOffline = () => {
    updateStatus(false);
    setShowConfirmation(false);
  };

  return (
    <>
      <div className="flex items-center space-x-2">
        <Switch
          id="store-availability"
          checked={isOnline}
          onCheckedChange={handleToggle}
          disabled={updateProfileMutation.isPending}
          aria-label={isOnline ? 'Your store is online. Toggle to go offline.' : 'Your store is offline. Toggle to go online.'}
        />
        <Label htmlFor="store-availability" className={`font-semibold text-lg ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
          {isOnline ? 'Store is Online' : 'Store is Offline'}
        </Label>
      </div>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to go offline?</AlertDialogTitle>
            <AlertDialogDescription>
              Your store will not be visible to customers and you will not receive new orders until you go back online.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmGoOffline} className="bg-red-600 hover:bg-red-700">
              Go Offline
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};