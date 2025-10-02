/**
 * @file This file manages environment-specific configurations for the application.
 * It provides a typed, centralized way to access environment variables.
 * This is a level 0 file with no internal dependencies.
 */
import Config from 'react-native-config';

// Define the shape of the environment variables for type safety
interface EnvironmentConfig {
  API_BASE_URL: string;
  WEBSOCKET_URL: string;
  MAPBOX_API_KEY: string;
  RAZORPAY_API_KEY: string;
  ENVIRONMENT: 'development' | 'staging' | 'production';
}

// Function to validate environment variables on startup
const validateConfig = (config: { [key: string]: string | undefined }): EnvironmentConfig => {
  if (!config.API_BASE_URL) {
    throw new Error('Missing environment variable: API_BASE_URL');
  }
  if (!config.WEBSOCKET_URL) {
    throw new Error('Missing environment variable: WEBSOCKET_URL');
  }
  if (!config.MAPBOX_API_KEY) {
    throw new Error('Missing environment variable: MAPBOX_API_KEY');
  }
  if (!config.RAZORPAY_API_KEY) {
    throw new Error('Missing environment variable: RAZORPAY_API_KEY');
  }
  if (
    !config.ENVIRONMENT ||