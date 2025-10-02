/**
 * @file Defines the core TypeScript types and interfaces for the Product Catalog feature.
 * These types represent product categories, products, and related data structures.
 * @version 1.0.0
 * @since 2024-05-24
 */

/**
 * Represents a product category created by a vendor.
 * Fulfills user story VND-008.
 */
export interface ProductCategory {
  readonly id: string;
  name: string;
}

/**
 * Represents a single product in a vendor's catalog.
 * This is the core entity for product management.
 * Aligns with REQ-1-068 and user stories VND-009, VND-010.
 */
export interface Product {
  readonly id: string;
  sku: string; // Stock Keeping Unit, unique per vendor. REQ-VND-013
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
  category: ProductCategory;
  isAvailable: boolean; // Derived field based on stock and store status
  limitedStockThreshold?: number; // From vendor settings
}

/**
 * Defines the shape of data used in product creation and editing forms.
 * Used for form validation with libraries like react-hook-form and zod.
 * Aligns with user stories VND-009 and VND-010.
 */
export interface ProductFormValues {
  name: string;
  description: string;
  sku: string;
  price: number;
  stockQuantity: number;
  categoryId: string;
  image?: File | null;
}

/**
 * Represents the result of a bulk import operation.
 * Fulfills user stories VND-013 and VND-014.
 */
export interface BulkImportResult {
  successCount: number;
  errorCount: number;
  errorReportUrl?: string;
}

/**
 * Represents the payload for initiating a bulk import.
 * Sent to the backend to get a pre-signed URL for upload.
 */
export interface BulkImportInitiatePayload {
  fileName: string;
  fileType: string;
  fileSize: number;
}

/**
 * Represents the response from the bulk import initiation API.
 */
export interface BulkImportInitiateResponse {
  jobId: string;
  uploadUrl: string;
}

/**
 * Represents the payload to notify the backend that the file upload is complete.
 */
export interface BulkImportCompletePayload {
  jobId: string;
}

/**
 * Represents the structure of a row in the CSV error report.
 * Fulfills user story VND-014.
 */
export interface CsvImportErrorRow {
  product_sku: string;
  product_name: string;
  description: string;
  price: string; // Kept as string to show original user input
  stock_quantity: string; // Kept as string
  category_name: string;
  error_description: string;
}