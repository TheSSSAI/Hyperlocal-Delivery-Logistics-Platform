import { LocationUpdateDto } from '../dtos/location-update.dto';

export const RIDER_LOCATION_SERVICE = 'IRiderLocationService';

export interface IRiderLocationService {
  /**
   * Handles an incoming location update from a rider's device.
   * It updates the real-time cache, broadcasts the location to the relevant customer,
   * and asynchronously archives the location data.
   * @param riderId - The unique identifier of the rider.
   * @param data - The location payload from the rider's device.
   */
  handleRiderLocationUpdate(
    riderId: string,
    data: LocationUpdateDto,
  ): Promise<void>;

  /**
   * Retrieves the last known location of a rider from the real-time cache.
   * @param riderId - The unique identifier of the rider.
   * @returns A promise that resolves to the rider's location or null if not found.
   */
  getRiderLocation(
    riderId: string,
  ): Promise<{ latitude: number; longitude: number } | null>;
}