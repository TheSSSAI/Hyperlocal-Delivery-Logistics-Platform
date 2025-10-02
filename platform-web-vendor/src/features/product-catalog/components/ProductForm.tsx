import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Product } from '@/features/product-catalog/types';
import { useCategories } from '@/features/product-catalog/hooks/useCategories';
import { Button } from '@/shared/ui/components/Button';
import { Input } from '@/shared/ui/components/Input';
import { Textarea } from '@/shared/ui/components/Textarea';
import { Label } from '@/shared/ui/components/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/components/Select';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/components/Alert';

const productFormSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(100),
  description: z.string().max(500).optional(),
  price: z.coerce.number().positive('Price must be a positive number'),
  stockQuantity: z.coerce.number().int().nonnegative('Stock must be a whole number'),
  categoryId: z.string().min(1, 'Category is required'),
  // imageFile: z.instanceof(File).optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: ProductFormValues) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit, isSubmitting, onCancel }) => {
  const { data: categories, isLoading: isLoadingCategories, isError: isCategoriesError } = useCategories();
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialData ? {
        ...initialData,
        price: initialData.price,
        stockQuantity: initialData.stockQuantity,
    } : {
        name: '',
        description: '',
        price: 0,
        stockQuantity: 0,
        categoryId: '',
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="name">Product Name</Label>
        <Controller name="name" control={form.control} render={({ field, fieldState }) => (
          <>
            <Input id="name" {...field} />
            {fieldState.error && <p className="text-sm text-red-500 mt-1">{fieldState.error.message}</p>}
          </>
        )} />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Controller name="description" control={form.control} render={({ field }) => (
          <Textarea id="description" {...field} />
        )} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="price">Price (₹)</Label>
          <Controller name="price" control={form.control} render={({ field, fieldState }) => (
            <>
              <Input id="price" type="number" step="0.01" {...field} />
              {fieldState.error && <p className="text-sm text-red-500 mt-1">{fieldState.error.message}</p>}
            </>
          )} />
        </div>
        <div>
          <Label htmlFor="stockQuantity">Stock Quantity</Label>
          <Controller name="stockQuantity" control={form.control} render={({ field, fieldState }) => (
            <>
              <Input id="stockQuantity" type="number" step="1" {...field} />
              {fieldState.error && <p className="text-sm text-red-500 mt-1">{fieldState.error.message}</p>}
            </>
          )} />
        </div>
      </div>

      <div>
        <Label htmlFor="categoryId">Category</Label>
        <Controller name="categoryId" control={form.control} render={({ field, fieldState }) => (
          <>
            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingCategories}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingCategories && <SelectItem value="loading" disabled>Loading...</SelectItem>}
                {isCategoriesError && <SelectItem value="error" disabled>Error loading categories</SelectItem>}
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.error && <p className="text-sm text-red-500 mt-1">{fieldState.error.message}</p>}
          </>
        )} />
         {categories?.length === 0 && !isLoadingCategories && (
          <Alert variant="default" className="mt-2">
            <AlertDescription>
              No categories found. Please add a category first in the 'Products' page.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Placeholder for image upload */}
       <div>
            <Label>Product Image</Label>
            <div className="p-4 border-2 border-dashed rounded-md text-center text-muted-foreground">
                Image upload functionality to be implemented.
            </div>
       </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || isLoadingCategories || categories?.length === 0}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? 'Save Changes' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
};