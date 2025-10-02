import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { AppDispatch } from '../../store/store'; // Assuming AppDispatch will be defined in store.ts (Level 4)

import {
  fetchNearbyVendors,
  fetchVendorDetails,
  searchProductsAndVendors,
  selectNearbyVendors,
  selectCurrentVendor,
  selectSearchResults,
  selectProductsLoading,
  selectProductsError,
  clearSearchResults,
} from './productsSlice';
import { SearchFilters } from './products.types';

/**
 * Custom hook for product and vendor discovery features.
 * Provides components with access to lists of nearby vendors, vendor details, search results,
 * and functions to trigger these data fetches.
 *
 * @returns An object containing product/vendor state and memoized functions for discovery actions.
 */
export const useProducts = () => {
  const dispatch = useDispatch<AppDispatch>();

  const nearbyVendors = useSelector(selectNearbyVendors);
  const currentVendor = useSelector(selectCurrentVendor);
  const searchResults = useSelector(selectSearchResults);
  const isLoading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

  const handleFetchNearbyVendors = useCallback(
    (location: { lat: number; lng: number }) => {
      dispatch(fetchNearbyVendors(location));
    },
    [dispatch],
  );

  const handleFetchVendorDetails = useCallback(
    (vendorId: string) => {
      dispatch(fetchVendorDetails(vendorId));
    },
    [dispatch],
  );

  const handleSearch = useCallback(
    (params: { query: string; filters?: SearchFilters }) => {
      dispatch(searchProductsAndVendors(params));
    },
    [dispatch],
  );
  
  const handleClearSearch = useCallback(() => {
    dispatch(clearSearchResults());
  }, [dispatch]);

  return {
    nearbyVendors,
    currentVendor,
    searchResults,
    isLoading,
    error,
    fetchNearbyVendors: handleFetchNearbyVendors,
    fetchVendorDetails: handleFetchVendorDetails,
    search: handleSearch,
    clearSearch: handleClearSearch,
  };
};