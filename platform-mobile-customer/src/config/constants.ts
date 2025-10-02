/**
 * @file This file contains shared constants used throughout the application.
 * Centralizing these values improves maintainability and consistency.
 * These constants are at dependency level 0, meaning they have no internal dependencies.
 */

// API and Network Configuration
export const API_TIMEOUT = 15000; // 15 seconds for API requests
export const LOCATION_UPDATE_INTERVAL = 5000; // 5 seconds for rider location updates as per REQ-1-059
export const REALTIME_LOCATION_LATENCY_THRESHOLD = 2000; // 2 seconds as per REQ-1-061
export const ORDER_STATUS_UPDATE_LATENCY_THRESHOLD = 2000; // 2 seconds for status updates as per CUS-027
export const CHAT_MESSAGE_LATENCY_THRESHOLD = 2000; // 2 seconds for chat message delivery

// Business Rule Constants based on requirements
export const FULL_REFUND_CANCELLATION_WINDOW_SECONDS = 60; // As per REQ-1-031
export const MAX_OTP_ATTEMPTS = 5; // As per REQ-1-041
export const OTP_LOCKOUT_DURATION_MINUTES = 15; // As per REQ-1-041
export const OTP_RESEND_COOLDOWN_SECONDS = 60; // As per REQ-1-041
export const OTP_VALIDITY_DURATION_MINUTES = 5; // As per SEQ-203

// UI and UX Constants
export const TOAST_DURATION = 3000; // 3 seconds
export const DEBOUNCE_DELAY = 300; // 300ms for search input
export const ANIMATION_DURATION = 250; // ms for standard animations
export const MAP_UPDATE_INTERVAL_SECONDS = 10; // Rider position on map updates every 10 seconds (5-10s range from REQ-1-059)

// Storage Keys for Secure Storage (Keychain/Keystore)
export const STORAGE_KEY_AUTH_TOKENS = 'com.hyperlocal.platform.auth.tokens';
export const STORAGE_KEY_DEVICE_TOKEN = 'com.hyperlocal.platform.device.token';

// Pagination and Data Fetching
export const DEFAULT_PAGE_SIZE = 20; // Default number of items to fetch per page for lists

// Colors - Centralized for theming
export const COLORS = {
  primary: '#4F46E5', // Indigo
  secondary: '#10B981', // Emerald
  background: '#F9FAFB', // Gray 50
  surface: '#FFFFFF',
  text: '#1F2937', // Gray 800
  textSecondary: '#6B7280', // Gray 500
  error: '#EF4444', // Red 500
  warning: '#F59E0B', // Amber 500
  success: '#10B981', // Emerald 500
  disabled: '#D1D5DB', // Gray 300
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

// Spacing and Layout
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// Font Sizes
export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
};

// Map configuration
export const MAP_DEFAULTS = {
  // Centered on Mumbai, as per REQ-1-112
  initialLatitude: 19.076,
  initialLongitude: 72.8777,
  initialLatitudeDelta: 0.2,
  initialLongitudeDelta: 0.2,
};