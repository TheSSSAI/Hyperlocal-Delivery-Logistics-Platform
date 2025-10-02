import React from 'react';
import DataGrid, { Column } from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import { useProducts } from '@/features/product-catalog/hooks/useProducts';
import { Product } from '@/features/product-catalog/types';
import { Button } from '@/shared/ui/components/Button';
import { Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/shared/ui/components/Badge';
import { useDeleteProduct } from '@/features/product-catalog/hooks/useDeleteProduct';
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

interface ProductDataTableProps {
  onEditProduct: (product: Product) => void;
}

const getStockBadgeVariant = (stock: number): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (stock <= 0) return 'destructive';
    if (stock <= 10) return 'secondary'; // Assuming 10 is limited stock
    return 'default';
};

export const ProductDataTable: React.FC<ProductDataTableProps> = ({ onEditProduct }) => {
  // This would be enhanced with pagination state if the hook supports it
  const { data: products, isLoading, isError, error } = useProducts({});
  const deleteMutation = useDeleteProduct();
  const { toast } = useToast();
  const [productToDelete, setProductToDelete] = React.useState<Product | null>(null);
  
  const handleDelete = () => {
    if (!productToDelete) return;
    deleteMutation.mutate(productToDelete.id, {
      onSuccess: () => {
        toast({ title: 'Success', description: `Product "${productToDelete.name}" deleted.` });
        setProductToDelete(null);
      },
      onError: (err) => {
        toast({ variant: 'destructive', title: 'Error', description: err.message });
        setProductToDelete(null);
      }
    });
  };

  const columns: readonly Column<Product>[] = [
    { key: 'name', name: 'Product Name', resizable: true },
    { key: 'categoryName', name: 'Category', width: 150 },
    { 
      key: 'price', 
      name: 'Price', 
      width: 120,
      formatter: ({ row }) => `₹${row.price.toFixed(2)}`
    },
    { 
      key: 'stockQuantity', 
      name: 'Stock', 
      width: 120,
      formatter: ({ row }) => (
        <Badge variant={getStockBadgeVariant(row.stockQuantity)}>
          {row.stockQuantity > 0 ? `${row.stockQuantity} in stock` : 'Out of Stock'}
        </Badge>
      )
    },
    {
      key: 'actions',
      name: 'Actions',
      width: 120,
      formatter: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => onEditProduct(row)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="icon" onClick={() => setProductToDelete(row)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) return <div>Loading products...</div>;
  if (isError) return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <>
      <DataGrid
        columns={columns}
        rows={products || []}
        className="rdg-light" // or "rdg-dark" based on theme
        style={{ height: 'calc(100vh - 200px)' }} // Example height
      />
      
      <AlertDialog open={!!productToDelete} onOpenChange={(isOpen) => !isOpen && setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the product "{productToDelete?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteMutation.isPending} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};