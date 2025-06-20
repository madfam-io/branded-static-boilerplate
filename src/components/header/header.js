/**
 * =============================================================================
 * BSB HEADER COMPONENT JAVASCRIPT
 * =============================================================================
 *
 * Progressive enhancement for the header component.
 * Adds mobile menu toggle functionality and keyboard navigation.
 *
 * 🎯 Features:
 * - Mobile menu toggle
 * - Keyboard navigation (Tab, Escape)
 * - Focus management
 * - ARIA attribute updates
 *
 * 📚 Learn More:
 * - JavaScript Components: /docs/tutorials/component-scripts.md
 * - Accessibility: /docs/tutorials/keyboard-navigation.md
 *
 * 💡 This script is optional - the header works without JavaScript,
 * but mobile users won't have a collapsible menu.
 * =============================================================================
 */

import { debug } from '../../scripts/core/debug.js';

// Constants
const CONSTANTS = {
  DESKTOP_BREAKPOINT: 768,
  RESIZE_DEBOUNCE_DELAY: 250
};

// Function definitions must come before usage due to linting rules

/**
 * Setup mobile menu toggle functionality
 * @function setupMobileMenu
 * @param {HTMLElement} header - The header element containing the mobile menu
 * @description Configures mobile menu toggle behavior and accessibility features
 * @returns {void}
 */
const setupMobileMenu = function setupMobileMenu(header) {
  const toggle = header.querySelector('.bsb-header__toggle');
  const nav = header.querySelector('.bsb-header__nav');

  if (!toggle || !nav) {
    debug.warn('BSB Header: Missing toggle button or navigation element');
    return;
  }

  // Toggle menu on button click
  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';

    // Update ARIA attributes
    toggle.setAttribute('aria-expanded', !isOpen);

    // Toggle active class for CSS animations
    nav.classList.toggle('bsb-header__nav--active', !isOpen);

    // Manage focus
    if (isOpen) {
      // When closing, return focus to toggle button
      toggle.focus();
    } else {
      // When opening, focus first menu item
      const firstLink = nav.querySelector('.bsb-header__link');
      if (firstLink) {
        firstLink.focus();
      }
    }
  });

  // Close menu when clicking outside
  document.addEventListener('click', event => {
    const isClickInside = header.contains(event.target);
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';

    if (!isClickInside && isOpen) {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('bsb-header__nav--active');
    }
  });

  // Close menu when window is resized to desktop size
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth >= CONSTANTS.DESKTOP_BREAKPOINT) {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('bsb-header__nav--active');
      }
    }, CONSTANTS.RESIZE_DEBOUNCE_DELAY);
  });
};

/**
 * Setup keyboard navigation enhancements
 * @function setupKeyboardNavigation
 * @param {HTMLElement} header - The header element to enhance
 * @description Adds keyboard navigation support including Escape key and focus trapping
 * @returns {void}
 */
const setupKeyboardNavigation = function setupKeyboardNavigation(header) {
  const nav = header.querySelector('.bsb-header__nav');
  const toggle = header.querySelector('.bsb-header__toggle');

  if (!nav) {
    return;
  }

  // Handle Escape key to close mobile menu
  nav.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      const isOpen = toggle?.getAttribute('aria-expanded') === 'true';

      if (isOpen && toggle) {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('bsb-header__nav--active');
        toggle.focus();
      }
    }
  });

  // Trap focus within mobile menu when open
  const focusableElements = nav.querySelectorAll(
    'a[href], button, [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length > 0) {
    const [firstFocusable] = focusableElements;
    const lastFocusable = focusableElements[focusableElements.length - 1];

    nav.addEventListener('keydown', event => {
      const isOpen = toggle?.getAttribute('aria-expanded') === 'true';

      if (!isOpen || event.key !== 'Tab') {
        return;
      }

      if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      } else if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    });
  }
};

/**
 * Mark current page in navigation
 * @function markCurrentPage
 * @description Highlights the current page link in navigation
 * @returns {void}
 */
const markCurrentPage = function markCurrentPage() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.bsb-header__link');

  navLinks.forEach(link => {
    const linkPath = new URL(link.href).pathname;

    if (linkPath === currentPath) {
      link.setAttribute('aria-current', 'page');
      link.classList.add('bsb-header__link--active');
    }
  });
};

/**
 * Initialize all header functionality
 * @function initializeHeader
 * @description Sets up mobile menu and keyboard navigation for all header components
 * @returns {void}
 */
const initializeHeader = function initializeHeader() {
  // Find all headers on the page (supports multiple headers)
  const headers = document.querySelectorAll('[data-bsb-component="header"]');

  headers.forEach(header => {
    setupMobileMenu(header);
    setupKeyboardNavigation(header);
  });
};

// Run current page marking on load
markCurrentPage();

/**
 * BSB Header API
 * @namespace BSBHeader
 * @description Public API for header component functionality
 */
window.BSBHeader = {
  /**
   * Initialize header functionality
   * @function initialize
   * @returns {void}
   */
  initialize: initializeHeader,

  /**
   * Mark current page in navigation
   * @function markCurrentPage
   * @returns {void}
   */
  markCurrentPage
};

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  initializeHeader();
});