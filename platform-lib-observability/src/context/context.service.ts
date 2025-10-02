import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { CORRELATION_ID_KEY } from '../constants';

/**
 * A service that provides a request-scoped context using Node.js AsyncLocalStorage.
 * This is a critical component for propagating the correlation ID and other context
 * information through asynchronous operations within a single request lifecycle.
 *
 * It is provided as a singleton service but manages a separate context for each request.
 */
@Injectable()
export class ContextService {
  private readonly asyncLocalStorage: AsyncLocalStorage<Map<string, any>>;

  constructor() {
    this.asyncLocalStorage = new AsyncLocalStorage();
  }

  /**
   * Runs a callback function within a new asynchronous context.
   * @param store - A Map containing the initial context values.
   * @param callback - The function to execute within the new context.
   * @returns The return value of the callback function.
   */
  run<T>(store: Map<string, any>, callback: () => T): T {
    return this.asyncLocalStorage.run(store, callback);
  }

  /**
   * Retrieves the current request context store.
   * @returns The Map representing the current context store, or undefined if not in a context.
   */
  getStore(): Map<string, any> | undefined {
    return this.asyncLocalStorage.getStore();
  }

  /**
   * Retrieves a value from the current request context by key.
   * @param key - The key of the value to retrieve.
   * @returns The value associated with the key, or undefined if not found or not in a context.
   */
  get<T>(key: string): T | undefined {
    const store = this.getStore();
    return store ? (store.get(key) as T) : undefined;
  }

  /**
   * Sets a value in the current request context by key.
   * This will throw an error if called outside of a context established by `run`.
   * @param key - The key of the value to set.
   * @param value - The value to associate with the key.
   */
  set<T>(key: string, value: T): void {
    const store = this.getStore();
    if (!store) {
      // This should theoretically not happen in a NestJS request lifecycle
      // after the middleware has run, but it's a safeguard.
      throw new Error('Cannot set context value outside of a running context.');
    }
    store.set(key, value);
  }

  /**
   * A convenient helper method to retrieve the correlation ID from the current context.
   * Fulfills part of REQ-1-110.
   * @returns The correlation ID for the current request, or undefined if not set.
   */
  getCorrelationId(): string | undefined {
    return this.get<string>(CORRELATION_ID_KEY);
  }
}