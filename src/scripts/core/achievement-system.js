/**
 * BSB Achievement System
 * =====================
 * 
 * Gamified learning experience that tracks user progress and awards achievements
 * for completing tutorials, challenges, and exploring components.
 */

export class AchievementSystem {
  constructor() {
    this.achievements = this.initializeAchievements();
    this.userProgress = this.loadProgress();
    this.init();
  }

  init() {
    this.createAchievementUI();
    this.bindEvents();
    this.checkInitialAchievements();
  }

  initializeAchievements() {
    return {
      // Tutorial Completion Achievements
      'first-tutorial': {
        id: 'first-tutorial',
        title: 'Getting Started',
        description: 'Complete your first tutorial',
        icon: '🎯',
        points: 10,
        type: 'tutorial',
        unlocked: false,
        condition: 'complete_tutorial',
        count: 1
      },
      
      'tutorial-master': {
        id: 'tutorial-master',
        title: 'Tutorial Master',
        description: 'Complete 5 tutorials',
        icon: '🎓',
        points: 50,
        type: 'tutorial',
        unlocked: false,
        condition: 'complete_tutorial',
        count: 5
      },
      
      'css-ninja': {
        id: 'css-ninja',
        title: 'CSS Ninja',
        description: 'Complete all CSS tutorials (Grid + Flexbox)',
        icon: '🥷',
        points: 75,
        type: 'tutorial',
        unlocked: false,
        condition: 'complete_css_tutorials'
      },
      
      // Component Exploration Achievements
      'component-explorer': {
        id: 'component-explorer',
        title: 'Component Explorer',
        description: 'View 10 different components',
        icon: '🔍',
        points: 25,
        type: 'exploration',
        unlocked: false,
        condition: 'view_components',
        count: 10
      },
      
      'playground-enthusiast': {
        id: 'playground-enthusiast',
        title: 'Playground Enthusiast',
        description: 'Run code in the playground 25 times',
        icon: '⚡',
        points: 30,
        type: 'interaction',
        unlocked: false,
        condition: 'run_code',
        count: 25
      },
      
      // Learning Mode Achievements
      'learning-advocate': {
        id: 'learning-advocate',
        title: 'Learning Advocate',
        description: 'Use learning mode for 10 minutes',
        icon: '📚',
        points: 20,
        type: 'engagement',
        unlocked: false,
        condition: 'learning_time',
        count: 600000 // 10 minutes in milliseconds
      },
      
      // Accessibility Achievements
      'accessibility-champion': {
        id: 'accessibility-champion',
        title: 'Accessibility Champion',
        description: 'Complete the accessibility tutorial',
        icon: '♿',
        points: 40,
        type: 'tutorial',
        unlocked: false,
        condition: 'complete_accessibility'
      },
      
      // Special Achievements
      'dark-mode-fan': {
        id: 'dark-mode-fan',
        title: 'Dark Mode Fan',
        description: 'Switch to dark mode',
        icon: '🌙',
        points: 5,
        type: 'interaction',
        unlocked: false,
        condition: 'use_dark_mode'
      },
      
      'bilingual': {
        id: 'bilingual',
        title: 'Bilingual',
        description: 'Switch languages',
        icon: '🌐',
        points: 5,
        type: 'interaction',
        unlocked: false,
        condition: 'switch_language'
      },
      
      'perfectionist': {
        id: 'perfectionist',
        title: 'Perfectionist',
        description: 'Complete a challenge without hints',
        icon: '💎',
        points: 100,
        type: 'challenge',
        unlocked: false,
        condition: 'perfect_challenge'
      },
      
      // Time-based Achievements
      'early-bird': {
        id: 'early-bird',
        title: 'Early Bird',
        description: 'Visit BSB before 9 AM',
        icon: '🌅',
        points: 15,
        type: 'special',
        unlocked: false,
        condition: 'early_visit'
      },
      
      'night-owl': {
        id: 'night-owl',
        title: 'Night Owl',
        description: 'Visit BSB after 10 PM',
        icon: '🦉',
        points: 15,
        type: 'special',
        unlocked: false,
        condition: 'late_visit'
      }
    };
  }

