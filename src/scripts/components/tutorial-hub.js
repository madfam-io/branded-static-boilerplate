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

// Constants
const CONSTANTS = {
  PERCENTAGE_MAX: 100,
  MIN_COMPLETION: 10,
  FIRST_MILESTONE: 30,
  SECOND_MILESTONE: 60,
  THIRD_MILESTONE: 90,
  CIRCLE_DIVISOR: 2,
  CIRCLE_RADIUS: 45,
  MIN_DURATION: 60,
  MID_DURATION: 100,
  MAX_DURATION: 95,
  MS_PER_SECOND: 1000,
  SECONDS_PER_MINUTE: 60,
  FADE_DURATION: 300,
  TOAST_DURATION: 4000,
  NOTIFICATION_DELAY: 200
};

class TutorialHub {
  constructor() {
    this.tutorials = [
      {
        id: 'component-development',
        title: 'Component Development Mastery',
        difficulty: 'beginner',
        topic: 'html-css',
        duration: 6,
        url: './component-development.html'
      },
      {
        id: 'theming',
        title: 'CSS Theming & Design Systems',
        difficulty: 'beginner',
        topic: 'html-css',
        duration: 4,
        url: './theming.html'
      },
      {
        id: 'build-process',
        title: 'Modern Build Process Mastery',
        difficulty: 'intermediate',
        topic: 'tooling',
        duration: 5,
        url: './build-process.html'
      },
      {
        id: 'deployment',
        title: 'Deployment & CI/CD Excellence',
        difficulty: 'intermediate',
        topic: 'deployment',
        duration: 5,
        url: './deployment.html'
      },
      {
        id: 'performance',
        title: 'Performance Optimization Mastery',
        difficulty: 'intermediate',
        topic: 'optimization',
        duration: 8,
        url: './performance.html'
      },
      {
        id: 'accessibility',
        title: 'Accessibility Best Practices',
        difficulty: 'intermediate',
        topic: 'optimization',
        duration: 7,
        url: './accessibility.html'
      },
      {
        id: 'seo',
        title: 'SEO Optimization Mastery',
        difficulty: 'advanced',
        topic: 'optimization',
        duration: 6,
        url: './seo.html'
      }
    ];

    this.progressData = this.loadProgress();
    this.filteredTutorials = [...this.tutorials];

    this.init();
  }

  /**
   * Initialize the tutorial hub
   */
  init() {
    this.setupEventListeners();
    this.updateProgressDisplay();
    this.initializeFilters();
    this.setupProgressTracking();

    // Initialize any tutorial cards that are visible
    this.updateTutorialCards();

    console.log('📚 Tutorial Hub initialized with', this.tutorials.length, 'tutorials');
  }

  /**
   * Set up all event listeners
   */
  setupEventListeners() {
    // Filter controls
    const difficultyFilter = document.getElementById('difficulty-filter');
    const topicFilter = document.getElementById('topic-filter');
    const sortSelect = document.getElementById('sort-select');

    if (difficultyFilter) {
      difficultyFilter.addEventListener('change', () => this.applyFilters());
    }

    if (topicFilter) {
      topicFilter.addEventListener('change', () => this.applyFilters());
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', () => this.applySorting());
    }

    // Tutorial card interactions
    document.addEventListener('click', e => {
      if (e.target.closest('.tutorial-card')) {
        this.handleTutorialCardClick(e);
      }
    });

    // Learning path interactions
    document.addEventListener('click', e => {
      if (e.target.closest('.learning-path')) {
        this.handleLearningPathClick(e);
      }
    });

    // Progress circle animation trigger
    this.setupIntersectionObserver();
  }

  /**
   * Handle tutorial card clicks for analytics
   */
  handleTutorialCardClick(event) {
    const card = event.target.closest('.tutorial-card');
    const tutorialId = this.getTutorialIdFromCard(card);

    if (tutorialId && event.target.tagName === 'A') {
      this.trackEvent('tutorial_clicked', {
        tutorial_id: tutorialId,
        tutorial_title: this.getTutorialById(tutorialId)?.title,
        click_source: 'tutorial_hub'
      });
    }
  }

  /**
   * Handle learning path clicks
   */
  handleLearningPathClick(event) {
    const path = event.target.closest('.learning-path');
    const pathType = path?.dataset.path;

    if (pathType && event.target.tagName === 'A') {
      this.trackEvent('learning_path_clicked', {
        path_type: pathType,
        click_source: 'tutorial_hub'
      });
    }
  }

