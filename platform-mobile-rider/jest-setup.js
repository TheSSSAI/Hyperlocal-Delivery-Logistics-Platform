// jest-setup.js
import '@testing-library/react-native/extend-expect';
import 'react-native-gesture-handler/jestSetup';

// Mock native modules that are not available in the Jest environment
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(() => Promise.resolve()),
  getGenericPassword: jest.fn(() => Promise.resolve(null)),
  resetGenericPassword: jest.fn(() => Promise.resolve()),
}));

jest.mock('@react-native-firebase/messaging', () => () => ({
  requestPermission: jest.fn(() => Promise.resolve(1)),
  getToken: jest.fn(() => Promise.resolve('mock-fcm-token')),
  onMessage: jest.fn(),
  onNotificationOpenedApp: jest.fn(),
  getInitialNotification: jest.fn(() => Promise.resolve(null)),
}));

jest.mock('react-native-background-geolocation', () => ({
  ready: jest.fn(),
  start: jest.fn(),
  stop: jest.fn(),
  onLocation: jest.fn(),
}));

jest.mock('@rnmapbox/maps', () => ({
  MapView: 'MapView',
  Camera: 'Camera',
  PointAnnotation: 'PointAnnotation',
  ShapeSource: 'ShapeSource',
  LineLayer: 'LineLayer',
  SymbolLayer: 'SymbolLayer',
  setAccessToken: jest.fn(),
}));