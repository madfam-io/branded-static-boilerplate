/**
 * =============================================================================
 * BSB MAIN JAVASCRIPT FILE
 * =============================================================================
 *
 * This is the main entry point for all JavaScript functionality.
 * It initializes components and sets up global features.
 *
 * 🎯 Features:
 * - Component initialization
 * - Smooth scrolling
 * - Form enhancements
 * - Performance monitoring
 *
 * 📚 Learn More:
 * - JavaScript Architecture: /docs/tutorials/javascript-architecture.md
 * - Progressive Enhancement: /docs/tutorials/progressive-enhancement.md
 *
 * 💡 This file uses ES6 modules - ensure your HTML uses type="module"
 * =============================================================================
 */

// Import component modules
import debug from './debug.js';
import './bsb-helper.js';
import '../../components/header/header.js';
import './resource-hints.js';
import './achievement-system.js';
import './language-toggle.js';
import './accessibility-enhancer.js';
import './performance-optimizer.js';

// Constants
const CONSTANTS = {
  SCROLL_OFFSET: 20
};

/**
 * Initialize all BSB features
 * @function initializeBSB
 * @description Sets up all interactive components and features of the BSB framework.
 *              This is the main entry point that coordinates all subsystem initialization.
 * @throws {Error} Throws if critical DOM elements are missing
 * @returns {void}
 * @since 1.0.0
 * @example
 * // Initialize BSB when DOM is ready
 * if (document.readyState === 'loading') {
 *   document.addEventListener('DOMContentLoaded', initializeBSB);
 * } else {
 *   initializeBSB();
 * }
 */
const initializeBSB = function initializeBSB() {
  // Initialize smooth scrolling
  initSmoothScrolling();

  // Initialize form enhancements
  initFormEnhancements();

  // Initialize lazy loading
  initLazyLoading();

  // Initialize accessibility features
  initAccessibility();

  // Update dynamic content
  updateDynamicContent();

  // Log initialization in development only
  debug.log('BSB: All systems initialized 🚀');
};

/**
 * Smooth scrolling for anchor links
 * @function initSmoothScrolling
 * @description Enables smooth scrolling behavior for internal anchor links with automatic
 *              header offset calculation for improved user experience.
 * @returns {void}
 * @since 1.0.0
 * @performance O(n) where n is the number of anchor links
 * @accessibility Preserves focus management and screen reader compatibility
 * @example
 * // Automatically called during BSB initialization
 * // Handles links like <a href="#section1">Go to Section 1</a>
 */
const initSmoothScrolling = function initSmoothScrolling() {
  // Find all links that point to anchors
  const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');

  anchorLinks.forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        e.preventDefault();

        // Calculate offset for fixed header
        const header = document.querySelector('.bsb-header');
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = targetElement.offsetTop - headerHeight - CONSTANTS.SCROLL_OFFSET;

        // Smooth scroll to target
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update URL without jumping
        history.pushState(null, null, targetId);

        // Focus target for accessibility
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus();
      }
    });
  });
};

/**
 * Form enhancements
 * @function initFormEnhancements
 * @description Adds progressive enhancements to forms including floating labels and validation
 * @returns {void}
 */
const initFormEnhancements = function initFormEnhancements() {
  // Add floating labels
  const formInputs = document.querySelectorAll('.form-input, .form-textarea');

  formInputs.forEach(input => {
    // Check if input has value on load
    if (input.value) {
      input.classList.add('has-value');
    }

    // Add class when input has value
    input.addEventListener('blur', () => {
      if (input.value) {
        input.classList.add('has-value');
      } else {
        input.classList.remove('has-value');
      }
    });
  });

  // Form validation feedback
  const forms = document.querySelectorAll('form[data-bsb-validate]');

  forms.forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();

        // Add validation classes
        form.classList.add('was-validated');

        // Focus first invalid input
        const firstInvalid = form.querySelector(':invalid');
        if (firstInvalid) {
          firstInvalid.focus();
        }
      }
    });
  });
};

/**
 * Lazy loading for images
 * @function initLazyLoading
 * @description Implements intersection observer-based lazy loading for images
 * @returns {void}
 */
const initLazyLoading = function initLazyLoading() {
  // Check if browser supports IntersectionObserver
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;

          // Load the image
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }

          // Stop observing this image
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px' // Start loading 50px before entering viewport
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  }
};

/**
 * Update dynamic content
 * @function updateDynamicContent
 * @description Updates copyright years and other dynamic content elements
 * @returns {void}
 */
const updateDynamicContent = function updateDynamicContent() {
  // Update copyright year
  const currentYear = new Date().getFullYear();
  const yearElements = document.querySelectorAll('time[datetime]');

  yearElements.forEach(element => {
    // Update both the datetime attribute and text content
    if (element.getAttribute('datetime') === '2024' ||
        element.textContent.trim() === '2024') {
      element.setAttribute('datetime', currentYear.toString());
      element.textContent = currentYear.toString();
    }
  });

  // Also update any copyright text that contains hardcoded years
  const copyrightElements = document.querySelectorAll('.bsb-footer__copyright');

  copyrightElements.forEach(element => {
    const text = element.innerHTML;
    // Replace year pattern (© YYYY) with current year
    const updatedText = text.replace(
      /©\s*<time[^>]*>(\d{4})<\/time>/u,
      `© <time datetime="${currentYear}">${currentYear}</time>`
    );
    if (updatedText !== text) {
      element.innerHTML = updatedText;
    }
  });
};

/**
 * Accessibility enhancements
 * @function initAccessibility
 * @description Enhances keyboard navigation and screen reader support
 * @returns {void}
 */
const initAccessibility = function initAccessibility() {
  // Add keyboard navigation indicators
  document.addEventListener('keydown', event => {
    if (event.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
  });

  // Enhance skip links
  const skipLinks = document.querySelectorAll('.skip-link');

  skipLinks.forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));

      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
        target.scrollIntoView();
      }
    });
  });
};

/**
 * Performance monitoring
 * @function monitorPerformance
 * @description Monitors and logs performance metrics in development environment
 * @returns {void}
 */
const monitorPerformance = function monitorPerformance() {
  // Only in development
  if (window.location.hostname === 'localhost') {
    window.addEventListener('load', () => {
      const [perfData] = performance.getEntriesByType('navigation');

      debug.log('BSB Performance Metrics:');
      debug.log(`- DOM Content Loaded: ${Math.round(perfData.domContentLoadedEventEnd)}ms`);
      debug.log(`- Page Load Complete: ${Math.round(perfData.loadEventEnd)}ms`);
      debug.log(`- Total Resources: ${performance.getEntriesByType('resource').length}`);
    });
  }
};

/**
 * Utility: Debounce function
 * @namespace BSBUtils
 * @description Utility functions for common operations
 */
window.BSBUtils = {
  /**
   * Debounce function execution
   * @function debounce
   * @param {Function} func - The function to debounce
   * @param {number} wait - The number of milliseconds to delay
   * @returns {Function} The debounced function
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttle function execution
   * @function throttle
   * @param {Function} func - The function to throttle
   * @param {number} limit - The number of milliseconds to limit execution
   * @returns {Function} The throttled function
   */
  throttle(func, limit) {
    let inThrottle;
    return function throttledFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => {
          inThrottle = false;
        }, limit);
      }
    };
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeBSB);
} else {
  initializeBSB();
}

// Monitor performance
monitorPerformance();