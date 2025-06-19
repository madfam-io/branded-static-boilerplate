/**
 * Tutorial Hub Progress Manager
 * ============================
 *
 * Manages learning progress tracking, storage, and visualization
 */

// Progress constants
const PROGRESS_CONSTANTS = {
  PERCENTAGE_MAX: 100,
  MIN_COMPLETION: 10,
  FIRST_MILESTONE: 30,
  SECOND_MILESTONE: 60,
  THIRD_MILESTONE: 90,
  CIRCLE_RADIUS: 45,
  MIN_DURATION: 60,
  MID_DURATION: 100,
  MAX_DURATION: 95,
  DEFAULT_SCORE: 100
};

// Skill level thresholds
const SKILL_LEVEL_THRESHOLDS = {
  LEARNING_MAX: 2,
  INTERMEDIATE_MAX: 4,
  ADVANCED_MAX: 6
};

/**
 * Progress management class
 */
export class ProgressManager {
  constructor(tutorials) {
    this.tutorials = tutorials;
    this.progressData = this.loadProgress();
  }

  /**
   * Load progress data from localStorage
   * @returns {Object} Progress data object
   */
  loadProgress() {
    try {
      const saved = localStorage.getItem('bsb-learning-progress');
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.warn('Failed to load progress data:', error);
      return {};
    }
  }

  /**
   * Save progress data to localStorage
   */
  saveProgress() {
    try {
      localStorage.setItem('bsb-learning-progress', JSON.stringify(this.progressData));
    } catch (error) {
      console.warn('Failed to save progress data:', error);
    }
  }

  /**
   * Mark tutorial as completed
   * @param {string} tutorialId - Tutorial identifier
   * @param {number} score - Completion score (optional)
   */
  markTutorialCompleted(tutorialId, score = PROGRESS_CONSTANTS.DEFAULT_SCORE) {
    if (!this.progressData[tutorialId]) {
      this.progressData[tutorialId] = {};
    }

    this.progressData[tutorialId].completed = true;
    this.progressData[tutorialId].completedAt = Date.now();
    this.progressData[tutorialId].score = score;

    this.saveProgress();
  }

  /**
   * Update tutorial progress
   * @param {string} tutorialId - Tutorial identifier
   * @param {number} progress - Progress percentage (0-100)
   */
  updateTutorialProgress(tutorialId, progress) {
    if (!this.progressData[tutorialId]) {
      this.progressData[tutorialId] = {};
    }

    this.progressData[tutorialId].progress = Math.max(0, Math.min(PROGRESS_CONSTANTS.PERCENTAGE_MAX, progress));
    this.progressData[tutorialId].lastAccessed = Date.now();

    this.saveProgress();
  }

  /**
   * Get tutorial progress
   * @param {string} tutorialId - Tutorial identifier
   * @returns {Object} Tutorial progress data
   */
  getTutorialProgress(tutorialId) {
    return this.progressData[tutorialId] || {
      completed: false,
      progress: 0,
      score: 0,
      lastAccessed: null,
      completedAt: null
    };
  }

  /**
   * Get overall progress statistics
   * @returns {Object} Progress statistics
   */
  getProgressStats() {
    const completedTutorials = Object.values(this.progressData)
      .filter(progress => progress.completed);

    const completedCount = completedTutorials.length;

    const totalHours = Object.entries(this.progressData).reduce((total, [id, progress]) => {
      if (progress.completed) {
        const tutorial = this.tutorials.find(tutorial => tutorial.id === id);
        return total + (tutorial?.duration || 0);
      }
      return total;
    }, 0);

    const averageScore = completedCount > 0
      ? Math.round(completedTutorials.reduce((sum, progress) => sum + (progress.score || 0), 0) / completedCount)
      : 0;

    const overallPercentage = Math.round(
      (completedCount / this.tutorials.length) * PROGRESS_CONSTANTS.PERCENTAGE_MAX
    );

    const skillLevel = this.calculateSkillLevel(completedCount);

    return {
      completedCount,
      totalTutorials: this.tutorials.length,
      totalHours,
      averageScore,
      overallPercentage,
      skillLevel
    };
  }

