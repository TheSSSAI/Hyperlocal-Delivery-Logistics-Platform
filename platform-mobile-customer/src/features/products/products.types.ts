/**
 * @enum StockStatus
 * @description The derived status of a product's inventory level.
 * @see REQ-1-050, CUS-014
 */
export enum StockStatus {
  Available = 'Available',
  LimitedStock = 'Limited Stock',
  OutOfStock = 'Out of Stock',
}

/**
 * @interface Product
 * @description Represents a single product item offered by a vendor.
 * @see REQ-1-006, VND-009 - Core product entity.
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
  stockQuantity: number;
  stockStatus: StockStatus;
  vendorId: string;
}

/**
 * @interface Category
 * @description Represents a product category within a vendor's catalog.
 * @see VND-008
 */
export interface Category {
  id: string;
  name: string;
  vendorId: string;
}

/**
 * @interface ProductFilters
 * @description Defines the available filters for product/vendor search.
 * @see REQ-1-049, CUS-012
 */
export interface ProductFilters {
  category?: string;
  rating?: number; // Minimum rating
  priceRange?: [number, number];
}