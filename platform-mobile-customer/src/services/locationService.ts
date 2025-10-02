import Geolocation, {
  GeolocationResponse,
  GeolocationError,
} from 'react-native-geolocation-service';
import { permissionsService, PermissionType, PermissionStatus } from './permissionsService';

export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

class LocationService {
  /**
   * Retrieves the current geographical position of the device.
   * It first checks for location permissions and requests them if necessary.
   *
   * @returns {Promise<Coordinates>} A promise that resolves with the device's coordinates.
   * @throws {Error} Throws an error if location permission is denied or if the location cannot be fetched.
   */
  public async getCurrentPosition(): Promise<Coordinates> {
    try {
      const hasPermission = await this.checkAndRequestLocationPermission();
      if (!hasPermission) {
        throw new Error('Location permission denied.');
      }

      return new Promise<Coordinates>((resolve, reject) => {
        Geolocation.getCurrentPosition(
          (position: GeolocationResponse) => {
            const { latitude, longitude, accuracy } = position.coords;
            resolve({ latitude, longitude, accuracy });
          },
          (error: GeolocationError) => {
            reject(new Error(`Failed to get location: ${error.message}`));
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
      });
    } catch (error) {
      console.error('[LocationService] Error getting current position:', error);
      throw error;
    }
  }

  /**
   * Checks for location permission and requests it if not already granted.
   * This is a crucial step before accessing GPS data.
   *
   * @private
   * @returns {Promise<boolean>} A promise that resolves to true if permission is granted, false otherwise.
   */
  private async checkAndRequestLocationPermission(): Promise<boolean> {
    let status = await permissionsService.check(PermissionType.LOCATION);

    if (status === PermissionStatus.DENIED) {
      status = await permissionsService.request(PermissionType.LOCATION);
    }

    return status === PermissionStatus.GRANTED;
  }
}

export const locationService = new LocationService();