  /**
   * Calculate skill level based on completed tutorials
   * @param {number} completedCount - Number of completed tutorials
   * @returns {string} Skill level
   */
  calculateSkillLevel(completedCount) {
    if (completedCount === 0) {
      return 'Beginner';
    }
    if (completedCount <= SKILL_LEVEL_THRESHOLDS.LEARNING_MAX) {
      return 'Learning';
    }
    if (completedCount <= SKILL_LEVEL_THRESHOLDS.INTERMEDIATE_MAX) {
      return 'Intermediate';
    }
    if (completedCount <= SKILL_LEVEL_THRESHOLDS.ADVANCED_MAX) {
      return 'Advanced';
    }
    return 'Expert';
  }

  /**
   * Update progress display elements
   */
  updateProgressDisplay() {
    this.updateProgressStats();
    this.updateProgressCircle();
  }

  /**
   * Update progress statistics in the UI
   */
  updateProgressStats() {
    const stats = this.getProgressStats();

    // Update completed count
    const completedElement = document.querySelector('.progress-stat--completed .stat-value');
    if (completedElement) {
      completedElement.textContent = `${stats.completedCount}/${stats.totalTutorials}`;
    }

    // Update hours learned
    const hoursElement = document.querySelector('.progress-stat--hours .stat-value');
    if (hoursElement) {
      hoursElement.textContent = `${stats.totalHours}h`;
    }

    // Update skill level
    const skillElement = document.querySelector('.progress-stat--skill .stat-value');
    if (skillElement) {
      skillElement.textContent = stats.skillLevel;
    }

    // Update percentage
    const percentageElement = document.querySelector('.progress-percentage');
    if (percentageElement) {
      percentageElement.textContent = `${stats.overallPercentage}%`;
    }
  }

  /**
   * Update progress circle visualization
   */
  updateProgressCircle() {
    const stats = this.getProgressStats();
    const progressCircle = document.querySelector('.progress-circle');

    if (!progressCircle) {
      return;
    }

    const circumference = SKILL_LEVEL_THRESHOLDS.LEARNING_MAX * Math.PI * PROGRESS_CONSTANTS.CIRCLE_RADIUS;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference * (1 - stats.overallPercentage / PROGRESS_CONSTANTS.PERCENTAGE_MAX);

    // Update SVG circle
    const circle = progressCircle.querySelector('circle.progress-ring');
    if (circle) {
      circle.style.strokeDasharray = strokeDasharray;
      circle.style.strokeDashoffset = strokeDashoffset;
    }

    // Update progress text
    const progressText = progressCircle.querySelector('.progress-text');
    if (progressText) {
      progressText.textContent = `${stats.overallPercentage}%`;
    }

    // Add milestone classes
    progressCircle.classList.remove('milestone-30', 'milestone-60', 'milestone-90');

    if (stats.overallPercentage >= PROGRESS_CONSTANTS.THIRD_MILESTONE) {
      progressCircle.classList.add('milestone-90');
    } else if (stats.overallPercentage >= PROGRESS_CONSTANTS.SECOND_MILESTONE) {
      progressCircle.classList.add('milestone-60');
    } else if (stats.overallPercentage >= PROGRESS_CONSTANTS.FIRST_MILESTONE) {
      progressCircle.classList.add('milestone-30');
    }
  }

  /**
   * Get learning path recommendations
   * @returns {Array} Recommended tutorials
   */
  getRecommendations() {
    const incomplete = this.tutorials.filter(tutorial => {
      const progress = this.getTutorialProgress(tutorial.id);
      return !progress.completed;
    });

    // Sort by difficulty and topic
    return incomplete.sort((tutorialA, tutorialB) => {
      const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
      return difficultyOrder[tutorialA.difficulty] - difficultyOrder[tutorialB.difficulty];
    });
  }

  /**
   * Reset all progress data
   */
  resetProgress() {
    this.progressData = {};
    this.saveProgress();
    this.updateProgressDisplay();
  }

  /**
   * Export progress data
   * @returns {Object} Complete progress data
   */
  exportProgress() {
    return {
      progressData: this.progressData,
      stats: this.getProgressStats(),
      exportedAt: Date.now()
    };
  }

  /**
   * Import progress data
   * @param {Object} data - Progress data to import
   */
  importProgress(data) {
    if (data && data.progressData) {
      this.progressData = data.progressData;
      this.saveProgress();
      this.updateProgressDisplay();
      return true;
    }
    return false;
  }
}