  loadProgress() {
    const stored = localStorage.getItem('bsb-achievements');
    const defaultProgress = {
      unlockedAchievements: [],
      totalPoints: 0,
      tutorialsCompleted: [],
      componentsViewed: [],
      codeRuns: 0,
      learningModeTime: 0,
      challengesCompleted: [],
      lastVisit: Date.now()
    };
    
    return stored ? { ...defaultProgress, ...JSON.parse(stored) } : defaultProgress;
  }

  saveProgress() {
    localStorage.setItem('bsb-achievements', JSON.stringify(this.userProgress));
  }

  createAchievementUI() {
    // Create achievement notification element
    const notification = document.createElement('div');
    notification.id = 'achievement-notification';
    notification.className = 'achievement-notification hidden';
    notification.setAttribute('role', 'status');
    notification.setAttribute('aria-live', 'polite');
    
    document.body.appendChild(notification);

    // Create achievement panel toggle
    const toggle = document.createElement('button');
    toggle.id = 'achievement-toggle';
    toggle.className = 'achievement-toggle';
    toggle.innerHTML = `
      <span class="achievement-icon">🏆</span>
      <span class="achievement-count">${this.userProgress.unlockedAchievements.length}</span>
    `;
    toggle.setAttribute('aria-label', `View achievements (${this.userProgress.unlockedAchievements.length} unlocked)`);
    
    // Create achievement panel
    const panel = document.createElement('div');
    panel.id = 'achievement-panel';
    panel.className = 'achievement-panel hidden';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-labelledby', 'achievement-title');
    
    panel.innerHTML = this.generatePanelHTML();
    
    document.body.appendChild(toggle);
    document.body.appendChild(panel);

    // Add styles
    this.addAchievementStyles();
  }

  generatePanelHTML() {
    const totalPoints = this.userProgress.totalPoints;
    const unlockedCount = this.userProgress.unlockedAchievements.length;
    const totalCount = Object.keys(this.achievements).length;
    
    let achievementsList = '';
    Object.values(this.achievements).forEach(achievement => {
      const isUnlocked = this.userProgress.unlockedAchievements.includes(achievement.id);
      const className = isUnlocked ? 'achievement-item unlocked' : 'achievement-item locked';
      
      achievementsList += `
        <div class="${className}">
          <div class="achievement-icon">${achievement.icon}</div>
          <div class="achievement-info">
            <h4 class="achievement-title">${achievement.title}</h4>
            <p class="achievement-description">${achievement.description}</p>
            <div class="achievement-points">${achievement.points} points</div>
          </div>
          ${isUnlocked ? '<div class="achievement-badge">✓</div>' : '<div class="achievement-badge">🔒</div>'}
        </div>
      `;
    });

    return `
      <div class="achievement-header">
        <h2 id="achievement-title">Achievements</h2>
        <button id="close-achievements" aria-label="Close achievements panel">×</button>
      </div>
      
      <div class="achievement-stats">
        <div class="stat">
          <div class="stat-value">${totalPoints}</div>
          <div class="stat-label">Total Points</div>
        </div>
        <div class="stat">
          <div class="stat-value">${unlockedCount}/${totalCount}</div>
          <div class="stat-label">Unlocked</div>
        </div>
        <div class="stat">
          <div class="stat-value">${Math.round((unlockedCount / totalCount) * 100)}%</div>
          <div class="stat-label">Complete</div>
        </div>
      </div>
      
      <div class="achievement-categories">
        <button class="category-filter active" data-type="all">All</button>
        <button class="category-filter" data-type="tutorial">Tutorials</button>
        <button class="category-filter" data-type="interaction">Interactive</button>
        <button class="category-filter" data-type="special">Special</button>
      </div>
      
      <div class="achievement-list">
        ${achievementsList}
      </div>
    `;
  }

