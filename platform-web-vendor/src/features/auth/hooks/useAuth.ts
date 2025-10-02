import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { apiClient } from '@/shared/api/ApiClient';
import { socket } from '@/shared/lib/socket';
import { StoreProfile } from '@/features/store-profile/types';

// Define the shape of the authentication context
interface AuthContextType {
  isAuthenticated: boolean;
  vendor: StoreProfile | null;
  isLoading: boolean;
  sendOtp: (mobileNumber: string) => Promise<void>;
  verifyOtp: (mobileNumber: string, otp: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to consume the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider component that encapsulates the authentication logic
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [vendor, setVendor] = useState<StoreProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const handleAuthSuccess = useCallback(async (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    
    try {
      // Per REQ-1-010, on login, fetch vendor profile
      const profile = await apiClient.get<StoreProfile>('/vendor/profile/me');
      setVendor(profile.data);
      setIsAuthenticated(true);
    } catch (e) {
      setError('Failed to fetch vendor profile. Please try logging in again.');
      await logout(); // Logout if profile fetch fails
    }
  }, []);

  const logout = useCallback(async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            await apiClient.post('/auth/logout', { refreshToken });
        }
    } catch (e) {
        // Fail silently on logout error, as the main goal is to clear local state
        console.error("Logout API call failed, but proceeding with client-side logout:", e);
    } finally {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        delete apiClient.defaults.headers.common['Authorization'];
        setVendor(null);
        setIsAuthenticated(false);
        socket.disconnect(); // Disconnect socket on logout
    }
  }, []);

  const refreshToken = useCallback(async () => {
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (!storedRefreshToken) {
      return false;
    }
    try {
      const response = await apiClient.post<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
        refreshToken: storedRefreshToken,
      });
      const { accessToken, refreshToken: newRefreshToken } = response.data;
      await handleAuthSuccess(accessToken, newRefreshToken);
      return true;
    } catch (e) {
      await logout();
      return false;
    }
  }, [handleAuthSuccess, logout]);

  // Check for session on initial app load
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('accessToken');
      if (token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          // Check if token is still valid by fetching profile
          const profile = await apiClient.get<StoreProfile>('/vendor/profile/me');
          setVendor(profile.data);
          setIsAuthenticated(true);
        } catch (e) {
          // If token is expired, try to refresh it
          await refreshToken();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [refreshToken]);
  
  // Set up an interceptor to handle token refresh automatically
  useEffect(() => {
    const interceptor = apiClient.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                const success = await refreshToken();
                if (success) {
                    originalRequest.headers['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
                    return apiClient(originalRequest);
                }
            }
            return Promise.reject(error);
        }
    );

    return () => {
        apiClient.interceptors.response.eject(interceptor);
    };
  }, [refreshToken]);


  const sendOtp = useCallback(async (mobileNumber: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // As per VND-004, this initiates the OTP login process
      await apiClient.post('/auth/otp/send', { mobileNumber });
    } catch (e: any) {
      const errorMessage = e.response?.data?.message || 'Failed to send OTP. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyOtp = useCallback(
    async (mobileNumber: string, otp: string) => {
      setIsLoading(true);
      setError(null);
      try {
        // VND-004: Verifies OTP and returns tokens
        const response = await apiClient.post<{ accessToken: string; refreshToken: string }>(
          '/auth/otp/verify',
          { mobileNumber, otp }
        );
        await handleAuthSuccess(response.data.accessToken, response.data.refreshToken);
      } catch (e: any) {
        const errorMessage = e.response?.data?.message || 'OTP verification failed. Please try again.';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [handleAuthSuccess]
  );
  
  const authContextValue: AuthContextType = {
    isAuthenticated,
    vendor,
    isLoading,
    sendOtp,
    verifyOtp,
    logout,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};