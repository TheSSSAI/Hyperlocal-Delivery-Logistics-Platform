import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useStoreProfile, useUpdateStoreProfile } from '@/features/store-profile/hooks/useStoreProfile';
import { Button } from '@/shared/ui/components/Button';
import { Input } from '@/shared/ui/components/Input';
import { Textarea } from '@/shared/ui/components/Textarea';
import { Label } from '@/shared/ui/components/Label';
import { useToast } from '@/shared/ui/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/shared/ui/components/Skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/components/Alert';

const profileSchema = z.object({
  storeName: z.string().min(1, 'Store name is required').max(100),
  address: z.string().min(1, 'Address is required').max(255),
  contactPhone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  contactEmail: z.string().email('Please enter a valid email address'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const StoreProfileForm: React.FC = () => {
  const { data: storeProfile, isLoading, isError, error } = useStoreProfile();
  const updateMutation = useUpdateStoreProfile();
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: storeProfile, // pre-populates the form once data is loaded
  });

  const onSubmit = (data: ProfileFormValues) => {
    updateMutation.mutate(data, {
      onSuccess: () => {
        toast({ title: 'Success', description: 'Store profile updated successfully.' });
        form.reset(data); // Resets dirty fields state
      },
      onError: (err) => {
        toast({ variant: 'destructive', title: 'Error', description: err.message });
      },
    });
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Failed to load profile</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
       <div>
        <Label htmlFor="storeName">Store Name</Label>
        <Controller
          name="storeName"
          control={form.control}
          render={({ field, fieldState }) => (
            <>
              <Input id="storeName" {...field} />
              {fieldState.error && <p className="text-sm text-red-500 mt-1">{fieldState.error.message}</p>}
            </>
          )}
        />
      </div>

      <div>
        <Label htmlFor="address">Store Address</Label>
        <Controller
          name="address"
          control={form.control}
          render={({ field, fieldState }) => (
            <>
              <Textarea id="address" {...field} />
              {fieldState.error && <p className="text-sm text-red-500 mt-1">{fieldState.error.message}</p>}
            </>
          )}
        />
      </div>

      <div>
        <Label htmlFor="contactPhone">Contact Phone</Label>
        <Controller
          name="contactPhone"
          control={form.control}
          render={({ field, fieldState }) => (
            <>
              <Input id="contactPhone" type="tel" {...field} />
              {fieldState.error && <p className="text-sm text-red-500 mt-1">{fieldState.error.message}</p>}
            </>
          )}
        />
      </div>

      <div>
        <Label htmlFor="contactEmail">Contact Email</Label>
        <Controller
          name="contactEmail"
          control={form.control}
          render={({ field, fieldState }) => (
            <>
              <Input id="contactEmail" type="email" {...field} />
              {fieldState.error && <p className="text-sm text-red-500 mt-1">{fieldState.error.message}</p>}
            </>
          )}
        />
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={updateMutation.isPending || !form.formState.isDirty}>
            {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
        </Button>
      </div>
    </form>
  );
};