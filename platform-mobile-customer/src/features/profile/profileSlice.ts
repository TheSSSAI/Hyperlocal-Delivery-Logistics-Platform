import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/user.types';
import { Address, AddressPayload } from '../../types/address.types';
import { profileService } from './profileService';
import { UpdateProfilePayload } from './profile.types';

interface ProfileState {
  profile: User | null;
  addresses: Address[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  addresses: [],
  isLoading: false,
  isSubmitting: false,
  error: null,
};

// Async Thunks
export const fetchProfile = createAsyncThunk<User, void>(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await profileService.getProfile();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  },
);

export const updateProfile = createAsyncThunk<User, UpdateProfilePayload>(
  'profile/updateProfile',
  async (payload, { rejectWithValue }) => {
    try {
      return await profileService.updateProfile(payload);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  },
);

export const fetchAddresses = createAsyncThunk<Address[], void>(
  'profile/fetchAddresses',
  async (_, { rejectWithValue }) => {
    try {
      return await profileService.getAddresses();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch addresses');
    }
  },
);

export const addAddress = createAsyncThunk<Address, AddressPayload>(
    'profile/addAddress',
    async (payload, { rejectWithValue }) => {
        try {
            return await profileService.addAddress(payload);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add address');
        }
    }
);

export const updateAddress = createAsyncThunk<Address, { addressId: string, payload: AddressPayload }>(
    'profile/updateAddress',
    async ({ addressId, payload }, { rejectWithValue }) => {
        try {
            return await profileService.updateAddress(addressId, payload);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update address');
        }
    }
);

export const deleteAddress = createAsyncThunk<string, string>(
    'profile/deleteAddress',
    async (addressId, { rejectWithValue }) => {
        try {
            await profileService.deleteAddress(addressId);
            return addressId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete address');
        }
    }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Profile
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Update Profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      });

    // Address Management
    builder
      .addCase(fetchAddresses.pending, (state) => {
          state.isLoading = true;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
          state.isLoading = false;
          state.addresses = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
          state.addresses.push(action.payload);
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
          const index = state.addresses.findIndex(addr => addr.id === action.payload.id);
          if (index !== -1) {
              state.addresses[index] = action.payload;
          }
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
          state.addresses = state.addresses.filter(addr => addr.id !== action.payload);
      });
  },
});

export default profileSlice.reducer;