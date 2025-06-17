/**
 * BSB Learning Mode Toggle Component
 * ==================================
 *
 * Manages the educational learning mode functionality with a user-friendly toggle interface.
 * Integrates with the existing BSB learning mode system to provide easy activation/deactivation.
 *
 * Features:
 * - One-click toggle for learning mode on/off
 * - Visual feedback and state indicators
 * - Integration with existing learning mode system
 * - Accessibility compliant with proper ARIA attributes
 * - Smooth transitions and animations
 *
 * @author BSB Team
 * @version 1.0.0
 */

class BSBLearningToggle {
  constructor(container) {
    this.container = container;
    this.button = container.querySelector('[data-bsb-learning-button]');
    this.label = container.querySelector('[data-bsb-learning-label]');
    this.status = container.querySelector('[data-bsb-learning-status]');

    // State management
    this.isLearningMode = false;
    this.isToggling = false;

    // Bind methods
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleKeyboard = this.handleKeyboard.bind(this);

    this.init();
  }

  /**
   * Initialize the learning mode toggle
   */
  init() {
    this.detectLearningMode();
    this.updateUI();
    this.setupEventListeners();

    // Listen for external learning mode changes
    this.setupStorageListener();
  }

  /**
   * Detect current learning mode state
   */
  detectLearningMode() {
    this.isLearningMode = localStorage.getItem('bsb-dev-mode') === 'true';
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Button click to toggle learning mode
    this.button.addEventListener('click', this.handleButtonClick);

    // Keyboard support
    this.button.addEventListener('keydown', this.handleKeyboard);

    // Listen for storage changes (multi-tab sync)
    window.addEventListener('storage', event => {
      if (event.key === 'bsb-dev-mode') {
        this.detectLearningMode();
        this.updateUI();
      }
    });
  }

  /**
   * Set up storage listener for external changes
   */
  setupStorageListener() {
    // Check for changes every second (for console-based toggles)
    setInterval(() => {
      const currentState = localStorage.getItem('bsb-dev-mode') === 'true';
      if (currentState !== this.isLearningMode) {
        this.isLearningMode = currentState;
        this.updateUI();
      }
    }, 1000);
  }

  /**
   * Handle button click
   */
  handleButtonClick(event) {
    event.preventDefault();

    if (this.isToggling) {
      return; // Prevent rapid clicking
    }

    this.toggleLearningMode();
  }

