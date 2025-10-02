// NOTE: This apiClient is a placeholder for the actual shared library client.
import { apiClient } from '../../services/apiClient';
import { Vendor, VendorSummary } from '../../types/vendor.types';
import { ProductFilters } from './products.types';

// Placeholder for shared paginated result type
interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

// Placeholder for combined search results type
interface SearchResults {
  vendors: VendorSummary[];
  products: any[]; // Define a ProductSummary type later if needed
}

/**
 * @class ProductsService
 * @description Handles API interactions for product and vendor discovery.
 * @see REQ-1-003 - Implements Product Discovery and Search module.
 */
class ProductsService {
  /**
   * @method getNearbyVendors
   * @description Fetches vendors near the user's current location.
   * @param {{ lat: number; lng: number }} location - User's coordinates.
   * @returns {Promise<PaginatedResult<VendorSummary>>} A list of nearby vendors.
   */
  public async getNearbyVendors(location: {
    lat: number;
    lng: number;
  }): Promise<PaginatedResult<VendorSummary>> {
    try {
      const response = await apiClient.get<PaginatedResult<VendorSummary>>(
        '/vendors/nearby',
        { params: location },
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching nearby vendors:', error);
      throw error;
    }
  }

  /**
   * @method getVendorDetails
   * @description Fetches the full profile for a single vendor, including their product catalog.
   * @param {string} vendorId - The ID of the vendor.
   * @returns {Promise<Vendor>} The full vendor profile.
   */
  public async getVendorDetails(vendorId: string): Promise<Vendor> {
    try {
      const response = await apiClient.get<Vendor>(`/vendors/${vendorId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching details for vendor ${vendorId}:`, error);
      throw error;
    }
  }

  /**
   * @method search
   * @description Performs a search query for vendors and products.
   * @param {string} query - The search term.
   * @param {ProductFilters} filters - Optional filters for the search.
   * @returns {Promise<SearchResults>} The combined search results.
   */
  public async search(
    query: string,
    filters?: ProductFilters,
  ): Promise<SearchResults> {
    try {
      const response = await apiClient.get<SearchResults>('/search', {
        params: { q: query, ...filters },
      });
      return response.data;
    } catch (error) {
      console.error('Error performing search:', error);
      throw error;
    }
  }
}

export const productsService = new ProductsService();