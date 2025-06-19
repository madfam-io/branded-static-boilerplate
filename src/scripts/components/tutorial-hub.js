/**
 * =============================================================================
 * TUTORIAL HUB COMPONENT
 * =============================================================================
 *
 * Interactive functionality for the tutorial hub page including:
 * - Progress tracking and visualization
 * - Tutorial filtering and sorting
 * - Learning path recommendations
 * - Local storage integration
 * - Analytics tracking
 *
 * 🎯 Features:
 * - Real-time progress updates
 * - Intelligent filtering system
 * - Accessibility-first interactions
 * - Performance optimized
 * - Educational progress gamification
 *
 * 📚 Educational Notes:
 * - Demonstrates modern JavaScript patterns
 * - Local storage for persistence
 * - Event delegation for performance
 * - Progressive enhancement approach
 * - Modular, reusable code structure
 * =============================================================================
 */

import { getTutorialData } from './tutorial-hub/tutorial-data.js';
import { FilterManager } from './tutorial-hub/filter-manager.js';
import { ProgressManager } from './tutorial-hub/progress-manager.js';
import { showResetConfirmation } from './tutorial-hub/reset-confirmation.js';

// Constants
const CONSTANTS = {
  FADE_DURATION: 300,
  TOAST_DURATION: 4000,
  NOTIFICATION_DELAY: 200,
  JSON_INDENT: 2,
  MS_PER_SECOND: 1000,
  SECONDS_PER_MINUTE: 60,
  MAX_ANALYTICS_EVENTS: 100
};

/**
 * Tutorial Hub management class
 */
class TutorialHub {
  /**
   * Initialize tutorial hub
   */
  constructor() {
    this.tutorials = getTutorialData();
    this.progressManager = new ProgressManager(this.tutorials);
    this.filterManager = new FilterManager(this.tutorials, filtered => {
      this.filteredTutorials = filtered;
      this.updateTutorialCards();
    });
    this.filteredTutorials = [...this.tutorials];

    this.init();
  }

  /**
   * Initialize the tutorial hub
   */
  init() {
    this.setupEventListeners();
    this.progressManager.updateProgressDisplay();
    this.setupProgressTracking();
    this.updateTutorialCards();
    this.setupIntersectionObserver();
  }

  /**
   * Set up all event listeners
   */
  setupEventListeners() {
    // Tutorial card interactions
    document.addEventListener('click', event => {
      if (event.target.closest('.tutorial-card')) {
        this.handleTutorialCardClick(event);
      }
    });

    // Learning path interactions
    document.addEventListener('click', event => {
      if (event.target.closest('.learning-path')) {
        this.handleLearningPathClick(event);
      }
    });

    // Reset button
    const resetButton = document.querySelector('[data-action="reset-progress"]');
    if (resetButton) {
      resetButton.addEventListener('click', () => this.handleResetProgress());
    }

    // Export/Import buttons
    const exportButton = document.querySelector('[data-action="export-progress"]');
    const importButton = document.querySelector('[data-action="import-progress"]');

    if (exportButton) {
      exportButton.addEventListener('click', () => this.exportProgress());
    }

    if (importButton) {
      importButton.addEventListener('click', () => this.importProgress());
    }
  }

  /**
   * Handle tutorial card clicks for analytics
   * @param {Event} event - Click event
   */
  handleTutorialCardClick(event) {
    const card = event.target.closest('.tutorial-card');
    const tutorialId = card?.dataset.tutorialId;

    if (tutorialId) {
      this.trackEvent('tutorial_card_click', { tutorialId });

      // Update last accessed time
      this.progressManager.updateTutorialProgress(tutorialId,
        this.progressManager.getTutorialProgress(tutorialId).progress || 0
      );
    }
  }

  /**
   * Handle learning path clicks
   * @param {Event} event - Click event
   */
  handleLearningPathClick(event) {
    const pathElement = event.target.closest('.learning-path');
    const pathType = pathElement?.dataset.pathType;

    if (pathType) {
      this.trackEvent('learning_path_click', { pathType });
    }
  }

  /**
   * Handle reset progress button click
   */
  handleResetProgress() {
    showResetConfirmation(() => {
      this.progressManager.resetProgress();
      this.trackEvent('progress_reset');
      this.showNotification('Learning progress has been reset.', 'success');
    });
  }

  /**
   * Setup progress tracking for external events
   */
  setupProgressTracking() {
    // Listen for tutorial completion events
    document.addEventListener('tutorial-completed', event => {
      const { tutorialId, score } = event.detail;
      this.progressManager.markTutorialCompleted(tutorialId, score);
      this.progressManager.updateProgressDisplay();
      this.updateTutorialCards();
      this.trackEvent('tutorial_completed', { tutorialId, score });
    });

    // Listen for progress updates
    document.addEventListener('tutorial-progress', event => {
      const { tutorialId, progress } = event.detail;
      this.progressManager.updateTutorialProgress(tutorialId, progress);
      this.updateTutorialCards();
    });
  }

  /**
   * Update tutorial cards display
   */
  updateTutorialCards() {
    const container = document.querySelector('.tutorial-grid');
    if (!container) {
      return;
    }

    const cardsHTML = this.filteredTutorials.map(tutorial => {
      const progress = this.progressManager.getTutorialProgress(tutorial.id);
      return this.generateTutorialCardHTML(tutorial, progress);
    }).join('');

    container.innerHTML = cardsHTML;
  }

