import { Product } from '../entities/product.entity';
import { UpdateResult } from 'typeorm';

export abstract class ProductRepository {
  /**
   * Finds a single product by its unique identifier.
   * @param id The UUID of the product.
   * @returns A promise that resolves to the Product entity or null if not found.
   */
  abstract findById(id: string): Promise<Product | null>;

  /**
   * Finds all products belonging to a specific vendor, with pagination.
   * @param vendorId The UUID of the vendor profile.
   * @param options Pagination options (e.g., skip, take).
   * @returns A promise that resolves to an array of Product entities.
   */
  abstract findByVendorId(
    vendorId: string,
    options: { skip: number; take: number },
  ): Promise<[Product[], number]>;
  
  /**
   * Creates a new product.
   * @param product The product data to create.
   * @returns A promise that resolves to the created Product entity.
   */
  abstract create(product: Partial<Product>): Promise<Product>;

  /**
   * Updates an existing product.
   * @param id The UUID of the product to update.
   * @param productUpdate The partial product data for the update.
   * @returns A promise that resolves to the updated Product entity.
   */
  abstract update(id: string, productUpdate: Partial<Product>): Promise<Product | null>;
  
  /**
   * Soft-deletes a product by its unique identifier.
   * @param id The UUID of the product to delete.
   * @returns A promise that resolves when the deletion is complete.
   */
  abstract softDelete(id: string): Promise<void>;

  /**
   * Atomically updates a product's stock quantity using optimistic locking.
   * Fails if the provided version does not match the database version.
   * @param productId The ID of the product to update.
   * @param newStock The new stock quantity.
   * @param currentVersion The version number of the product record being updated.
   * @returns A promise that resolves to an UpdateResult. The `affected` property will be 0 if the lock fails.
   */
  abstract updateStockWithOptimisticLock(
    productId: string,
    newStock: number,
    currentVersion: number,
  ): Promise<UpdateResult>;
}