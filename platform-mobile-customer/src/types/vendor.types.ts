import { Product } from '../features/products/products.types';

/**
 * @interface VendorSummary
 * @description Represents a summarized view of a vendor for display in lists.
 * @see REQ-1-010 - Vendor user role permissions.
 * @see CUS-010 - Customer views nearby vendors.
 */
export interface VendorSummary {
  id: string;
  storeName: string;
  bannerImageUrl?: string;
  logoImageUrl?: string;
  primaryCategory: string; // e.g., 'Italian', 'Groceries'
  averageRating: number;
  ratingCount: number;
  isOnline: boolean;
  distance?: number; // in kilometers
  estimatedDeliveryTime?: string; // e.g., '25-35 min'
}

/**
 * @interface BusinessHour
 * @description Defines the operating hours for a specific day.
 * @see VND-006 - Vendor manages business hours.
 */
export interface BusinessHourSlot {
  opens: string; // HH:mm format
  closes: string; // HH:mm format
}

/**
 * @interface Vendor
 * @description Represents the full profile of a vendor, including their complete product catalog.
 * @see REQ-1-010 - Vendor user role permissions.
 * @see CUS-013 - Customer views vendor profile page.
 */
export interface Vendor extends VendorSummary {
  address: string;
  businessHours: {
    [day: number]: BusinessHourSlot[]; // day: 0 (Sunday) - 6 (Saturday)
  };
  products: Product[];
  categories: string[];
}