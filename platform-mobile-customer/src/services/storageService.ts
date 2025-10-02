import { MMKV } from 'react-native-mmkv';
import * as Keychain from 'react-native-keychain';

const storage = new MMKV();

/**
 * @class StorageService
 * @description A singleton service providing an abstraction layer for device storage.
 * It uses MMKV for fast, synchronous, general-purpose storage (e.g., for caching)
 * and react-native-keychain for secure storage of sensitive data like JWTs.
 * This directly supports REQ-1-040 (secure token storage) and REQ-1-087 (offline support).
 */
class StorageService {
  // --- General Purpose Storage (MMKV) ---

  public setItem(key: string, value: string | number | boolean | object): void {
    try {
      if (typeof value === 'object') {
        storage.set(key, JSON.stringify(value));
      } else {
        storage.set(key, value);
      }
    } catch (error) {
      console.error(`Error setting item to MMKV storage: ${key}`, error);
    }
  }

  public getItem<T>(key: string): T | null {
    try {
      const value = storage.getString(key);
      if (value === undefined) return null;
      try {
        // Attempt to parse if it's a JSON object
        return JSON.parse(value) as T;
      } catch {
        // Return as string if not a JSON object
        return value as unknown as T;
      }
    } catch (error) {
      console.error(`Error getting item from MMKV storage: ${key}`, error);
      return null;
    }
  }

  public removeItem(key: string): void {
    try {
      storage.delete(key);
    } catch (error) {
      console.error(`Error removing item from MMKV storage: ${key}`, error);
    }
  }

  public clearAll(): void {
    try {
      storage.clearAll();
    } catch (error) {
      console.error('Error clearing MMKV storage:', error);
    }
  }

  // --- Secure Storage (Keychain) ---

  public async setSecureItem(key: string, value: string): Promise<void> {
    try {
      await Keychain.setGenericPassword(key, value, { service: key });
    } catch (error) {
      console.error(`Error setting secure item to Keychain: ${key}`, error);
    }
  }

  public async getSecureItem(key: string): Promise<string | null> {
    try {
      const credentials = await Keychain.getGenericPassword({ service: key });
      return credentials ? credentials.password : null;
    } catch (error) {
      console.error(`Error getting secure item from Keychain: ${key}`, error);
      return null;
    }
  }

  public async removeSecureItem(key: string): Promise<void> {
    try {
      await Keychain.resetGenericPassword({ service: key });
    } catch (error) {
      console.error(`Error removing secure item from Keychain: ${key}`, error);
    }
  }
}

export const storageService = new StorageService();