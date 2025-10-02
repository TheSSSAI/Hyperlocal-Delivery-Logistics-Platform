import BackgroundGeolocation, {
  State,
  Config,
  Location,
  HttpEvent,
} from 'react-native-background-geolocation';
import { permissionService, PermissionType } from './permissionService';
import { environment } from '../config/environment';
import { secureStorage } from './secureStorage';

let isInitialized = false;

/**
 * Initializes and configures the background location service.
 * This must be called once after login before starting tracking.
 */
const initialize = async (): Promise<void> => {
  if (isInitialized) {
    return;
  }

  const token = await secureStorage.get('accessToken');
  if (!token) {
    throw new Error('Cannot initialize LocationService without an access token.');
  }

  const config: Config = {
    // Geolocation Config
    desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
    distanceFilter: 10, // meters
    stopTimeout: 5, // minutes

    // Application config
    debug: environment.name !== 'production', // enable logs in dev
    logLevel:
      environment.name !== 'production'
        ? BackgroundGeolocation.LOG_LEVEL_VERBOSE
        : BackgroundGeolocation.LOG_LEVEL_OFF,
    stopOnTerminate: false,
    startOnBoot: true, // Will restart tracking if the app is terminated

    // HTTP & Sync Config
    url: `${environment.api.baseUrl}/location`,
    autoSync: true,
    batchSync: true,
    maxBatchSize: 50,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      // additional static params if needed
    },
    httpRootProperty: 'locations',
    locationTemplate:
      '{"latitude":<%= latitude %>,"longitude":<%= longitude %>,"timestamp":"<%= timestamp %>","accuracy":<%= accuracy %>,"speed":<%= speed %>}',

    // Activity Recognition
    stopOnStationary: true,
    stationaryRadius: 25,

    // App Experience
    notification: {
      title: 'Platform Rider',
      text: 'Live location tracking is active.',
    },
  };

  try {
    await BackgroundGeolocation.ready(config);
    isInitialized = true;
    console.log('[LocationService] BackgroundGeolocation ready');

    // Add event listeners if needed for advanced logic
    BackgroundGeolocation.onHttp((response: HttpEvent) => {
        console.log('[LocationService] onHttp success: ', response.success);
        console.log('[LocationService] onHttp status: ', response.status);
        console.log('[LocationService] onHttp response: ', response.responseText);
    });

    BackgroundGeolocation.onLocation((location: Location) => {
        console.log('[LocationService] onLocation: ', location);
    });


  } catch (error) {
    console.error('[LocationService] BackgroundGeolocation.ready error:', error);
    throw error;
  }
};

/**
 * Starts the background location tracking.
 * Checks for permissions before starting.
 * @throws {Error} if permissions are not granted or initialization failed.
 */
const startTracking = async (): Promise<void> => {
  if (!isInitialized) {
    throw new Error('LocationService is not initialized. Call initialize() first.');
  }
  
  const hasPermission = await permissionService.checkPermission(PermissionType.LOCATION);
  if (!hasPermission) {
    const granted = await permissionService.requestPermission(PermissionType.LOCATION);
    if (!granted) {
      throw new Error('Location permission denied.');
    }
  }

  try {
    const state: State = await BackgroundGeolocation.getState();
    if (!state.enabled) {
      await BackgroundGeolocation.start();
      console.log('[LocationService] Tracking started');
    } else {
      console.log('[LocationService] Tracking was already started');
    }
  } catch (error) {
    console.error('[LocationService] Failed to start tracking:', error);
    throw error;
  }
};

/**
 * Stops the background location tracking.
 */
const stopTracking = async (): Promise<void> => {
  if (!isInitialized) {
    console.warn('[LocationService] Not initialized, cannot stop tracking.');
    return;
  }
  try {
    const state: State = await BackgroundGeolocation.getState();
    if (state.enabled) {
        await BackgroundGeolocation.stop();
        console.log('[LocationService] Tracking stopped');
    }
  } catch (error) {
    console.error('[LocationService] Failed to stop tracking:', error);
    // Do not re-throw, as this is a non-critical cleanup operation
  }
};

/**
 * Updates the authorization token used for background HTTP posts.
 * This should be called whenever the app refreshes its JWT.
 * @param token The new JWT access token.
 */
const updateAuthToken = async (token: string): Promise<void> => {
    if (!isInitialized) {
        return;
    }
    try {
        await BackgroundGeolocation.setConfig({
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        console.log('[LocationService] Auth token updated for background posts.');
    } catch (error) {
        console.error('[LocationService] Failed to update auth token:', error);
    }
}

export const locationService = {
  initialize,
  startTracking,
  stopTracking,
  updateAuthToken,
};