  addAchievementStyles() {
    const styles = `
      <style>
        .achievement-toggle {
          position: fixed;
          top: 50%;
          right: 20px;
          background: var(--bsb-primary);
          color: white;
          border: none;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          cursor: pointer;
          box-shadow: var(--bsb-shadow-lg);
          z-index: var(--bsb-z-40);
          transition: all var(--bsb-transition-base);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }
        
        .achievement-toggle:hover {
          transform: scale(1.1);
          box-shadow: var(--bsb-shadow-xl);
        }
        
        .achievement-count {
          font-size: 0.75rem;
          background: var(--bsb-error);
          border-radius: 10px;
          padding: 2px 6px;
          position: absolute;
          top: -5px;
          right: -5px;
          min-width: 20px;
          text-align: center;
        }
        
        .achievement-panel {
          position: fixed;
          top: 50%;
          right: 20px;
          transform: translateY(-50%);
          background: var(--bsb-bg-primary);
          border: 1px solid var(--bsb-border-color);
          border-radius: var(--bsb-radius-lg);
          box-shadow: var(--bsb-shadow-xl);
          width: 400px;
          max-height: 80vh;
          overflow-y: auto;
          z-index: var(--bsb-z-50);
          animation: slideIn 0.3s ease-out;
        }
        
        .achievement-panel.hidden {
          display: none;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-50%) translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateY(-50%) translateX(0);
          }
        }
        
        .achievement-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid var(--bsb-border-color);
        }
        
        .achievement-header h2 {
          margin: 0;
          color: var(--bsb-text-primary);
        }
        
        #close-achievements {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: var(--bsb-text-secondary);
          border-radius: var(--bsb-radius-sm);
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        #close-achievements:hover {
          background: var(--bsb-bg-hover);
          color: var(--bsb-text-primary);
        }
        
        .achievement-stats {
          display: flex;
          justify-content: space-around;
          padding: 20px;
          background: var(--bsb-bg-secondary);
        }
        
        .stat {
          text-align: center;
        }
        
        .stat-value {
          font-size: 1.5rem;
          font-weight: bold;
          color: var(--bsb-primary);
        }
        
        .stat-label {
          font-size: 0.875rem;
          color: var(--bsb-text-secondary);
        }
        
        .achievement-categories {
          display: flex;
          padding: 15px 20px;
          gap: 10px;
          border-bottom: 1px solid var(--bsb-border-color);
        }
        
        .category-filter {
          background: var(--bsb-bg-secondary);
          border: 1px solid var(--bsb-border-color);
          border-radius: var(--bsb-radius-md);
          padding: 5px 12px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all var(--bsb-transition-base);
        }
        
        .category-filter:hover,
        .category-filter.active {
          background: var(--bsb-primary);
          color: white;
          border-color: var(--bsb-primary);
        }
        
        .achievement-list {
          padding: 20px;
        }
        
        .achievement-item {
          display: flex;
          align-items: center;
          padding: 15px;
          margin: 10px 0;
          border-radius: var(--bsb-radius-md);
          border: 1px solid var(--bsb-border-color);
          transition: all var(--bsb-transition-base);
        }
        
        .achievement-item.unlocked {
          background: var(--bsb-bg-secondary);
          border-color: var(--bsb-success);
        }
        
        .achievement-item.locked {
          opacity: 0.6;
          background: var(--bsb-bg-tertiary);
        }
        
        .achievement-item .achievement-icon {
          font-size: 2rem;
          margin-right: 15px;
        }
        
        .achievement-info {
          flex: 1;
        }
        
        .achievement-title {
          margin: 0 0 5px 0;
          font-size: 1rem;
          font-weight: bold;
          color: var(--bsb-text-primary);
        }
        
        .achievement-description {
          margin: 0 0 5px 0;
          font-size: 0.875rem;
          color: var(--bsb-text-secondary);
        }
        
        .achievement-points {
          font-size: 0.75rem;
          color: var(--bsb-primary);
          font-weight: bold;
        }
        
        .achievement-badge {
          font-size: 1.25rem;
          margin-left: 10px;
        }
        
        .achievement-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          background: var(--bsb-success);
          color: white;
          padding: 15px 20px;
          border-radius: var(--bsb-radius-lg);
          box-shadow: var(--bsb-shadow-lg);
          z-index: var(--bsb-z-modal);
          animation: achievementPop 0.5s ease-out;
          max-width: 300px;
        }
        
        .achievement-notification.hidden {
          display: none;
        }
        
        @keyframes achievementPop {
          0% {
            opacity: 0;
            transform: translateX(100px) scale(0.8);
          }
          70% {
            transform: translateX(-10px) scale(1.05);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        
        .achievement-notification-content {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .achievement-notification-icon {
          font-size: 2rem;
        }
        
        .achievement-notification-text h4 {
          margin: 0 0 5px 0;
          font-size: 1rem;
        }
        
        .achievement-notification-text p {
          margin: 0;
          font-size: 0.875rem;
          opacity: 0.9;
        }
        
        @media (max-width: 768px) {
          .achievement-panel {
            width: calc(100vw - 40px);
            right: 20px;
          }
          
          .achievement-toggle {
            right: 15px;
            width: 50px;
            height: 50px;
            font-size: 1.25rem;
          }
        }
      </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
  }

  bindEvents() {
    // Toggle achievement panel
    document.addEventListener('click', (e) => {
      if (e.target.closest('#achievement-toggle')) {
        this.togglePanel();
      } else if (e.target.id === 'close-achievements') {
        this.closePanel();
      } else if (e.target.closest('.category-filter')) {
        this.filterAchievements(e.target.dataset.type);
      }
    });

    // Close panel on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closePanel();
      }
    });

    // Track various events for achievements
    this.bindAchievementTracking();
  }

  bindAchievementTracking() {
    // Track tutorial completions
    document.addEventListener('tutorial-completed', (e) => {
      this.trackTutorialCompletion(e.detail.tutorialId);
    });

    // Track component views
    document.addEventListener('component-viewed', (e) => {
      this.trackComponentView(e.detail.componentId);
    });

    // Track code runs
    document.addEventListener('code-executed', () => {
      this.trackCodeRun();
    });

    // Track theme changes
    document.addEventListener('theme-changed', (e) => {
      if (e.detail.theme === 'dark') {
        this.unlockAchievement('dark-mode-fan');
      }
    });

    // Track language changes
    document.addEventListener('language-changed', () => {
      this.unlockAchievement('bilingual');
    });

    // Track learning mode usage
    this.trackLearningMode();

    // Check time-based achievements
    this.checkTimeBasedAchievements();
  }

  togglePanel() {
    const panel = document.getElementById('achievement-panel');
    panel.classList.toggle('hidden');
    
    if (!panel.classList.contains('hidden')) {
      // Update panel content
      panel.innerHTML = this.generatePanelHTML();
    }
  }

  closePanel() {
    document.getElementById('achievement-panel').classList.add('hidden');
  }

  filterAchievements(type) {
    const filters = document.querySelectorAll('.category-filter');
    const achievements = document.querySelectorAll('.achievement-item');
    
    // Update active filter
    filters.forEach(filter => {
      filter.classList.toggle('active', filter.dataset.type === type);
    });
    
    // Filter achievements
    achievements.forEach(item => {
      const achievementId = item.querySelector('.achievement-title').textContent.toLowerCase().replace(/\s+/g, '-');
      const achievement = Object.values(this.achievements).find(a => a.title.toLowerCase().replace(/\s+/g, '-') === achievementId);
      
      if (type === 'all' || (achievement && achievement.type === type)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }

  unlockAchievement(achievementId) {
    const achievement = this.achievements[achievementId];
    if (!achievement || this.userProgress.unlockedAchievements.includes(achievementId)) {
      return;
    }

    // Unlock achievement
    this.userProgress.unlockedAchievements.push(achievementId);
    this.userProgress.totalPoints += achievement.points;
    
    // Save progress
    this.saveProgress();
    
    // Show notification
    this.showAchievementNotification(achievement);
    
    // Update UI
    this.updateAchievementCount();
    
    // Trigger custom event
    document.dispatchEvent(new CustomEvent('achievement-unlocked', {
      detail: { achievement }
    }));
  }

  showAchievementNotification(achievement) {
    const notification = document.getElementById('achievement-notification');
    
    notification.innerHTML = `
      <div class="achievement-notification-content">
        <div class="achievement-notification-icon">${achievement.icon}</div>
        <div class="achievement-notification-text">
          <h4>Achievement Unlocked!</h4>
          <p>${achievement.title} (+${achievement.points} points)</p>
        </div>
      </div>
    `;
    
    notification.classList.remove('hidden');
    
    // Auto-hide after 4 seconds
    setTimeout(() => {
      notification.classList.add('hidden');
    }, 4000);
  }

  updateAchievementCount() {
    const countElement = document.querySelector('.achievement-count');
    if (countElement) {
      countElement.textContent = this.userProgress.unlockedAchievements.length;
    }
    
    const toggle = document.getElementById('achievement-toggle');
    if (toggle) {
      toggle.setAttribute('aria-label', `View achievements (${this.userProgress.unlockedAchievements.length} unlocked)`);
    }
  }

  // Tracking methods
  trackTutorialCompletion(tutorialId) {
    if (!this.userProgress.tutorialsCompleted.includes(tutorialId)) {
      this.userProgress.tutorialsCompleted.push(tutorialId);
      this.saveProgress();
      
      // Check tutorial achievements
      if (this.userProgress.tutorialsCompleted.length === 1) {
        this.unlockAchievement('first-tutorial');
      } else if (this.userProgress.tutorialsCompleted.length >= 5) {
        this.unlockAchievement('tutorial-master');
      }
      
      // Check CSS-specific achievements
      const cssGridCompleted = this.userProgress.tutorialsCompleted.includes('css-grid');
      const flexboxCompleted = this.userProgress.tutorialsCompleted.includes('flexbox');
      if (cssGridCompleted && flexboxCompleted) {
        this.unlockAchievement('css-ninja');
      }
      
      // Check accessibility achievement
      if (tutorialId === 'accessibility') {
        this.unlockAchievement('accessibility-champion');
      }
    }
  }

  trackComponentView(componentId) {
    if (!this.userProgress.componentsViewed.includes(componentId)) {
      this.userProgress.componentsViewed.push(componentId);
      this.saveProgress();
      
      if (this.userProgress.componentsViewed.length >= 10) {
        this.unlockAchievement('component-explorer');
      }
    }
  }

  trackCodeRun() {
    this.userProgress.codeRuns++;
    this.saveProgress();
    
    if (this.userProgress.codeRuns >= 25) {
      this.unlockAchievement('playground-enthusiast');
    }
  }

  trackLearningMode() {
    let learningModeStartTime = null;
    
    // Listen for learning mode toggle
    document.addEventListener('learning-mode-changed', (e) => {
      if (e.detail.enabled) {
        learningModeStartTime = Date.now();
      } else if (learningModeStartTime) {
        const sessionTime = Date.now() - learningModeStartTime;
        this.userProgress.learningModeTime += sessionTime;
        this.saveProgress();
        
        if (this.userProgress.learningModeTime >= 600000) { // 10 minutes
          this.unlockAchievement('learning-advocate');
        }
        
        learningModeStartTime = null;
      }
    });
  }

  checkTimeBasedAchievements() {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour < 9) {
      this.unlockAchievement('early-bird');
    } else if (hour >= 22) {
      this.unlockAchievement('night-owl');
    }
  }

  checkInitialAchievements() {
    // Check if user has already unlocked some achievements based on current state
    this.checkTimeBasedAchievements();
    
    // Check existing progress
    if (this.userProgress.tutorialsCompleted.length >= 1) {
      this.unlockAchievement('first-tutorial');
    }
    if (this.userProgress.tutorialsCompleted.length >= 5) {
      this.unlockAchievement('tutorial-master');
    }
    if (this.userProgress.componentsViewed.length >= 10) {
      this.unlockAchievement('component-explorer');
    }
    if (this.userProgress.codeRuns >= 25) {
      this.unlockAchievement('playground-enthusiast');
    }
  }

  // Public API for triggering achievements
  static triggerTutorialComplete(tutorialId) {
    document.dispatchEvent(new CustomEvent('tutorial-completed', {
      detail: { tutorialId }
    }));
  }

  static triggerComponentView(componentId) {
    document.dispatchEvent(new CustomEvent('component-viewed', {
      detail: { componentId }
    }));
  }

  static triggerCodeExecution() {
    document.dispatchEvent(new CustomEvent('code-executed'));
  }
}

// Initialize achievement system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.bsbAchievements = new AchievementSystem();
});

// Export for use in other modules
export default AchievementSystem;