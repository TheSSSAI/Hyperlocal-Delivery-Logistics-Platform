module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-reanimated|@react-native-firebase|@rnmapbox)/)',
  ],
  setupFilesAfterEnv: ['./jest-setup.js'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.types.ts',
    '!src/navigation/**',
    '!src/config/**',
    '!src/App.tsx',
  ],
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleNameMapper: {
    '^@/api/(.*)$': '<rootDir>/src/api/$1',
    '^@/assets/(.*)$': '<rootDir>/src/assets/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/config/(.*)$': '<rootDir>/src/config/$1',
    '^@/features/(.*)$': '<rootDir>/src/features/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/navigation/(.*)$': '<rootDir>/src/navigation/$1',
    '^@/store/(.*)$': '<rootDir>/src/store/$1',
    '^@/shared/(.*)$': '<rootDir>/src/shared/$1',
  },
};