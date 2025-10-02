export const RIDER_LOCATION_CACHE_SERVICE = 'IRiderLocationCacheService';

export interface RiderLocation {
  latitude: number;
  longitude: number;
}

export interface RiderLocationWithId extends RiderLocation {
  riderId: string;
}

/**
 * Defines the contract for a high-performance cache that stores and queries
 * the real-time locations of riders. This is a critical component for the
 * rider allocation algorithm.
 */
export interface IRiderLocationCacheService {
  /**
   * Adds or updates a rider's current location in the cache.
   * Uses Redis GEOADD command.
   * @param riderId The unique identifier of the rider.
   * @param location The rider's current latitude and longitude.
   */
  updateRiderLocation(riderId: string, location: RiderLocation): Promise<void>;

  /**
   * Removes a rider's location from the cache.
   * This is typically called when a rider goes offline.
   * Uses Redis ZREM command.
   * @param riderId The unique identifier of the rider.
   */
  removeRiderLocation(riderId: string): Promise<void>;

  /**
   * Retrieves the current location of a single rider.
   * Uses Redis GEOPOS command.
   * @param riderId The unique identifier of the rider.
   * @returns The rider's location, or null if not found.
   */
  getRiderLocation(riderId: string): Promise<RiderLocation | null>;

  /**
   * Finds all riders within a specified radius of a given point.
   * This is the core method used by the allocation service.
   * Uses Redis GEORADIUS command with distance.
   * @param location The center point for the search.
   * @param radiusInMeters The search radius.
   * @returns An array of rider IDs with their locations.
   */
  findRidersNear(
    location: RiderLocation,
    radiusInMeters: number,
  ): Promise<RiderLocationWithId[]>;
}