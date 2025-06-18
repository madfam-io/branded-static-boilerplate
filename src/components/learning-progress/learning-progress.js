/**
 * =============================================================================
 * LEARNING PROGRESS TRACKER - JavaScript Implementation
 * =============================================================================
 *
 * This component tracks and visualizes a user's learning journey through the
 * BSB codebase. It gamifies the learning experience with achievements,
 * progress tracking, and personalized recommendations.
 *
 * Educational Features:
 * - Tracks component exploration and time spent
 * - Awards achievements for learning milestones
 * - Provides personalized learning recommendations
 * - Visualizes progress through learning paths
 * - Stores progress locally for persistence
 *
 * Meta-Learning Implementation:
 * - Monitors which components are viewed
 * - Tracks source code viewing
 * - Measures engagement with tutorials
 * - Analyzes learning patterns
 * - Suggests optimal learning paths
 *
 * @class BSBLearningProgress
 * @version 1.0.0
 */

import { debug } from '../../scripts/core/debug.js';

import {
  trackComponentViews,
  trackSourceViewer,
  trackPlayground,
  startProgressTracking,
  logActivity,
  checkAchievements
} from './modules/progress-tracking.js';
import {
  getTemplate,
  updateUI,
  showAchievementNotification,
  formatTime,
  formatTimeAgo
} from './modules/progress-ui.js';
import {
  saveProgress,
  loadProgress,
  exportProgress,
  resetProgress
} from './modules/progress-storage.js';

// Constants
const CONSTANTS = {
  NOTIFICATION_DELAY: 3000,
  SCROLL_PADDING: 20
};

/**
 * Learning Progress Tracker Class
 * @class BSBLearningProgress
 */
class BSBLearningProgress {
  /**
   * Create a learning progress instance
   * @constructor
   */
  constructor() {
    this.element = null;
    this.isMinimized = false;
    this.startTime = Date.now();
    this.trackingInterval = null;
    this.componentObserver = null;

    // Load progress from storage
    this.progress = loadProgress();

    this.init();
  }

  /**
   * Initialize the component
   * @method init
   */
  init() {
    this.createElements();
    this.setupEventListeners();
    this.startTracking();
    this.updateDisplay();

    // Show welcome message on first visit
    if (this.progress.componentsExplored.size === 0) {
      logActivity(this.progress, 'started', 'Started BSB learning journey!');
    }

    debug.log('🎓 Learning Progress Tracker initialized');
  }

  /**
   * Create DOM elements
   * @method createElements
   */
  createElements() {
    // Check if element already exists
    this.element = document.querySelector('.bsb-learning-progress');
    if (this.element) {
      return;
    }

    // Create from template (simplified for demo)
    const template = this.getTemplate();
    const container = document.createElement('div');
    container.innerHTML = template;
    this.element = container.firstElementChild;

    document.body.appendChild(this.element);
  }

  /**
   * Get component template
   * @method getTemplate
   * @returns {string} HTML template
   */
  getTemplate() {
    return getTemplate(this.progress);
  }

  /**
   * Setup event listeners
   * @method setupEventListeners
   */
  setupEventListeners() {
    // Toggle minimize/maximize
    const header = this.element.querySelector('.bsb-learning-progress__header');
    header.addEventListener('click', () => this.toggleMinimize());

    // Setup tracking
    this.componentObserver = trackComponentViews(this.progress, componentName => {
      this.addComponentExplored(componentName);
    });

    trackSourceViewer(concept => {
      this.addConceptLearned(concept);
    });

    trackPlayground(concept => {
      this.addConceptLearned(concept);
    });

    // Action buttons
    this.element.addEventListener('click', event => {
      const { action } = event.target.dataset;
      if (action) {
        this.handleAction(action);
      }
    });
  }

  /**
   * Start progress tracking
   * @method startTracking
   */
  startTracking() {
    this.trackingInterval = startProgressTracking(this.progress, () => {
      this.saveProgress();
    });
  }

  /**
   * Update display with current progress
   * @method updateDisplay
   */
  updateDisplay() {
    updateUI(this.element, this.progress);
  }

  /**
   * Add explored component
   * @method addComponentExplored
   * @param {string} componentName - Component name
   */
  addComponentExplored(componentName) {
    this.progress.componentsExplored.add(componentName);
    logActivity(this.progress, 'component', `Explored ${componentName} component`);

    // Check for new achievements
    const newAchievements = checkAchievements(this.progress);
    newAchievements.forEach(achievement => {
      showAchievementNotification(achievement);
    });

    this.updateDisplay();
    saveProgress(this.progress);
  }

  /**
   * Add learned concept
   * @method addConceptLearned
   * @param {string} concept - Concept name
   */
  addConceptLearned(concept) {
    this.progress.conceptsLearned.add(concept);
    logActivity(this.progress, 'concept', `Learned ${concept}`);

    const newAchievements = checkAchievements(this.progress);
    newAchievements.forEach(achievement => {
      showAchievementNotification(achievement);
    });

    this.updateDisplay();
    saveProgress(this.progress);
  }

  /**
   * Toggle minimize state
   * @method toggleMinimize
   */
  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
    this.element.classList.toggle('bsb-learning-progress--minimized', this.isMinimized);
  }

  /**
   * Handle action button clicks
   * @method handleAction
   * @param {string} action - Action to perform
   */
  handleAction(action) {
    switch (action) {
      case 'export-progress':
        exportProgress(this.progress);
        break;
      case 'reset-progress':
        this.showResetConfirmation();
        break;
      case 'toggle-minimize':
        this.toggleMinimize();
        break;
      default:
        break;
    }
  }

  /**
   * Show reset confirmation dialog
   * @method showResetConfirmation
   */
  async showResetConfirmation() {
    const confirmed = confirm('Are you sure you want to reset all learning progress? This cannot be undone.');

    if (confirmed) {
      resetProgress();
      this.progress = loadProgress();
      this.updateDisplay();
    }
  }

  /**
   * Cleanup resources when component is destroyed
   * @method cleanup
   */
  cleanup() {
    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
    }

    if (this.componentObserver) {
      this.componentObserver.disconnect();
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Only initialize in learning mode
    if (localStorage.getItem('bsb-learning-mode') === 'true') {
      window.BSBLearningProgress = new BSBLearningProgress();
    }
  });
} else if (localStorage.getItem('bsb-learning-mode') === 'true') {
  window.BSBLearningProgress = new BSBLearningProgress();
}

// Export for use in other modules
export default BSBLearningProgress;