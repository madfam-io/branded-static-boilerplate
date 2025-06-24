/**
 * BSB Achievement System
 * =====================
 *
 * Gamified learning experience that tracks user progress and awards achievements
 * for completing tutorials, challenges, and exploring components.
 */

import { getAchievementDefinitions } from './achievements/achievement-definitions.js';
import { injectAchievementStyles } from './achievements/achievement-styles.js';
import {
  createAchievementUI,
  updateAchievementList,
  showAchievementNotification,
  updateToggleBadge,
  toggleAchievementPanel,
  closeAchievementPanel,
  updateCategoryFilter
} from './achievements/achievement-ui.js';

// Constants
const CONSTANTS = {
  NOTIFICATION_DURATION: 4000,
  CODE_TIME_HOURS: 9,
  CODE_TIME_DAY: 22,
  TIMER_INTERVAL: 600000, // 10 minutes
  MIN_DURATION_TIME: 10,
  PERCENTAGE_MAX: 100
};

/**
 * Achievement system for gamified learning experience
 */
export class AchievementSystem {
  /**
   * Initialize the achievement system
   */
  constructor() {
    this.achievements = getAchievementDefinitions();
    this.userProgress = this.loadProgress();
    this.currentFilter = 'all';
    this.init();
  }

  /**
   * Initialize UI and event bindings
   */
  init() {
    injectAchievementStyles();
    createAchievementUI(this.userProgress);
    this.updateUI();
    this.bindEvents();
    this.checkInitialAchievements();
  }

  /**
   * Load user progress from localStorage
   * @returns {Object} User progress data
   */
  loadProgress() {
    const stored = localStorage.getItem('bsb-achievements');
    const defaultProgress = {
      achievements: {},
      totalPoints: 0,
      tutorialsCompleted: [],
      componentsViewed: [],
      codeRuns: 0,
      learningModeTime: 0,
      challengesCompleted: [],
      lastVisit: Date.now()
    };

    if (stored) {
      const parsedProgress = JSON.parse(stored);
      return { ...defaultProgress, ...parsedProgress };
    }

    return defaultProgress;
  }

  /**
   * Save user progress to localStorage
   */
  saveProgress() {
    localStorage.setItem('bsb-achievements', JSON.stringify(this.userProgress));
  }

  /**
   * Update all UI components
   */
  updateUI() {
    const unlockedCount = Object.values(this.userProgress.achievements || {})
      .filter(achievement => achievement.unlocked).length;

    updateToggleBadge(unlockedCount);
    updateAchievementList(this.achievements, this.userProgress, this.currentFilter);
  }

