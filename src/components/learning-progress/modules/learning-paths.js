/**
 * Learning Paths Configuration
 * ===========================
 *
 * Defines learning paths and checkpoints for guided education
 */

export const learningPaths = {
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
        trigger: 'view-navigation'
      },
      {
        id: 'accessibility-basics',
        name: 'Learned accessibility fundamentals',
        trigger: 'view-accessible-forms'
      }
    ]
  },
  'css-styling': {
    name: 'CSS & Styling',
    icon: '🎨',
    checkpoints: [
      {
        id: 'css-variables',
        name: 'Mastered CSS custom properties',
        trigger: 'view-theme-variables'
      },
      {
        id: 'responsive-design',
        name: 'Applied responsive design principles',
        trigger: 'view-responsive-grid'
      },
      {
        id: 'animations',
        name: 'Created smooth animations',
        trigger: 'view-animations'
      }
    ]
  },
  'javascript-interactivity': {
    name: 'JavaScript & Interactivity',
    icon: '⚡',
    checkpoints: [
      {
        id: 'dom-manipulation',
        name: 'Manipulated the DOM effectively',
        trigger: 'view-interactive-components'
      },
      {
        id: 'event-handling',
        name: 'Implemented event handlers',
        trigger: 'view-form-validation'
      },
      {
        id: 'api-integration',
        name: 'Integrated with external APIs',
        trigger: 'view-data-fetching'
      }
    ]
  },
  'performance-optimization': {
    name: 'Performance & Optimization',
    icon: '🚀',
    checkpoints: [
      {
        id: 'lazy-loading',
        name: 'Implemented lazy loading strategies',
        trigger: 'view-lazy-loading'
      },
      {
        id: 'code-splitting',
        name: 'Applied code splitting techniques',
        trigger: 'view-dynamic-imports'
      },
      {
        id: 'caching-strategies',
        name: 'Optimized caching mechanisms',
        trigger: 'view-service-worker'
      }
    ]
  }
};

/**
 * Get learning path recommendations based on current progress
 * @param {Set} componentsExplored - Components user has explored
 * @param {Set} conceptsLearned - Concepts user has learned
 * @returns {Array} Recommended learning paths
 */
/**
 * Analyze user's current skill levels
 * @param {Set} componentsExplored - Components user has explored
 * @param {Set} conceptsLearned - Concepts user has learned
 * @returns {Object} Skill level analysis
 */
const analyzeSkillLevels = (componentsExplored, conceptsLearned) => ({
  hasBasicHTML: componentsExplored.has('header') || componentsExplored.has('navigation'),
  hasCSS: componentsExplored.has('theme-variables') || conceptsLearned.has('css-styling'),
  hasJS: componentsExplored.has('interactive-components') || conceptsLearned.has('javascript')
});

/**
 * Add HTML-related recommendations
 * @param {Array} recommendations - Recommendations array to modify
 * @param {Object} skillLevels - User's skill levels
 */
const addHTMLRecommendations = (recommendations, skillLevels) => {
  if (!skillLevels.hasBasicHTML) {
    recommendations.push({
      path: 'html-structure',
      reason: 'Start with HTML fundamentals',
      priority: 'high'
    });
  }
};

/**
 * Add CSS-related recommendations
 * @param {Array} recommendations - Recommendations array to modify
 * @param {Object} skillLevels - User's skill levels
 */
const addCSSRecommendations = (recommendations, skillLevels) => {
  if (skillLevels.hasBasicHTML && !skillLevels.hasCSS) {
    recommendations.push({
      path: 'css-styling',
      reason: 'Build on HTML with styling',
      priority: 'high'
    });
  }
};

/**
 * Add JavaScript-related recommendations
 * @param {Array} recommendations - Recommendations array to modify
 * @param {Object} skillLevels - User's skill levels
 */
const addJavaScriptRecommendations = (recommendations, skillLevels) => {
  if (skillLevels.hasBasicHTML && skillLevels.hasCSS && !skillLevels.hasJS) {
    recommendations.push({
      path: 'javascript-interactivity',
      reason: 'Add interactivity to your knowledge',
      priority: 'medium'
    });
  }
};

/**
 * Add advanced topic recommendations
 * @param {Array} recommendations - Recommendations array to modify
 * @param {Object} skillLevels - User's skill levels
 */
const addAdvancedRecommendations = (recommendations, skillLevels) => {
  if (skillLevels.hasBasicHTML && skillLevels.hasCSS && skillLevels.hasJS) {
    recommendations.push({
      path: 'performance-optimization',
      reason: 'Optimize for production',
      priority: 'low'
    });
  }
};

/**
 * Get learning path recommendations based on current progress
 * @param {Set} componentsExplored - Components user has explored
 * @param {Set} conceptsLearned - Concepts user has learned
 * @returns {Array} Recommended learning paths
 */
export const getRecommendedPaths = (componentsExplored, conceptsLearned) => {
  const recommendations = [];

  // Analyze current progress
  const skillLevels = analyzeSkillLevels(componentsExplored, conceptsLearned);

  // Generate recommendations based on skill gaps
  addHTMLRecommendations(recommendations, skillLevels);
  addCSSRecommendations(recommendations, skillLevels);
  addJavaScriptRecommendations(recommendations, skillLevels);
  addAdvancedRecommendations(recommendations, skillLevels);

  return recommendations;
};