import React, { useState } from 'react';
import { ProductDataTable } from '@/features/product-catalog/components/ProductDataTable';
import { Button } from '@/shared/ui/shadcn/button';
import { Input } from '@/shared/ui/shadcn/input';
import { PlusCircle, Upload } from 'lucide-react';
import { ProductForm } from '@/features/product-catalog/components/ProductForm';
import { BulkImportModal } from '@/features/product-catalog/components/BulkImportModal';
import { ModalDialog } from '@/shared/ui/shadcn/modal';

/**
 * @file ProductsPage.tsx
 * @description The main page for vendors to manage their product catalog.
 * It provides functionality to view, search, add, edit, and bulk import products.
 * Fulfills user stories VND-009, VND-010, VND-011, VND-013.
 */

const ProductsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddProductModalOpen, setAddProductModalOpen] = useState(false);
  const [isBulkImportModalOpen, setBulkImportModalOpen] = useState(false);

  // Note: Debouncing for the search term would be implemented here
  // using a custom hook like useDebounce for better performance.
  // For simplicity here, we'll pass the searchTerm directly.

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setBulkImportModalOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Bulk Import
          </Button>
          <Button onClick={() => setAddProductModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      <div className="flex items-center">
        <Input
          placeholder="Search products by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <ProductDataTable searchTerm={searchTerm} />

      {/* Add Product Modal */}
      <ModalDialog
        isOpen={isAddProductModalOpen}
        onClose={() => setAddProductModalOpen(false)}
        title="Add New Product"
        description="Fill in the details for your new product."
      >
        <ProductForm onSaveSuccess={() => setAddProductModalOpen(false)} />
      </ModalDialog>

      {/* Bulk Import Modal */}
      <BulkImportModal
        isOpen={isBulkImportModalOpen}
        onClose={() => setBulkImportModalOpen(false)}
      />
    </div>
  );
};

export default ProductsPage;