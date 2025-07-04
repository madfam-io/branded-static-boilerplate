/**
 * =============================================================================
 * BSB THEME TOGGLE COMPONENT - JavaScript Functionality
 * =============================================================================
 *
 * Handles theme switching between light, dark, and auto modes with:
 * - localStorage persistence
 * - System preference detection
 * - Smooth transitions
 * - Accessibility support
 * - Keyboard navigation
 *
 * 🎯 Features:
 * - Three theme modes: light, dark, auto
 * - Remembers user preference
 * - Respects system color scheme
 * - Accessible dropdown menu
 * - Smooth color transitions
 *
 * 📚 Learn More:
 * - Theme System: /docs/tutorials/theming.md
 * - localStorage API: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
 * =============================================================================
 */

import debug from '../../scripts/core/debug.js';

// Constants
const CONSTANTS = {
  FOCUS_DELAY: 100,
  TRANSITION_DELAY: 50
};

/**
 * BSB Theme Toggle Component
 * @class BSBThemeToggle
 * @description Manages theme switching functionality
 */
class BSBThemeToggle {
  /**
   * Create a theme toggle instance
   * @constructor
   * @param {HTMLElement} element - The theme toggle container element
   */
  constructor(element) {
    this.element = element;
    this.button = element.querySelector('[data-bsb-theme-button]');
    this.menu = element.querySelector('[data-bsb-theme-menu]');
    this.options = element.querySelectorAll('[data-theme]');
    this.label = element.querySelector('[data-bsb-theme-label]');

    // Theme state
    this.currentTheme = this.getStoredTheme() || 'auto';
    this.isMenuOpen = false;

    // System preference tracking
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    this.init();
  }

  /**
   * Initialize the theme toggle
   * @method init
   * @description Sets up event listeners and initial state
   * @returns {void}
   */
  init() {
    // Apply initial theme
    this.applyTheme(this.currentTheme, false);

    // Set up event listeners
    this.setupEventListeners();

    // Update UI to reflect current theme
    this.updateUI();

    // Log initialization in development only
    debug.log(`BSB Theme Toggle: Initialized with theme "${this.currentTheme}"`);
  }

  /**
   * Set up all event listeners
   * @method setupEventListeners
   * @description Configures click, keyboard, and system preference listeners
   * @returns {void}
   */
  setupEventListeners() {
    // Main button click
    this.button.addEventListener('click', () => {
      this.toggleMenu();
    });

    // Theme option clicks
    this.options.forEach(option => {
      option.addEventListener('click', () => {
        const { theme } = option.dataset;
        this.setTheme(theme);
        this.closeMenu();
      });
    });

    // Keyboard navigation
    this.element.addEventListener('keydown', event => {
      this.handleKeydown(event);
    });

    // Click outside to close menu
    document.addEventListener('click', event => {
      if (this.element.contains(event.target)) {
        // Click is inside element, do nothing
      } else {
        this.closeMenu();
      }
    });

    // System preference changes
    this.mediaQuery.addEventListener('change', () => {
      if (this.currentTheme === 'auto') {
        this.updateSystemTheme();
      }
    });

    // Window focus (in case user changed system preference in another tab)
    window.addEventListener('focus', () => {
      if (this.currentTheme === 'auto') {
        this.updateSystemTheme();
      }
    });
  }

  /**
   * Handle keyboard navigation
   * @method handleKeydown
   * @param {KeyboardEvent} event - The keyboard event
   * @description Manages keyboard accessibility for the theme toggle
   * @returns {void}
   */
  handleKeydown(event) {
    const { key } = event;

    if (this.handleEscapeKey(event, key)) {
      return;
    }
    if (this.handleButtonToggle(event, key)) {
      return;
    }
    if (this.handleArrowNavigation(event, key)) {
      return;
    }
    if (this.handleMenuSelection(event, key)) {
      // Menu selection handled
    }
  }

  /**
   * Handle escape key press
   * @method handleEscapeKey
   * @param {KeyboardEvent} event - The keyboard event
   * @param {string} key - The key pressed
   * @returns {boolean} True if handled
   */
  handleEscapeKey(event, key) {
    if (key === 'Escape' && this.isMenuOpen) {
      event.preventDefault();
      this.closeMenu();
      this.button.focus();
      return true;
    }
    return false;
  }

