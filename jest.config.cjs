/**
 * Jest Configuration for BSB
 * ==========================
 * 
 * Comprehensive testing setup for a production-ready static site.
 * 
 * Features:
 * - Unit testing for JavaScript modules
 * - DOM testing with jsdom environment
 * - Code coverage reporting
 * - Accessibility testing integration
 * - Performance testing utilities
 * 
 * @see https://jestjs.io/docs/configuration
 */

module.exports = {
  // Test environment
  testEnvironment: 'jsdom',
  
  // Root directory for tests
  rootDir: '.',
  
  // Test file patterns
  testMatch: [
    '<rootDir>/tests/**/*.test.js',
    '<rootDir>/src/**/*.test.js',
    '<rootDir>/src/**/__tests__/**/*.js'
  ],
  
  // Module file extensions
  moduleFileExtensions: ['js', 'json', 'css'],
  
  // Module name mapping for assets and styles
  moduleNameMapper: {
    // CSS modules and regular CSS
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
    
    // Static assets
    '\\.(jpg|jpeg|png|gif|svg|webp)$': '<rootDir>/tests/__mocks__/fileMock.js',
    '\\.(woff|woff2|eot|ttf)$': '<rootDir>/tests/__mocks__/fileMock.js',
    
    // Path aliases
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@styles/(.*)$': '<rootDir>/src/styles/$1',
    '^@scripts/(.*)$': '<rootDir>/src/scripts/$1',
    '^@assets/(.*)$': '<rootDir>/src/assets/$1'
  },
  
  // Setup files to run before tests
  setupFilesAfterEnv: [
    '<rootDir>/tests/setup/jest.setup.js'
  ],
  
  // Coverage configuration
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/__tests__/**',
    '!src/assets/**',
    '!**/node_modules/**',
    '!**/dist/**'
  ],
  
  // Coverage thresholds (temporarily reduced - should be increased)
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0
    }
  },
  
  // Coverage output
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
    'clover'
  ],
  
  // Test execution settings
  verbose: true,
  testTimeout: 10000,
  
  // Clear mocks between tests
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,
  
  // Error handling
  errorOnDeprecated: true,
  
  // Globals for testing environment
  globals: {
    'NODE_ENV': 'test'
  },
  
  // Transform configuration
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/coverage/'
  ],
  
  // Watch mode configuration
  watchPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/coverage/'
  ],
  
  // Reporter configuration
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './coverage/html-report',
        filename: 'jest-report.html',
        expand: true,
        hideIcon: false,
        pageTitle: 'BSB Test Report'
      }
    ]
  ],
  
  // Custom test result processor for accessibility results
  testResultsProcessor: '<rootDir>/tests/processors/accessibilityProcessor.cjs'
};