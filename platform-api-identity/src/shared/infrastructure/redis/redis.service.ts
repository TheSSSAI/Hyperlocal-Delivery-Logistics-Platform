import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis, { Redis as RedisClient } from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);

  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: RedisClient) {}

  onModuleDestroy() {
    this.redisClient.quit();
    this.logger.log('Redis client connection closed.');
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.redisClient.get(key);
    } catch (error) {
      this.logger.error(`Error getting key ${key} from Redis:`, error);
      throw error;
    }
  }

  async set(key: string, value: string | number, ttlSeconds?: number): Promise<'OK'> {
    try {
      if (ttlSeconds) {
        return await this.redisClient.set(key, value, 'EX', ttlSeconds);
      } else {
        return await this.redisClient.set(key, value);
      }
    } catch (error) {
      this.logger.error(`Error setting key ${key} in Redis:`, error);
      throw error;
    }
  }

  async del(key: string): Promise<number> {
    try {
      return await this.redisClient.del(key);
    } catch (error) {
      this.logger.error(`Error deleting key ${key} from Redis:`, error);
      throw error;
    }
  }

  async incr(key: string): Promise<number> {
    try {
      return await this.redisClient.incr(key);
    } catch (error) {
      this.logger.error(`Error incrementing key ${key} in Redis:`, error);
      throw error;
    }
  }

  async expire(key: string, ttlSeconds: number): Promise<number> {
    try {
      return await this.redisClient.expire(key, ttlSeconds);
    } catch (error) {
      this.logger.error(`Error setting expiry for key ${key} in Redis:`, error);
      throw error;
    }
  }

  async ttl(key: string): Promise<number> {
    try {
      return await this.redisClient.ttl(key);
    } catch (error) {
      this.logger.error(`Error getting TTL for key ${key} in Redis:`, error);
      throw error;
    }
  }

  getClient(): RedisClient {
    return this.redisClient;
  }
}