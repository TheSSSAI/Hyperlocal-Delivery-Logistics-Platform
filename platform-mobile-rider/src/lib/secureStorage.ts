import * as Keychain from 'react-native-keychain';
import {Platform} from 'react-native';

/**
 * @description A secure storage service for sensitive information like tokens.
 * This service abstracts the underlying keychain/keystore implementation,
 * providing a simple, promise-based API for storing, retrieving, and deleting credentials.
 * Implements security requirement REQ-1-040 for securely storing refresh tokens.
 */

const REFRESH_TOKEN_KEY = 'refreshToken';
const ACCESS_TOKEN_KEY = 'accessToken'; // Though short-lived, might be useful for some flows.

/**
 * Saves a key-value pair to the device's secure storage.
 * @param key The key to store the value against.
 * @param value The value to store.
 * @returns A promise that resolves if the operation is successful, or rejects with an error.
 */
const save = async (key: string, value: string): Promise<void> => {
  try {
    await Keychain.setGenericPassword(key, value, {
      service: key, // Using key as service for simplicity, can be a global app identifier
    });
  } catch (error) {
    console.error('SecureStorage: Failed to save data for key:', key, error);
    throw new Error(`Failed to save data securely for key: ${key}`);
  }
};

/**
 * Loads a value from the device's secure storage.
 * @param key The key of the value to retrieve.
 * @returns A promise that resolves with the stored value, or null if not found.
 */
const load = async (key: string): Promise<string | null> => {
  try {
    const credentials = await Keychain.getGenericPassword({service: key});
    if (credentials) {
      return credentials.password;
    }
    return null;
  } catch (error) {
    console.error('SecureStorage: Failed to load data for key:', key, error);
    throw new Error(`Failed to load data securely for key: ${key}`);
  }
};

/**
 * Removes a value from the device's secure storage.
 * @param key The key of the value to remove.
 * @returns A promise that resolves if the operation is successful, or rejects with an error.
 */
const remove = async (key: string): Promise<void> => {
  try {
    await Keychain.resetGenericPassword({service: key});
  } catch (error) {
    console.error('SecureStorage: Failed to remove data for key:', key, error);
    throw new Error(`Failed to remove data securely for key: ${key}`);
  }
};

/**
 * Saves the user's refresh token to secure storage.
 * @param token The refresh token to save.
 */
export const saveRefreshToken = async (token: string): Promise<void> => {
  await save(REFRESH_TOKEN_KEY, token);
};

/**
 * Loads the user's refresh token from secure storage.
 * @returns A promise that resolves with the refresh token, or null if not found.
 */
export const loadRefreshToken = async (): Promise<string | null> => {
  return await load(REFRESH_TOKEN_KEY);
};

/**
 * Removes the user's refresh token from secure storage.
 */
export const removeRefreshToken = async (): Promise<void> => {
  await remove(REFRESH_TOKEN_KEY);
};

/**
 * Saves the user's access token to secure storage.
 * @param token The access token to save.
 */
export const saveAccessToken = async (token: string): Promise<void> => {
  await save(ACCESS_TOKEN_KEY, token);
};

/**
 * Loads the user's access token from secure storage.
 * @returns A promise that resolves with the access token, or null if not found.
 */
export const loadAccessToken = async (): Promise<string | null> => {
  return await load(ACCESS_TOKEN_KEY);
};

/**
 * Removes the user's access token from secure storage.
 */
export const removeAccessToken = async (): Promise<void> => {
  await remove(ACCESS_TOKEN_KEY);
};

/**
 * Clears all authentication tokens from secure storage.
 * Useful for logout flows.
 */
export const clearAuthTokens = async (): Promise<void> => {
  try {
    await removeRefreshToken();
    await removeAccessToken();
  } catch (error) {
    console.error('SecureStorage: Failed to clear all auth tokens.', error);
    // We don't re-throw here because logout should proceed even if token clearing fails.
    // The error is logged for monitoring.
  }
};

const secureStorage = {
  save,
  load,
  remove,
  saveRefreshToken,
  loadRefreshToken,
  removeRefreshToken,
  saveAccessToken,
  loadAccessToken,
  removeAccessToken,
  clearAuthTokens,
};

export default secureStorage;