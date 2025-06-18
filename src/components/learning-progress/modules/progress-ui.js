/**
 * Progress UI Management
 * =====================
 *
 * Handles UI rendering and interactions for the learning progress component
 */

import { learningPaths, getRecommendedPaths } from './learning-paths.js';

// UI Constants
const UI_CONSTANTS = {
  SCROLL_PADDING: 20,
  PROGRESS_UPDATE_DELAY: 100,
  PERCENTAGE_MAX: 100,
  NOTIFICATION_DELAY: 3000,
  BADGE_ANIMATION_DELAY: 20,
  TIMELINE_DISPLAY_COUNT: 5
};

/**
 * Generate the main learning progress template
 * @param {Object} progress - Current progress data
 * @returns {string} HTML template
 */
export const getTemplate = (progress) => {
  const componentsCount = progress.componentsExplored.size;
  const conceptsCount = progress.conceptsLearned.size;
  const timeSpent = formatTime(progress.timeSpent);
  const achievements = progress.achievements.size;

  return `
    <div class="bsb-learning-progress__header">
      <h3 class="bsb-learning-progress__title">
        📚 Learning Progress
        <span class="bsb-learning-progress__badge" data-count="${achievements}">
          ${achievements}
        </span>
      </h3>
      <div class="bsb-learning-progress__controls">
        <button class="bsb-learning-progress__action" data-action="toggle-minimize" 
                aria-label="Toggle minimize" title="Minimize/Expand">
          <span class="bsb-learning-progress__minimize-icon">−</span>
        </button>
        <button class="bsb-learning-progress__action" data-action="export-progress" 
                aria-label="Export progress" title="Export Progress">
          📥
        </button>
        <button class="bsb-learning-progress__action bsb-learning-progress__action--danger" 
                data-action="reset-progress" 
                aria-label="Reset progress" title="Reset Progress">
          🔄
        </button>
      </div>
    </div>

    <div class="bsb-learning-progress__content">
      <div class="bsb-learning-progress__stats">
        <div class="bsb-learning-progress__stat">
          <div class="bsb-learning-progress__stat-value">${componentsCount}</div>
          <div class="bsb-learning-progress__stat-label">Components</div>
        </div>
        <div class="bsb-learning-progress__stat">
          <div class="bsb-learning-progress__stat-value">${conceptsCount}</div>
          <div class="bsb-learning-progress__stat-label">Concepts</div>
        </div>
        <div class="bsb-learning-progress__stat">
          <div class="bsb-learning-progress__stat-value">${timeSpent}</div>
          <div class="bsb-learning-progress__stat-label">Time</div>
        </div>
        <div class="bsb-learning-progress__stat">
          <div class="bsb-learning-progress__stat-value">${achievements}</div>
          <div class="bsb-learning-progress__stat-label">Achievements</div>
        </div>
      </div>

      ${generateLearningPaths(progress)}
      ${generateRecentActivity(progress)}
    </div>
  `;
};

/**
 * Generate learning paths section
 * @param {Object} progress - Current progress data
 * @returns {string} Learning paths HTML
 */
