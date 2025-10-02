import Config from 'react-native-config';

/**
 * Type definition for environment variables. Ensures type safety when accessing process.env.
 * REQ-1-111: Specifies the technology stack and third-party services.
 * This config provides type-safe access to their required URLs and tokens.
 */
interface Environment {
  API_BASE_URL: string;
  WEBSOCKET_URL: string;
  MAPBOX_ACCESS_TOKEN: string;
}

/**
 * A type-safe configuration object that pulls values from the .env files.
 * It performs runtime validation to ensure that all required environment variables are set,
 * preventing the application from running in a misconfigured state. This is a "fail-fast" approach.
 */
const environment: Environment = {
  API_BASE_URL: Config.API_BASE_URL || '',
  WEBSOCKET_URL: Config.WEBSOCKET_URL || '',
  MAPBOX_ACCESS_TOKEN: Config.MAPBOX_ACCESS_TOKEN || '',
};

// --- Runtime Validation ---
// Ensures that the application will not start if critical environment variables are missing.

if (!environment.API_BASE_URL) {
  throw new ReferenceError(
    'API_BASE_URL is not defined in the environment file. Please check your .env configuration.',
  );
}

if (!environment.WEBSOCKET_URL) {
  throw new ReferenceError(
    'WEBSOCKET_URL is not defined in the environment file. Please check your .env configuration.',
  );
}

if (!environment.MAPBOX_ACCESS_TOKEN) {
  throw new ReferenceError(
    'MAPBOX_ACCESS_TOKEN is not defined in the environment file. Please check your .env configuration.',
  );
}

export default environment;