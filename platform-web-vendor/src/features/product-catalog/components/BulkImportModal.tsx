import React, { useState } from 'react';
import { useBulkImport } from '@/features/product-catalog/hooks/useBulkImport';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/ui/components/Dialog';
import { Button } from '@/shared/ui/components/Button';
import { useToast } from '@/shared/ui/hooks/use-toast';
import { FileUp, Loader2, Download, AlertCircle, CheckCircle } from 'lucide-react';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({ isOpen, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const bulkImportMutation = useBulkImport();
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      if (files[0].type === 'text/csv') {
        setFile(files[0]);
        bulkImportMutation.reset();
      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload a .csv file.',
        });
        setFile(null);
      }
    }
  };

  const handleImport = () => {
    if (file) {
      bulkImportMutation.mutate(file);
    }
  };
  
  const handleClose = () => {
    setFile(null);
    bulkImportMutation.reset();
    onClose();
  }

  const result = bulkImportMutation.data;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Import Products</DialogTitle>
          <DialogDescription>
            Upload a CSV file to add or update your products in bulk.
            <Button variant="link" asChild className="p-0 h-auto ml-1">
              <a href="/templates/product_template.csv" download>Download template</a>
            </Button>
          </DialogDescription>
        </DialogHeader>

        <div className="my-4">
          {!result && (
            <div className="flex flex-col items-center justify-center w-full">
              <label htmlFor="csv-upload" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FileUp className="w-8 h-8 mb-4 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">CSV file (MAX. 5MB)</p>
                </div>
                <input id="csv-upload" type="file" className="hidden" accept=".csv" onChange={handleFileChange} />
              </label>
              {file && <p className="mt-2 text-sm font-medium">Selected file: {file.name}</p>}
            </div>
          )}

          {bulkImportMutation.isPending && (
            <div className="text-center p-8">
              <Loader2 className="h-8 w-8 mx-auto animate-spin" />
              <p className="mt-2 font-semibold">Processing your file...</p>
              <p className="text-sm text-muted-foreground">This may take a few moments.</p>
            </div>
          )}

          {bulkImportMutation.isSuccess && result && (
             <div className="text-center p-8">
                <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
                <h3 className="mt-2 text-lg font-semibold">Import Complete</h3>
                <p>{result.successCount} products imported/updated successfully.</p>
                {result.errorCount > 0 && (
                  <div className="mt-4">
                    <p className="text-red-500">{result.errorCount} rows failed.</p>
                    <Button variant="outline" size="sm" asChild className="mt-2">
                        <a href={result.errorFileUrl} download>
                            <Download className="mr-2 h-4 w-4" />
                            Download Error Report
                        </a>
                    </Button>
                  </div>
                )}
            </div>
          )}

          {bulkImportMutation.isError && (
             <div className="text-center p-8">
                <AlertCircle className="h-12 w-12 mx-auto text-red-500" />
                <h3 className="mt-2 text-lg font-semibold">Import Failed</h3>
                <p className="text-muted-foreground">{bulkImportMutation.error.message}</p>
             </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2">
           <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
          {!result && (
            <Button onClick={handleImport} disabled={!file || bulkImportMutation.isPending}>
              Import Products
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};