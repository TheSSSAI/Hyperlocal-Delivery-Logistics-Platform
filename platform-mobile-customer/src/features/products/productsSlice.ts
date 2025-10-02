import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Vendor, VendorSummary } from '../../types/vendor.types';
import { productsService } from './productsService';
import { SearchFilters, SearchResults } from './products.types';

interface ProductsState {
  vendors: VendorSummary[];
  selectedVendor: Vendor | null;
  searchResults: SearchResults | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  vendors: [],
  selectedVendor: null,
  searchResults: null,
  isLoading: false,
  error: null,
};

export const fetchNearbyVendors = createAsyncThunk<
  VendorSummary[],
  { latitude: number; longitude: number }
>('products/fetchNearbyVendors', async (location, { rejectWithValue }) => {
  try {
    return await productsService.getNearbyVendors(location);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch vendors');
  }
});

export const fetchVendorDetails = createAsyncThunk<Vendor, string>(
  'products/fetchVendorDetails',
  async (vendorId, { rejectWithValue }) => {
    try {
      return await productsService.getVendorDetails(vendorId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch vendor details');
    }
  },
);

export const searchProductsAndVendors = createAsyncThunk<
  SearchResults,
  { query: string; filters?: SearchFilters }
>('products/search', async ({ query, filters }, { rejectWithValue }) => {
  try {
    return await productsService.search(query, filters);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Search failed');
  }
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearSearch: (state) => {
      state.searchResults = null;
    },
  },
  extraReducers: (builder) => {
    // Shared pending/rejected logic
    const handlePending = (state: ProductsState) => {
      state.isLoading = true;
      state.error = null;
    };
    const handleRejected = (state: ProductsState, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.error = action.payload;
    };

    // Fetch Nearby Vendors
    builder
      .addCase(fetchNearbyVendors.pending, handlePending)
      .addCase(fetchNearbyVendors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vendors = action.payload;
      })
      .addCase(fetchNearbyVendors.rejected, handleRejected);

    // Fetch Vendor Details
    builder
      .addCase(fetchVendorDetails.pending, (state) => {
          state.isLoading = true;
          state.error = null;
          state.selectedVendor = null;
      })
      .addCase(fetchVendorDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedVendor = action.payload;
      })
      .addCase(fetchVendorDetails.rejected, handleRejected);
      
    // Search
    builder
        .addCase(searchProductsAndVendors.pending, handlePending)
        .addCase(searchProductsAndVendors.fulfilled, (state, action) => {
            state.isLoading = false;
            state.searchResults = action.payload;
        })
        .addCase(searchProductsAndVendors.rejected, handleRejected);
  },
});

export const { clearSearch } = productsSlice.actions;

export default productsSlice.reducer;