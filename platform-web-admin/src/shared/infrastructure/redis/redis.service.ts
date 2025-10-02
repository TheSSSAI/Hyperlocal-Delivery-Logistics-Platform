import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis, { Redis as RedisClient } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClient;
  private readonly logger = new Logger(RedisService.name);

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const redisHost = this.configService.get<string>('REDIS_HOST');
    const redisPort = this.configService.get<number>('REDIS_PORT');

    if (!redisHost || !redisPort) {
      this.logger.error('Redis configuration (HOST, PORT) is missing.');
      throw new Error('Redis configuration is missing.');
    }

    this.client = new Redis({
      host: redisHost,
      port: redisPort,
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    this.client.on('connect', () => {
      this.logger.log('Successfully connected to Redis.');
    });

    this.client.on('error', (error) => {
      this.logger.error('Redis connection error:', error);
    });
  }

  onModuleDestroy() {
    this.client.quit().then(() => {
      this.logger.log('Redis connection closed gracefully.');
    }).catch(error => {
      this.logger.error('Error while closing Redis connection:', error);
    });
  }

  getClient(): RedisClient {
    return this.client;
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      this.logger.error(`Error getting key "${key}" from Redis`, error);
      throw error;
    }
  }

  async set(
    key: string,
    value: string | number,
    ttlSeconds?: number,
  ): Promise<'OK'> {
    try {
      if (ttlSeconds) {
        return await this.client.setex(key, ttlSeconds, value);
      } else {
        return await this.client.set(key, value);
      }
    } catch (error) {
      this.logger.error(`Error setting key "${key}" in Redis`, error);
      throw error;
    }
  }

  async del(key: string): Promise<number> {
    try {
      return await this.client.del(key);
    } catch (error) {
      this.logger.error(`Error deleting key "${key}" from Redis`, error);
      throw error;
    }
  }

  async incr(key: string): Promise<number> {
    try {
      return await this.client.incr(key);
    } catch (error) {
      this.logger.error(`Error incrementing key "${key}" in Redis`, error);
      throw error;
    }
  }
  
  async decr(key: string): Promise<number> {
    try {
      return await this.client.decr(key);
    } catch (error) {
      this.logger.error(`Error decrementing key "${key}" in Redis`, error);
      throw error;
    }
  }

  async expire(key: string, ttlSeconds: number): Promise<number> {
    try {
      return await this.client.expire(key, ttlSeconds);
    } catch (error) {
      this.logger.error(`Error setting expiry for key "${key}" in Redis`, error);
      throw error;
    }
  }

  async ttl(key: string): Promise<number> {
    try {
        return await this.client.ttl(key);
    } catch (error) {
        this.logger.error(`Error getting TTL for key "${key}" in Redis`, error);
        throw error;
    }
  }
}