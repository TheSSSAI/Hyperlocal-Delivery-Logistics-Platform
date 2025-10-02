// jest.setup.js
import '@testing-library/jest-dom';

// Mock react-native specifics for web-based tests if needed
jest.mock('react-native', () => ({
  Platform: {
    OS: 'web',
    select: jest.fn(selector => selector.web),
  },
  StyleSheet: {
    create: style => style,
  },
  // Add other react-native mocks here as needed by components
}));