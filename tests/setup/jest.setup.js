/**
 * Jest Setup Configuration
 * =========================
 * 
 * Global test environment setup for BSB.
 * Configures testing utilities, mocks, and accessibility testing.
 */

import 'jest-axe/extend-expect';
import { configureAxe } from 'jest-axe';

// Configure axe for accessibility testing
const axe = configureAxe({
  rules: {
    // Customize axe rules for educational content
    'color-contrast': { enabled: true },
    'focus-order-semantics': { enabled: true },
    'landmark-unique': { enabled: true },
    'page-has-heading-one': { enabled: true },
    'region': { enabled: true }
  },
  tags: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice']
});

// Global test utilities
global.axe = axe;

// Mock window.matchMedia for responsive design tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock window.getComputedStyle
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => '',
    getPropertyPriority: () => '',
    setProperty: () => {},
    removeProperty: () => {},
  }),
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock performance API
global.performance = {
  timing: {
    navigationStart: 0,
    loadEventEnd: 1000,
  },
  getEntriesByType: jest.fn(() => [
    {
      name: 'navigation',
      loadEventEnd: 1000,
      navigationStart: 0,
    }
  ]),
  mark: jest.fn(),
  measure: jest.fn(),
  now: jest.fn(() => 1000),
};

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Keep error and warn for debugging
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
};

// Global DOM testing utilities
global.createMockElement = (tagName, attributes = {}, textContent = '') => {
  const element = document.createElement(tagName);
  
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'dataset') {
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        element.dataset[dataKey] = dataValue;
      });
    } else {
      element.setAttribute(key, value);
    }
  });
  
  if (textContent) {
    element.textContent = textContent;
  }
  
  return element;
};

// Helper for creating complete HTML documents for testing
global.createMockDocument = (htmlContent) => {
  document.body.innerHTML = htmlContent;
  return document;
};

// Helper for testing accessibility
global.testAccessibility = async (element) => {
  const results = await axe(element);
  expect(results).toHaveNoViolations();
  return results;
};

// Helper for testing performance
global.measurePerformance = (fn) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  return {
    result,
    duration: end - start,
  };
};

// Helper for testing responsive behavior
global.mockViewport = (width, height = 768) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  
  // Trigger resize event
  window.dispatchEvent(new Event('resize'));
};

// Clean up after each test
afterEach(() => {
  // Clear DOM
  document.body.innerHTML = '';
  document.head.innerHTML = '';
  
  // Clear mocks
  jest.clearAllMocks();
  
  // Reset localStorage
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();
  
  // Reset sessionStorage
  sessionStorageMock.getItem.mockClear();
  sessionStorageMock.setItem.mockClear();
  sessionStorageMock.removeItem.mockClear();
  sessionStorageMock.clear.mockClear();
  
  // Reset viewport
  mockViewport(1024, 768);
});

// Setup before all tests
beforeAll(() => {
  // Set default viewport
  mockViewport(1024, 768);
  
  // Add BSB CSS custom properties for testing
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --bsb-primary: #007bff;
      --bsb-secondary: #6c757d;
      --bsb-space-4: 1rem;
      --bsb-text-base: 1rem;
      --bsb-font-base: system-ui, sans-serif;
    }
  `;
  document.head.appendChild(style);
});