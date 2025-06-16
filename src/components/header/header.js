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

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  initializeHeader();
});

/**
 * Initialize all header functionality
 */
function initializeHeader() {
  // Find all headers on the page (supports multiple headers)
  const headers = document.querySelectorAll('[data-bsb-component="header"]');

  headers.forEach(header => {
    setupMobileMenu(header);
    setupKeyboardNavigation(header);
  });
}

/**
 * Setup mobile menu toggle functionality
 * @param {HTMLElement} header - The header element
 */
function setupMobileMenu(header) {
  const toggle = header.querySelector('.bsb-header__toggle');
  const nav = header.querySelector('.bsb-header__nav');

  if (!toggle || !nav) {
    console.warn('BSB Header: Missing toggle button or navigation element');
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
    if (!isOpen) {
      // When opening, focus first menu item
      const firstLink = nav.querySelector('.bsb-header__link');
      if (firstLink) {
        firstLink.focus();
      }
    } else {
      // When closing, return focus to toggle button
      toggle.focus();
    }
  });

  // Close menu when clicking outside
  document.addEventListener('click', (event) => {
    const isClickInside = header.contains(event.target);
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';

    if (!isClickInside && isOpen) {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('bsb-header__nav--active');
    }
  });

  // Close menu when window is resized to desktop size
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth >= 768) {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('bsb-header__nav--active');
      }
    }, 250);
  });
}

/**
 * Setup keyboard navigation enhancements
 * @param {HTMLElement} header - The header element
 */
function setupKeyboardNavigation(header) {
  const nav = header.querySelector('.bsb-header__nav');
  const toggle = header.querySelector('.bsb-header__toggle');

  if (!nav) {
    return;
  }

  // Handle Escape key to close mobile menu
  nav.addEventListener('keydown', (event) => {
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
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    nav.addEventListener('keydown', (event) => {
      const isOpen = toggle?.getAttribute('aria-expanded') === 'true';

      if (!isOpen || event.key !== 'Tab') {
        return;
      }

      // Tab forward from last element
      if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }

      // Tab backward from first element
      if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      }
    });
  }
}

/**
 * Utility: Mark current page in navigation
 * Automatically adds aria-current="page" based on URL
 */
function markCurrentPage() {
  const currentPath = window.location.pathname;
  const links = document.querySelectorAll('.bsb-header__link');

  links.forEach(link => {
    const linkPath = new URL(link.href).pathname;

    if (currentPath === linkPath) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

// Run current page marking on load
markCurrentPage();

// Export functions for use in other scripts
window.BSBHeader = {
  initialize: initializeHeader,
  markCurrentPage: markCurrentPage
};