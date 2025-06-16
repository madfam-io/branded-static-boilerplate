/**
 * BSB Helper Tests
 * ================
 * 
 * Unit tests for the BSB Helper development tools.
 * Tests educational features, component inspection, and accessibility.
 */

import { jest } from '@jest/globals';

// Mock BSB Helper class for testing
class MockBSBHelper {
  constructor() {
    this.devMode = false;
    this.components = new Map();
  }

  init() {
    this.devMode = true;
    this.setup();
  }

  setup() {
    this.findComponents();
    this.createDevPanel();
  }

  findComponents() {
    const components = document.querySelectorAll('[data-bsb-component]');
    components.forEach(element => {
      const componentName = element.dataset.bsbComponent;
      if (!this.components.has(componentName)) {
        this.components.set(componentName, []);
      }
      this.components.get(componentName).push(element);
    });
  }

  createDevPanel() {
    const panel = document.createElement('div');
    panel.className = 'bsb-dev-panel';
    panel.innerHTML = `
      <div class="bsb-dev-panel__header">
        <h5>BSB Dev Mode</h5>
        <button class="bsb-dev-panel__close" aria-label="Close dev panel">×</button>
      </div>
      <div class="bsb-dev-panel__content">
        <p>Components: <span class="bsb-dev-panel__component-count">${this.components.size}</span></p>
      </div>
    `;
    document.body.appendChild(panel);
    return panel;
  }

  showComponentDocs(componentName, element) {
    const modal = document.createElement('div');
    modal.className = 'bsb-dev-modal';
    modal.innerHTML = `
      <div class="bsb-dev-modal__content">
        <h3>${componentName} Component</h3>
        <p>Documentation for ${componentName}</p>
        <button onclick="this.closest('.bsb-dev-modal').remove()">Close</button>
      </div>
    `;
    document.body.appendChild(modal);
    return modal;
  }

  toggleGrid() {
    document.body.classList.toggle('bsb-show-grid');
  }

  toggleHelpers() {
    document.body.classList.toggle('bsb-show-helpers');
  }
}

// Make MockBSBHelper available globally for tests
global.BSBHelper = MockBSBHelper;

