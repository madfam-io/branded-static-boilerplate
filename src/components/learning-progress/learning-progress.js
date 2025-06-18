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

// Constants
const CONSTANTS = {
  // Achievement thresholds
  EXPLORER_THRESHOLD: 5,
  ARCHITECT_THRESHOLD: 10,
  SESSION_TIME_THRESHOLD: 1800000, // 30 minutes in milliseconds
  ENGAGEMENT_THRESHOLD: 10,

  // Time values
  MS_PER_MINUTE: 60000,
  ACTIVITY_CHECK_INTERVAL: 60000, // 1 minute
  NOTIFICATION_DELAY: 3000,
  BADGE_ANIMATION_DELAY: 20,

  // UI values
  SCROLL_PADDING: 20,
  PROGRESS_UPDATE_DELAY: 100,
  PERCENTAGE_MAX: 100,

  // Learning values
  PATH_MIN_ITEMS: 3,
  PATH_DIVISOR: 2,
  SECONDS_PER_MINUTE: 60,
  MS_PER_SECOND: 1000,
  HOURS_PER_DAY: 24,
  MINUTES_PER_HOUR: 60,
  SECONDS_PER_HOUR: 3600,
  SECONDS_PER_DAY: 86400,
  MAX_ACTIVITY_LOG_SIZE: 20
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

    // Learning data structure
    this.progress = {
      componentsExplored: new Set(),
      conceptsLearned: new Set(),
      timeSpent: 0,
      lastActivity: Date.now(),
      achievements: new Set(),
      checkpoints: new Map(),
      activityLog: []
    };

    // Learning paths configuration
    this.learningPaths = {
      'html-structure': {
        name: 'HTML & Structure',
        icon: '🏗️',
        checkpoints: [
          {
            id: 'semantic-html',
            name: 'Explored semantic HTML elements',
            trigger: 'view-header'
          },
          {
            id: 'component-structure',
            name: 'Understood component structure',
            trigger: 'view-card'
          },
          {
            id: 'accessibility-markup',
            name: 'Learned accessibility markup',
            trigger: 'view-accessibility'
          }
        ]
      },
      'css-styling': {
        name: 'CSS & Styling',
        icon: '🎨',
        checkpoints: [
          {
            id: 'css-architecture',
            name: 'Understood CSS architecture',
            trigger: 'view-theme-toggle'
          },
          {
            id: 'responsive-design',
            name: 'Mastered responsive design',
            trigger: 'resize-viewport'
          },
          {
            id: 'css-variables',
            name: 'Used CSS custom properties',
            trigger: 'modify-css-vars'
          }
        ]
      },
      'javascript': {
        name: 'JavaScript & Interactivity',
        icon: '⚡',
        checkpoints: [
          {
            id: 'event-handling',
            name: 'Implemented event handling',
            trigger: 'playground-interact'
          },
          {
            id: 'component-state',
            name: 'Managed component state',
            trigger: 'toggle-component'
          },
          { id: 'es6-patterns', name: 'Applied ES6+ patterns', trigger: 'view-modern-js' }
        ]
      },
      'best-practices': {
        name: 'Best Practices',
        icon: '✨',
        checkpoints: [
          { id: 'performance', name: 'Optimized performance', trigger: 'check-metrics' },
          { id: 'security', name: 'Applied security practices', trigger: 'view-csp' },
          { id: 'testing', name: 'Understood testing approach', trigger: 'run-tests' }
        ]
      }
    };

    // Achievement definitions
    this.achievements = {
      'first-steps': {
        name: 'First Steps',
        icon: '👣',
        description: 'Explore your first component',
        condition: () => this.progress.componentsExplored.size >= 1
      },
      'explorer': {
        name: 'Explorer',
        icon: '🗺️',
        description: 'Explore 5 different components',
        condition: () => this.progress.componentsExplored.size >= CONSTANTS.EXPLORER_THRESHOLD
      },
      'completionist': {
        name: 'Completionist',
        icon: '🏆',
        description: 'Explore all components',
        condition: () => this.progress.componentsExplored.size >= CONSTANTS.ARCHITECT_THRESHOLD
      },
      'time-investor': {
        name: 'Time Investor',
        icon: '⏰',
        description: 'Spend 30 minutes learning',
        condition: () => this.progress.timeSpent >= CONSTANTS.SESSION_TIME_THRESHOLD
      },
      'code-reader': {
        name: 'Code Reader',
        icon: '📖',
        description: 'View source code 10 times',
        condition: () => this.getActivityCount('view-source') >= CONSTANTS.ARCHITECT_THRESHOLD
      },
      'playground-master': {
        name: 'Playground Master',
        icon: '🎮',
        description: 'Use the code playground 5 times',
        condition: () => this.getActivityCount('playground-use') >= CONSTANTS.EXPLORER_THRESHOLD
      }
    };

    this.init();
  }

  /**
   * Initialize the component
   * @method init
   */
  init() {
    this.loadProgress();
    this.createElements();
    this.setupEventListeners();
    this.startProgressTracking();
    this.updateDisplay();

    // Show welcome message on first visit
    if (this.progress.componentsExplored.size === 0) {
      this.logActivity('started', 'Started BSB learning journey!');
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
    // Simplified template - in production would load from HTML file
    return `
      <div class="bsb-learning-progress" data-bsb-component="learning-progress">
        <header class="bsb-learning-progress__header">
          <h3 class="bsb-learning-progress__title">
            <span class="bsb-learning-progress__icon">🎓</span>
            Your Learning Journey
          </h3>
          <button class="bsb-learning-progress__toggle" aria-label="Toggle panel">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" 
                 stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </header>
        
        <div class="bsb-learning-progress__content">
          <!-- Content sections will be dynamically populated -->
        </div>
      </div>
    `;
  }

  /**
   * Setup event listeners
   * @method setupEventListeners
   */
  setupEventListeners() {
    // Toggle minimize/maximize
    const header = this.element.querySelector('.bsb-learning-progress__header');
    header.addEventListener('click', () => this.toggleMinimize());

    // Track component views
    this.trackComponentViews();

    // Track source viewer usage
    this.trackSourceViewer();

    // Track playground usage
    this.trackPlayground();

    // Action buttons
    this.element.addEventListener('click', event => {
      const { action } = event.target.dataset;
      if (action) {
        this.handleAction(action);
      }
    });
  }

  /**
   * Track component views
   * @method trackComponentViews
   */
  trackComponentViews() {
    // Use MutationObserver to detect when components come into view
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const component = entry.target;
          const componentName = component.dataset.bsbComponent;

          if (componentName && !this.progress.componentsExplored.has(componentName)) {
            this.addComponentExplored(componentName);
          }
        }
      });
    }, { threshold: 0.5 });

    // Observe all BSB components
    document.querySelectorAll('[data-bsb-component]').forEach(component => {
      observer.observe(component);
    });
  }

  /**
   * Track source viewer usage
   * @method trackSourceViewer
   */
  trackSourceViewer() {
    document.addEventListener('bsb:source-viewer:open', event => {
      this.logActivity('view-source', `Viewed source for ${event.detail.componentName}`);
      this.checkAchievements();
    });
  }

  /**
   * Track playground usage
   * @method trackPlayground
   */
  trackPlayground() {
    document.addEventListener('bsb:playground:run', () => {
      this.logActivity('playground-use', 'Used code playground');
      this.addConceptLearned('interactive-coding');
      this.checkAchievements();
    });
  }

  /**
   * Start progress tracking
   * @method startProgressTracking
   */
  startProgressTracking() {
    // Update time spent every minute
    setInterval(() => {
      this.updateTimeSpent();
      this.saveProgress();
    }, CONSTANTS.ACTIVITY_CHECK_INTERVAL);

    // Track page visibility for accurate time
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.lastActivity = null;
      } else {
        this.lastActivity = Date.now();
      }
    });
  }

  /**
   * Add explored component
   * @method addComponentExplored
   * @param {string} componentName - Component name
   */
  addComponentExplored(componentName) {
    this.progress.componentsExplored.add(componentName);
    this.logActivity('explore', `Explored ${componentName} component`);

    // Check related checkpoints
    this.checkCheckpoints(`view-${componentName}`);

    // Check achievements
    this.checkAchievements();

    // Update display
    this.updateDisplay();

    // Save progress
    this.saveProgress();
  }

  /**
   * Add learned concept
   * @method addConceptLearned
   * @param {string} concept - Concept name
   */
  addConceptLearned(concept) {
    this.progress.conceptsLearned.add(concept);
    this.updateDisplay();
    this.saveProgress();
  }

  /**
   * Log activity
   * @method logActivity
   * @param {string} type - Activity type
   * @param {string} description - Activity description
   */
  logActivity(type, description) {
    const activity = {
      type,
      description,
      timestamp: Date.now(),
      icon: this.getActivityIcon(type)
    };

    this.progress.activityLog.unshift(activity);

    // Keep only recent activities
    if (this.progress.activityLog.length > CONSTANTS.MAX_ACTIVITY_LOG_SIZE) {
      this.progress.activityLog.pop();
    }

    this.updateActivityTimeline();
  }

  /**
   * Get activity icon
   * @method getActivityIcon
   * @param {string} type - Activity type
   * @returns {string} Icon emoji
   */
  getActivityIcon(type) {
    const icons = {
      'started': '🚀',
      'explore': '🔍',
      'view-source': '📖',
      'playground-use': '⚡',
      'achievement': '🏆',
      'checkpoint': '✅'
    };

    return icons[type] || '📌';
  }

  /**
   * Check checkpoints
   * @method checkCheckpoints
   * @param {string} trigger - Trigger event
   */
  checkCheckpoints(trigger) {
    Object.entries(this.learningPaths).forEach(([pathId, path]) => {
      path.checkpoints.forEach(checkpoint => {
        if (checkpoint.trigger === trigger && !this.progress.checkpoints.has(checkpoint.id)) {
          this.progress.checkpoints.set(checkpoint.id, true);
          this.logActivity('checkpoint', `Completed: ${checkpoint.name}`);
          this.updateLearningPaths();
        }
      });
    });
  }

  /**
   * Check achievements
   * @method checkAchievements
   */
  checkAchievements() {
    Object.entries(this.achievements).forEach(([id, achievement]) => {
      if (!this.progress.achievements.has(id) && achievement.condition()) {
        this.unlockAchievement(id, achievement);
      }
    });
  }

  /**
   * Unlock achievement
   * @method unlockAchievement
   * @param {string} id - Achievement ID
   * @param {Object} achievement - Achievement data
   */
  unlockAchievement(id, achievement) {
    this.progress.achievements.add(id);
    this.logActivity('achievement', `Unlocked: ${achievement.name}`);

    // Show notification
    this.showAchievementNotification(achievement);

    // Update display
    this.updateAchievements();

    // Save progress
    this.saveProgress();
  }

  /**
   * Show achievement notification
   * @method showAchievementNotification
   * @param {Object} achievement - Achievement data
   */
  showAchievementNotification(achievement) {
    const notification = document.createElement('div');
    notification.className = 'bsb-achievement-notification';
    notification.innerHTML = `
      <div class="bsb-achievement-notification__content">
        <span class="bsb-achievement-notification__icon">${achievement.icon}</span>
        <div>
          <h4>Achievement Unlocked!</h4>
          <p>${achievement.name}</p>
        </div>
      </div>
    `;

    // Style the notification
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--bsb-success, #10b981);
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      z-index: 10000;
      animation: achievement-pop 0.5s ease;
    `;

    document.body.appendChild(notification);

    // Remove after animation
    setTimeout(() => {
      notification.remove();
    }, CONSTANTS.NOTIFICATION_DELAY);
  }

  /**
   * Update time spent
   * @method updateTimeSpent
   */
  updateTimeSpent() {
    if (this.lastActivity && !document.hidden) {
      const elapsed = Date.now() - this.lastActivity;
      this.progress.timeSpent += elapsed;
      this.lastActivity = Date.now();
    }
  }

  /**
   * Get activity count
   * @method getActivityCount
   * @param {string} type - Activity type
   * @returns {number} Count
   */
  getActivityCount(type) {
    return this.progress.activityLog.filter(activity => activity.type === type).length;
  }

  /**
   * Update display
   * @method updateDisplay
   */
  updateDisplay() {
    this.updateStats();
    this.updateProgressBar();
    this.updateLearningPaths();
    this.updateActivityTimeline();
    this.updateAchievements();
    this.updateRecommendations();
  }

  /**
   * Update stats
   * @method updateStats
   */
  updateStats() {
    const stats = {
      'components-explored': this.progress.componentsExplored.size,
      'concepts-learned': this.progress.conceptsLearned.size,
      'time-spent': this.formatTime(this.progress.timeSpent)
    };

    Object.entries(stats).forEach(([key, value]) => {
      const element = this.element.querySelector(`[data-stat="${key}"]`);
      if (element) {
        element.textContent = value;
      }
    });
  }

  /**
   * Update progress bar
   * @method updateProgressBar
   */
  updateProgressBar() {
    const totalComponents = document.querySelectorAll('[data-bsb-component]').length;
    const progress = (this.progress.componentsExplored.size / totalComponents) *
      CONSTANTS.PERCENTAGE_MAX;

    const progressBar = this.element.querySelector('[data-progress-bar]');
    const progressText = this.element.querySelector('[data-progress-text]');

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (progressText) {
      progressText.textContent = `${Math.round(progress)}% Complete`;
    }
  }

  /**
   * Update learning paths
   * @method updateLearningPaths
   */
  updateLearningPaths() {
    Object.entries(this.learningPaths).forEach(([pathId, path]) => {
      const completedCount = path.checkpoints.filter(cp =>
        this.progress.checkpoints.has(cp.id)
      ).length;

      const progress = (completedCount / path.checkpoints.length) * CONSTANTS.PERCENTAGE_MAX;

      // Update progress display
      const progressElement = this.element.querySelector(`[data-path-progress="${pathId}"]`);
      if (progressElement) {
        progressElement.textContent = `${Math.round(progress)}%`;
      }

      // Update checkboxes
      path.checkpoints.forEach(checkpoint => {
        const checkbox = this.element.querySelector(`#checkpoint-${checkpoint.id}`);
        if (checkbox) {
          checkbox.checked = this.progress.checkpoints.has(checkpoint.id);
        }
      });
    });
  }

  /**
   * Update activity timeline
   * @method updateActivityTimeline
   */
  updateActivityTimeline() {
    const timeline = this.element.querySelector('[data-activity-timeline]');
    if (!timeline) {
      return;
    }

    timeline.innerHTML = this.progress.activityLog.slice(0, 5).map(activity => `
      <li class="bsb-learning-progress__timeline-item">
        <span class="bsb-learning-progress__timeline-icon">${activity.icon}</span>
        <div class="bsb-learning-progress__timeline-content">
          <p>${activity.description}</p>
          <time>${this.formatTimeAgo(activity.timestamp)}</time>
        </div>
      </li>
    `).join('');
  }

  /**
   * Update achievements
   * @method updateAchievements
   */
  updateAchievements() {
    const container = this.element.querySelector('[data-achievements]');
    if (!container) {
      return;
    }

    container.innerHTML = Object.entries(this.achievements).map(([id, achievement]) => {
      const isUnlocked = this.progress.achievements.has(id);

      return `
        <div class="bsb-learning-progress__badge ${
  isUnlocked ? 'bsb-learning-progress__badge--unlocked' :
    'bsb-learning-progress__badge--locked'
}">
          <span class="bsb-learning-progress__badge-icon">
            ${isUnlocked ? achievement.icon : '🔒'}
          </span>
          <span class="bsb-learning-progress__badge-name">${achievement.name}</span>
          <span class="bsb-learning-progress__badge-desc">${achievement.description}</span>
        </div>
      `;
    }).join('');
  }

  /**
   * Update recommendations
   * @method updateRecommendations
   */
  updateRecommendations() {
    const container = this.element.querySelector('[data-recommendations]');
    if (!container) {
      return;
    }

    const recommendations = this.getRecommendations();

    container.innerHTML = recommendations.map(rec => `
      <div class="bsb-learning-progress__recommendation">
        <span class="bsb-learning-progress__rec-icon">${rec.icon}</span>
        <div class="bsb-learning-progress__rec-content">
          <h5>${rec.title}</h5>
          <p>${rec.description}</p>
          <a href="${rec.link}" class="bsb-learning-progress__rec-action">Start Learning →</a>
        </div>
      </div>
    `).join('');
  }

  /**
   * Get personalized recommendations
   * @method getRecommendations
   * @returns {Array} Recommendations
   */
  getRecommendations() {
    const recommendations = [];

    // Recommend unexplored components
    const allComponents = Array.from(document.querySelectorAll('[data-bsb-component]'))
      .map(el => el.dataset.bsbComponent)
      .filter(name => !this.progress.componentsExplored.has(name));

    if (allComponents.length > 0) {
      const [nextComponent] = allComponents;
      recommendations.push({
        icon: '🔍',
        title: `Explore the ${nextComponent} Component`,
        description: 'Discover new patterns and techniques.',
        link: `#${nextComponent}`
      });
    }

    // Recommend based on incomplete paths
    Object.entries(this.learningPaths).forEach(([pathId, path]) => {
      const incomplete = path.checkpoints.find(cp => !this.progress.checkpoints.has(cp.id));
      if (incomplete) {
        recommendations.push({
          icon: path.icon,
          title: incomplete.name,
          description: `Continue your ${path.name} journey.`,
          link: '#'
        });
      }
    });

    // Playground recommendation
    if (this.getActivityCount('playground-use') < CONSTANTS.PATH_MIN_ITEMS) {
      recommendations.push({
        icon: '⚡',
        title: 'Try the Code Playground',
        description: 'Practice coding with instant feedback.',
        link: '/pages/interactive-playground.html'
      });
    }

    return recommendations.slice(0, CONSTANTS.PATH_MIN_ITEMS);
  }

  /**
   * Toggle minimize state
   * @method toggleMinimize
   */
  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
    this.element.classList.toggle('bsb-learning-progress--minimized', this.isMinimized);

    const content = this.element.querySelector('.bsb-learning-progress__content');
    const toggle = this.element.querySelector('.bsb-learning-progress__toggle');

    content.setAttribute('aria-hidden', this.isMinimized);
    toggle.setAttribute('aria-expanded', !this.isMinimized);
  }

  /**
   * Handle action buttons
   * @method handleAction
   * @param {string} action - Action name
   */
  handleAction(action) {
    switch (action) {
      case 'export-progress':
        this.exportProgress();
        break;
      case 'reset-progress':
        this.resetProgress();
        break;
      default:
        // Unknown action - no operation needed
        break;
    }
  }

  /**
   * Export progress data
   * @method exportProgress
   */
  exportProgress() {
    const exportData = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      progress: {
        componentsExplored: Array.from(this.progress.componentsExplored),
        conceptsLearned: Array.from(this.progress.conceptsLearned),
        timeSpent: this.progress.timeSpent,
        achievements: Array.from(this.progress.achievements),
        checkpoints: Array.from(this.progress.checkpoints.entries()),
        stats: {
          totalComponents: document.querySelectorAll('[data-bsb-component]').length,
          completionPercentage: Math.round(
            (this.progress.componentsExplored.size /
             document.querySelectorAll('[data-bsb-component]').length) *
            CONSTANTS.PERCENTAGE_MAX
          )
        }
      }
    };

    const blob = new Blob(
      [JSON.stringify(exportData, null, CONSTANTS.PATH_DIVISOR)],
      { type: 'application/json' }
    );
    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    const [datePart] = new Date().toISOString().split('T');
    downloadLink.download = `bsb-learning-progress-${datePart}.json`;
    downloadLink.click();

    URL.revokeObjectURL(url);
  }

  /**
   * Reset progress
   * @method resetProgress
   */
  resetProgress() {
    this.showResetConfirmation();
  }

  /**
   * Show reset confirmation dialog
   * @method showResetConfirmation
   */
  showResetConfirmation() {
    const confirmDialog = document.createElement('div');
    confirmDialog.className = 'learning-progress__confirm-dialog';
    confirmDialog.innerHTML = `
      <div class="learning-progress__confirm-backdrop"></div>
      <div class="learning-progress__confirm-content">
        <h3>Reset Learning Progress</h3>
        <p>Are you sure you want to reset all learning progress? This cannot be undone.</p>
        <div class="learning-progress__confirm-actions">
          <button class="learning-progress__confirm-cancel">Cancel</button>
          <button class="learning-progress__confirm-reset">Reset Progress</button>
        </div>
      </div>
    `;

    document.body.appendChild(confirmDialog);

    // Add event listeners
    const cancelBtn = confirmDialog.querySelector('.learning-progress__confirm-cancel');
    const resetBtn = confirmDialog.querySelector('.learning-progress__confirm-reset');
    const backdrop = confirmDialog.querySelector('.learning-progress__confirm-backdrop');

    const closeDialog = () => {
      document.body.removeChild(confirmDialog);
    };

    const confirmReset = () => {
      localStorage.removeItem('bsb-learning-progress');
      location.reload();
    };

    cancelBtn.addEventListener('click', closeDialog);
    resetBtn.addEventListener('click', confirmReset);
    backdrop.addEventListener('click', closeDialog);

    // Add escape key handler
    const escapeHandler = event => {
      if (event.key === 'Escape') {
        closeDialog();
        document.removeEventListener('keydown', escapeHandler);
      }
    };
    document.addEventListener('keydown', escapeHandler);

    // Add styles if not already added
    if (!document.querySelector('#learning-progress-confirm-styles')) {
      const styles = document.createElement('style');
      styles.id = 'learning-progress-confirm-styles';
      styles.textContent = `
        .learning-progress__confirm-dialog {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .learning-progress__confirm-backdrop {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
        }
        
        .learning-progress__confirm-content {
          position: relative;
          background: var(--bsb-bg-primary, white);
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          max-width: 400px;
          width: 90%;
        }
        
        .learning-progress__confirm-content h3 {
          margin: 0 0 12px 0;
          font-size: 1.25rem;
          color: var(--bsb-text-primary, #333);
        }
        
        .learning-progress__confirm-content p {
          margin: 0 0 20px 0;
          color: var(--bsb-text-secondary, #666);
          line-height: 1.5;
        }
        
        .learning-progress__confirm-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }
        
        .learning-progress__confirm-cancel,
        .learning-progress__confirm-reset {
          padding: 8px 16px;
          border: 1px solid;
          border-radius: 4px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .learning-progress__confirm-cancel {
          background: transparent;
          border-color: var(--bsb-border-color, #ccc);
          color: var(--bsb-text-secondary, #666);
        }
        
        .learning-progress__confirm-cancel:hover {
          background: var(--bsb-bg-secondary, #f5f5f5);
        }
        
        .learning-progress__confirm-reset {
          background: var(--bsb-error, #dc3545);
          border-color: var(--bsb-error, #dc3545);
          color: white;
        }
        
        .learning-progress__confirm-reset:hover {
          background: #c82333;
          border-color: #c82333;
        }
      `;
      document.head.appendChild(styles);
    }
  }

  /**
   * Save progress to localStorage
   * @method saveProgress
   */
  saveProgress() {
    const data = {
      componentsExplored: Array.from(this.progress.componentsExplored),
      conceptsLearned: Array.from(this.progress.conceptsLearned),
      timeSpent: this.progress.timeSpent,
      achievements: Array.from(this.progress.achievements),
      checkpoints: Array.from(this.progress.checkpoints.entries()),
      activityLog: this.progress.activityLog.slice(0, CONSTANTS.MAX_ACTIVITY_LOG_SIZE),
      lastSaved: Date.now()
    };

    localStorage.setItem('bsb-learning-progress', JSON.stringify(data));
  }

  /**
   * Load progress from localStorage
   * @method loadProgress
   */
  loadProgress() {
    try {
      const saved = localStorage.getItem('bsb-learning-progress');
      if (saved) {
        const data = JSON.parse(saved);

        this.progress.componentsExplored = new Set(data.componentsExplored || []);
        this.progress.conceptsLearned = new Set(data.conceptsLearned || []);
        this.progress.timeSpent = data.timeSpent || 0;
        this.progress.achievements = new Set(data.achievements || []);
        this.progress.checkpoints = new Map(data.checkpoints || []);
        this.progress.activityLog = data.activityLog || [];
      }
    } catch (error) {
      debug.warn('Failed to load learning progress:', error);
    }
  }

  /**
   * Format time duration
   * @method formatTime
   * @param {number} milliseconds - Time in milliseconds
   * @returns {string} Formatted time
   */
  formatTime(milliseconds) {
    const minutes = Math.floor(milliseconds / CONSTANTS.MS_PER_MINUTE);
    const hours = Math.floor(minutes / CONSTANTS.MINUTES_PER_HOUR);

    if (hours > 0) {
      return `${hours}h ${minutes % CONSTANTS.MINUTES_PER_HOUR}m`;
    }

    return `${minutes}m`;
  }

  /**
   * Format time ago
   * @method formatTimeAgo
   * @param {number} timestamp - Unix timestamp
   * @returns {string} Formatted time ago
   */
  formatTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / CONSTANTS.MS_PER_SECOND);

    if (seconds < CONSTANTS.SECONDS_PER_MINUTE) {
      return 'Just now';
    }
    if (seconds < CONSTANTS.SECONDS_PER_HOUR) {
      return `${Math.floor(seconds / CONSTANTS.SECONDS_PER_MINUTE)}m ago`;
    }
    if (seconds < CONSTANTS.SECONDS_PER_DAY) {
      return `${Math.floor(seconds / CONSTANTS.SECONDS_PER_HOUR)}h ago`;
    }

    return new Date(timestamp).toLocaleDateString();
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