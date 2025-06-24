/**
 * Achievement Definitions
 * ======================
 *
 * All achievement types and their configurations
 */

// Constants for achievement thresholds
export const ACHIEVEMENT_CONSTANTS = {
  EXPLORER_THRESHOLD: 5,
  MASTER_THRESHOLD: 10,
  LEGEND_THRESHOLD: 25,
  TIMER_INTERVAL: 600000, // 10 minutes
  CODE_TIME_HOURS: 9,
  CODE_TIME_DAY: 22
};

/**
 * Get tutorial achievements
 * @returns {Object} Tutorial achievement definitions
 */
const getTutorialAchievements = () => ({
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
    count: ACHIEVEMENT_CONSTANTS.EXPLORER_THRESHOLD
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
  'accessibility-champion': {
    id: 'accessibility-champion',
    title: 'Accessibility Champion',
    description: 'Complete the accessibility tutorial',
    icon: '♿',
    points: 40,
    type: 'tutorial',
    unlocked: false,
    condition: 'complete_accessibility'
  }
});

/**
 * Get exploration achievements
 * @returns {Object} Exploration achievement definitions
 */
const getExplorationAchievements = () => ({
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
    description: `Run code in the playground ${ACHIEVEMENT_CONSTANTS.LEGEND_THRESHOLD} times`,
    icon: '⚡',
    points: 30,
    type: 'interaction',
    unlocked: false,
    condition: 'run_code',
    count: ACHIEVEMENT_CONSTANTS.LEGEND_THRESHOLD
  },
  'learning-advocate': {
    id: 'learning-advocate',
    title: 'Learning Advocate',
    description: 'Use learning mode for 10 minutes',
    icon: '📚',
    points: 20,
    type: 'engagement',
    unlocked: false,
    condition: 'learning_time',
    count: ACHIEVEMENT_CONSTANTS.TIMER_INTERVAL
  }
});

/**
 * Get interaction achievements
 * @returns {Object} Interaction achievement definitions
 */
const getInteractionAchievements = () => ({
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
  }
});

/**
 * Get time-based achievements
 * @returns {Object} Time-based achievement definitions
 */
const getTimeBasedAchievements = () => ({
  'early-bird': {
    id: 'early-bird',
    title: 'Early Bird',
    description: `Visit BSB before ${ACHIEVEMENT_CONSTANTS.CODE_TIME_HOURS} AM`,
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
});

/**
 * Get all achievement definitions
 * @returns {Object} Achievement definitions by ID
 */
export const getAchievementDefinitions = () => ({
  ...getTutorialAchievements(),
  ...getExplorationAchievements(),
  ...getInteractionAchievements(),
  ...getTimeBasedAchievements()
});

/**
 * Group achievements by type
 * @param {Object} achievements - Achievement definitions
 * @returns {Object} Grouped achievements
 */
export const groupAchievementsByType = achievements => {
  const groups = {};

  Object.values(achievements).forEach(achievement => {
    const { type } = achievement;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(achievement);
  });

  return groups;
};