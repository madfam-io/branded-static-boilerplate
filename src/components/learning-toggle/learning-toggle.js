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

// Constants
const CONSTANTS = {
  ANIMATION_DELAY: 1000,
  TRANSITION_DELAY: 400,
  NOTIFICATION_DURATION: 5000,
  FADE_DURATION: 300,
  DEBOUNCE_DELAY: 500,
  PROGRESS_MAX: 100,
  MS_PER_MINUTE: 60000,
  SECONDS_PER_MINUTE: 60
};

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
    }, CONSTANTS.ANIMATION_DELAY);
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
      default:
        // No action needed for other keys
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
    }, CONSTANTS.TRANSITION_DELAY);
  }

  /**
   * Enable learning mode
   */
  enableLearningMode() {
    this.isLearningMode = true;
    localStorage.setItem('bsb-dev-mode', 'true');
    localStorage.setItem('bsb-learning-mode', 'true');

    // Update UI immediately
    this.updateUI();

    // Add body class for immediate visual feedback
    document.body.setAttribute('data-learning-mode', 'true');

    // Show enhanced notification with meta-learning features
    this.showNotification({
      title: '🎓 Learning Mode Activated',
      message: 'Interactive learning features are now enabled. Explore components to view their source code, track your progress, and unlock achievements!',
      type: 'success',
      actions: [
        {
          text: 'View Progress',
          action: () => this.showLearningProgress(),
          primary: false
        },
        {
          text: 'Start Learning',
          action: () => this.initializeMetaLearning(),
          primary: true
        }
      ]
    });

    // Dispatch custom event
    this.dispatchLearningModeChange(true);

    // Initialize all meta-learning features
    this.initializeMetaLearning();
  }

  /**
   * Disable learning mode
   */
  disableLearningMode() {
    this.isLearningMode = false;
    localStorage.setItem('bsb-dev-mode', 'false');
    localStorage.setItem('bsb-learning-mode', 'false');

    // Update UI immediately
    this.updateUI();

    // Remove body class
    document.body.setAttribute('data-learning-mode', 'false');

    // Show notification
    this.showNotification({
      title: '📖 Learning Mode Deactivated',
      message: 'Learning features have been disabled. Your progress has been saved and will be available when you return.',
      type: 'info',
      actions: [
        {
          text: 'View Progress Summary',
          action: () => this.showProgressSummary(),
          primary: false
        },
        {
          text: 'Continue Without Learning',
          action: () => this.cleanupMetaLearning(),
          primary: true
        }
      ]
    });

    // Dispatch custom event
    this.dispatchLearningModeChange(false);

    // Cleanup meta-learning features
    this.cleanupMetaLearning();
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
    // Build aria-label with clear conditional logic
    const modeStatus = this.isLearningMode ? 'on' : 'off';
    const actionText = this.isLearningMode ? 'disable' : 'enable';
    this.button.setAttribute('aria-label', `Learning mode is ${modeStatus}. Click to ${actionText}.`);

    // Update container state
    this.container.setAttribute('data-learning-active', this.isLearningMode);
  }

  /**
   * Show notification with learning mode status
   */
  showNotification({ title, message, type = 'info', duration = CONSTANTS.NOTIFICATION_DURATION, actions = [] }) {
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
          setTimeout(() => notification.remove(), CONSTANTS.FADE_DURATION);
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

  /**
   * Initialize meta-learning features
   */
  async initializeMetaLearning() {
    try {
      // Load CSS for meta-learning components
      await this.loadMetaLearningStyles();

      // Initialize Source Viewer
      if (!window.BSBSourceViewer) {
        const module = await import('../source-viewer/source-viewer.js');
        window.BSBSourceViewer = new module.default();
      }
      window.BSBSourceViewer.addViewSourceButtons();

      // Initialize Learning Progress Tracker
      if (!window.BSBLearningProgress) {
        const module = await import('../learning-progress/learning-progress.js');
        window.BSBLearningProgress = new module.default();
      }

      // Initialize BSB Helper if available
      if (window.BSBHelper) {
        window.BSBHelper.init();
      }

      // Add educational tooltips
      this.addEducationalTooltips();

      // Log learning mode activation
      if (window.BSBLearningProgress) {
        window.BSBLearningProgress.logActivity('learning-mode', 'Learning mode activated');
      }

    } catch (error) {
      console.error('Failed to initialize meta-learning features:', error);
    }
  }

  /**
   * Load styles for meta-learning components
   */
  async loadMetaLearningStyles() {
    const components = ['source-viewer', 'learning-progress'];

    for (const component of components) {
      const cssId = `bsb-${component}-css`;
      if (!document.getElementById(cssId)) {
        const link = document.createElement('link');
        link.id = cssId;
        link.rel = 'stylesheet';
        link.href = `/branded-static-boilerplate/components/${component}/${component}.css`;
        document.head.appendChild(link);
      }
    }
  }

  /**
   * Add educational tooltips to components
   */
  addEducationalTooltips() {
    const tooltips = [
      { selector: '.bsb-header', tip: 'This header uses semantic HTML and responsive design patterns' },
      { selector: '.bsb-card', tip: 'Cards demonstrate BEM naming and component-based architecture' },
      { selector: '.bsb-hero', tip: 'Hero sections showcase CSS Grid and custom properties' },
      { selector: '[data-bsb-component]', tip: 'Click the </> button to view this component\'s source code' }
    ];

    tooltips.forEach(({ selector, tip }) => {
      document.querySelectorAll(selector).forEach(el => {
        el.setAttribute('data-learning-tooltip', tip);
        el.classList.add('bsb-has-tooltip');
      });
    });
  }

  /**
   * Cleanup meta-learning features
   */
  cleanupMetaLearning() {
    // Hide source viewer buttons
    document.querySelectorAll('.bsb-view-source-btn').forEach(btn => {
      btn.style.display = 'none';
    });

    // Hide learning progress tracker
    const progress = document.querySelector('.bsb-learning-progress');
    if (progress) {
      progress.style.display = 'none';
    }

    // Disable BSB Helper
    if (window.BSBHelper && window.BSBHelper.disable) {
      window.BSBHelper.disable();
    }

    // Remove educational tooltips
    document.querySelectorAll('[data-learning-tooltip]').forEach(el => {
      el.removeAttribute('data-learning-tooltip');
      el.classList.remove('bsb-has-tooltip');
    });
  }

  /**
   * Show learning progress panel
   */
  showLearningProgress() {
    const progress = document.querySelector('.bsb-learning-progress');
    if (progress) {
      progress.classList.remove('bsb-learning-progress--minimized');
      progress.scrollIntoView({ behavior: 'smooth', block: 'end' });
    } else {
      // Initialize if not yet loaded
      this.initializeMetaLearning().then(() => {
        setTimeout(() => this.showLearningProgress(), CONSTANTS.DEBOUNCE_DELAY);
      });
    }
  }

  /**
   * Show progress summary when disabling learning mode
   */
  showProgressSummary() {
    if (window.BSBLearningProgress) {
      const { progress } = window.BSBLearningProgress;
      const totalComponents = document.querySelectorAll('[data-bsb-component]').length;
      const completion = Math.round((progress.componentsExplored.size / totalComponents) * CONSTANTS.PROGRESS_MAX);

      this.showNotification({
        title: '📊 Your Learning Progress',
        message: `You've explored ${progress.componentsExplored.size} of ${totalComponents} components (${completion}% complete) and spent ${this.formatTime(progress.timeSpent)} learning. Great job!`,
        type: 'success',
        duration: 8000
      });
    }
  }

  /**
   * Format time for display
   */
  formatTime(milliseconds) {
    const minutes = Math.floor(milliseconds / CONSTANTS.MS_PER_MINUTE);
    const hours = Math.floor(minutes / CONSTANTS.SECONDS_PER_MINUTE);

    if (hours > 0) {
      return `${hours}h ${minutes % CONSTANTS.SECONDS_PER_MINUTE}m`;
    }

    return `${minutes}m`;
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const toggles = document.querySelectorAll('[data-bsb-component="learning-toggle"]');
  toggles.forEach(toggle => {
    const learningToggle = new BSBLearningToggle(toggle);
    // Store reference if needed for later access
    toggle.learningToggleInstance = learningToggle;
  });
});

// Add global styles for learning tooltips
const style = document.createElement('style');
style.textContent = `
  /* Learning mode tooltips */
  [data-learning-mode="true"] .bsb-has-tooltip {
    position: relative;
  }
  
  [data-learning-mode="true"] .bsb-has-tooltip::after {
    content: attr(data-learning-tooltip);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(-8px);
    background: var(--bsb-gray-900, #111827);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: var(--bsb-radius-sm, 6px);
    font-size: var(--bsb-text-sm, 0.875rem);
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease, transform 0.2s ease;
    z-index: 1000;
    max-width: 250px;
    white-space: normal;
    text-align: center;
  }
  
  [data-learning-mode="true"] .bsb-has-tooltip:hover::after {
    opacity: 1;
    transform: translateX(-50%) translateY(-12px);
  }
  
  /* View source buttons */
  .bsb-view-source-btn {
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .bsb-view-source-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;
document.head.appendChild(style);

// Export for module usage
window.BSBLearningToggle = BSBLearningToggle;

export default BSBLearningToggle;