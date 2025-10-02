import React, { useState } from 'react';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/features/product-catalog/hooks/useCategories';
import { Button } from '@/shared/ui/components/Button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/ui/components/Dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/shared/ui/components/AlertDialog';
import { Input } from '@/shared/ui/components/Input';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/shared/ui/hooks/use-toast';
import { Loader2, Pencil, Trash2, PlusCircle } from 'lucide-react';
import { Category } from '@/features/product-catalog/types';
import { Skeleton } from '@/shared/ui/components/Skeleton';

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(50, 'Category name is too long'),
});
type CategoryFormValues = z.infer<typeof categorySchema>;

const CategoryForm: React.FC<{
  initialData?: Category;
  onSuccess: () => void;
}> = ({ initialData, onSuccess }) => {
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const mutation = initialData ? updateMutation : createMutation;
  const { toast } = useToast();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: initialData?.name || '' },
  });

  const onSubmit = (data: CategoryFormValues) => {
    const payload = initialData ? { ...initialData, ...data } : data;
    mutation.mutate(payload as any, {
      onSuccess: () => {
        toast({ title: `Category ${initialData ? 'updated' : 'created'} successfully.` });
        onSuccess();
        form.reset();
      },
      onError: (error) => {
        toast({ variant: 'destructive', title: 'Error', description: error.message });
      },
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <div>
            <Input {...field} placeholder="e.g., Appetizers" />
            {fieldState.error && <p className="mt-1 text-sm text-red-500">{fieldState.error.message}</p>}
          </div>
        )}
      />
      <DialogFooter>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? 'Save Changes' : 'Create Category'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export const CategoryManagement: React.FC = () => {
  const { data: categories, isLoading, isError, error } = useCategories();
  const deleteMutation = useDeleteCategory();
  const { toast } = useToast();
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  const handleDelete = () => {
    if (!deletingCategory) return;
    deleteMutation.mutate(deletingCategory.id, {
      onSuccess: () => {
        toast({ title: `Category "${deletingCategory.name}" deleted successfully.` });
        setDeletingCategory(null);
      },
      onError: (err) => {
        toast({ variant: 'destructive', title: 'Error deleting category', description: err.message });
        setDeletingCategory(null);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (isError) {
    return <p className="text-red-500">Error loading categories: {error.message}</p>;
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Product Categories</h3>
        <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <CategoryForm onSuccess={() => setCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      {categories && categories.length > 0 ? (
        <ul className="border rounded-md">
          {categories.map((category) => (
            <li key={category.id} className="flex items-center justify-between p-3 border-b last:border-b-0">
              <span className="font-medium">{category.name}</span>
              <div className="space-x-2">
                <Button variant="outline" size="icon" onClick={() => setEditingCategory(category)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => setDeletingCategory(category)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground text-center p-4">No categories created yet.</p>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={(isOpen) => !isOpen && setEditingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          {editingCategory && (
            <CategoryForm
              initialData={editingCategory}
              onSuccess={() => setEditingCategory(null)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingCategory} onOpenChange={(isOpen) => !isOpen && setDeletingCategory(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the "{deletingCategory?.name}" category. This action cannot be undone. You cannot delete a category if it has products associated with it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteMutation.isPending} className="bg-red-600 hover:bg-red-700">
              {deleteMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};