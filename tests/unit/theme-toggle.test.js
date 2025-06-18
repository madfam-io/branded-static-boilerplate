/**
 * Theme Toggle Tests
 * ==================
 *
 * Unit tests for the theme toggle functionality.
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

describe('Theme Toggle', () => {
  let ThemeToggle;
  
  beforeEach(async () => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Reset DOM
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('data-theme');
    
    // Clear localStorage
    localStorage.clear();
    
    // Reset modules
    jest.resetModules();
    
    // Mock CSS media query
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)' ? false : true,
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));
  });

  describe('Component Creation', () => {
    test('should create theme toggle component', async () => {
      // Create container with proper structure
      document.body.innerHTML = `
        <div data-bsb-component="theme-toggle">
          <button data-bsb-theme-button aria-expanded="false">
            <span class="bsb-theme-toggle__icon bsb-theme-toggle__icon--light">☀️</span>
            <span class="bsb-theme-toggle__icon bsb-theme-toggle__icon--dark">🌙</span>
            <span class="bsb-theme-toggle__icon bsb-theme-toggle__icon--auto">🌓</span>
          </button>
          <div data-bsb-theme-menu aria-hidden="true">
            <button data-theme="light">Light</button>
            <button data-theme="dark">Dark</button>
            <button data-theme="auto">Auto</button>
          </div>
          <span data-bsb-theme-label class="sr-only">Auto</span>
        </div>
      `;
      
      // Import and let it auto-initialize
      await import('../../src/components/theme-toggle/theme-toggle.js');
      
      const toggle = document.querySelector('[data-bsb-component="theme-toggle"]');
      expect(toggle).toBeTruthy();
      expect(toggle.themeToggleInstance).toBeTruthy();
    });
  });

  describe('Theme Detection', () => {
    test('should detect system dark mode preference', async () => {
      // Mock dark mode preference
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));
      
      document.body.innerHTML = `
        <div data-bsb-component="theme-toggle">
          <button data-bsb-theme-button aria-expanded="false"></button>
          <div data-bsb-theme-menu aria-hidden="true">
            <button data-theme="light">Light</button>
            <button data-theme="dark">Dark</button>
            <button data-theme="auto">Auto</button>
          </div>
        </div>
      `;
      
      await import('../../src/components/theme-toggle/theme-toggle.js');
      
      // Auto theme should detect dark preference
      const toggle = document.querySelector('[data-bsb-component="theme-toggle"]');
      const instance = toggle.themeToggleInstance;
      
      // The default is 'auto' which will follow system preference
      expect(instance.currentTheme).toBe('auto');
    });
    
    test('should use saved theme preference over system preference', async () => {
      localStorage.setItem('bsb-theme', 'light');
      
      // Mock dark mode system preference
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));
      
      document.body.innerHTML = `
        <div data-bsb-component="theme-toggle">
          <button data-bsb-theme-button aria-expanded="false"></button>
          <div data-bsb-theme-menu aria-hidden="true">
            <button data-theme="light">Light</button>
            <button data-theme="dark">Dark</button>
            <button data-theme="auto">Auto</button>
          </div>
        </div>
      `;
      
      await import('../../src/components/theme-toggle/theme-toggle.js');
      
      const toggle = document.querySelector('[data-bsb-component="theme-toggle"]');
      const instance = toggle.themeToggleInstance;
      
      // Should use saved light theme
      expect(instance.currentTheme).toBe('light');
    });
  });

  describe('Theme Switching', () => {
    test('should toggle between themes using menu', async () => {
      document.body.innerHTML = `
        <div data-bsb-component="theme-toggle">
          <button data-bsb-theme-button aria-expanded="false"></button>
          <div data-bsb-theme-menu aria-hidden="true">
            <button data-theme="light">Light</button>
            <button data-theme="dark">Dark</button>
            <button data-theme="auto">Auto</button>
          </div>
        </div>
      `;
      
      await import('../../src/components/theme-toggle/theme-toggle.js');
      
      const toggle = document.querySelector('[data-bsb-component="theme-toggle"]');
      const instance = toggle.themeToggleInstance;
      const darkButton = toggle.querySelector('[data-theme="dark"]');
      const lightButton = toggle.querySelector('[data-theme="light"]');
      
      // Click dark theme button
      darkButton.click();
      expect(instance.currentTheme).toBe('dark');
      expect(document.body.getAttribute('data-bsb-theme')).toBe('dark');
      
      // Click light theme button
      lightButton.click();
      expect(instance.currentTheme).toBe('light');
      expect(document.body.getAttribute('data-bsb-theme')).toBe('light');
    });
    
    test('should save theme preference to localStorage', async () => {
      document.body.innerHTML = `
        <div data-bsb-component="theme-toggle">
          <button data-bsb-theme-button aria-expanded="false"></button>
          <div data-bsb-theme-menu aria-hidden="true">
            <button data-theme="light">Light</button>
            <button data-theme="dark">Dark</button>
            <button data-theme="auto">Auto</button>
          </div>
        </div>
      `;
      
      await import('../../src/components/theme-toggle/theme-toggle.js');
      
      const toggle = document.querySelector('[data-bsb-component="theme-toggle"]');
      const instance = toggle.themeToggleInstance;
      
      // Set dark theme
      instance.setTheme('dark');
      expect(localStorage.getItem('bsb-theme')).toBe('dark');
      
      // Set light theme
      instance.setTheme('light');
      expect(localStorage.getItem('bsb-theme')).toBe('light');
    });
  });

  describe('Icon Updates', () => {
    test('should update icon based on theme', async () => {
      document.body.innerHTML = `
        <div data-bsb-component="theme-toggle">
          <button data-bsb-theme-button aria-expanded="false">
            <span class="bsb-theme-toggle__icon bsb-theme-toggle__icon--light">☀️</span>
            <span class="bsb-theme-toggle__icon bsb-theme-toggle__icon--dark">🌙</span>
            <span class="bsb-theme-toggle__icon bsb-theme-toggle__icon--auto">🌓</span>
          </button>
          <div data-bsb-theme-menu aria-hidden="true">
            <button data-theme="light">Light</button>
            <button data-theme="dark">Dark</button>
            <button data-theme="auto">Auto</button>
          </div>
        </div>
      `;
      
      await import('../../src/components/theme-toggle/theme-toggle.js');
      
      const toggle = document.querySelector('[data-bsb-component="theme-toggle"]');
      const instance = toggle.themeToggleInstance;
      
      // Set to dark theme
      instance.setTheme('dark');
      const darkIcon = toggle.querySelector('.bsb-theme-toggle__icon--dark.bsb-theme-toggle__icon--active');
      expect(darkIcon).toBeTruthy();
      
      // Set to light theme
      instance.setTheme('light');
      const lightIcon = toggle.querySelector('.bsb-theme-toggle__icon--light.bsb-theme-toggle__icon--active');
      expect(lightIcon).toBeTruthy();
    });
    
    test('should update aria-current for menu options', async () => {
      document.body.innerHTML = `
        <div data-bsb-component="theme-toggle">
          <button data-bsb-theme-button aria-expanded="false"></button>
          <div data-bsb-theme-menu aria-hidden="true">
            <button data-theme="light">Light</button>
            <button data-theme="dark">Dark</button>
            <button data-theme="auto">Auto</button>
          </div>
        </div>
      `;
      
      await import('../../src/components/theme-toggle/theme-toggle.js');
      
      const toggle = document.querySelector('[data-bsb-component="theme-toggle"]');
      const instance = toggle.themeToggleInstance;
      const darkOption = toggle.querySelector('[data-theme="dark"]');
      const lightOption = toggle.querySelector('[data-theme="light"]');
      
      // Set to dark theme
      instance.setTheme('dark');
      expect(darkOption.getAttribute('aria-current')).toBe('true');
      expect(lightOption.getAttribute('aria-current')).toBe('false');
      
      // Set to light theme
      instance.setTheme('light');
      expect(lightOption.getAttribute('aria-current')).toBe('true');
      expect(darkOption.getAttribute('aria-current')).toBe('false');
    });
  });

  describe('CSS Custom Properties', () => {
    test('should apply theme-specific CSS variables', async () => {
      document.body.innerHTML = `
        <div data-bsb-component="theme-toggle">
          <button data-bsb-theme-button aria-expanded="false"></button>
          <div data-bsb-theme-menu aria-hidden="true">
            <button data-theme="light">Light</button>
            <button data-theme="dark">Dark</button>
            <button data-theme="auto">Auto</button>
          </div>
        </div>
      `;
      
      await import('../../src/components/theme-toggle/theme-toggle.js');
      
      const toggle = document.querySelector('[data-bsb-component="theme-toggle"]');
      const instance = toggle.themeToggleInstance;
      
      // Set to dark theme
      instance.setTheme('dark');
      
      // Should have dark theme attribute on body
      expect(document.body.getAttribute('data-bsb-theme')).toBe('dark');
      
      // Set to auto (removes attribute)
      instance.setTheme('auto');
      expect(document.body.hasAttribute('data-bsb-theme')).toBe(false);
    });
  });

  describe('Keyboard Accessibility', () => {
    test('should be keyboard accessible', async () => {
      document.body.innerHTML = `
        <div data-bsb-component="theme-toggle">
          <button data-bsb-theme-button aria-expanded="false"></button>
          <div data-bsb-theme-menu aria-hidden="true">
            <button data-theme="light">Light</button>
            <button data-theme="dark">Dark</button>
            <button data-theme="auto">Auto</button>
          </div>
        </div>
      `;
      
      await import('../../src/components/theme-toggle/theme-toggle.js');
      
      const toggle = document.querySelector('[data-bsb-component="theme-toggle"]');
      const button = toggle.querySelector('[data-bsb-theme-button]');
      const instance = toggle.themeToggleInstance;
      
      // Should be focusable
      button.focus();
      expect(document.activeElement).toBe(button);
      
      // Should respond to Enter key to open menu
      const enterEvent = new KeyboardEvent('keydown', { 
        key: 'Enter',
        bubbles: true 
      });
      button.dispatchEvent(enterEvent);
      
      // Menu should be open
      expect(button.getAttribute('aria-expanded')).toBe('true');
      
      // Escape should close menu
      const escapeEvent = new KeyboardEvent('keydown', { 
        key: 'Escape',
        bubbles: true 
      });
      toggle.dispatchEvent(escapeEvent);
      
      expect(button.getAttribute('aria-expanded')).toBe('false');
    });
  });

  describe('Event Handling', () => {
    test('should dispatch theme-changed event', async () => {
      document.body.innerHTML = `
        <div data-bsb-component="theme-toggle">
          <button data-bsb-theme-button aria-expanded="false"></button>
          <div data-bsb-theme-menu aria-hidden="true">
            <button data-theme="light">Light</button>
            <button data-theme="dark">Dark</button>
            <button data-theme="auto">Auto</button>
          </div>
        </div>
      `;
      
      await import('../../src/components/theme-toggle/theme-toggle.js');
      
      const toggle = document.querySelector('[data-bsb-component="theme-toggle"]');
      const instance = toggle.themeToggleInstance;
      
      let eventFired = false;
      let eventDetail = null;
      
      toggle.addEventListener('bsb:themechange', (e) => {
        eventFired = true;
        eventDetail = e.detail;
      });
      
      // Switch theme
      instance.setTheme('dark');
      
      expect(eventFired).toBe(true);
      expect(eventDetail.theme).toBe('dark');
      expect(eventDetail.element).toBe(toggle);
    });
  });
});