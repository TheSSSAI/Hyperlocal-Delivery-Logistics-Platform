import { Inject, Injectable, Logger } from '@nestjs/common';
import { IRiderLocationCacheService } from 'src/shared/cache/interfaces/rider-location-cache.interface';
import { LocationUpdateDto } from '../dtos/location-update.dto';
import { IRiderLocationService } from '../interfaces/rider-location.service.interface';
import { IEventPublisher } from 'src/shared/messaging/interfaces/event-publisher.interface';
import { RiderLocationArchivalEvent } from '@platform-la-logistics-contracts/rider-events';

@Injectable()
export class RiderLocationService implements IRiderLocationService {
  private readonly logger = new Logger(RiderLocationService.name);

  constructor(
    @Inject('IRiderLocationCacheService')
    private readonly riderLocationCache: IRiderLocationCacheService,
    @Inject('IEventPublisher')
    private readonly eventPublisher: IEventPublisher,
  ) {}

  /**
   * Updates a rider's real-time location in the cache and triggers an asynchronous archival process.
   * This is a high-frequency, performance-critical operation.
   * @param riderId - The ID of the rider.
   * @param locationUpdateDto - The new location data from the rider's device.
   */
  async updateRiderLocation(riderId: string, locationUpdateDto: LocationUpdateDto): Promise<void> {
    const { latitude, longitude, timestamp } = locationUpdateDto;
    this.logger.debug(`Updating location for rider ${riderId} to (${latitude}, ${longitude})`);

    try {
      // Primary, low-latency update to Redis for live tracking and allocation.
      await this.riderLocationCache.updateRiderLocation(riderId, { latitude, longitude });

      // Asynchronously publish an event to archive the location data to PostGIS.
      // This decouples the write to the primary database from the critical real-time path.
      const archivalEvent = new RiderLocationArchivalEvent({
        riderId,
        latitude,
        longitude,
        timestamp,
      });

      await this.eventPublisher.publish('rider.location.archive', archivalEvent);

    } catch (error) {
      this.logger.error(`Failed to update location for rider ${riderId}`, error.stack);
      // Depending on the error, we might want to throw or just log.
      // For now, we log as this is a background process.
    }
  }

  /**
   * Retrieves a rider's last known location from the real-time cache.
   * @param riderId - The ID of the rider.
   * @returns The rider's latitude and longitude, or null if not found.
   */
  async getRiderLocation(riderId: string): Promise<{ latitude: number; longitude: number } | null> {
    this.logger.debug(`Fetching location for rider ${riderId}`);
    return this.riderLocationCache.getRiderLocation(riderId);
  }

  /**
   * Finds all available riders within a specified radius of a geographic point.
   * This method queries the real-time cache for high performance.
   * @param point - The center point for the search.
   * @param radiusInMeters - The radius of the search area.
   * @returns A list of rider IDs found within the radius.
   */
  async findNearbyRiders(
    point: { latitude: number; longitude: number },
    radiusInMeters: number,
  ): Promise<string[]> {
    this.logger.debug(
      `Finding nearby riders around (${point.latitude}, ${point.longitude}) within ${radiusInMeters}m`,
    );
    try {
      const riderIds = await this.riderLocationCache.findRidersNear(point, radiusInMeters);
      this.logger.log(`Found ${riderIds.length} riders nearby.`);
      return riderIds;
    } catch (error) {
      this.logger.error('Failed to query nearby riders from cache', error.stack);
      return [];
    }
  }
}