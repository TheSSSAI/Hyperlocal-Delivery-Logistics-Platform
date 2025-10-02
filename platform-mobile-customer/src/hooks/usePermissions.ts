import { useCallback } from 'react';
import { Linking, Platform } from 'react-native';
import {
  permissionsService,
  PermissionType,
  PermissionStatus,
} from '../services/permissionsService';

interface UsePermissions {
  requestLocationPermission: () => Promise<boolean>;
  requestCameraPermission: () => Promise<boolean>;
  openSettings: () => void;
}

/**
 * A custom hook to abstract the logic for requesting and checking device permissions.
 * It provides a simplified interface for UI components to request permissions
 * and guides the user to the device settings if permissions are blocked.
 * This directly supports REQ-1-089.
 *
 * @returns {UsePermissions} An object with functions to request permissions.
 */
export const usePermissions = (): UsePermissions => {
  const openSettings = useCallback(() => {
    Linking.openSettings();
  }, []);

  const requestPermission = useCallback(
    async (type: PermissionType): Promise<boolean> => {
      try {
        let status = await permissionsService.check(type);

        if (status === PermissionStatus.DENIED) {
          status = await permissionsService.request(type);
        }

        if (status === PermissionStatus.BLOCKED) {
          // Here, the UI component would typically show a modal
          // with the `openSettings` function to guide the user.
          console.warn(`Permission for ${type} is blocked. User must enable it in settings.`);
          return false;
        }

        return status === PermissionStatus.GRANTED;
      } catch (error) {
        console.error(`Error requesting ${type} permission:`, error);
        return false;
      }
    },
    [],
  );

  const requestLocationPermission = useCallback(
    () => requestPermission(PermissionType.LOCATION),
    [requestPermission],
  );

  const requestCameraPermission = useCallback(
    () => requestPermission(PermissionType.CAMERA),
    [requestPermission],
  );

  return {
    requestLocationPermission,
    requestCameraPermission,
    openSettings,
  };
};