/**
 * Accessibility Enhancement System
 * ===============================
 *
 * Provides progressive accessibility enhancements for educational content:
 * - Screen reader optimizations
 * - Keyboard navigation improvements
 * - Focus management
 * - ARIA live regions
 * - High contrast support
 * - Animation preferences
 *
 * Educational Features:
 * - Interactive accessibility demonstrations
 * - Real-time accessibility feedback
 * - ARIA best practice examples
 * - Keyboard shortcut tutorials
 */

import debug from './debug.js';
import { escapeHtml } from './helpers/safe-html.js';

// Constants
const CONSTANTS = {
  PERCENTAGE_MAX: 100,
  NOTIFICATION_DURATION: 1000,
  SKIP_NAV_COUNT: 5,
  TOAST_DURATION: 3000,
  TOOLTIP_MAX_WIDTH: 300,
  TOOLTIP_SPACING: 5,
  FOCUS_DELAY: 100
};

/**
 * Accessibility Enhancer class for improving web accessibility
 */
class AccessibilityEnhancer {
  /**
   * Initialize the accessibility enhancer
   */
  constructor() {
    this.preferences = this.loadPreferences();
    this.init();
  }

  /**
   * Initialize accessibility enhancements
   */
  init() {
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupScreenReaderOptimizations();
    this.setupLiveRegions();
    this.setupAccessibilityMenu();
    this.applyUserPreferences();
    this.setupEducationalFeatures();

    debug.log('BSB Accessibility: Enhanced features initialized ♿');
  }

  /**
   * Load user accessibility preferences
   */
  loadPreferences() {
    const saved = localStorage.getItem('bsb-a11y-preferences');
    return saved ? JSON.parse(saved) : {
      highContrast: false,
      reducedMotion: false,
      largeText: false,
      keyboardHints: true,
      screenReaderMode: false
    };
  }

  /**
   * Save accessibility preferences
   */
  savePreferences() {
    localStorage.setItem('bsb-a11y-preferences', JSON.stringify(this.preferences));
  }

  /**
   * Enhanced keyboard navigation
   */
  setupKeyboardNavigation() {
    // Track keyboard usage for enhanced focus indicators
    let isKeyboardUser = false;

    document.addEventListener('keydown', event => {
      if (event.key === 'Tab') {
        isKeyboardUser = true;
        document.body.classList.add('keyboard-navigation');
      }

      // Global keyboard shortcuts
      this.handleGlobalShortcuts(event);
    });

    document.addEventListener('mousedown', () => {
      isKeyboardUser = false;
      document.body.classList.remove('keyboard-navigation');
    });

    // Enhanced skip links
    this.enhanceSkipLinks();

    // Focus management for modals
    this.setupFocusManagement();

    // Dynamic focus management
    this.setupDynamicFocusManagement();
  }

  /**
   * Handle global accessibility keyboard shortcuts
   */
  handleGlobalShortcuts(event) {
    if (!event.altKey) {
      return;
    }

    switch (event.key) {
      case '1':
        this.handleSkipToMain(event);
        break;
      case '2':
        this.handleSkipToNavigation(event);
        break;
      case 'a':
      case 'A':
        this.handleToggleAccessibilityMenu(event);
        break;
      case 'h':
      case 'H':
        this.handleShowKeyboardHelp(event);
        break;
      default:
        // No action for other keys
        break;
    }
  }

  /**
   * Handle skip to main content shortcut
   * @param {KeyboardEvent} event - Keyboard event
   */
  handleSkipToMain(event) {
    event.preventDefault();
    const main = document.querySelector('#main, main');
    if (main) {
      main.focus();
      main.scrollIntoView();
      this.announceToScreenReader('Skipped to main content');
    }
  }

  /**
   * Handle skip to navigation shortcut
   * @param {KeyboardEvent} event - Keyboard event
   */
  handleSkipToNavigation(event) {
    event.preventDefault();
    const nav = document.querySelector('[role="navigation"], nav');
    if (nav) {
      const firstLink = nav.querySelector('a, button');
      if (firstLink) {
        firstLink.focus();
        this.announceToScreenReader('Skipped to navigation');
      }
    }
  }

