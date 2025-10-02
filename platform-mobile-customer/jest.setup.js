import '@testing-library/jest-native/extend-expect';
import 'react-native-gesture-handler/jestSetup';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Mock react-native-keychain
jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(() => Promise.resolve()),
  getGenericPassword: jest.fn(() => Promise.resolve(null)),
  resetGenericPassword: jest.fn(() => Promise.resolve()),
}));

// Mock MMKV
jest.mock('react-native-mmkv', () => {
  const MMKV = jest.requireActual('react-native-mmkv');
  return {
    ...MMKV,
    MMKV: function () {
      const storage = {};
      return {
        set: (key, value) => {
          storage[key] = value;
        },
        getString: (key) => storage[key] || null,
        delete: (key) => {
          delete storage[key];
        },
        clearAll: () => {
          Object.keys(storage).forEach(key => delete storage[key]);
        },
      };
    },
  };
});

// Mock Reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Silence the warning about Animated: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock Firebase messaging
jest.mock('@react-native-firebase/messaging', () => () => ({
  hasPermission: jest.fn(() => Promise.resolve(true)),
  requestPermission: jest.fn(() => Promise.resolve(true)),
  getToken: jest.fn(() => Promise.resolve('mock-fcm-token')),
  onNotificationOpenedApp: jest.fn(),
  onMessage: jest.fn(),
  setBackgroundMessageHandler: jest.fn(),
}));