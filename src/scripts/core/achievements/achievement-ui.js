/**
 * Achievement UI Management
 * ========================
 *
 * Manages the achievement UI components and interactions
 */

// UI Constants
const UI_CONSTANTS = {
  NOTIFICATION_DURATION: 4000,
  BADGE_ANIMATION_INTERVAL: 10,
  BADGE_COUNT_THRESHOLD: 5,
  BADGE_SECOND_THRESHOLD: 10
};

/**
 * Generate achievement panel HTML structure
 * @param {Object} userProgress - User progress data
 * @returns {string} Panel HTML content
 */
const getAchievementPanelHTML = userProgress => {
  const totalPoints = userProgress.totalPoints || 0;
  const unlockedCount = Object.values(userProgress.achievements || {})
    .filter(achievement => achievement.unlocked).length;

  return `
    <div class="achievement-header">
      <h2>🏆 Achievements</h2>
      <button id="close-achievements" aria-label="Close achievements">×</button>
    </div>

    <div class="achievement-stats">
      <div class="stat">
        <div class="stat-value">${totalPoints}</div>
        <div class="stat-label">Points</div>
      </div>
      <div class="stat">
        <div class="stat-value">${unlockedCount}</div>
        <div class="stat-label">Unlocked</div>
      </div>
    </div>

    <div class="achievement-categories">
      <button class="category-filter active" data-type="all">All</button>
      <button class="category-filter" data-type="tutorial">Tutorials</button>
      <button class="category-filter" data-type="exploration">Exploration</button>
      <button class="category-filter" data-type="interaction">Interaction</button>
      <button class="category-filter" data-type="special">Special</button>
    </div>

    <div class="achievement-list" id="achievement-list">
      <!-- Achievement items will be populated here -->
    </div>
  `;
};

/**
 * Create the achievement toggle button and panel UI
 * @param {Object} userProgress - Current user progress data
 * @returns {void}
 */
export const createAchievementUI = userProgress => {
  // Check if UI already exists
  if (document.querySelector('#achievement-toggle')) {
    return;
  }

  // Count unlocked achievements
  const unlockedCount = Object.values(userProgress.achievements || {})
    .filter(achievement => achievement.unlocked).length;

  // Create toggle button
  const toggleButton = document.createElement('button');
  toggleButton.id = 'achievement-toggle';
  toggleButton.className = 'achievement-toggle';
  toggleButton.innerHTML = `
    🏆
    ${unlockedCount > 0 ? `<span class="achievement-count">${unlockedCount}</span>` : ''}
  `;
  toggleButton.setAttribute('aria-label', 'Toggle achievements panel');

  // Create achievement panel
  const panel = document.createElement('div');
  panel.id = 'achievement-panel';
  panel.className = 'achievement-panel hidden';
  panel.innerHTML = getAchievementPanelHTML(userProgress);

  // Add to document
  document.body.appendChild(toggleButton);
  document.body.appendChild(panel);
};

/**
 * Update achievement list display
 * @param {Object} achievements - Achievement definitions
 * @param {Object} userProgress - User progress data
 * @param {string} filterType - Current filter type
 * @returns {void}
 */
export const updateAchievementList = (achievements, userProgress, filterType = 'all') => {
  const listContainer = document.querySelector('#achievement-list');
  if (!listContainer) {
    return;
  }

  const achievementItems = Object.values(achievements)
    .filter(achievement => filterType === 'all' || achievement.type === filterType)
    .map(achievement => {
      const userAchievement = userProgress.achievements?.[achievement.id] || achievement;
      const isUnlocked = userAchievement.unlocked;
      const progress = userAchievement.progress || 0;
      const target = achievement.count || 1;

      return `
        <div class="achievement-item ${isUnlocked ? 'unlocked' : 'locked'}">
          <div class="achievement-icon">${achievement.icon}</div>
          <div class="achievement-info">
            <h3 class="achievement-title">${achievement.title}</h3>
            <p class="achievement-description">${achievement.description}</p>
            <div class="achievement-points">+${achievement.points} points</div>
            ${!isUnlocked && achievement.count ?
    `<div class="achievement-progress">${progress}/${target}</div>` : ''}
          </div>
          ${isUnlocked ? '<div class="achievement-badge">✓</div>' : ''}
        </div>
      `;
    })
    .join('');

  listContainer.innerHTML = achievementItems;
};

/**
 * Show achievement unlock notification
 * @param {Object} achievement - Achievement that was unlocked
 * @returns {void}
 */
export const showAchievementNotification = achievement => {
  // Remove existing notification
  const existing = document.querySelector('.achievement-notification');
  if (existing) {
    existing.remove();
  }

  // Create notification
  const notification = document.createElement('div');
  notification.className = 'achievement-notification';
  notification.innerHTML = `
    <div class="achievement-notification-content">
      <div class="achievement-notification-icon">${achievement.icon}</div>
      <div class="achievement-notification-text">
        <h4>Achievement Unlocked!</h4>
        <p>${achievement.title}</p>
      </div>
    </div>
  `;

  // Add to document
  document.body.appendChild(notification);

  // Auto-remove after duration
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, UI_CONSTANTS.NOTIFICATION_DURATION);
};

/**
 * Update achievement toggle button badge
 * @param {number} unlockedCount - Number of unlocked achievements
 * @returns {void}
 */
export const updateToggleBadge = unlockedCount => {
  const toggle = document.querySelector('#achievement-toggle');
  if (!toggle) {
    return;
  }

  const existingBadge = toggle.querySelector('.achievement-count');

  if (unlockedCount > 0) {
    if (existingBadge) {
      existingBadge.textContent = unlockedCount;
    } else {
      toggle.innerHTML = `
        🏆
        <span class="achievement-count">${unlockedCount}</span>
      `;
    }
  } else if (existingBadge) {
    existingBadge.remove();
  }
};

/**
 * Toggle achievement panel visibility
 * @returns {void}
 */
export const toggleAchievementPanel = () => {
  const panel = document.querySelector('#achievement-panel');
  if (!panel) {
    return;
  }

  panel.classList.toggle('hidden');
};

/**
 * Close achievement panel
 * @returns {void}
 */
export const closeAchievementPanel = () => {
  const panel = document.querySelector('#achievement-panel');
  if (!panel) {
    return;
  }

  panel.classList.add('hidden');
};

/**
 * Update category filter active state
 * @param {string} activeType - Currently active filter type
 * @returns {void}
 */
export const updateCategoryFilter = activeType => {
  const filters = document.querySelectorAll('.category-filter');
  filters.forEach(filter => {
    filter.classList.toggle('active', filter.dataset.type === activeType);
  });
};