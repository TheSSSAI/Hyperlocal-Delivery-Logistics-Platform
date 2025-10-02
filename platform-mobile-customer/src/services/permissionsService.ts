import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  Permission,
  PermissionStatus,
} from 'react-native-permissions';
import { Platform } from 'react-native';

export type PermissionType = 'location' | 'camera';

/**
 * @class PermissionsService
 * @description A singleton service to abstract device permission handling.
 * This service centralizes the logic for checking and requesting permissions
 * for features like location-based vendor discovery (CUS-010) and potential
 * future features requiring camera access. It directly supports REQ-1-089.
 */
class PermissionsService {
  private getPlatformPermission(type: PermissionType): Permission {
    if (type === 'location') {
      return Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    }
    // (type === 'camera')
    return Platform.OS === 'ios'
      ? PERMISSIONS.IOS.CAMERA
      : PERMISSIONS.ANDROID.CAMERA;
  }

  /**
   * @method checkPermission
   * @description Checks the current status of a given permission without prompting the user.
   * @param {PermissionType} type - The type of permission to check ('location' or 'camera').
   * @returns {Promise<PermissionStatus>} The current status of the permission (e.g., GRANTED, DENIED, BLOCKED).
   */
  public async checkPermission(type: PermissionType): Promise<PermissionStatus> {
    const permission = this.getPlatformPermission(type);
    try {
      const result = await check(permission);
      return result;
    } catch (error) {
      console.error(`Error checking ${type} permission:`, error);
      return RESULTS.UNAVAILABLE;
    }
  }

  /**
   * @method requestPermission
   * @description Prompts the user to grant a specific permission if not already granted.
   * @param {PermissionType} type - The type of permission to request ('location' or 'camera').
   * @returns {Promise<PermissionStatus>} The status of the permission after the request.
   */
  public async requestPermission(
    type: PermissionType,
  ): Promise<PermissionStatus> {
    const permission = this.getPlatformPermission(type);
    try {
      const result = await request(permission);
      return result;
    } catch (error) {
      console.error(`Error requesting ${type} permission:`, error);
      return RESULTS.UNAVAILABLE;
    }
  }
}

// Export a singleton instance of the service
export const permissionsService = new PermissionsService();