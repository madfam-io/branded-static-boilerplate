/**
 * Main JavaScript Entry Point Tests
 * ==================================
 * 
 * Tests for the main BSB initialization and core functionality
 */

// Mock all module imports to isolate main.js functionality
jest.mock('../../src/scripts/core/debug.js', () => ({
  log: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
}));

jest.mock('../../src/scripts/core/bsb-helper.js', () => ({}));
jest.mock('../../src/components/header/header.js', () => ({}));
jest.mock('../../src/scripts/core/resource-hints.js', () => ({}));
jest.mock('../../src/scripts/core/achievement-system.js', () => ({}));
jest.mock('../../src/scripts/core/language-toggle.js', () => ({}));
jest.mock('../../src/scripts/core/accessibility-enhancer.js', () => ({}));
jest.mock('../../src/scripts/core/performance-optimizer.js', () => ({}));

describe('Main JavaScript Entry Point', () => {
  let mockIntersectionObserver;
  let mockPerformance;
  let originalLocation;
  let originalHistory;

  beforeEach(() => {
    // Mock IntersectionObserver
    mockIntersectionObserver = {
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn()
    };
    global.IntersectionObserver = jest.fn(() => mockIntersectionObserver);

    // Mock performance API
    mockPerformance = {
      getEntriesByType: jest.fn(),
      mark: jest.fn(),
      measure: jest.fn()
    };
    global.performance = mockPerformance;

    // Mock location and history
    originalLocation = window.location;
    originalHistory = window.history;
    
    delete window.location;
    delete window.history;
    
    window.location = {
      hostname: 'localhost',
      href: 'http://localhost:3000'
    };
    
    window.history = {
      pushState: jest.fn()
    };

    // Clear document body
    document.body.innerHTML = '';
    document.head.innerHTML = '';

    // Clear module cache and re-import
    jest.resetModules();
  });

  afterEach(() => {
    // Restore original objects
    window.location = originalLocation;
    window.history = originalHistory;
    
    // Clean up event listeners
    document.removeEventListener('DOMContentLoaded', jest.fn());
    window.removeEventListener('load', jest.fn());
    
    // Clear BSBUtils
    delete window.BSBUtils;
  });

  describe('Module Import and Setup', () => {
    test('should import all required modules without errors', async () => {
      expect(() => {
        require('../../src/scripts/core/main.js');
      }).not.toThrow();
    });

    test('should set up BSBUtils global object', async () => {
      require('../../src/scripts/core/main.js');
      
      expect(window.BSBUtils).toBeDefined();
      expect(typeof window.BSBUtils.debounce).toBe('function');
      expect(typeof window.BSBUtils.throttle).toBe('function');
    });
  });

  describe('Smooth Scrolling', () => {
    test('should set up smooth scrolling for anchor links', async () => {
      // Create test DOM
      document.body.innerHTML = `
        <a href="#section1" id="anchor-link">Go to Section</a>
        <div id="section1">Section Content</div>
        <header class="bsb-header" style="height: 60px;">Header</header>
      `;

      // Import main.js to initialize
      require('../../src/scripts/core/main.js');

      const link = document.getElementById('anchor-link');
      const section = document.getElementById('section1');
      
      // Mock scrollTo
      window.scrollTo = jest.fn();
      
      // Mock offsetTop and offsetHeight
      Object.defineProperty(section, 'offsetTop', { value: 500 });
      Object.defineProperty(document.querySelector('.bsb-header'), 'offsetHeight', { value: 60 });

      // Simulate click
      const clickEvent = new Event('click', { bubbles: true });
      Object.defineProperty(clickEvent, 'preventDefault', { value: jest.fn() });
      
      link.dispatchEvent(clickEvent);

      expect(clickEvent.preventDefault).toHaveBeenCalled();
      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 420, // 500 - 60 - 20 (offset)
        behavior: 'smooth'
      });
      expect(window.history.pushState).toHaveBeenCalledWith(null, null, '#section1');
    });

    test('should not affect external links', async () => {
      document.body.innerHTML = `
        <a href="https://example.com" id="external-link">External Link</a>
        <a href="#" id="hash-only">Hash Only</a>
      `;

      require('../../src/scripts/core/main.js');

      window.scrollTo = jest.fn();
      
      const externalLink = document.getElementById('external-link');
      const hashLink = document.getElementById('hash-only');
      
      const clickEvent1 = new Event('click', { bubbles: true });
      const clickEvent2 = new Event('click', { bubbles: true });
      
      externalLink.dispatchEvent(clickEvent1);
      hashLink.dispatchEvent(clickEvent2);

      expect(window.scrollTo).not.toHaveBeenCalled();
    });
  });

  describe('Form Enhancements', () => {
    test('should add floating label functionality', async () => {
      document.body.innerHTML = `
        <input class="form-input" value="test" />
        <textarea class="form-textarea"></textarea>
      `;

      require('../../src/scripts/core/main.js');

      const input = document.querySelector('.form-input');
      const textarea = document.querySelector('.form-textarea');

      // Input with value should have has-value class
      expect(input.classList.contains('has-value')).toBe(true);

      // Textarea without value should not have has-value class
      expect(textarea.classList.contains('has-value')).toBe(false);

      // Test blur event
      textarea.value = 'some content';
      textarea.dispatchEvent(new Event('blur'));
      expect(textarea.classList.contains('has-value')).toBe(true);

      // Test blur with empty value
      textarea.value = '';
      textarea.dispatchEvent(new Event('blur'));
      expect(textarea.classList.contains('has-value')).toBe(false);
    });

    test('should handle form validation', async () => {
      document.body.innerHTML = `
        <form data-bsb-validate>
          <input type="email" required />
          <button type="submit">Submit</button>
        </form>
      `;

      require('../../src/scripts/core/main.js');

      const form = document.querySelector('form');
      const input = document.querySelector('input');
      
      // Mock form.checkValidity
      form.checkValidity = jest.fn().mockReturnValue(false);
      input.focus = jest.fn();

      const submitEvent = new Event('submit', { bubbles: true });
      Object.defineProperty(submitEvent, 'preventDefault', { value: jest.fn() });
      Object.defineProperty(submitEvent, 'stopPropagation', { value: jest.fn() });

      form.dispatchEvent(submitEvent);

      expect(submitEvent.preventDefault).toHaveBeenCalled();
      expect(submitEvent.stopPropagation).toHaveBeenCalled();
      expect(form.classList.contains('was-validated')).toBe(true);
    });
  });

  describe('Lazy Loading', () => {
    test('should set up intersection observer for lazy images', async () => {
      document.body.innerHTML = `
        <img loading="lazy" data-src="test.jpg" />
        <img loading="lazy" data-src="test2.jpg" />
      `;

      require('../../src/scripts/core/main.js');

      expect(global.IntersectionObserver).toHaveBeenCalled();
      expect(mockIntersectionObserver.observe).toHaveBeenCalledTimes(2);
    });

    test('should load images when they intersect', async () => {
      document.body.innerHTML = `
        <img loading="lazy" data-src="test.jpg" />
      `;

      require('../../src/scripts/core/main.js');

      // Get the callback function passed to IntersectionObserver
      const [callback] = global.IntersectionObserver.mock.calls[0];
      const img = document.querySelector('img');

      // Simulate intersection
      callback([{
        target: img,
        isIntersecting: true
      }], mockIntersectionObserver);

      expect(img.src).toBe('test.jpg');
      expect(img.hasAttribute('data-src')).toBe(false);
      expect(mockIntersectionObserver.unobserve).toHaveBeenCalledWith(img);
    });

    test('should handle browsers without IntersectionObserver', async () => {
      delete global.IntersectionObserver;
      
      document.body.innerHTML = `
        <img loading="lazy" data-src="test.jpg" />
      `;

      expect(() => {
        require('../../src/scripts/core/main.js');
      }).not.toThrow();
    });
  });

  describe('Dynamic Content Updates', () => {
    test('should update copyright years', async () => {
      const currentYear = new Date().getFullYear();
      
      document.body.innerHTML = `
        <time datetime="2024">2024</time>
        <div class="bsb-footer__copyright">© 2024 Company</div>
      `;

      require('../../src/scripts/core/main.js');

      const timeElement = document.querySelector('time');
      const copyrightElement = document.querySelector('.bsb-footer__copyright');

      expect(timeElement.getAttribute('datetime')).toBe(currentYear.toString());
      expect(timeElement.textContent).toBe(currentYear.toString());
      expect(copyrightElement.innerHTML).toBe(`© ${currentYear} Company`);
    });

    test('should not update non-2024 years', async () => {
      document.body.innerHTML = `
        <time datetime="2023">2023</time>
        <div class="bsb-footer__copyright">© 2023 Company</div>
      `;

      require('../../src/scripts/core/main.js');

      const timeElement = document.querySelector('time');
      const copyrightElement = document.querySelector('.bsb-footer__copyright');

      expect(timeElement.getAttribute('datetime')).toBe('2023');
      expect(timeElement.textContent).toBe('2023');
      expect(copyrightElement.innerHTML).toBe('© 2023 Company');
    });
  });

  describe('Accessibility Features', () => {
    test('should set up keyboard navigation for dropdowns', async () => {
      document.body.innerHTML = `
        <div role="menu">
          <div role="menuitem" tabindex="0">Item 1</div>
          <div role="menuitem" tabindex="0">Item 2</div>
          <div role="menuitem" tabindex="0">Item 3</div>
        </div>
      `;

      require('../../src/scripts/core/main.js');

      const menu = document.querySelector('[role="menu"]');
      const items = document.querySelectorAll('[role="menuitem"]');
      
      items.forEach(item => {
        item.focus = jest.fn();
      });

      // Test ArrowDown
      const downEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      Object.defineProperty(downEvent, 'preventDefault', { value: jest.fn() });
      menu.dispatchEvent(downEvent);

      expect(downEvent.preventDefault).toHaveBeenCalled();
      expect(items[0].focus).toHaveBeenCalled();

      // Test ArrowUp
      const upEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      Object.defineProperty(upEvent, 'preventDefault', { value: jest.fn() });
      menu.dispatchEvent(upEvent);

      expect(upEvent.preventDefault).toHaveBeenCalled();
      expect(items[2].focus).toHaveBeenCalled();
    });

    test('should handle skip links', async () => {
      document.body.innerHTML = `
        <a href="#main" class="bsb-skip-link">Skip to main</a>
        <main id="main">Main content</main>
      `;

      require('../../src/scripts/core/main.js');

      const skipLink = document.querySelector('.bsb-skip-link');
      const main = document.querySelector('#main');
      
      main.focus = jest.fn();
      main.scrollIntoView = jest.fn();

      const clickEvent = new Event('click', { bubbles: true });
      Object.defineProperty(clickEvent, 'preventDefault', { value: jest.fn() });
      
      skipLink.dispatchEvent(clickEvent);

      expect(clickEvent.preventDefault).toHaveBeenCalled();
      expect(main.getAttribute('tabindex')).toBe('-1');
      expect(main.focus).toHaveBeenCalled();
      expect(main.scrollIntoView).toHaveBeenCalled();
    });
  });

  describe('Performance Monitoring', () => {
    test('should be properly mocked', () => {
      expect(mockPerformance).toBeDefined();
      expect(mockPerformance.getEntriesByType).toBeDefined();
    });
  });

  describe('BSBUtils', () => {
    beforeEach(() => {
      require('../../src/scripts/core/main.js');
    });

    describe('debounce', () => {
      test('should debounce function calls', done => {
        const mockFn = jest.fn();
        const debouncedFn = window.BSBUtils.debounce(mockFn, 100);

        debouncedFn('arg1');
        debouncedFn('arg2');
        debouncedFn('arg3');

        setTimeout(() => {
          expect(mockFn).toHaveBeenCalledTimes(1);
          expect(mockFn).toHaveBeenCalledWith('arg3');
          done();
        }, 150);
      });

      test('should pass arguments correctly', done => {
        const mockFn = jest.fn();
        const debouncedFn = window.BSBUtils.debounce(mockFn, 50);

        debouncedFn('test', 123, { key: 'value' });

        setTimeout(() => {
          expect(mockFn).toHaveBeenCalledWith('test', 123, { key: 'value' });
          done();
        }, 100);
      });
    });

    describe('throttle', () => {
      test('should throttle function calls', done => {
        const mockFn = jest.fn();
        const throttledFn = window.BSBUtils.throttle(mockFn, 100);

        throttledFn('call1');
        throttledFn('call2');
        throttledFn('call3');

        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockFn).toHaveBeenCalledWith('call1');

        setTimeout(() => {
          throttledFn('call4');
          expect(mockFn).toHaveBeenCalledTimes(2);
          expect(mockFn).toHaveBeenCalledWith('call4');
          done();
        }, 150);
      });
    });
  });

  describe('Initialization', () => {
    test('should initialize when DOM is ready', async () => {
      const debug = require('../../src/scripts/core/debug.js');
      
      // Simulate DOM loading state
      Object.defineProperty(document, 'readyState', {
        writable: true,
        value: 'loading'
      });

      require('../../src/scripts/core/main.js');

      // Simulate DOMContentLoaded
      document.dispatchEvent(new Event('DOMContentLoaded'));

      expect(debug.log).toHaveBeenCalledWith('BSB: All systems initialized 🚀');
    });

    test('should initialize immediately if DOM is already loaded', async () => {
      Object.defineProperty(document, 'readyState', {
        writable: true,
        value: 'complete'
      });

      const debug = require('../../src/scripts/core/debug.js');
      require('../../src/scripts/core/main.js');

      expect(debug.log).toHaveBeenCalledWith('BSB: All systems initialized 🚀');
    });
  });
});