  /**
   * Handle button toggle keys
   * @method handleButtonToggle
   * @param {KeyboardEvent} event - The keyboard event
   * @param {string} key - The key pressed
   * @returns {boolean} True if handled
   */
  handleButtonToggle(event, key) {
    if ((key === 'Enter' || key === ' ') && event.target === this.button) {
      event.preventDefault();
      this.toggleMenu();
      return true;
    }
    return false;
  }

  /**
   * Handle arrow key navigation
   * @method handleArrowNavigation
   * @param {KeyboardEvent} event - The keyboard event
   * @param {string} key - The key pressed
   * @returns {boolean} True if handled
   */
  handleArrowNavigation(event, key) {
    if (this.isMenuOpen && ['ArrowDown', 'ArrowUp'].includes(key)) {
      event.preventDefault();
      this.navigateMenu(key === 'ArrowDown' ? 1 : -1);
      return true;
    }
    return false;
  }

  /**
   * Handle menu selection keys
   * @method handleMenuSelection
   * @param {KeyboardEvent} event - The keyboard event
   * @param {string} key - The key pressed
   * @returns {boolean} True if handled
   */
  handleMenuSelection(event, key) {
    if (this.isMenuOpen && (key === 'Enter' || key === ' ') && event.target.dataset.theme) {
      event.preventDefault();
      const { theme } = event.target.dataset;
      this.setTheme(theme);
      this.closeMenu();
      this.button.focus();
      return true;
    }
    return false;
  }

  /**
   * Navigate through menu options with keyboard
   * @method navigateMenu
   * @param {number} direction - Direction to navigate (1 for down, -1 for up)
   * @description Handles arrow key navigation in the theme menu
   * @returns {void}
   */
  navigateMenu(direction) {
    const focusableOptions = Array.from(this.options);
    const currentIndex = focusableOptions.indexOf(document.activeElement);
    let nextIndex = currentIndex + direction;

    // Wrap around navigation
    if (nextIndex >= focusableOptions.length) {
      nextIndex = 0;
    } else if (nextIndex < 0) {
      nextIndex = focusableOptions.length - 1;
    }

    focusableOptions[nextIndex].focus();
  }

