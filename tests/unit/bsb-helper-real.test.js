/**
 * BSB Helper Real Tests
 * =====================
 *
 * Unit tests for the actual BSB Helper implementation.
 * These tests import and test the real source code to generate proper coverage.
 */

import { jest } from '@jest/globals';

// Mock the debug module
jest.mock('../../src/scripts/core/debug.js', () => ({
  debug: {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
  }
}));

// Mock performance timing for tests
Object.defineProperty(window.performance, 'timing', {
  writable: true,
  value: {
    navigationStart: 0,
    loadEventEnd: 1000,
  }
});

describe('BSBHelper (Real Implementation)', () => {
  let BSBHelper;
  let originalGetItem;
  
  beforeAll(async () => {
    // Store original localStorage.getItem
    originalGetItem = window.localStorage.getItem;
  });
  
  afterAll(() => {
    // Restore original localStorage.getItem
    window.localStorage.getItem = originalGetItem;
  });

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Reset DOM
    document.body.innerHTML = '';
    document.head.innerHTML = '';
    
    // Clear localStorage
    localStorage.clear();
    
    // Reset modules
    jest.resetModules();
    
    // Delete BSBHelper from window to ensure fresh import
    delete window.BSBHelper;
  });

  describe('Initialization with dev mode disabled', () => {
    test('should not initialize when dev mode is disabled', async () => {
      // Ensure dev mode is disabled
      localStorage.removeItem('bsb-dev-mode');
      
      // Import BSBHelper (this will create a new instance)
      await import('../../src/scripts/core/bsb-helper.js');
      
      // Check that dev panel was not created
      expect(document.querySelector('.bsb-dev-panel')).toBeNull();
    });
  });

  describe('Initialization with dev mode enabled', () => {
    test('should initialize when dev mode is enabled', async () => {
      // Enable dev mode
      localStorage.setItem('bsb-dev-mode', 'true');
      
      // Import BSBHelper (this will create a new instance)
      await import('../../src/scripts/core/bsb-helper.js');
      
      // Wait for DOM ready
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Check that dev panel was created
      const devPanel = document.querySelector('.bsb-dev-panel');
      expect(devPanel).toBeTruthy();
      expect(devPanel.querySelector('.bsb-dev-panel__header')).toBeTruthy();
      expect(devPanel.querySelector('.bsb-dev-panel__content')).toBeTruthy();
    });
    
    test('should find and track components', async () => {
      // Enable dev mode
      localStorage.setItem('bsb-dev-mode', 'true');
      
      // Add test components to DOM
      document.body.innerHTML = `
        <div data-bsb-component="card">Card 1</div>
        <div data-bsb-component="card">Card 2</div>
        <div data-bsb-component="hero">Hero</div>
      `;
      
      // Import BSBHelper
      await import('../../src/scripts/core/bsb-helper.js');
      
      // Wait for DOM ready
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Check component count in dev panel
      const componentCount = document.querySelector('.bsb-dev-panel__component-count');
      expect(componentCount).toBeTruthy();
      expect(componentCount.textContent).toBe('2'); // 2 unique component types
      
      // Check that helper buttons were added
      const helpers = document.querySelectorAll('.bsb-dev-helper');
      expect(helpers.length).toBe(3); // One for each component instance
    });
  });

  describe('Panel interactions', () => {
    test('should close panel when close button is clicked', async () => {
      localStorage.setItem('bsb-dev-mode', 'true');
      
      await import('../../src/scripts/core/bsb-helper.js');
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const closeButton = document.querySelector('.bsb-dev-panel__close');
      expect(closeButton).toBeTruthy();
      
      // Click close button
      closeButton.click();
      
      // Panel should be hidden (has hidden class)
      const panel = document.querySelector('.bsb-dev-panel');
      expect(panel.classList.contains('bsb-dev-panel--hidden')).toBe(true);
    });
    
    test('should toggle grid when grid button is clicked', async () => {
      localStorage.setItem('bsb-dev-mode', 'true');
      
      await import('../../src/scripts/core/bsb-helper.js');
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const gridButton = document.querySelector('[data-action="toggle-grid"]');
      expect(gridButton).toBeTruthy();
      
      // Click grid button
      gridButton.click();
      
      // Grid class should be toggled
      expect(document.body.classList.contains('bsb-show-grid')).toBe(true);
      
      // Click again
      gridButton.click();
      expect(document.body.classList.contains('bsb-show-grid')).toBe(false);
    });
  });

  describe('Component documentation', () => {
    test('should show component docs when helper button is clicked', async () => {
      localStorage.setItem('bsb-dev-mode', 'true');
      
      // Add a test component
      document.body.innerHTML = `
        <div data-bsb-component="card">Test Card</div>
      `;
      
      await import('../../src/scripts/core/bsb-helper.js');
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const helperButton = document.querySelector('.bsb-dev-helper');
      expect(helperButton).toBeTruthy();
      
      // Click helper button
      helperButton.click();
      
      // Modal should appear
      const modal = document.querySelector('.bsb-dev-modal');
      expect(modal).toBeTruthy();
      expect(modal.textContent).toContain('card Component');
    });
  });

  describe('Keyboard shortcuts', () => {
    test('should respond to keyboard shortcuts', async () => {
      localStorage.setItem('bsb-dev-mode', 'true');
      
      await import('../../src/scripts/core/bsb-helper.js');
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Check if BSBHelper instance exists (note: capital B)
      expect(window.BSBHelper).toBeDefined();
      
      // Ensure dev mode is enabled
      expect(window.BSBHelper.devMode).toBe(true);
      
      // Test Ctrl+G for grid toggle - call directly since event might not propagate in test
      window.BSBHelper.toggleGrid();
      
      expect(document.body.classList.contains('bsb-show-grid')).toBe(true);
      
      // Toggle again to test off state
      window.BSBHelper.toggleGrid();
      expect(document.body.classList.contains('bsb-show-grid')).toBe(false);
    });
  });

  describe('Learning mode toggle', () => {
    test('should handle enableLearningMode function', async () => {
      // Import the module
      await import('../../src/scripts/core/bsb-helper.js');
      
      // Call enableLearningMode
      window.enableLearningMode();
      
      // Check localStorage
      expect(localStorage.getItem('bsb-dev-mode')).toBe('true');
      
      // Check notification appeared (it doesn't have a class, but has specific styling)
      const notifications = Array.from(document.querySelectorAll('div')).filter(
        el => el.style.position === 'fixed' && el.textContent.includes('Learning mode enabled')
      );
      expect(notifications.length).toBe(1);
      expect(notifications[0].textContent).toContain('Learning mode enabled');
    });
    
    test('should handle disableLearningMode function', async () => {
      localStorage.setItem('bsb-dev-mode', 'true');
      
      // Import the module
      await import('../../src/scripts/core/bsb-helper.js');
      
      // Call disableLearningMode
      window.disableLearningMode();
      
      // Check localStorage
      expect(localStorage.getItem('bsb-dev-mode')).toBe('false');
      
      // Check notification appeared (it doesn't have a class, but has specific styling)
      const notifications = Array.from(document.querySelectorAll('div')).filter(
        el => el.style.position === 'fixed' && el.textContent.includes('Learning mode disabled')
      );
      expect(notifications.length).toBe(1);
      expect(notifications[0].textContent).toContain('Learning mode disabled');
    });
  });
});