  /**
   * Bind event listeners for achievement system
   */
  bindEvents() {
    // Toggle achievement panel
    document.addEventListener('click', event => {
      if (event.target.closest('#achievement-toggle')) {
        this.togglePanel();
      } else if (event.target.id === 'close-achievements') {
        this.closePanel();
      } else if (event.target.closest('.category-filter')) {
        this.filterAchievements(event.target.dataset.type);
      }
    });

    // Close panel on escape
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        this.closePanel();
      }
    });

    // Listen for achievement triggers
    this.bindAchievementTriggers();
  }

  /**
   * Bind event listeners for achievement triggers
   */
  bindAchievementTriggers() {
    // Tutorial completion
    document.addEventListener('tutorial-completed', event => {
      this.recordAchievement('complete_tutorial', event.detail);
    });

    // Component viewing
    document.addEventListener('component-viewed', event => {
      this.recordAchievement('view_components', event.detail);
    });

    // Code execution
    document.addEventListener('code-executed', () => {
      this.recordAchievement('run_code');
    });

    // Theme changes
    document.addEventListener('theme-changed', event => {
      if (event.detail.theme === 'dark') {
        this.recordAchievement('use_dark_mode');
      }
    });

    // Language changes
    document.addEventListener('language-changed', () => {
      this.recordAchievement('switch_language');
    });
  }

  /**
   * Check for time-based achievements on initialization
   */
  checkInitialAchievements() {
    const hour = new Date().getHours();

    if (hour < CONSTANTS.CODE_TIME_HOURS) {
      this.recordAchievement('early_visit');
    } else if (hour >= CONSTANTS.CODE_TIME_DAY) {
      this.recordAchievement('late_visit');
    }
  }

  /**
   * Record an achievement trigger
   * @param {string} condition - Achievement condition
   * @param {*} data - Additional data for the achievement
   */
  recordAchievement(condition, data = null) {
    let shouldSave = false;

    Object.values(this.achievements).forEach(achievement => {
      if (achievement.condition === condition && !this.isUnlocked(achievement.id)) {
        if (this.checkAchievementCondition(achievement, data)) {
          this.unlockAchievement(achievement);
          shouldSave = true;
        }
      }
    });

    if (shouldSave) {
      this.saveProgress();
      this.updateUI();
    }
  }

  /**
   * Check if achievement condition is met
   * @param {Object} achievement - Achievement definition
   * @param {*} data - Additional data for checking
   * @returns {boolean} Whether condition is met
   */
  checkAchievementCondition(achievement, data) {
    const userAchievement = this.userProgress.achievements[achievement.id] || {
      ...achievement,
      progress: 0
    };

    switch (achievement.condition) {
      case 'complete_tutorial':
        return this.checkTutorialCondition(achievement, data);

      case 'view_components':
        return this.checkComponentViewCondition(achievement, data);

      case 'run_code':
        return this.checkCodeRunCondition(achievement);

      case 'learning_time':
        return this.checkLearningTimeCondition(achievement);

      default:
        return true; // Simple one-time achievements
    }
  }

  /**
   * Check tutorial completion condition
   * @param {Object} achievement - Achievement definition
   * @param {*} data - Tutorial data
   * @returns {boolean} Whether condition is met
   */
  checkTutorialCondition(achievement, data) {
    this.userProgress.tutorialsCompleted ||= [];
    if (data && !this.userProgress.tutorialsCompleted.includes(data.tutorialId)) {
      this.userProgress.tutorialsCompleted.push(data.tutorialId);
    }
    return this.userProgress.tutorialsCompleted.length >= (achievement.count || 1);
  }

  /**
   * Check component view condition
   * @param {Object} achievement - Achievement definition
   * @param {*} data - Component data
   * @returns {boolean} Whether condition is met
   */
  checkComponentViewCondition(achievement, data) {
    this.userProgress.componentsViewed ||= [];
    if (data && !this.userProgress.componentsViewed.includes(data.componentId)) {
      this.userProgress.componentsViewed.push(data.componentId);
    }
    return this.userProgress.componentsViewed.length >= (achievement.count || 1);
  }

  /**
   * Check code run condition
   * @param {Object} achievement - Achievement definition
   * @returns {boolean} Whether condition is met
   */
  checkCodeRunCondition(achievement) {
    this.userProgress.codeRuns = (this.userProgress.codeRuns || 0) + 1;
    return this.userProgress.codeRuns >= (achievement.count || 1);
  }

  /**
   * Check learning time condition
   * @param {Object} achievement - Achievement definition
   * @returns {boolean} Whether condition is met
   */
  checkLearningTimeCondition(achievement) {
    this.userProgress.learningModeTime = (this.userProgress.learningModeTime || 0) +
      CONSTANTS.MIN_DURATION_TIME;
    return this.userProgress.learningModeTime >= achievement.count;
  }

  /**
   * Unlock an achievement
   * @param {Object} achievement - Achievement to unlock
   */
  unlockAchievement(achievement) {
    if (!this.userProgress.achievements) {
      this.userProgress.achievements = {};
    }

    this.userProgress.achievements[achievement.id] = {
      ...achievement,
      unlocked: true,
      unlockedAt: Date.now()
    };

    this.userProgress.totalPoints = (this.userProgress.totalPoints || 0) + achievement.points;

    showAchievementNotification(achievement);
  }

  /**
   * Check if achievement is unlocked
   * @param {string} achievementId - Achievement ID
   * @returns {boolean} Whether achievement is unlocked
   */
  isUnlocked(achievementId) {
    return this.userProgress.achievements?.[achievementId]?.unlocked || false;
  }

  /**
   * Toggle achievement panel
   */
  togglePanel() {
    toggleAchievementPanel();
  }

  /**
   * Close achievement panel
   */
  closePanel() {
    closeAchievementPanel();
  }

  /**
   * Filter achievements by type
   * @param {string} type - Achievement type to filter by
   */
  filterAchievements(type) {
    this.currentFilter = type;
    updateCategoryFilter(type);
    updateAchievementList(this.achievements, this.userProgress, type);
  }

  /**
   * Get user statistics
   * @returns {Object} User statistics
   */
  getStats() {
    const unlockedAchievements = Object.values(this.userProgress.achievements || {})
      .filter(achievement => achievement.unlocked);

    return {
      totalPoints: this.userProgress.totalPoints || 0,
      unlockedCount: unlockedAchievements.length,
      totalAchievements: Object.keys(this.achievements).length,
      completionPercentage: Math.round(
        (unlockedAchievements.length / Object.keys(this.achievements).length) *
        CONSTANTS.PERCENTAGE_MAX
      )
    };
  }

  /**
   * Reset all progress (for testing/debugging)
   */
  resetProgress() {
    localStorage.removeItem('bsb-achievements');
    this.userProgress = this.loadProgress();
    this.updateUI();
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.bsbAchievements = new AchievementSystem();
});

// Export for manual initialization
export { AchievementSystem as default };