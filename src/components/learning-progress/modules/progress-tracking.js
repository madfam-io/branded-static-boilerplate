/**
 * Progress Tracking Module
 * ========================
 *
 * Handles tracking and observation of user learning activities
 */

import { debug } from '../../../scripts/core/debug.js';

// Constants
const TRACKING_CONSTANTS = {
  MS_PER_MINUTE: 60000,
  ACTIVITY_CHECK_INTERVAL: 60000, // 1 minute
  MAX_ACTIVITY_LOG_SIZE: 20,
  EXPLORER_THRESHOLD: 5,
  ACTIVITY_TIMEOUT_MULTIPLIER: 2,
  ARCHITECT_THRESHOLD: 10,
  SESSION_TIME_THRESHOLD: 1800000, // 30 minutes
  ENGAGEMENT_THRESHOLD: 10
};

/**
 * Track component views using Intersection Observer
 * @param {Object} progress - Progress data object
 * @param {Function} addComponentExplored - Callback for new components
 */
export const trackComponentViews = (progress, addComponentExplored) => {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const componentElement = entry.target;
        const componentName = componentElement.dataset.component ||
                            componentElement.className.split(' ')[0];

        if (componentName && !progress.componentsExplored.has(componentName)) {
          debug.log(`📍 Discovered component: ${componentName}`);
          addComponentExplored(componentName);
        }
      }
    });
  }, {
    threshold: 0.5,
    rootMargin: '0px 0px -50px 0px'
  });

  // Observe all component elements
  document.querySelectorAll('[data-component], .component, .bsb-component')
    .forEach(element => observer.observe(element));

  return observer;
};

/**
 * Track source viewer interactions
 * @param {Function} addConceptLearned - Callback for new concepts
 */
export const trackSourceViewer = addConceptLearned => {
  document.addEventListener('source-viewed', event => {
    const { file, language } = event.detail;
    debug.log(`👁️ Source viewed: ${file} (${language})`);
    addConceptLearned(`source-${language}`);
    addConceptLearned('code-exploration');
  });
};

/**
 * Track code playground usage
 * @param {Function} addConceptLearned - Callback for new concepts
 */
export const trackPlayground = addConceptLearned => {
  document.addEventListener('code-executed', event => {
    const { language } = event.detail || {};
    debug.log(`⚡ Code executed: ${language || 'unknown'}`);
    addConceptLearned('code-execution');
    if (language) {
      addConceptLearned(`playground-${language}`);
    }
  });
};

/**
 * Start automatic progress tracking
 * @param {Object} progress - Progress data object
 * @param {Function} saveProgress - Save function
 * @returns {number} Interval ID
 */
export const startProgressTracking = (progress, saveProgress) => setInterval(() => {
  // Only track time if user is active and page is visible
  const now = Date.now();
  const timeSinceLastActivity = now - progress.lastActivity;

  if (document.hidden) {
    return; // Don't track time when tab is hidden
  }

  if (timeSinceLastActivity < TRACKING_CONSTANTS.ACTIVITY_CHECK_INTERVAL * TRACKING_CONSTANTS.ACTIVITY_TIMEOUT_MULTIPLIER) {
    progress.timeSpent += TRACKING_CONSTANTS.ACTIVITY_CHECK_INTERVAL;
    progress.lastActivity = now;
    saveProgress();
  }
}, TRACKING_CONSTANTS.ACTIVITY_CHECK_INTERVAL);

/**
 * Log learning activity
 * @param {Object} progress - Progress data object
 * @param {string} type - Activity type
 * @param {string} description - Activity description
 */
export const logActivity = (progress, type, description) => {
  const activity = {
    timestamp: Date.now(),
    type,
    description
  };

  progress.activityLog.unshift(activity);

  // Keep only recent activities
  if (progress.activityLog.length > TRACKING_CONSTANTS.MAX_ACTIVITY_LOG_SIZE) {
    progress.activityLog = progress.activityLog.slice(0, TRACKING_CONSTANTS.MAX_ACTIVITY_LOG_SIZE);
  }
};

/**
 * Check for achievements based on current progress
 * @param {Object} progress - Progress data object
 * @returns {Array} New achievements unlocked
 */
export const checkAchievements = progress => {
  const newAchievements = [];
  const { componentsExplored, conceptsLearned, timeSpent } = progress;

  // Component exploration achievements
  if (componentsExplored.size >= TRACKING_CONSTANTS.EXPLORER_THRESHOLD &&
      !progress.achievements.has('component-explorer')) {
    newAchievements.push({
      id: 'component-explorer',
      title: 'Component Explorer',
      description: `Explored ${TRACKING_CONSTANTS.EXPLORER_THRESHOLD} components`,
      icon: '🔍'
    });
    progress.achievements.add('component-explorer');
  }

  if (componentsExplored.size >= TRACKING_CONSTANTS.ARCHITECT_THRESHOLD &&
      !progress.achievements.has('code-architect')) {
    newAchievements.push({
      id: 'code-architect',
      title: 'Code Architect',
      description: `Explored ${TRACKING_CONSTANTS.ARCHITECT_THRESHOLD} components`,
      icon: '🏗️'
    });
    progress.achievements.add('code-architect');
  }

  // Time-based achievements
  if (timeSpent >= TRACKING_CONSTANTS.SESSION_TIME_THRESHOLD &&
      !progress.achievements.has('dedicated-learner')) {
    newAchievements.push({
      id: 'dedicated-learner',
      title: 'Dedicated Learner',
      description: 'Spent 30+ minutes learning',
      icon: '📚'
    });
    progress.achievements.add('dedicated-learner');
  }

  // Concept-based achievements
  if (conceptsLearned.has('code-execution') && conceptsLearned.has('source-css') &&
      !progress.achievements.has('hands-on-learner')) {
    newAchievements.push({
      id: 'hands-on-learner',
      title: 'Hands-on Learner',
      description: 'Combined theory with practice',
      icon: '👐'
    });
    progress.achievements.add('hands-on-learner');
  }

  return newAchievements;
};