const generateLearningPaths = (progress) => {
  const recommendations = getRecommendedPaths(progress.componentsExplored, progress.conceptsLearned);
  
  if (recommendations.length === 0) {
    return `
      <div class="bsb-learning-progress__section">
        <h4>🎯 Learning Paths</h4>
        <div class="bsb-learning-progress__message">
          <p>Great progress! You've explored the fundamentals. 
             Continue exploring components to unlock new learning paths.</p>
        </div>
      </div>
    `;
  }

  const pathsHTML = recommendations.map(rec => {
    const path = learningPaths[rec.path];
    const completedCheckpoints = path.checkpoints.filter(checkpoint =>
      progress.checkpoints.has(checkpoint.id)
    ).length;
    const totalCheckpoints = path.checkpoints.length;
    const progressPercent = Math.round((completedCheckpoints / totalCheckpoints) * UI_CONSTANTS.PERCENTAGE_MAX);

    return `
      <div class="bsb-learning-progress__path" data-priority="${rec.priority}">
        <div class="bsb-learning-progress__path-header">
          <span class="bsb-learning-progress__path-icon">${path.icon}</span>
          <div class="bsb-learning-progress__path-info">
            <h5 class="bsb-learning-progress__path-name">${path.name}</h5>
            <p class="bsb-learning-progress__path-reason">${rec.reason}</p>
          </div>
          <div class="bsb-learning-progress__path-progress">
            ${completedCheckpoints}/${totalCheckpoints}
          </div>
        </div>
        <div class="bsb-learning-progress__progress-bar">
          <div class="bsb-learning-progress__progress-fill" 
               style="width: ${progressPercent}%"></div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="bsb-learning-progress__section">
      <h4>🎯 Recommended Learning Paths</h4>
      <div class="bsb-learning-progress__paths">
        ${pathsHTML}
      </div>
    </div>
  `;
};

/**
 * Generate recent activity timeline
 * @param {Object} progress - Current progress data
 * @returns {string} Activity timeline HTML
 */
const generateRecentActivity = (progress) => {
  if (progress.activityLog.length === 0) {
    return `
      <div class="bsb-learning-progress__section">
        <h4>📈 Recent Activity</h4>
        <div class="bsb-learning-progress__message">
          <p>Start exploring components to see your learning activity here!</p>
        </div>
      </div>
    `;
  }

  const recentActivities = progress.activityLog
    .slice(0, UI_CONSTANTS.TIMELINE_DISPLAY_COUNT)
    .map(activity => `
      <div class="bsb-learning-progress__activity">
        <div class="bsb-learning-progress__activity-icon">
          ${getActivityIcon(activity.type)}
        </div>
        <div class="bsb-learning-progress__activity-content">
          <div class="bsb-learning-progress__activity-description">
            ${activity.description}
          </div>
          <div class="bsb-learning-progress__activity-time">
            ${formatTimeAgo(activity.timestamp)}
          </div>
        </div>
      </div>
    `).join('');

  return `
    <div class="bsb-learning-progress__section">
      <h4>📈 Recent Activity</h4>
      <div class="bsb-learning-progress__timeline">
        ${recentActivities}
      </div>
    </div>
  `;
};

/**
 * Get icon for activity type
 * @param {string} type - Activity type
 * @returns {string} Icon emoji
 */
const getActivityIcon = (type) => {
  const icons = {
    'component': '🔍',
    'concept': '💡',
    'achievement': '🏆',
    'milestone': '🎯',
    'default': '📍'
  };
  return icons[type] || icons.default;
};

/**
 * Format time duration
 * @param {number} milliseconds - Duration in milliseconds
 * @returns {string} Formatted time string
 */
export const formatTime = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return `${seconds}s`;
  }
};

/**
 * Format timestamp to relative time
 * @param {number} timestamp - Timestamp in milliseconds
 * @returns {string} Relative time string
 */
export const formatTimeAgo = (timestamp) => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) {
    return 'Just now';
  } else if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}m ago`;
  } else if (seconds < 86400) {
    return `${Math.floor(seconds / 3600)}h ago`;
  } else {
    return `${Math.floor(seconds / 86400)}d ago`;
  }
};

/**
 * Update the UI with current progress
 * @param {HTMLElement} element - Container element
 * @param {Object} progress - Current progress data
 */
export const updateUI = (element, progress) => {
  if (!element) return;

  element.innerHTML = getTemplate(progress);
  
  // Animate new achievements badge
  const badge = element.querySelector('.bsb-learning-progress__badge');
  if (badge && progress.achievements.size > 0) {
    setTimeout(() => {
      badge.classList.add('bsb-learning-progress__badge--animated');
    }, UI_CONSTANTS.BADGE_ANIMATION_DELAY);
  }
};

/**
 * Show achievement notification
 * @param {Object} achievement - Achievement object
 */
export const showAchievementNotification = (achievement) => {
  // Remove existing notification
  const existing = document.querySelector('.bsb-learning-progress__notification');
  if (existing) {
    existing.remove();
  }

  // Create notification
  const notification = document.createElement('div');
  notification.className = 'bsb-learning-progress__notification';
  notification.innerHTML = `
    <div class="bsb-learning-progress__notification-content">
      <div class="bsb-learning-progress__notification-icon">${achievement.icon}</div>
      <div class="bsb-learning-progress__notification-text">
        <strong>${achievement.title}</strong>
        <p>${achievement.description}</p>
      </div>
    </div>
  `;

  document.body.appendChild(notification);

  // Auto-remove after delay
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, UI_CONSTANTS.NOTIFICATION_DELAY);
};