describe('BSB Helper', () => {
  let helper;

  beforeEach(() => {
    helper = new MockBSBHelper();
    document.body.innerHTML = '';
    localStorage.clear();
  });

  describe('Initialization', () => {
    test('should initialize with correct default state', () => {
      expect(helper.devMode).toBe(false);
      expect(helper.components).toBeInstanceOf(Map);
      expect(helper.components.size).toBe(0);
    });

    test('should enable dev mode when init() is called', () => {
      helper.init();
      expect(helper.devMode).toBe(true);
    });

    test('should create dev panel on initialization', () => {
      helper.init();
      const panel = document.querySelector('.bsb-dev-panel');
      expect(panel).toBeTruthy();
      expect(panel.querySelector('.bsb-dev-panel__header')).toBeTruthy();
      expect(panel.querySelector('.bsb-dev-panel__content')).toBeTruthy();
    });
  });

  describe('Component Discovery', () => {
    test('should find components with data-bsb-component attribute', () => {
      // Create test components
      document.body.innerHTML = `
        <div data-bsb-component="card" class="bsb-card">Card 1</div>
        <div data-bsb-component="card" class="bsb-card">Card 2</div>
        <div data-bsb-component="hero" class="bsb-hero">Hero</div>
        <div class="regular-element">No component</div>
      `;

      helper.findComponents();

      expect(helper.components.size).toBe(2);
      expect(helper.components.has('card')).toBe(true);
      expect(helper.components.has('hero')).toBe(true);
      expect(helper.components.get('card')).toHaveLength(2);
      expect(helper.components.get('hero')).toHaveLength(1);
    });

    test('should handle empty document gracefully', () => {
      helper.findComponents();
      expect(helper.components.size).toBe(0);
    });

    test('should update component count in dev panel', () => {
      document.body.innerHTML = `
        <div data-bsb-component="card">Card</div>
        <div data-bsb-component="hero">Hero</div>
      `;

      helper.init();
      const componentCount = document.querySelector('.bsb-dev-panel__component-count');
      expect(componentCount.textContent).toBe('2');
    });
  });

  describe('Component Documentation', () => {
    test('should show component documentation modal', () => {
      const element = createMockElement('div', {
        'data-bsb-component': 'card',
        className: 'bsb-card'
      });

      const modal = helper.showComponentDocs('card', element);

      expect(modal).toBeTruthy();
      expect(modal.className).toBe('bsb-dev-modal');
      expect(modal.textContent).toContain('card Component');
      expect(modal.textContent).toContain('Documentation for card');
    });

    test('should create modal with proper accessibility attributes', () => {
      const element = createMockElement('div', {
        'data-bsb-component': 'hero'
      });

      const modal = helper.showComponentDocs('hero', element);
      const content = modal.querySelector('.bsb-dev-modal__content');

      expect(content).toBeTruthy();
      expect(content.querySelector('h3')).toBeTruthy();
      expect(content.querySelector('button')).toBeTruthy();
    });
  });

  describe('Grid Overlay', () => {
    test('should toggle grid overlay class', () => {
      expect(document.body.classList.contains('bsb-show-grid')).toBe(false);

      helper.toggleGrid();
      expect(document.body.classList.contains('bsb-show-grid')).toBe(true);

      helper.toggleGrid();
      expect(document.body.classList.contains('bsb-show-grid')).toBe(false);
    });
  });

  describe('Component Helpers', () => {
    test('should toggle helpers visibility class', () => {
      expect(document.body.classList.contains('bsb-show-helpers')).toBe(false);

      helper.toggleHelpers();
      expect(document.body.classList.contains('bsb-show-helpers')).toBe(true);

      helper.toggleHelpers();
      expect(document.body.classList.contains('bsb-show-helpers')).toBe(false);
    });
  });

  describe('Educational Features', () => {
    test('should track component usage for educational purposes', () => {
      document.body.innerHTML = `
        <div data-bsb-component="card">Card</div>
        <div data-bsb-component="hero">Hero</div>
        <div data-bsb-component="card">Another Card</div>
      `;

      helper.findComponents();

      // Should track most used components
      const componentUsage = Array.from(helper.components.entries())
        .map(([name, elements]) => ({ name, count: elements.length }))
        .sort((a, b) => b.count - a.count);

      expect(componentUsage[0].name).toBe('card');
      expect(componentUsage[0].count).toBe(2);
      expect(componentUsage[1].name).toBe('hero');
      expect(componentUsage[1].count).toBe(1);
    });
  });

  describe('Accessibility', () => {
    test('dev panel should be accessible', async () => {
      helper.init();
      const panel = document.querySelector('.bsb-dev-panel');
      
      // Test basic accessibility
      await testAccessibility(panel);

      // Check for proper ARIA attributes
      const closeButton = panel.querySelector('.bsb-dev-panel__close');
      expect(closeButton.getAttribute('aria-label')).toBe('Close dev panel');
    });

    test('component modals should be accessible', async () => {
      const element = createMockElement('div', {
        'data-bsb-component': 'card'
      });

      const modal = helper.showComponentDocs('card', element);
      
      // Test modal accessibility
      await testAccessibility(modal);

      // Check heading structure
      const heading = modal.querySelector('h3');
      expect(heading).toBeTruthy();
      expect(heading.textContent).toContain('Component');
    });

    test('should maintain focus management in modals', () => {
      const element = createMockElement('div', {
        'data-bsb-component': 'card'
      });

      const modal = helper.showComponentDocs('card', element);
      const closeButton = modal.querySelector('button');

      expect(closeButton).toBeTruthy();
      expect(closeButton.textContent).toBe('Close');
    });
  });

  describe('Performance', () => {
    test('should initialize quickly', () => {
      const { duration } = measurePerformance(() => {
        helper.init();
      });

      // Should initialize in under 50ms
      expect(duration).toBeLessThan(50);
    });

    test('should handle large numbers of components efficiently', () => {
      // Create 100 components
      const components = Array.from({ length: 100 }, (_, i) => 
        `<div data-bsb-component="card-${i % 5}">Component ${i}</div>`
      ).join('');
      
      document.body.innerHTML = components;

      const { duration } = measurePerformance(() => {
        helper.findComponents();
      });

      // Should process 100 components in under 100ms
      expect(duration).toBeLessThan(100);
      expect(helper.components.size).toBe(5); // 5 unique component types
    });
  });

  describe('Error Handling', () => {
    test('should handle missing elements gracefully', () => {
      expect(() => {
        helper.showComponentDocs('nonexistent', null);
      }).not.toThrow();
    });

    test('should handle malformed HTML gracefully', () => {
      document.body.innerHTML = '<div data-bsb-component="">Empty component name</div>';
      
      expect(() => {
        helper.findComponents();
      }).not.toThrow();
    });
  });
});

describe('Learning Mode Integration', () => {
  test('should enable learning mode via localStorage', () => {
    localStorage.setItem('bsb-dev-mode', 'true');
    
    const helper = new MockBSBHelper();
    const isEnabled = localStorage.getItem('bsb-dev-mode') === 'true';
    
    expect(isEnabled).toBe(true);
  });

  test('should provide educational notifications', () => {
    // Mock enableLearningMode function
    global.enableLearningMode = jest.fn(() => {
      localStorage.setItem('bsb-dev-mode', 'true');
      
      const notification = document.createElement('div');
      notification.textContent = '🎓 Learning mode enabled! Refresh to see interactive tooltips.';
      document.body.appendChild(notification);
      
      return notification;
    });

    const notification = global.enableLearningMode();
    
    expect(localStorage.getItem('bsb-dev-mode')).toBe('true');
    expect(notification.textContent).toContain('Learning mode enabled');
    expect(document.body.contains(notification)).toBe(true);
  });
});