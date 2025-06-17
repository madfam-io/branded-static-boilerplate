/**
 * Babel Configuration for BSB
 * ============================
 * 
 * Transforms modern JavaScript for testing and legacy browser support.
 * 
 * Features:
 * - ES6+ module transformation for Jest
 * - Modern JavaScript features support
 * - Environment-specific optimizations
 */

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        // Target environments
        targets: {
          // For production builds
          browsers: [
            'last 2 versions',
            'not dead',
            'not < 2%'
          ],
          // For testing
          node: 'current'
        },
        
        // Module transformation
        modules: process.env.NODE_ENV === 'test' ? 'commonjs' : false,
        
        // Use built-ins efficiently
        useBuiltIns: 'usage',
        corejs: 3,
        
        // Debug information
        debug: process.env.NODE_ENV === 'development'
      }
    ]
  ],
  
  plugins: [
    // Class properties support
    '@babel/plugin-proposal-class-properties',
    
    // Optional chaining and nullish coalescing
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    
    // Dynamic imports
    '@babel/plugin-syntax-dynamic-import'
  ],
  
  // Environment-specific configuration
  env: {
    test: {
      plugins: [
        // Istanbul coverage for testing
        ['babel-plugin-istanbul', {}, 'istanbul-for-jest']
      ]
    },
    
    development: {
      // Retain function names for debugging
      plugins: [
        '@babel/plugin-transform-runtime'
      ]
    },
    
    production: {
      plugins: [
        // Remove console statements in production
        ['transform-remove-console', { exclude: ['error', 'warn'] }]
      ]
    }
  }
};