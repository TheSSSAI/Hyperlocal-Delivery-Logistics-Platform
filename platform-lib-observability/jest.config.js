module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.ts',
    '!**/index.ts',
    '!**/*.module.ts',
    '!**/*.interface.ts',
    '!**/*.config.ts',
    '!**/*.decorator.ts',
    '!**/metrics.controller.ts', // Controller is mostly passthrough
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/$1',
  },
};