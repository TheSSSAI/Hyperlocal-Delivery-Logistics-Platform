import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/shared/api/ApiClient';
import { ApiClientError } from '@/features/product-catalog/types';
import { toast } from 'react-hot-toast';

interface GetUploadUrlResponse {
  uploadUrl: string;
  jobId: string;
}

const getUploadUrl = async (file: File): Promise<GetUploadUrlResponse> => {
  const response = await apiClient.post<GetUploadUrlResponse>('/products/bulk-import/initiate', {
    fileName: file.name,
    contentType: file.type,
  });
  return response.data;
};

const uploadFileToS3 = async ({ uploadUrl, file }: { uploadUrl: string; file: File }) => {
  await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });
};

const notifyUploadComplete = async (jobId: string): Promise<void> => {
  await apiClient.post(`/products/bulk-import/complete`, { jobId });
};

// This hook manages the multi-step process of bulk importing a CSV
export const useBulkImport = () => {
  const queryClient = useQueryClient();

  return useMutation<void, ApiClientError, File>({
    mutationFn: async (file: File) => {
      try {
        // Step 1: Get a pre-signed URL and a job ID from our backend
        toast.loading('Preparing upload...', { id: 'bulk-import' });
        const { uploadUrl, jobId } = await getUploadUrl(file);

        // Step 2: Upload the file directly to S3 using the pre-signed URL
        toast.loading('Uploading file...', { id: 'bulk-import' });
        await uploadFileToS3({ uploadUrl, file });

        // Step 3: Notify our backend that the upload is complete to start processing
        toast.loading('Starting import process...', { id: 'bulk-import' });
        await notifyUploadComplete(jobId);

        // The final result will come via a WebSocket notification
        // See NotificationProvider for handling 'import_complete' event
      } catch (error) {
        // Re-throw to let TanStack Query handle the onError callback
        throw error;
      }
    },
    onSuccess: () => {
      // This success means the process was successfully queued.
      // The final success/error message is handled by the WebSocket listener.
      toast.success(
        'File uploaded. The import is now processing in the background. You will be notified when it is complete.',
        { id: 'bulk-import', duration: 10000 }
      );
      // We can invalidate products query to show changes later
      // A better approach is to do this in the WebSocket handler
      // queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Bulk import failed. Please try again.', { id: 'bulk-import' });
    },
  });
};