  /**
   * Handle keyboard navigation
   */
  handleKeyboard(event) {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.toggleLearningMode();
        break;
    }
  }

  /**
   * Toggle learning mode on/off
   */
  toggleLearningMode() {
    this.isToggling = true;
    this.button.setAttribute('data-toggling', 'true');

    const newState = !this.isLearningMode;

    if (newState) {
      this.enableLearningMode();
    } else {
      this.disableLearningMode();
    }

    // Reset toggling state after animation
    setTimeout(() => {
      this.isToggling = false;
      this.button.removeAttribute('data-toggling');
    }, 400);
  }

  /**
   * Enable learning mode
   */
  enableLearningMode() {
    this.isLearningMode = true;
    localStorage.setItem('bsb-dev-mode', 'true');

    // Update UI immediately
    this.updateUI();

    // Add body class for immediate visual feedback
    document.body.setAttribute('data-learning-mode', 'true');

    // Show notification
    this.showNotification({
      title: '🎓 Learning Mode Activated',
      message: 'Interactive learning features are now enabled. Refresh the page to see all educational tools and tooltips.',
      type: 'success',
      actions: [
        {
          text: 'Refresh Page',
          action: () => window.location.reload(),
          primary: true
        }
      ]
    });

    // Dispatch custom event
    this.dispatchLearningModeChange(true);

    // Initialize learning features if BSBHelper is available
    if (window.BSBHelper) {
      window.BSBHelper.init();
    }
  }

  /**
   * Disable learning mode
   */
  disableLearningMode() {
    this.isLearningMode = false;
    localStorage.setItem('bsb-dev-mode', 'false');

    // Update UI immediately
    this.updateUI();

    // Remove body class
    document.body.setAttribute('data-learning-mode', 'false');

    // Show notification
    this.showNotification({
      title: '📖 Learning Mode Deactivated',
      message: 'Learning features have been disabled. Refresh the page to return to normal mode.',
      type: 'info',
      actions: [
        {
          text: 'Refresh Page',
          action: () => window.location.reload(),
          primary: true
        }
      ]
    });

    // Dispatch custom event
    this.dispatchLearningModeChange(false);

    // Hide learning features if BSBHelper is available
    if (window.BSBHelper && window.BSBHelper.disable) {
      window.BSBHelper.disable();
    }
  }

  /**
   * Update the toggle UI
   */
  updateUI() {
    // Update button state
    this.button.setAttribute('aria-pressed', this.isLearningMode);

    // Update label text
    this.label.textContent = this.isLearningMode ? 'On' : 'Off';

    // Update button title
    const title = this.isLearningMode
      ? 'Disable interactive learning features'
      : 'Enable interactive learning features';
    this.button.setAttribute('title', title);
    this.button.setAttribute('aria-label', `Learning mode is ${this.isLearningMode ? 'on' : 'off'}. Click to ${this.isLearningMode ? 'disable' : 'enable'}.`);

    // Update container state
    this.container.setAttribute('data-learning-active', this.isLearningMode);
  }

  /**
   * Show notification with learning mode status
   */
  showNotification({ title, message, type = 'info', duration = 5000, actions = [] }) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.bsb-learning-notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'bsb-learning-notification';
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');

    // Build notification content
    let actionsHTML = '';
    if (actions.length > 0) {
      actionsHTML = `
        <div class="bsb-learning-notification__actions" style="margin-top: 1rem; display: flex; gap: 0.5rem;">
          ${actions.map(action => `
            <button 
              class="btn btn--small ${action.primary ? 'btn--primary' : 'btn--secondary'}" 
              onclick="this.closest('.bsb-learning-notification').bsbAction_${actions.indexOf(action)}()"
            >
              ${action.text}
            </button>
          `).join('')}
        </div>
      `;
    }

    notification.innerHTML = `
      <button class="bsb-learning-notification__close" onclick="this.closest('.bsb-learning-notification').remove()" aria-label="Close notification">
        ×
      </button>
      <div class="bsb-learning-notification__title">${title}</div>
      <div class="bsb-learning-notification__text">${message}</div>
      ${actionsHTML}
    `;

    // Add action handlers
    actions.forEach((action, index) => {
      notification[`bsbAction_${index}`] = () => {
        action.action();
        notification.remove();
      };
    });

    // Add to page
    document.body.appendChild(notification);

    // Trigger show animation
    requestAnimationFrame(() => {
      notification.classList.add('bsb-learning-notification--show');
    });

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        if (notification.parentNode) {
          notification.classList.remove('bsb-learning-notification--show');
          setTimeout(() => notification.remove(), 300);
        }
      }, duration);
    }

    return notification;
  }

  /**
   * Dispatch learning mode change event
   */
  dispatchLearningModeChange(enabled) {
    const event = new CustomEvent('bsb:learningModeChange', {
      detail: {
        enabled,
        timestamp: Date.now()
      },
      bubbles: true
    });

    this.container.dispatchEvent(event);
  }

  /**
   * Get current learning mode state
   */
  isEnabled() {
    return this.isLearningMode;
  }

  /**
   * Programmatically enable learning mode
   */
  enable() {
    if (!this.isLearningMode) {
      this.enableLearningMode();
    }
  }

  /**
   * Programmatically disable learning mode
   */
  disable() {
    if (this.isLearningMode) {
      this.disableLearningMode();
    }
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const toggles = document.querySelectorAll('[data-bsb-component="learning-toggle"]');
  toggles.forEach(toggle => {
    new BSBLearningToggle(toggle);
  });
});

// Export for module usage
window.BSBLearningToggle = BSBLearningToggle;

export default BSBLearningToggle;