  /**
   * Toggle the theme menu open/closed
   * @method toggleMenu
   * @description Opens or closes the theme selection menu
   * @returns {void}
   */
  toggleMenu() {
    if (this.isMenuOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  /**
   * Open the theme menu
   * @method openMenu
   * @description Shows the theme selection menu
   * @returns {void}
   */
  openMenu() {
    this.isMenuOpen = true;
    this.button.setAttribute('aria-expanded', 'true');
    this.menu.setAttribute('aria-hidden', 'false');

    // Focus first option
    setTimeout(() => {
      const [firstOption] = this.options;
      if (firstOption) {
        firstOption.focus();
      }
    }, CONSTANTS.FOCUS_DELAY);
  }

  /**
   * Close the theme menu
   * @method closeMenu
   * @description Hides the theme selection menu
   * @returns {void}
   */
  closeMenu() {
    this.isMenuOpen = false;
    this.button.setAttribute('aria-expanded', 'false');
    this.menu.setAttribute('aria-hidden', 'true');
  }

  /**
   * Set the theme
   * @method setTheme
   * @param {string} theme - Theme to set ('light', 'dark', 'auto')
   * @description Changes the current theme and persists the choice
   * @returns {void}
   */
  setTheme(theme) {
    if (['light', 'dark', 'auto'].includes(theme)) {
      this.currentTheme = theme;
      this.applyTheme(theme);
      this.storeTheme(theme);
      this.updateUI();

      // Dispatch custom event
      this.dispatchThemeChange(theme);
    } else {
      debug.warn(`BSB Theme Toggle: Invalid theme "${theme}"`);
    }
  }

  /**
   * Apply theme to document
   * @method applyTheme
   * @param {string} theme - Theme to apply
   * @param {boolean} animate - Whether to animate the transition
   * @description Updates the document's theme attribute
   * @returns {void}
   */
  applyTheme(theme, animate = true) {
    const { body } = document;

    if (animate) {
      // Apply theme with animations
      this.applyThemeWithTransitions(theme, body);
    } else {
      // Apply theme instantly without transitions
      this.applyThemeInstantly(theme, body);
    }
  }

  /**
   * Apply theme with transitions enabled
   * @param {string} theme - Theme name to apply
   * @param {HTMLElement} body - Document body element
   */
  applyThemeWithTransitions(theme, body) {
    if (theme === 'auto') {
      body.removeAttribute('data-bsb-theme');
    } else {
      body.setAttribute('data-bsb-theme', theme);
    }
  }

  /**
   * Apply theme instantly without transitions
   * @param {string} theme - Theme name to apply
   * @param {HTMLElement} body - Document body element
   */
  applyThemeInstantly(theme, body) {
    // Temporarily disable transitions for instant theme switching
    body.classList.add('no-transition');

    if (theme === 'auto') {
      body.removeAttribute('data-bsb-theme');
    } else {
      body.setAttribute('data-bsb-theme', theme);
    }

    // Re-enable transitions after a brief delay
    setTimeout(() => {
      body.classList.remove('no-transition');
    }, CONSTANTS.TRANSITION_DELAY);
  }

  /**
   * Update system theme when in auto mode
   * @method updateSystemTheme
   * @description Re-evaluates system preference and updates if needed
   * @returns {void}
   */
  updateSystemTheme() {
    if (this.currentTheme === 'auto') {
      // Force re-evaluation of system preference
      this.applyTheme('auto');
    }
  }

  /**
   * Update UI to reflect current theme
   * @method updateUI
   * @description Updates button icons and menu states
   * @returns {void}
   */
  updateUI() {
    // Update icons
    this.updateIcons();

    // Update menu options
    this.updateMenuOptions();

    // Update screen reader label
    this.updateLabel();
  }

  /**
   * Update theme icons
   * @method updateIcons
   * @description Shows the appropriate icon for current theme
   * @returns {void}
   */
  updateIcons() {
    const icons = this.element.querySelectorAll('.bsb-theme-toggle__icon');
    icons.forEach(icon => {
      icon.classList.remove('bsb-theme-toggle__icon--active');
    });

    const activeIcon = this.element.querySelector(`.bsb-theme-toggle__icon--${this.currentTheme}`);
    if (activeIcon) {
      activeIcon.classList.add('bsb-theme-toggle__icon--active');
    }
  }

  /**
   * Update menu option states
   * @method updateMenuOptions
   * @description Updates aria-current attributes for menu options
   * @returns {void}
   */
  updateMenuOptions() {
    this.options.forEach(option => {
      const isActive = option.dataset.theme === this.currentTheme;
      option.setAttribute('aria-current', isActive.toString());
    });
  }

  /**
   * Update screen reader label
   * @method updateLabel
   * @description Updates the accessible label with current theme
   * @returns {void}
   */
  updateLabel() {
    if (this.label) {
      const themeNames = {
        light: 'Light',
        dark: 'Dark',
        auto: 'Auto'
      };
      this.label.textContent = themeNames[this.currentTheme] || 'Auto';
    }
  }

  /**
   * Get stored theme preference
   * @method getStoredTheme
   * @description Retrieves theme preference from localStorage
   * @returns {string|null} Stored theme or null if none stored
   */
  getStoredTheme() {
    try {
      return localStorage.getItem('bsb-theme');
    } catch (error) {
      debug.warn('BSB Theme Toggle: Unable to access localStorage:', error);
      return null;
    }
  }

  /**
   * Store theme preference
   * @method storeTheme
   * @param {string} theme - Theme to store
   * @description Saves theme preference to localStorage
   * @returns {void}
   */
  storeTheme(theme) {
    try {
      localStorage.setItem('bsb-theme', theme);
    } catch (error) {
      debug.warn('BSB Theme Toggle: Unable to save to localStorage:', error);
    }
  }

  /**
   * Dispatch theme change event
   * @method dispatchThemeChange
   * @param {string} theme - New theme value
   * @description Fires custom event when theme changes
   * @returns {void}
   */
  dispatchThemeChange(theme) {
    const event = new CustomEvent('bsb:themechange', {
      detail: { theme, element: this.element },
      bubbles: true
    });
    this.element.dispatchEvent(event);
  }
}

/**
 * Initialize all theme toggle components
 * @function initializeThemeToggles
 * @description Finds and initializes all theme toggle components on the page
 * @returns {void}
 */
const initializeThemeToggles = function initializeThemeToggles() {
  const toggles = document.querySelectorAll('[data-bsb-component="theme-toggle"]');

  toggles.forEach(toggle => {
    const themeToggle = new BSBThemeToggle(toggle);
    // Store reference if needed for later access
    toggle.themeToggleInstance = themeToggle;
  });

  // Log initialization in development only
  debug.log(`BSB Theme Toggle: Initialized ${toggles.length} toggle(s) 🎨`);
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeThemeToggles);
} else {
  initializeThemeToggles();
}

// Export for use in other scripts
window.BSBThemeToggle = BSBThemeToggle;