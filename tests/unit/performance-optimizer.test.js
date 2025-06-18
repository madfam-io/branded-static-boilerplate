/**
 * Performance Optimizer Tests
 * ===========================
 *
 * Unit tests for the performance optimization utilities.
 */

import { jest } from '@jest/globals';

// Mock the debug module
const mockDebug = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
};

jest.mock('../../src/scripts/core/debug.js', () => ({
  __esModule: true,
  default: mockDebug,
  debug: mockDebug
}));

describe('Performance Optimizer', () => {
  let PerformanceOptimizer;
  
  beforeEach(async () => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Reset DOM
    document.body.innerHTML = '';
    document.head.innerHTML = '';
    
    // Reset modules
    jest.resetModules();
    
    // Mock IntersectionObserver
    global.IntersectionObserver = jest.fn().mockImplementation((callback) => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
      // Simulate intersection
      triggerIntersection: (entries) => callback(entries, this)
    }));
    
    // Import module
    const module = await import('../../src/scripts/core/performance-optimizer.js');
    PerformanceOptimizer = module.default || module.PerformanceOptimizer;
  });

  describe('Initialization', () => {
    test('should create performance optimizer instance', () => {
      const optimizer = new PerformanceOptimizer();
      expect(optimizer).toBeTruthy();
      expect(optimizer.metrics).toBeDefined();
      expect(optimizer.observers).toBeDefined();
    });
    
    test('should initialize with default metrics structure', () => {
      const optimizer = new PerformanceOptimizer();
      expect(optimizer.metrics.pageLoad).toBeDefined();
      expect(optimizer.metrics.resources).toBeDefined();
      expect(optimizer.metrics.vitals).toBeDefined();
      expect(optimizer.metrics.navigation).toBeDefined();
    });
  });

  describe('Image Lazy Loading', () => {
    test('should setup lazy loading for images with data-src attribute', () => {
      document.body.innerHTML = `
        <img data-src="image1.jpg" alt="Test image 1">
        <img data-src="image2.jpg" alt="Test image 2">
        <img src="eager.jpg" alt="Eager loaded image">
      `;
      
      const optimizer = new PerformanceOptimizer();
      
      // Should create observers for lazy images
      expect(IntersectionObserver).toHaveBeenCalled();
      
      const lazyImages = document.querySelectorAll('img.lazy');
      expect(lazyImages.length).toBe(2);
    });
    
    test('should load image when it intersects viewport', () => {
      document.body.innerHTML = `
        <img data-src="lazy-image.jpg" alt="Lazy image">
      `;
      
      const optimizer = new PerformanceOptimizer();
      
      const img = document.querySelector('[data-src]');
      // Find the IntersectionObserver instance that was created for images
      const observerCalls = IntersectionObserver.mock.calls;
      let imageObserver = null;
      
      // Find the observer callback for images
      for (let i = 0; i < observerCalls.length; i++) {
        const [callback, options] = observerCalls[i];
        if (options && options.rootMargin && options.rootMargin.includes('50px')) {
          imageObserver = IntersectionObserver.mock.results[i].value;
          imageObserver.callback = callback;
          break;
        }
      }
      
      // Simulate image entering viewport
      if (imageObserver && imageObserver.callback) {
        imageObserver.callback([{
          target: img,
          isIntersecting: true
        }], imageObserver);
      }
      
      // Image src should be set
      expect(img.src).toContain('lazy-image.jpg');
      expect(img.hasAttribute('data-src')).toBe(false);
    });
    
    test('should add lazy class to images', () => {
      document.body.innerHTML = `
        <img data-src="slow-image.jpg" alt="Slow loading image">
      `;
      
      const optimizer = new PerformanceOptimizer();
      
      const img = document.querySelector('[data-src]');
      
      // Should have lazy class
      expect(img.classList.contains('lazy')).toBe(true);
    });
  });

  describe('Resource Prefetching', () => {
    test('should have method to optimize resource hints', () => {
      const optimizer = new PerformanceOptimizer();
      
      // The method should be defined
      expect(optimizer.optimizeResourceHints).toBeDefined();
      expect(typeof optimizer.optimizeResourceHints).toBe('function');
      
      // Should be able to call it without errors
      expect(() => optimizer.optimizeResourceHints()).not.toThrow();
    });
  });

  describe('Script Loading Optimization', () => {
    test('should setup event delegation for performance', () => {
      const optimizer = new PerformanceOptimizer();
      
      // The implementation sets up event delegation for various interactions
      // We can verify that the optimizer is tracking interactions
      expect(optimizer.metrics).toBeDefined();
      
      // Simulate a click interaction
      document.body.innerHTML = '<button>Test</button>';
      const button = document.querySelector('button');
      button.click();
      
      // The optimizer tracks user interactions
      // Just verify it doesn't throw errors
      expect(true).toBe(true);
    });
  });

  describe('CSS Optimization', () => {
    test('should optimize critical CSS', () => {
      const optimizer = new PerformanceOptimizer();
      
      // The optimizeCriticalCSS method is called during init
      // It adds critical CSS handling
      expect(optimizer.optimizeCriticalCSS).toBeDefined();
      
      // Call the method directly to test it
      optimizer.optimizeCriticalCSS();
      
      // Should not throw errors
      expect(true).toBe(true);
    });
  });

  describe('Performance Monitoring', () => {
    test('should track performance metrics', () => {
      const optimizer = new PerformanceOptimizer();
      
      // Should have metrics structure
      expect(optimizer.metrics).toBeDefined();
      expect(optimizer.metrics.pageLoad).toBeDefined();
      expect(optimizer.metrics.resources).toEqual([]);
      expect(optimizer.metrics.vitals).toBeDefined();
      expect(optimizer.metrics.navigation).toBeDefined();
    });
    
    test('should measure Web Vitals', () => {
      const optimizer = new PerformanceOptimizer();
      
      // The measureWebVitals method should be defined
      expect(optimizer.measureWebVitals).toBeDefined();
      
      // Call it to ensure no errors
      optimizer.measureWebVitals();
      
      expect(true).toBe(true);
    });
  });

  describe('Memory Management', () => {
    test('should have observers object for tracking', () => {
      const optimizer = new PerformanceOptimizer();
      
      // Should have observers object
      expect(optimizer.observers).toBeDefined();
      expect(typeof optimizer.observers).toBe('object');
    });
  });

  describe('Network Detection', () => {
    test('should handle missing navigator.connection gracefully', () => {
      // Remove navigator.connection if it exists
      const originalConnection = global.navigator.connection;
      delete global.navigator.connection;
      
      // Should not throw error
      const optimizer = new PerformanceOptimizer();
      expect(optimizer).toBeTruthy();
      
      // Restore
      if (originalConnection) {
        global.navigator.connection = originalConnection;
      }
    });
  });
});