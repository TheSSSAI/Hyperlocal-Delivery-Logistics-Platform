import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import jwt_decode from 'jwt-decode';
import { User } from '../../types/user.types';
import { AuthTokens, RequestOtpPayload, VerifyOtpPayload } from './auth.types';
import { authService } from './authService';
import { realtimeService } from '../../services/realtimeService';

interface DecodedToken {
  sub: string;
  name: string;
  // Add other claims as needed
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAppLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  isAppLoading: true, // To handle initial auth status check
  error: null,
};

// Async Thunks
export const checkAuthStatus = createAsyncThunk<AuthTokens | null, void>(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getInitialAuthStatus();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const requestLoginOtp = createAsyncThunk<void, RequestOtpPayload>(
  'auth/requestLoginOtp',
  async (payload, { rejectWithValue }) => {
    try {
      await authService.requestLoginOtp(payload);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send OTP');
    }
  },
);

export const verifyLoginOtp = createAsyncThunk<AuthTokens, VerifyOtpPayload>(
  'auth/verifyLoginOtp',
  async (payload, { rejectWithValue }) => {
    try {
      const tokens = await authService.verifyLoginOtp(payload);
      await realtimeService.connect();
      return tokens;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Invalid OTP');
    }
  },
);

export const logoutUser = createAsyncThunk<void, void>(
  'auth/logoutUser',
  async (_, { dispatch }) => {
    await authService.logout();
    realtimeService.disconnect();
    // After logout, you might want to reset other slices' state too
    // This can be handled in a root reducer or with another action.
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Shared pending/rejected logic for OTP requests
    const handlePending = (state: AuthState) => {
      state.isLoading = true;
      state.error = null;
    };
    const handleRejected = (state: AuthState, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.error = action.payload;
    };
    
    // Check Auth Status
    builder
      .addCase(checkAuthStatus.pending, (state) => {
        state.isAppLoading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        if (action.payload) {
          const { accessToken, refreshToken } = action.payload;
          const decoded: DecodedToken = jwt_decode(accessToken);
          state.user = { id: decoded.sub, name: decoded.name, email: null, mobileNumber: '' }; // Populate as needed
          state.accessToken = accessToken;
          state.refreshToken = refreshToken;
          state.isAuthenticated = true;
        }
        state.isAppLoading = false;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isAppLoading = false;
      });

    // Login Flow
    builder
      .addCase(requestLoginOtp.pending, handlePending)
      .addCase(requestLoginOtp.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(requestLoginOtp.rejected, handleRejected)
      .addCase(verifyLoginOtp.pending, handlePending)
      .addCase(verifyLoginOtp.fulfilled, (state, action) => {
        const { accessToken, refreshToken } = action.payload;
        const decoded: DecodedToken = jwt_decode(accessToken);
        state.user = { id: decoded.sub, name: decoded.name, email: null, mobileNumber: '' };
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(verifyLoginOtp.rejected, handleRejected);

    // Logout
    builder
      .addCase(logoutUser.fulfilled, (state) => {
          return initialState; // Reset state to initial
      });
  },
});

export const { clearAuthError } = authSlice.actions;

export default authSlice.reducer;