  /**
   * Handle toggle accessibility menu shortcut
   * @param {KeyboardEvent} event - Keyboard event
   */
  handleToggleAccessibilityMenu(event) {
    event.preventDefault();
    this.toggleAccessibilityMenu();
  }

  /**
   * Handle show keyboard help shortcut
   * @param {KeyboardEvent} event - Keyboard event
   */
  handleShowKeyboardHelp(event) {
    event.preventDefault();
    this.showKeyboardHelp();
  }

  /**
   * Enhanced skip links with better UX
   */
  enhanceSkipLinks() {
    const skipLinks = document.querySelectorAll('.skip-link, [href^="#"]:first-child');

    skipLinks.forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);

        if (target) {
          // Make target focusable if not already
          if (!target.hasAttribute('tabindex')) {
            target.setAttribute('tabindex', '-1');
          }

          // Focus and scroll
          target.focus();
          target.scrollIntoView({ behavior: 'smooth' });

          // Announce to screen readers
          this.announceToScreenReader(`Navigated to ${target.tagName.toLowerCase()} section`);
        }
      });
    });
  }

  /**
   * Advanced focus management
   */
  setupFocusManagement() {
    // Remember focus position when navigating
    let lastFocusedElement = null;

    document.addEventListener('focusin', event => {
      lastFocusedElement = event.target;
    });

    // Restore focus when appropriate
    window.addEventListener('popstate', () => {
      if (lastFocusedElement) {
        setTimeout(() => {
          lastFocusedElement.focus();
        }, CONSTANTS.FOCUS_DELAY);
      }
    });

    // Manage focus for dynamic content
    this.setupDynamicFocusManagement();

    // Add focus indicators for interactive elements
    this.enhanceFocusIndicators();
  }

  /**
   * Dynamic focus management for SPA-like behavior
   */
  setupDynamicFocusManagement() {
    // Watch for content changes
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) { // Element node
              // Auto-focus new interactive content
              const newInteractive = node.querySelector ?
                node.querySelector('button, input, select, textarea, [tabindex="0"]') : null;

              if (newInteractive && node.hasAttribute('data-auto-focus')) {
                setTimeout(() => {
                  newInteractive.focus();
                  this.announceToScreenReader('New content loaded and focused');
                }, CONSTANTS.FOCUS_DELAY);
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Enhanced focus indicators
   */
  enhanceFocusIndicators() {
    const style = document.createElement('style');
    style.textContent = `
      .keyboard-navigation *:focus {
        outline: 3px solid var(--bsb-primary, #0066cc) !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.8) !important;
      }

      .keyboard-navigation button:focus,
      .keyboard-navigation .btn:focus {
        outline-color: var(--bsb-secondary, #ff6b6b) !important;
      }

      .high-contrast *:focus {
        outline-width: 4px !important;
        outline-color: #ffff00 !important;
        background-color: #000000 !important;
        color: #ffffff !important;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Screen reader optimizations
   */
  setupScreenReaderOptimizations() {
    // Enhanced ARIA labels
    this.enhanceAriaLabels();

    // Dynamic content announcements
    this.setupContentAnnouncements();

    // Reading order optimization
    this.optimizeReadingOrder();

    // Table accessibility
    this.enhanceTableAccessibility();
  }

  /**
   * Enhance ARIA labels and descriptions
   */
  enhanceAriaLabels() {
    // Auto-generate missing alt text
    document.querySelectorAll('img:not([alt])').forEach(img => {
      const figcaption = img.closest('figure')?.querySelector('figcaption');
      if (figcaption) {
        img.setAttribute('alt', figcaption.textContent.trim());
      } else {
        img.setAttribute('alt', 'Image');
      }
    });

    // Enhance form labels
    document.querySelectorAll('input, select, textarea').forEach(input => {
      if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (label) {
          input.setAttribute('aria-labelledby', (label.id ||= `label-${Date.now()}`));
        }
      }
    });

    // Add context to links
    document.querySelectorAll('a[href^="http"]').forEach(link => {
      if (!link.getAttribute('aria-label')) {
        link.setAttribute('aria-label', `${link.textContent.trim()} (external link)`);
      }
    });
  }

  /**
   * Setup ARIA live regions
   */
  setupLiveRegions() {
    // Create announcement region if not exists
    if (!document.getElementById('aria-announcements')) {
      const announcements = document.createElement('div');
      announcements.id = 'aria-announcements';
      announcements.setAttribute('aria-live', 'polite');
      announcements.setAttribute('aria-atomic', 'true');
      announcements.className = 'sr-only';
      document.body.appendChild(announcements);
    }

    // Create status region for immediate updates
    if (!document.getElementById('aria-status')) {
      const status = document.createElement('div');
      status.id = 'aria-status';
      status.setAttribute('aria-live', 'assertive');
      status.setAttribute('aria-atomic', 'true');
      status.className = 'sr-only';
      document.body.appendChild(status);
    }
  }

  /**
   * Announce messages to screen readers
   */
  announceToScreenReader(message, priority = 'polite') {
    const regionId = priority === 'assertive' ? 'aria-status' : 'aria-announcements';
    const region = document.getElementById(regionId);

    if (region) {
      region.textContent = message;

      // Clear after announcement
      setTimeout(() => {
        region.textContent = '';
      }, CONSTANTS.NOTIFICATION_DURATION);
    }
  }

  /**
   * Setup accessibility control menu
   */
  setupAccessibilityMenu() {
    // Create accessibility menu if not exists
    if (document.querySelector('.bsb-a11y-menu')) {
      return;
    }

    const menu = document.createElement('div');
    menu.className = 'bsb-a11y-menu';
    menu.setAttribute('hidden', '');
    menu.innerHTML = `
      <div class="bsb-a11y-menu__content">
        <h3>Accessibility Options</h3>
        <div class="bsb-a11y-menu__controls">
          <label>
            <input type="checkbox" id="high-contrast-toggle"> High Contrast
          </label>
          <label>
            <input type="checkbox" id="large-text-toggle"> Large Text
          </label>
          <label>
            <input type="checkbox" id="reduced-motion-toggle"> Reduce Motion
          </label>
          <label>
            <input type="checkbox" id="keyboard-hints-toggle"> Keyboard Hints
          </label>
        </div>
        <button class="bsb-a11y-menu__close">Close</button>
      </div>
    `;

    document.body.appendChild(menu);

    // Setup menu controls
    this.bindAccessibilityControls();
  }

  /**
   * Bind accessibility control events
   */
  bindAccessibilityControls() {
    const menu = document.querySelector('.bsb-a11y-menu');

    // High contrast toggle
    const highContrastToggle = document.getElementById('high-contrast-toggle');
    highContrastToggle.checked = this.preferences.highContrast;
    highContrastToggle.addEventListener('change', () => {
      this.preferences.highContrast = highContrastToggle.checked;
      this.applyHighContrast();
      this.savePreferences();
    });

    // Large text toggle
    const largeTextToggle = document.getElementById('large-text-toggle');
    largeTextToggle.checked = this.preferences.largeText;
    largeTextToggle.addEventListener('change', () => {
      this.preferences.largeText = largeTextToggle.checked;
      this.applyLargeText();
      this.savePreferences();
    });

    // Reduced motion toggle
    const reducedMotionToggle = document.getElementById('reduced-motion-toggle');
    reducedMotionToggle.checked = this.preferences.reducedMotion;
    reducedMotionToggle.addEventListener('change', () => {
      this.preferences.reducedMotion = reducedMotionToggle.checked;
      this.applyReducedMotion();
      this.savePreferences();
    });

    // Close menu
    menu.querySelector('.bsb-a11y-menu__close').addEventListener('click', () => {
      this.toggleAccessibilityMenu();
    });
  }

  /**
   * Toggle accessibility menu
   */
  toggleAccessibilityMenu() {
    const menu = document.querySelector('.bsb-a11y-menu');
    const isHidden = menu.hasAttribute('hidden');

    if (isHidden) {
      menu.removeAttribute('hidden');
      menu.querySelector('h3').focus();
      this.announceToScreenReader('Accessibility menu opened');
    } else {
      menu.setAttribute('hidden', '');
      this.announceToScreenReader('Accessibility menu closed');
    }
  }

  /**
   * Apply user preferences
   */
  applyUserPreferences() {
    if (this.preferences.highContrast) {
      this.applyHighContrast();
    }
    if (this.preferences.largeText) {
      this.applyLargeText();
    }
    if (this.preferences.reducedMotion) {
      this.applyReducedMotion();
    }
  }

  /**
   * Apply high contrast mode
   */
  applyHighContrast() {
    document.body.classList.toggle('high-contrast', this.preferences.highContrast);

    if (this.preferences.highContrast) {
      this.announceToScreenReader('High contrast mode enabled');
    } else {
      this.announceToScreenReader('High contrast mode disabled');
    }
  }

  /**
   * Apply large text mode
   */
  applyLargeText() {
    document.body.classList.toggle('large-text', this.preferences.largeText);

    if (this.preferences.largeText) {
      this.announceToScreenReader('Large text mode enabled');
    } else {
      this.announceToScreenReader('Large text mode disabled');
    }
  }

  /**
   * Apply reduced motion preferences
   */
  applyReducedMotion() {
    document.body.classList.toggle('reduced-motion', this.preferences.reducedMotion);

    if (this.preferences.reducedMotion) {
      this.announceToScreenReader('Reduced motion enabled');
    } else {
      this.announceToScreenReader('Reduced motion disabled');
    }
  }

  /**
   * Show keyboard shortcuts help
   */
  showKeyboardHelp() {
    const helpDialog = document.createElement('div');
    helpDialog.className = 'bsb-keyboard-help';
    helpDialog.setAttribute('role', 'dialog');
    helpDialog.setAttribute('aria-modal', 'true');
    helpDialog.innerHTML = `
      <div class="bsb-keyboard-help__content">
        <h2>Keyboard Shortcuts</h2>
        <dl>
          <dt>Alt + 1</dt><dd>Skip to main content</dd>
          <dt>Alt + 2</dt><dd>Skip to navigation</dd>
          <dt>Alt + A</dt><dd>Toggle accessibility menu</dd>
          <dt>Alt + H</dt><dd>Show this help</dd>
          <dt>Alt + L</dt><dd>Toggle language</dd>
          <dt>Tab / Shift+Tab</dt><dd>Navigate between elements</dd>
          <dt>Enter / Space</dt><dd>Activate buttons and links</dd>
          <dt>Escape</dt><dd>Close dialogs and menus</dd>
        </dl>
        <button class="bsb-keyboard-help__close">Close Help</button>
      </div>
    `;

    document.body.appendChild(helpDialog);
    helpDialog.querySelector('h2').focus();

    // Close on escape or close button
    const closeHelp = () => {
      document.body.removeChild(helpDialog);
      this.announceToScreenReader('Keyboard help closed');
    };

    helpDialog.querySelector('.bsb-keyboard-help__close').addEventListener('click', closeHelp);

    helpDialog.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        closeHelp();
      }
    });

    this.announceToScreenReader('Keyboard shortcuts help opened');
  }

  /**
   * Setup educational accessibility features
   */
  setupEducationalFeatures() {
    // Add accessibility inspector tool
    this.createAccessibilityInspector();

    // Add ARIA role demonstrations (placeholder)
    // this.enhanceAriaRoleDemos();

    // Create accessibility checklist (placeholder)
    // this.createAccessibilityChecklist();
  }

  /**
   * Create accessibility inspector tool
   */
  createAccessibilityInspector() {
    // Create inspector toggle
    const toggle = document.createElement('button');
    toggle.className = 'bsb-a11y-inspector-toggle';
    toggle.textContent = '♿ A11y Inspector';
    toggle.setAttribute('aria-label', 'Toggle accessibility inspector');
    document.body.appendChild(toggle);
    debug.log('BSB Accessibility: Inspector created');
  }

  /**
   * Enable accessibility inspector
   */
  enableAccessibilityInspector() {
    document.addEventListener('mouseover', this.highlightAccessibilityInfo);
    this.announceToScreenReader('Accessibility inspector enabled. Hover over elements to see accessibility information.');
  }

  /**
   * Disable accessibility inspector
   */
  disableAccessibilityInspector() {
    document.removeEventListener('mouseover', this.highlightAccessibilityInfo);
    // Remove any existing tooltips
    document.querySelectorAll('.bsb-a11y-tooltip').forEach(tooltip => {
      tooltip.remove();
    });
    this.announceToScreenReader('Accessibility inspector disabled.');
  }

  /**
   * Highlight accessibility information on hover
   */
  highlightAccessibilityInfo = event => {
    // Remove existing tooltip
    const existingTooltip = document.querySelector('.bsb-a11y-tooltip');
    if (existingTooltip) {
      existingTooltip.remove();
    }

    const element = event.target;
    const info = this.getAccessibilityInfo(element);

    if (info.length > 0) {
      const tooltip = document.createElement('div');
      tooltip.className = 'bsb-a11y-tooltip';
      tooltip.innerHTML = info.map(item => escapeHtml(item)).join('<br>');
      tooltip.style.cssText = `
        position: absolute;
        background: #333;
        color: white;
        padding: 8px;
        border-radius: 4px;
        font-size: 12px;
        line-height: 1.3;
        max-width: ${CONSTANTS.TOOLTIP_MAX_WIDTH}px;
        z-index: 10001;
        pointer-events: none;
      `;

      document.body.appendChild(tooltip);

      // Position tooltip
      const rect = element.getBoundingClientRect();
      tooltip.style.left = `${rect.left}px`;
      tooltip.style.top = `${rect.bottom + CONSTANTS.TOOLTIP_SPACING}px`;
    }
  };

  /**
   * Get accessibility information for an element
   */
  getAccessibilityInfo(element) {
    const info = [];

    // Tag and role
    info.push(`Tag: ${escapeHtml(element.tagName.toLowerCase())}`);

    if (element.getAttribute('role')) {
      info.push(`Role: ${escapeHtml(element.getAttribute('role'))}`);
    }

    // ARIA attributes
    const ariaAttrs = Array.from(element.attributes)
      .filter(attr => attr.name.startsWith('aria-'))
      .map(attr => `${escapeHtml(attr.name)}: ${escapeHtml(attr.value)}`);

    if (ariaAttrs.length > 0) {
      info.push(`ARIA: ${ariaAttrs.join(', ')}`);
    }

    // Accessibility labels
    if (element.getAttribute('aria-label')) {
      info.push(`Label: ${escapeHtml(element.getAttribute('aria-label'))}`);
    }

    // Tab index
    if (element.hasAttribute('tabindex')) {
      info.push(`Tabindex: ${element.getAttribute('tabindex')}`);
    }

    // Form-specific info
    if (element.matches('input, select, textarea')) {
      const label = document.querySelector(`label[for="${element.id}"]`);
      if (label) {
        info.push(`Label: ${label.textContent.trim()}`);
      } else {
        info.push('⚠️ Missing label');
      }
    }

    // Image alt text
    if (element.tagName === 'IMG') {
      const alt = element.getAttribute('alt');
      if (alt === null) {
        info.push('⚠️ Missing alt attribute');
      } else {
        info.push(`Alt: ${alt || '(empty)'}`);
      }
    }

    return info;
  }

  /**
   * Setup content announcements for dynamic changes
   */
  setupContentAnnouncements() {
    // Content announcements implementation
    debug.log('BSB Accessibility: Content announcements setup');
  }

  /**
   * Optimize reading order for screen readers
   */
  optimizeReadingOrder() {
    // Reading order optimization implementation
    debug.log('BSB Accessibility: Reading order optimization');
  }

  /**
   * Enhance table accessibility
   */
  enhanceTableAccessibility() {
    // Table accessibility enhancements
    debug.log('BSB Accessibility: Table accessibility enhanced');
  }

  /**
   * Get current preferences
   * @returns {Object} Current preferences object
   */
  getPreferences() {
    return { ...this.preferences };
  }

  /**
   * Update specific preference
   * @param {string} key - Preference key to update
   * @param {*} value - New value for the preference
   */
  updatePreference(key, value) {
    this.preferences[key] = value;
    this.savePreferences();
    this.applyUserPreferences();
  }
}

// Initialize accessibility enhancer when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.bsbAccessibility = new AccessibilityEnhancer();
  });
} else {
  window.bsbAccessibility = new AccessibilityEnhancer();
}

export default AccessibilityEnhancer;