import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  Permission,
  PermissionStatus as RNPPermissionStatus,
  openSettings,
} from 'react-native-permissions';
import {Platform} from 'react-native';

/**
 * Represents the simplified status of a permission request.
 * This enum abstracts the platform-specific statuses into a consistent format.
 */
export enum PermissionStatus {
  UNAVAILABLE = 'unavailable', // The feature is not available on this device.
  DENIED = 'denied', // The user has denied the permission but can be prompted again.
  GRANTED = 'granted', // The user has granted the permission.
  BLOCKED = 'blocked', // The user has permanently denied the permission. Must go to settings.
}

/**
 * A service to abstract and manage device hardware permissions (e.g., Location, Camera).
 * This service provides a consistent API across iOS and Android and handles the logic
 * for checking, requesting, and guiding users to settings.
 * Fulfills the requirements of REQ-1-089 and supports User Story RDR-020.
 */

const PLATFORM_PERMISSIONS = {
  camera: Platform.select({
    ios: PERMISSIONS.IOS.CAMERA,
    android: PERMISSIONS.ANDROID.CAMERA,
  })!,
  location: Platform.select({
    ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  })!,
  background_location: Platform.select({
    ios: PERMISSIONS.IOS.LOCATION_ALWAYS,
    android: PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
  })!,
};

/**
 * Maps the result from react-native-permissions to our internal PermissionStatus enum.
 * @param result The status string from the library.
 * @returns The corresponding PermissionStatus.
 */
const mapResultToStatus = (result: RNPPermissionStatus): PermissionStatus => {
  switch (result) {
    case RESULTS.UNAVAILABLE:
      return PermissionStatus.UNAVAILABLE;
    case RESULTS.DENIED:
      return PermissionStatus.DENIED;
    case RESULTS.GRANTED:
      return PermissionStatus.GRANTED;
    case RESULTS.BLOCKED:
      return PermissionStatus.BLOCKED;
    default:
      return PermissionStatus.DENIED;
  }
};

/**
 * Checks the current status of a given permission.
 * @param permission The permission to check.
 * @returns A promise that resolves with the current PermissionStatus.
 */
const checkPermission = async (
  permission: Permission,
): Promise<PermissionStatus> => {
  try {
    const result = await check(permission);
    return mapResultToStatus(result);
  } catch (error) {
    console.error(`PermissionService: Error checking permission ${permission}`, error);
    return PermissionStatus.UNAVAILABLE;
  }
};

/**
 * Requests a given permission from the user.
 * @param permission The permission to request.
 * @returns A promise that resolves with the new PermissionStatus after the user responds.
 */
const requestPermission = async (
  permission: Permission,
): Promise<PermissionStatus> => {
  try {
    const result = await request(permission);
    return mapResultToStatus(result);
  } catch (error) {
    console.error(`PermissionService: Error requesting permission ${permission}`, error);
    return PermissionStatus.UNAVAILABLE;
  }
};

/**
 * Checks the status of the camera permission.
 * @returns A promise that resolves with the current PermissionStatus for the camera.
 */
export const checkCameraPermission = async (): Promise<PermissionStatus> => {
  return checkPermission(PLATFORM_PERMISSIONS.camera);
};

/**
 * Requests camera permission from the user.
 * @returns A promise that resolves with the new PermissionStatus for the camera.
 */
export const requestCameraPermission = async (): Promise<PermissionStatus> => {
  return requestPermission(PLATFORM_PERMISSIONS.camera);
};

/**
 * Checks the status of the fine location permission (foreground).
 * @returns A promise that resolves with the current PermissionStatus for location.
 */
export const checkLocationPermission = async (): Promise<PermissionStatus> => {
  return checkPermission(PLATFORM_PERMISSIONS.location);
};

/**
 * Requests fine location permission from the user.
 * @returns A promise that resolves with the new PermissionStatus for location.
 */
export const requestLocationPermission = async (): Promise<PermissionStatus> => {
  return requestPermission(PLATFORM_PERMISSIONS.location);
};

/**
 * Opens the app's settings screen in the device's settings app.
 * This is used when a permission is 'blocked' to allow the user to manually enable it.
 * @returns A promise that resolves when the settings are opened.
 */
export const openAppSettings = async (): Promise<void> => {
  try {
    await openSettings();
  } catch (error) {
    console.error('PermissionService: Could not open app settings.', error);
  }
};

const permissionService = {
  PermissionStatus,
  checkCameraPermission,
  requestCameraPermission,
  checkLocationPermission,
  requestLocationPermission,
  openAppSettings,
};

export default permissionService;