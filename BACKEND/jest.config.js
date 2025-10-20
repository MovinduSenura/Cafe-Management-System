module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/uploads/',
    '/logs/'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'lcov',
    'html'
  ],
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/tests/**',
    '!**/coverage/**',
    '!**/logs/**',
    '!**/uploads/**',
    '!server.js',
    '!jest.config.js'
  ],
  setupFilesAfterEnv: [
    '<rootDir>/tests/setup.js'
  ],
  testTimeout: 30000,
  verbose: true
};