  /**
   * Apply filters to tutorial list
   */
  applyFilters() {
    const difficultyFilter = document.getElementById('difficulty-filter')?.value || 'all';
    const topicFilter = document.getElementById('topic-filter')?.value || 'all';

    this.filteredTutorials = this.tutorials.filter(tutorial => {
      const matchesDifficulty = difficultyFilter === 'all' || tutorial.difficulty === difficultyFilter;
      const matchesTopic = topicFilter === 'all' || tutorial.topic === topicFilter;

      return matchesDifficulty && matchesTopic;
    });

    this.applySorting();
    this.updateTutorialGrid();

    // Track filter usage
    this.trackEvent('tutorials_filtered', {
      difficulty_filter: difficultyFilter,
      topic_filter: topicFilter,
      results_count: this.filteredTutorials.length
    });
  }

  /**
   * Apply sorting to filtered tutorials
   */
  applySorting() {
    const sortBy = document.getElementById('sort-select')?.value || 'recommended';

    switch (sortBy) {
      case 'difficulty':
        this.filteredTutorials.sort((a, b) => {
          const difficultyOrder = { beginner: 0, intermediate: 1, advanced: 2 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        });
        break;

      case 'duration':
        this.filteredTutorials.sort((a, b) => a.duration - b.duration);
        break;

      case 'alphabetical':
        this.filteredTutorials.sort((a, b) => a.title.localeCompare(b.title));
        break;

      case 'recommended':
      default:
        // Keep original order (recommended learning sequence)
        this.filteredTutorials = this.tutorials.filter(tutorial =>
          this.filteredTutorials.find(filtered => filtered.id === tutorial.id)
        );
        break;
    }
  }

  /**
   * Update tutorial grid display
   */
  updateTutorialGrid() {
    const grid = document.querySelector('.tutorials-grid');
    if (!grid) {
      return;
    }

    const cards = grid.querySelectorAll('.tutorial-card');

    // Hide all cards first
    cards.forEach(card => {
      card.style.display = 'none';
    });

    // Show filtered cards
    this.filteredTutorials.forEach(tutorial => {
      const card = grid.querySelector(`[data-tutorial="${tutorial.id}"]`) ||
                   grid.querySelector(`[href*="${tutorial.id}"]`)?.closest('.tutorial-card');

      if (card) {
        card.style.display = 'flex';

        // Add animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        // Animate in
        requestAnimationFrame(() => {
          card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        });
      }
    });

    // Update results count
    this.updateResultsCount();
  }

  /**
   * Update results count display
   */
  updateResultsCount() {
    const totalTutorials = this.tutorials.length;
    const visibleTutorials = this.filteredTutorials.length;

    // Create or update results indicator
    let resultsIndicator = document.querySelector('.tutorial-results-count');
    if (!resultsIndicator) {
      resultsIndicator = document.createElement('div');
      resultsIndicator.className = 'tutorial-results-count';
      resultsIndicator.style.cssText = `
        margin-bottom: var(--spacing-md);
        font-size: var(--font-size-sm);
        color: var(--color-text-muted);
        text-align: center;
      `;

      const grid = document.querySelector('.tutorials-grid');
      if (grid) {
        grid.parentNode.insertBefore(resultsIndicator, grid);
      }
    }

    resultsIndicator.textContent = visibleTutorials === totalTutorials
      ? `Showing all ${totalTutorials} tutorials`
      : `Showing ${visibleTutorials} of ${totalTutorials} tutorials`;
  }

  /**
   * Initialize filter controls
   */
  initializeFilters() {
    // Set initial filter states
    const difficultyFilter = document.getElementById('difficulty-filter');
    const topicFilter = document.getElementById('topic-filter');
    const sortSelect = document.getElementById('sort-select');

    // Restore filter states from localStorage
    const savedFilters = localStorage.getItem('tutorial-hub-filters');
    if (savedFilters) {
      try {
        const filters = JSON.parse(savedFilters);
        if (difficultyFilter) {
          difficultyFilter.value = filters.difficulty || 'all';
        }
        if (topicFilter) {
          topicFilter.value = filters.topic || 'all';
        }
        if (sortSelect) {
          sortSelect.value = filters.sort || 'recommended';
        }
      } catch (error) {
        console.warn('Failed to restore filter state:', error);
      }
    }

    // Save filter states on change
    const saveFilters = () => {
      const filters = {
        difficulty: difficultyFilter?.value || 'all',
        topic: topicFilter?.value || 'all',
        sort: sortSelect?.value || 'recommended'
      };
      localStorage.setItem('tutorial-hub-filters', JSON.stringify(filters));
    };

    if (difficultyFilter) {
      difficultyFilter.addEventListener('change', saveFilters);
    }
    if (topicFilter) {
      topicFilter.addEventListener('change', saveFilters);
    }
    if (sortSelect) {
      sortSelect.addEventListener('change', saveFilters);
    }

    // Apply initial filters
    this.applyFilters();
  }

  /**
   * Load progress data from localStorage
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
   * Update progress display
   */
  updateProgressDisplay() {
    this.updateProgressStats();
    this.updateProgressCircle();
    this.updateTutorialCards();
  }

  /**
   * Update progress statistics
   */
  updateProgressStats() {
    const completedCount = Object.values(this.progressData).filter(p => p.completed).length;
    const totalHours = Object.entries(this.progressData).reduce((total, [id, progress]) => {
      if (progress.completed) {
        const tutorial = this.getTutorialById(id);
        return total + (tutorial?.duration || 0);
      }
      return total;
    }, 0);

    const skillLevel = this.calculateSkillLevel(completedCount);
    const overallPercentage = Math.round((completedCount / this.tutorials.length) * CONSTANTS.PERCENTAGE_MAX);

    // Update stat displays
    this.updateElement('[data-progress="tutorials-completed"]', completedCount);
    this.updateElement('[data-progress="hours-learned"]', totalHours);
    this.updateElement('[data-progress="skill-level"]', skillLevel);
    this.updateElement('[data-progress="overall-percentage"]', `${overallPercentage}%`);
  }

  /**
   * Calculate skill level based on completed tutorials
   */
  calculateSkillLevel(completedCount) {
    const total = this.tutorials.length;
    const percentage = (completedCount / total) * CONSTANTS.PERCENTAGE_MAX;

    if (percentage === 0) {
      return 'Beginner';
    }
    if (percentage < CONSTANTS.FIRST_MILESTONE) {
      return 'Learning';
    }
    if (percentage < CONSTANTS.SECOND_MILESTONE) {
      return 'Developing';
    }
    if (percentage < CONSTANTS.THIRD_MILESTONE) {
      return 'Proficient';
    }
    return 'Expert';
  }

  /**
   * Update progress circle visualization
   */
  updateProgressCircle() {
    const completedCount = Object.values(this.progressData).filter(p => p.completed).length;
    const percentage = (completedCount / this.tutorials.length) * CONSTANTS.PERCENTAGE_MAX;

    const progressCircle = document.querySelector('[data-progress-circle]');
    if (progressCircle) {
      const circumference = CONSTANTS.CIRCLE_DIVISOR * Math.PI * CONSTANTS.CIRCLE_RADIUS; // Radius = 45
      const offset = circumference - (percentage / CONSTANTS.PERCENTAGE_MAX) * circumference;

      progressCircle.style.strokeDashoffset = offset;
    }
  }

  /**
   * Update tutorial cards with progress
   */
  updateTutorialCards() {
    this.tutorials.forEach(tutorial => {
      const progress = this.progressData[tutorial.id] || { completed: false, timeSpent: 0 };
      const card = document.querySelector(`[data-tutorial="${tutorial.id}"]`);

      if (card) {
        this.updateTutorialCardProgress(card, tutorial, progress);
      }
    });
  }

  /**
   * Update individual tutorial card progress
   */
  updateTutorialCardProgress(card, tutorial, progress) {
    const progressBar = card.querySelector('.progress-bar__fill');
    const progressText = card.querySelector('.progress-text');

    if (progressBar && progressText) {
      const percentage = progress.completed ? CONSTANTS.PERCENTAGE_MAX :
        Math.min((progress.timeSpent / (tutorial.duration * CONSTANTS.SECONDS_PER_MINUTE)) * CONSTANTS.PERCENTAGE_MAX, CONSTANTS.MAX_DURATION);

      progressBar.style.width = `${percentage}%`;

      if (progress.completed) {
        progressText.textContent = 'Completed ✓';
        progressText.style.color = 'var(--color-success-600)';
        progressText.style.fontWeight = 'var(--font-weight-medium)';
      } else if (progress.timeSpent > 0) {
        progressText.textContent = `${Math.round(percentage)}% complete`;
      } else {
        progressText.textContent = 'Not started';
      }
    }
  }

  /**
   * Set up progress tracking for tutorials
   */
  setupProgressTracking() {
    // Track page visibility to measure time spent
    let startTime = Date.now();
    let isVisible = !document.hidden;

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && isVisible) {
        // Page became hidden, record time
        this.recordTimeSpent(Date.now() - startTime);
        isVisible = false;
      } else if (!document.hidden && !isVisible) {
        // Page became visible, restart timer
        startTime = Date.now();
        isVisible = true;
      }
    });

    // Record time on page unload
    window.addEventListener('beforeunload', () => {
      if (isVisible) {
        this.recordTimeSpent(Date.now() - startTime);
      }
    });
  }

  /**
   * Record time spent on current page
   */
  recordTimeSpent(timeMs) {
    const currentPath = window.location.pathname;
    const tutorial = this.tutorials.find(t => currentPath.includes(t.id));

    if (tutorial) {
      if (!this.progressData[tutorial.id]) {
        this.progressData[tutorial.id] = { completed: false, timeSpent: 0 };
      }

      this.progressData[tutorial.id].timeSpent += Math.round(timeMs / CONSTANTS.MS_PER_SECOND / CONSTANTS.SECONDS_PER_MINUTE); // Convert to minutes
      this.saveProgress();
    }
  }

  /**
   * Mark tutorial as completed
   */
  markTutorialCompleted(tutorialId) {
    if (!this.progressData[tutorialId]) {
      this.progressData[tutorialId] = { timeSpent: 0 };
    }

    this.progressData[tutorialId].completed = true;
    this.saveProgress();
    this.updateProgressDisplay();

    // Track completion
    this.trackEvent('tutorial_completed', {
      tutorial_id: tutorialId,
      tutorial_title: this.getTutorialById(tutorialId)?.title,
      time_spent: this.progressData[tutorialId].timeSpent
    });

    // Show completion celebration
    this.showCompletionCelebration(tutorialId);
  }

  /**
   * Show completion celebration
   */
  showCompletionCelebration(tutorialId) {
    const tutorial = this.getTutorialById(tutorialId);
    if (!tutorial) {
      return;
    }

    // Create celebration toast
    const toast = document.createElement('div');
    toast.className = 'completion-toast';
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--color-success-500);
      color: white;
      padding: var(--spacing-md) var(--spacing-lg);
      border-radius: var(--border-radius-md);
      box-shadow: var(--shadow-lg);
      z-index: 9999;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;

    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: var(--spacing-sm);">
        <span style="font-size: 1.2em;">🎉</span>
        <div>
          <div style="font-weight: var(--font-weight-bold);">Tutorial Completed!</div>
          <div style="font-size: var(--font-size-sm); opacity: 0.9;">${tutorial.title}</div>
        </div>
      </div>
    `;

    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(0)';
    });

    // Remove after delay
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), CONSTANTS.FADE_DURATION);
    }, CONSTANTS.TOAST_DURATION);
  }

  /**
   * Set up intersection observer for animations
   */
  setupIntersectionObserver() {
    if (!window.IntersectionObserver) {
      return;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('progress-circle')) {
            // Animate progress circle
            setTimeout(() => this.updateProgressCircle(), CONSTANTS.NOTIFICATION_DELAY);
          }
        }
      });
    }, { threshold: 0.5 });

    // Observe progress elements
    document.querySelectorAll('.progress-circle').forEach(el => {
      observer.observe(el);
    });
  }

  /**
   * Utility function to update element content
   */
  updateElement(selector, content) {
    const element = document.querySelector(selector);
    if (element) {
      element.textContent = content;
    }
  }

  /**
   * Get tutorial by ID
   */
  getTutorialById(id) {
    return this.tutorials.find(tutorial => tutorial.id === id);
  }

  /**
   * Get tutorial ID from card element
   */
  getTutorialIdFromCard(card) {
    const link = card.querySelector('a[href]');
    if (link) {
      const href = link.getAttribute('href');
      return this.tutorials.find(t => href.includes(t.id))?.id;
    }
    return null;
  }

  /**
   * Track analytics events
   */
  trackEvent(eventName, eventData = {}) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'Tutorial Hub',
        ...eventData
      });
    }

    // Console logging for development
    console.log(`📊 Event: ${eventName}`, eventData);
  }

  /**
   * Get recommended next tutorial
   */
  getRecommendedNext() {
    // Find first incomplete tutorial in recommended order
    for (const tutorial of this.tutorials) {
      const progress = this.progressData[tutorial.id];
      if (!progress || !progress.completed) {
        return tutorial;
      }
    }

    // All tutorials completed
    return null;
  }

  /**
   * Export progress data (for backup/sharing)
   */
  exportProgress() {
    const exportData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      progress: this.progressData,
      tutorials: this.tutorials.map(t => ({ id: t.id, title: t.title }))
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `bsb-learning-progress-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    this.trackEvent('progress_exported');
  }

  /**
   * Reset all progress (with confirmation)
   */
  resetProgress() {
    if (confirm('Are you sure you want to reset all learning progress? This cannot be undone.')) {
      this.progressData = {};
      this.saveProgress();
      this.updateProgressDisplay();

      this.trackEvent('progress_reset');

      alert('Learning progress has been reset.');
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize on tutorial hub page
  if (document.querySelector('.tutorials-grid') || document.querySelector('.learning-paths-grid')) {
    window.tutorialHub = new TutorialHub();
  }
});

// Expose for console debugging
window.TutorialHub = TutorialHub;