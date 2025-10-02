export const MAPBOX_SERVICE = 'IMapboxService';

export interface Waypoint {
  latitude: number;
  longitude: number;
}

export interface OptimizedRoute {
  distance: number; // in meters
  duration: number; // in seconds
  geometry: any; // GeoJSON geometry object
  waypoints: Waypoint[];
}

export interface IMapboxService {
  /**
   * Calculates an optimized route between a series of waypoints,
   * considering real-time traffic.
   * @param waypoints - An array of Waypoint objects representing the stops in order.
   * @returns A promise that resolves to an OptimizedRoute object.
   * @throws MapboxApiException if the external service call fails.
   */
  getOptimizedRoute(waypoints: Waypoint[]): Promise<OptimizedRoute>;
}