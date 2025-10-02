import {
  launchCamera,
  launchImageLibrary,
  CameraOptions,
  ImagePickerResponse,
} from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import permissionService, {PermissionStatus} from './permissionService';

/**
 * A service to abstract interactions with the device's camera and image library.
 * It handles permission checks, launching the camera, and processing the captured image.
 * This service directly supports the Photo Proof of Delivery feature (RDR-022, REQ-1-074).
 */

const CAMERA_OPTIONS: CameraOptions = {
  mediaType: 'photo',
  quality: 0.7, // Reduce quality to save space
  saveToPhotos: false, // Don't save to the public gallery
  cameraType: 'back',
};

const IMAGE_RESIZE_OPTIONS = {
  maxWidth: 1024,
  maxHeight: 1024,
  compressFormat: 'JPEG',
  quality: 80,
  rotation: 0,
  outputPath: undefined, // Let the library handle temp path
};

export interface CapturedImage {
  uri: string;
  width: number;
  height: number;
  size: number;
  fileName: string;
}

/**
 * Launches the device camera for taking a photo, handling permissions automatically.
 * Includes logic to resize and compress the image for efficient upload.
 * @returns A promise that resolves with the processed image data, or null if the user cancels or an error occurs.
 */
export const launchCameraForPOD = async (): Promise<CapturedImage | null> => {
  try {
    // 1. Check and request camera permission
    let cameraPermission = await permissionService.checkCameraPermission();
    if (
      cameraPermission === PermissionStatus.DENIED ||
      cameraPermission === PermissionStatus.BLOCKED
    ) {
      cameraPermission = await permissionService.requestCameraPermission();
    }

    if (cameraPermission !== PermissionStatus.GRANTED) {
      console.warn('CameraService: Camera permission not granted.');
      // The calling UI should handle this by showing the PermissionDeniedModal
      return null;
    }

    // 2. Launch the camera
    const response: ImagePickerResponse = await new Promise(resolve =>
      launchCamera(CAMERA_OPTIONS, resolve),
    );

    if (response.didCancel) {
      console.log('CameraService: User cancelled camera.');
      return null;
    }

    if (response.errorCode || response.errorMessage) {
      console.error(
        'CameraService: ImagePicker error:',
        response.errorMessage,
      );
      throw new Error(response.errorMessage);
    }

    if (response.assets && response.assets.length > 0) {
      const asset = response.assets[0];
      if (!asset.uri) {
        throw new Error('CameraService: Captured image has no URI.');
      }

      // 3. Resize and compress the image
      const resizedImage = await ImageResizer.createResizedImage(
        asset.uri,
        IMAGE_RESIZE_OPTIONS.maxWidth,
        IMAGE_RESIZE_OPTIONS.maxHeight,
        IMAGE_RESIZE_OPTIONS.compressFormat,
        IMAGE_RESIZE_OPTIONS.quality,
      );

      return {
        uri: resizedImage.uri,
        width: resizedImage.width,
        height: resizedImage.height,
        size: resizedImage.size,
        fileName: resizedImage.name,
      };
    }

    return null;
  } catch (error) {
    console.error('CameraService: Failed to launch camera or process image.', error);
    // Rethrow to be handled by the calling saga/hook
    throw error;
  }
};

const cameraService = {
  launchCameraForPOD,
};

export default cameraService;