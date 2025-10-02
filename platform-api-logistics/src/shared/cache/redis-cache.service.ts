import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { RedisClientType } from 'redis';
import { IRiderLocationCacheService } from './interfaces/rider-location-cache.interface';

@Injectable()
export class RedisCacheService
  implements IRiderLocationCacheService, OnModuleInit
{
  private readonly logger = new Logger(RedisCacheService.name);
  private redisClient: RedisClientType;
  private readonly RIDER_LOCATION_KEY = 'rider_live_locations';

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  onModuleInit() {
    // Access the underlying Redis client from cache-manager to use native commands like GEOADD
    // This is a common pattern when needing functionality beyond the cache-manager abstraction.
    this.redisClient = (this.cacheManager.store as any).getClient();
    if (!this.redisClient) {
      this.logger.error(
        'Could not get Redis client from CacheManager. Geo commands will not work.',
      );
    } else {
      this.logger.log('Successfully initialized Redis client for GEO commands.');
    }
  }

  private ensureClient(): void {
    if (!this.redisClient) {
      throw new Error('Redis client is not available.');
    }
  }

  async updateRiderLocation(
    riderId: string,
    location: { latitude: number; longitude: number },
  ): Promise<void> {
    this.ensureClient();
    this.logger.debug(
      `Updating location for rider ${riderId}: lon=${location.longitude}, lat=${location.latitude}`,
    );
    try {
      await this.redisClient.geoAdd(this.RIDER_LOCATION_KEY, {
        longitude: location.longitude,
        latitude: location.latitude,
        member: riderId,
      });
    } catch (error) {
      this.logger.error(
        `Failed to update rider location for ${riderId} in Redis: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findRidersNear(
    location: { latitude: number; longitude: number },
    radiusInMeters: number,
  ): Promise<string[]> {
    this.ensureClient();
    this.logger.debug(
      `Finding riders near (lon: ${location.longitude}, lat: ${location.latitude}) within ${radiusInMeters}m`,
    );
    try {
      const riders = await this.redisClient.geoRadius(
        this.RIDER_LOCATION_KEY,
        {
          longitude: location.longitude,
          latitude: location.latitude,
        },
        radiusInMeters,
        'm',
      );
      return riders;
    } catch (error) {
      this.logger.error(
        `Failed to find riders near in Redis: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getRiderLocation(
    riderId: string,
  ): Promise<{ latitude: number; longitude: number } | null> {
    this.ensureClient();
    this.logger.debug(`Getting location for rider ${riderId}`);
    try {
      const position = await this.redisClient.geoPos(
        this.RIDER_LOCATION_KEY,
        riderId,
      );
      if (position && position[0]) {
        return {
          longitude: position[0].longitude,
          latitude: position[0].latitude,
        };
      }
      return null;
    } catch (error) {
      this.logger.error(
        `Failed to get rider location for ${riderId} from Redis: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async removeRiderLocation(riderId: string): Promise<void> {
    this.ensureClient();
    this.logger.debug(`Removing location for rider ${riderId}`);
    try {
      await this.redisClient.zRem(this.RIDER_LOCATION_KEY, riderId);
    } catch (error) {
      this.logger.error(
        `Failed to remove rider location for ${riderId} from Redis: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}