  /**
   * Generate HTML for a tutorial card
   * @param {Object} tutorial - Tutorial data
   * @param {Object} progress - Progress data
   * @returns {string} Card HTML
   */
  generateTutorialCardHTML(tutorial, progress) {
    const difficultyClass = `difficulty-${tutorial.difficulty}`;
    const completedClass = progress.completed ? 'completed' : '';
    const progressPercentage = progress.progress || 0;

    return `
      <article class="tutorial-card ${difficultyClass} ${completedClass}" 
               data-tutorial-id="${tutorial.id}">
        <div class="tutorial-card__header">
          <span class="tutorial-card__difficulty">${tutorial.difficulty}</span>
          <span class="tutorial-card__duration">${tutorial.duration}h</span>
        </div>
        
        <div class="tutorial-card__content">
          <h3 class="tutorial-card__title">${tutorial.title}</h3>
          <div class="tutorial-card__progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progressPercentage}%"></div>
            </div>
            <span class="progress-text">${progressPercentage}%</span>
          </div>
        </div>
        
        <div class="tutorial-card__footer">
          <a href="${tutorial.url}" class="tutorial-card__link">
            ${progress.completed ? 'Review' : 'Start'} Tutorial
          </a>
        </div>
        
        ${progress.completed ? '<div class="tutorial-card__badge">✓</div>' : ''}
      </article>
    `;
  }

  /**
   * Setup intersection observer for animations
   */
  setupIntersectionObserver() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, { threshold: 0.1 });

    // Observe tutorial cards and progress elements
    const elements = document.querySelectorAll('.tutorial-card, .progress-circle, .stat-card');
    elements.forEach(el => observer.observe(el));
  }

  /**
   * Get tutorial by ID
   * @param {string} tutorialId - Tutorial identifier
   * @returns {Object|null} Tutorial object or null
   */
  getTutorialById(tutorialId) {
    return this.tutorials.find(tutorial => tutorial.id === tutorialId) || null;
  }

  /**
   * Show notification to user
   * @param {string} message - Notification message
   * @param {string} type - Notification type (success, error, info)
   */
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    notification.setAttribute('role', 'status');
    notification.setAttribute('aria-live', 'polite');

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
      notification.classList.add('notification--visible');
    }, CONSTANTS.NOTIFICATION_DELAY);

    // Auto-hide notification
    setTimeout(() => {
      notification.classList.remove('notification--visible');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, CONSTANTS.FADE_DURATION);
    }, CONSTANTS.TOAST_DURATION);
  }

  /**
   * Track analytics events
   * @param {string} eventName - Event name
   * @param {Object} eventData - Event data
   */
  trackEvent(eventName, eventData = {}) {
    // Send to analytics service
    if (window.gtag) {
      window.gtag('event', eventName, {
        custom_parameter_1: eventData.tutorialId || '',
        custom_parameter_2: eventData.pathType || '',
        value: eventData.score || 0
      });
    }

    // Store in local analytics
    const analytics = JSON.parse(localStorage.getItem('bsb-analytics') || '[]');
    analytics.push({
      event: eventName,
      data: eventData,
      timestamp: Date.now(),
      page: 'tutorial-hub'
    });

    // Keep only last events
    if (analytics.length > CONSTANTS.MAX_ANALYTICS_EVENTS) {
      analytics.splice(0, analytics.length - CONSTANTS.MAX_ANALYTICS_EVENTS);
    }

    localStorage.setItem('bsb-analytics', JSON.stringify(analytics));
  }

  /**
   * Export progress data
   */
  exportProgress() {
    try {
      const progressData = this.progressManager.exportProgress();
      const dataStr = JSON.stringify(progressData, null, CONSTANTS.JSON_INDENT);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `bsb-progress-${new Date().toISOString().split('T')[0]}.json`;
      link.click();

      this.showNotification('Progress data exported successfully!', 'success');
      this.trackEvent('progress_exported');
    } catch (error) {
      this.showNotification('Failed to export progress data.', 'error');
      console.error('Export failed:', error);
    }
  }

  /**
   * Import progress data
   */
  importProgress() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = event => {
      const file = event.target.files[0];
      if (!file) {
        return;
      }

      const reader = new FileReader();
      reader.onload = event => {
        try {
          const data = JSON.parse(event.target.result);
          if (this.progressManager.importProgress(data)) {
            this.updateTutorialCards();
            this.showNotification('Progress data imported successfully!', 'success');
            this.trackEvent('progress_imported');
          } else {
            this.showNotification('Invalid progress data format.', 'error');
          }
        } catch (error) {
          this.showNotification('Failed to import progress data.', 'error');
          console.error('Import failed:', error);
        }
      };

      reader.readAsText(file);
    };

    input.click();
  }

  /**
   * Get learning statistics
   * @returns {Object} Learning statistics
   */
  getStats() {
    return this.progressManager.getProgressStats();
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize if we're on the tutorial hub page
  if (document.querySelector('.tutorial-hub')) {
    window.tutorialHub = new TutorialHub();
  }
});

// Export for manual initialization
export { TutorialHub as default };