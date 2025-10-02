import { Zone } from '../domain/zone.entity';

export const ZONE_REPOSITORY = 'IZoneRepository';

export interface IZoneRepository {
  /**
   * Finds a zone by its unique identifier.
   * @param id - The UUID of the zone.
   * @returns A promise that resolves to the Zone entity or null if not found.
   */
  findById(id: string): Promise<Zone | null>;

  /**
   * Finds all zones.
   * @returns A promise that resolves to an array of Zone entities.
   */
  findAll(): Promise<Zone[]>;

  /**
   * Creates a new zone in the persistence layer.
   * @param zone - The Zone entity to create.
   * @returns A promise that resolves to the created Zone entity.
   */
  create(zone: Zone): Promise<Zone>;

  /**
   * Updates an existing zone in the persistence layer.
   * @param zone - The Zone entity with updated properties.
   * @returns A promise that resolves to the updated Zone entity.
   */
  update(zone: Zone): Promise<Zone>;

  /**
   * Deletes a zone by its unique identifier.
   * @param id - The UUID of the zone to delete.
   * @returns A promise that resolves when the deletion is complete.
   */
  delete(id: string): Promise<void>;

  /**
   * Performs a geospatial query to check if a given point is within any active zone.
   * @param point - An object containing latitude and longitude.
   * @returns A promise that resolves to true if the point is in an active zone, otherwise false.
   */
  isPointInAnyActiveZone(point: {
    latitude: number;
    longitude: number;
  }): Promise<boolean>;
}