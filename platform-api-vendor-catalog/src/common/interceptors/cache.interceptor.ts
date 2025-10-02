import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
  Logger,
} from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Reflector } from '@nestjs/core';
import { Observable, of, tap } from 'rxjs';
import {
  CACHE_KEY_METADATA,
  CACHE_TTL_METADATA,
  INVALIDATE_CACHE_KEY_METADATA,
} from '../decorators/cache.decorator';
import { Request } from 'express';
import * as objectHash from 'object-hash';

/**
 * @class HttpCacheInterceptor
 * @implements {NestInterceptor}
 * @description
 * An enterprise-grade interceptor to handle HTTP caching strategies declaratively.
 * It supports both cache-aside for GET requests and cache invalidation for write operations (POST, PUT, PATCH, DELETE).
 * This interceptor is designed to be resilient, gracefully falling back to the database if the cache store is unavailable.
 *
 * It works in conjunction with custom decorators:
 * - `@Cache(key: string, ttl: number)`: Applied to GET endpoints to enable caching.
 * - `@InvalidateCache(keys: string[])`: Applied to write endpoints to invalidate specific cache keys or patterns.
 *
 * Cache keys can be dynamic, using request parameters (e.g., 'product:{id}').
 * User-scoped caching is enforced by including the user's ID in the cache key if available.
 */
@Injectable()
export class HttpCacheInterceptor implements NestInterceptor {
  private readonly logger = new Logger(HttpCacheInterceptor.name);

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly reflector: Reflector,
  ) {}

  /**
   * @method intercept
   * @description
   * The core method that intercepts incoming requests and applies caching or invalidation logic.
   * @param {ExecutionContext} context - The execution context of the request.
   * @param {CallHandler} next - The next handler in the request pipeline.
   * @returns {Observable<any>} An observable of the response.
   */
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const handler = context.getHandler();
    const request = context.switchToHttp().getRequest<Request>();
    const method = request.method;

    const isWriteOperation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(
      method,
    );

    // Step 1: Handle Cache Invalidation for write operations
    if (isWriteOperation) {
      const keysToInvalidate = this.reflector.get<string[]>(
        INVALIDATE_CACHE_KEY_METADATA,
        handler,
      );
      if (keysToInvalidate && keysToInvalidate.length > 0) {
        return next.handle().pipe(
          tap(async () => {
            await this.handleInvalidation(keysToInvalidate, request);
          }),
        );
      }
      return next.handle();
    }

    // Step 2: Handle Caching for GET operations
    const cacheKeyTemplate = this.reflector.get<string>(
      CACHE_KEY_METADATA,
      handler,
    );
    const ttl = this.reflector.get<number>(CACHE_TTL_METADATA, handler);

    if (method !== 'GET' || !cacheKeyTemplate || !ttl) {
      return next.handle();
    }

    const cacheKey = this.generateCacheKey(cacheKeyTemplate, request);

    try {
      // Step 3: Attempt to retrieve from cache (Cache Hit)
      const cachedResponse = await this.cacheManager.get(cacheKey);
      if (cachedResponse !== undefined && cachedResponse !== null) {
        this.logger.debug(`Cache HIT for key: ${cacheKey}`);
        return of(cachedResponse);
      }

      // Step 4: Handle Cache Miss
      this.logger.debug(`Cache MISS for key: ${cacheKey}`);
      return next.handle().pipe(
        tap(async (response) => {
          try {
            await this.cacheManager.set(cacheKey, response, ttl * 1000); // ttl is in seconds, cacheManager expects ms
            this.logger.debug(`Cached response for key: ${cacheKey}`);
          } catch (error) {
            this.logger.error(
              `Failed to set cache for key: ${cacheKey}`,
              error.stack,
            );
          }
        }),
      );
    } catch (error) {
      // Step 5: Graceful fallback if cache is unavailable
      this.logger.error(
        `Cache is unavailable. Falling back to handler for key: ${cacheKey}`,
        error.stack,
      );
      return next.handle();
    }
  }

  /**
   * @method generateCacheKey
   * @private
   * @description
   * Generates a unique cache key based on a template and the incoming request.
   * It incorporates request params, query params, and the user's ID for user-scoped caches.
   *
   * @param {string} template - The key template from the `@Cache` decorator (e.g., 'products:vendor:{vendorId}').
   * @param {Request} request - The Express request object.
   * @returns {string} The final, unique cache key.
   */
  private generateCacheKey(template: string, request: Request): string {
    let key = template;

    // Replace path parameters (e.g., {id})
    if (request.params) {
      for (const param in request.params) {
        key = key.replace(`{${param}}`, request.params[param]);
      }
    }

    // Include user/vendor scope if present on the request
    const user = (request as any).user;
    if (user && user.sub) {
      key = `${key}:user:${user.sub}`;
    }
    // In our case, the VendorOwnershipGuard might place vendorId
    if (user && user.vendorId) {
       key = key.replace(`{vendorId}`, user.vendorId);
    }


    // Append a hash of query parameters for uniqueness across different queries
    if (request.query && Object.keys(request.query).length > 0) {
      const queryHash = objectHash(request.query, {
        algorithm: 'md5',
        encoding: 'base64',
      });
      key = `${key}:query:${queryHash}`;
    }

    return `cache:${key}`;
  }

  /**
   * @method handleInvalidation
   * @private
   * @description
   * Invalidates cache keys based on templates provided in the `@InvalidateCache` decorator.
   * Supports both direct key invalidation and pattern-based invalidation (e.g., 'products:*').
   *
   * @param {string[]} templates - Array of key templates to invalidate.
   * @param {Request} request - The Express request object to resolve dynamic parts of the key.
   */
  private async handleInvalidation(
    templates: string[],
    request: Request,
  ): Promise<void> {
    const user = (request as any).user;
    const dynamicParams = { ...request.params, ...user };

    for (let template of templates) {
      // Replace dynamic parts of the template
      for (const param in dynamicParams) {
        template = template.replace(`{${param}}`, dynamicParams[param]);
      }

      const keyToDelete = `cache:${template}`;

      try {
        if (keyToDelete.includes('*')) {
          // Handle pattern invalidation
          const keys = await (this.cacheManager.store as any).keys(keyToDelete);
          if (keys && keys.length > 0) {
            await (this.cacheManager.store as any).del(keys);
            this.logger.debug(
              `Invalidated ${keys.length} keys for pattern: ${keyToDelete}`,
            );
          }
        } else {
          // Handle direct key invalidation
          await this.cacheManager.del(keyToDelete);
          this.logger.debug(`Invalidated cache for key: ${keyToDelete}`);
        }
      } catch (error) {
        this.logger.error(
          `Failed to invalidate cache for key/pattern: ${keyToDelete}`,
          error.stack,
        );
      }
    }
  }
}