import {Linking, Platform} from 'react-native';

/**
 * A service to handle navigation-related tasks, such as launching external map applications.
 * This abstracts platform-specific URI schemes for maps.
 * This directly supports User Story RDR-014 (Navigate to Vendor). While REQ-1-072
 * mentions integrated navigation (which would be a different component), this service
 * provides the essential fallback or alternative of using external maps.
 */

/**
 * Opens the device's default map application with directions to the specified coordinates.
 * @param latitude The destination latitude.
 * @param longitude The destination longitude.
 * @param label An optional label for the destination pin.
 * @returns A promise that resolves if the map app was successfully launched, or rejects if it failed.
 */
export const openExternalMaps = async (
  latitude: number,
  longitude: number,
  label?: string,
): Promise<void> => {
  const scheme = Platform.select({
    ios: 'maps:0,0?q=',
    android: 'geo:0,0?q=',
  });

  const latLng = `${latitude},${longitude}`;
  const url = Platform.select({
    ios: `${scheme}${label}@${latLng}`,
    android: `${scheme}${latLng}(${label})`,
  });

  if (!url) {
    const errorMsg = 'NavigationService: Could not construct map URL for the current platform.';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  try {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      const errorMsg = 'NavigationService: No map application installed that can handle the request.';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  } catch (error) {
    console.error('NavigationService: An error occurred while trying to open the map application.', error);
    if (error instanceof Error) {
        throw error;
    }
    throw new Error('An unknown error occurred while opening maps.');
  }
};


// In a full implementation with Mapbox Navigation SDK (as per REQ-1-072), this service would
// be expanded or a new one created to manage the in-app navigation lifecycle.
// For example:
//
// export const startInAppNavigation = async (destination: { latitude: number, longitude: number }) => {
//   // Logic to launch the in-app navigation screen/component
// };

const navigationService = {
  openExternalMaps,
};

export default navigationService;