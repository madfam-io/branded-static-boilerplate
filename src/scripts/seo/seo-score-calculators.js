/**
 * SEO Score Calculation Helpers
 * =============================
 * Extracted functions to reduce complexity
 */

// Import config and validators separately to avoid circular dependencies
const SEO_CONFIG = {
  scoreExcellent: 100,
  scoreGood: 80,
  scoreAverage: 60,
  scorePoor: 40,
  scoreHeadingBonus: 50,
  scoreImagePenalty: 10,
  minWordCount: 300,
  scoreWordCountDivisor: 10,
  technicalFeatureScore: 25
};

// Content length validation constants
const TITLE_VALIDATION = {
  MIN_LENGTH: 30,
  MAX_LENGTH: 60,
  EXCELLENT_MIN: 50,
  EXCELLENT_MAX: 60
};

const DESCRIPTION_VALIDATION = {
  MIN_LENGTH: 120,
  MAX_LENGTH: 160,
  EXCELLENT_MIN: 150,
  EXCELLENT_MAX: 160
};

// Scoring constants
const LINK_SCORES = {
  INTERNAL_BONUS: 50,
  EXTERNAL_BONUS: 50,
  EXTERNAL_PARTIAL: 25
};

// Simple validators (copied to avoid circular import)
const validateTitle = title => {
  if (!title) {
    return { status: 'error' };
  }
  if (title.length < TITLE_VALIDATION.MIN_LENGTH) {
    return { status: 'warning' };
  }
  if (title.length > TITLE_VALIDATION.MAX_LENGTH) {
    return { status: 'warning' };
  }
  if (title.length >= TITLE_VALIDATION.EXCELLENT_MIN && title.length <= TITLE_VALIDATION.EXCELLENT_MAX) {
    return { status: 'excellent' };
  }
  return { status: 'good' };
};

const validateDescription = description => {
  if (!description) {
    return { status: 'error' };
  }
  if (description.length < DESCRIPTION_VALIDATION.MIN_LENGTH) {
    return { status: 'warning' };
  }
  if (description.length > DESCRIPTION_VALIDATION.MAX_LENGTH) {
    return { status: 'warning' };
  }
  if (description.length >= DESCRIPTION_VALIDATION.EXCELLENT_MIN && description.length <= DESCRIPTION_VALIDATION.EXCELLENT_MAX) {
    return { status: 'excellent' };
  }
  return { status: 'good' };
};

/**
 * Calculate title score
 * @param {string} title - Page title
 * @returns {number} Title score
 */
export const calculateTitleScore = title => {
  const validation = validateTitle(title || '');
  const scoreMap = {
    excellent: SEO_CONFIG.scoreExcellent,
    good: SEO_CONFIG.scoreGood,
    warning: SEO_CONFIG.scoreAverage,
    error: SEO_CONFIG.scorePoor
  };
  return scoreMap[validation.status] || SEO_CONFIG.scorePoor;
};

/**
 * Calculate description score
 * @param {string} description - Page description
 * @returns {number} Description score
 */
export const calculateDescriptionScore = description => {
  const validation = validateDescription(description || '');
  const scoreMap = {
    excellent: SEO_CONFIG.scoreExcellent,
    good: SEO_CONFIG.scoreGood,
    warning: SEO_CONFIG.scoreAverage,
    error: SEO_CONFIG.scorePoor
  };
  return scoreMap[validation.status] || SEO_CONFIG.scorePoor;
};

/**
 * Calculate headings score and insights
 * @param {Object} page - Page data
 * @returns {Object} Score and insights
 */
export const calculateHeadingsScore = page => {
  let score = 0;
  const insights = [];

  // H1 validation
  if (page.h1Count === 1) {
    score += SEO_CONFIG.scoreHeadingBonus;
  } else {
    insights.push({
      category: 'Headings',
      issue: page.h1Count === 0 ? 'Missing H1 tag' : 'Multiple H1 tags found',
      impact: 'high',
      solution: 'Use exactly one H1 tag per page'
    });
  }

  // Hierarchy validation
  if (page.headingHierarchy) {
    score += SEO_CONFIG.scoreHeadingBonus;
  } else {
    insights.push({
      category: 'Headings',
      issue: 'Improper heading hierarchy',
      impact: 'medium',
      solution: 'Use headings in sequential order (H1 → H2 → H3)'
    });
  }

  return { score, insights };
};

/**
 * Calculate images score and insights
 * @param {Object} page - Page data
 * @returns {Object} Score and insights
 */
export const calculateImagesScore = page => {
  const insights = [];
  const imagesWithoutAlt = page.images?.filter(img => !img.alt).length || 0;

  let score = SEO_CONFIG.scoreExcellent;
  if (imagesWithoutAlt > 0) {
    score = Math.max(0,
      SEO_CONFIG.scoreExcellent - (imagesWithoutAlt * SEO_CONFIG.scoreImagePenalty)
    );
    insights.push({
      category: 'Images',
      issue: `${imagesWithoutAlt} images missing alt text`,
      impact: 'high',
      solution: 'Add descriptive alt text to all images'
    });
  }

  return { score, insights };
};

/**
 * Calculate links score and insights
 * @param {Object} page - Page data
 * @returns {Object} Score and insights
 */
export const calculateLinksScore = page => {
  let score = 0;
  const insights = [];

  // Internal links
  if (page.links?.internal > 0) {
    score += LINK_SCORES.INTERNAL_BONUS;
  } else {
    insights.push({
      category: 'Links',
      issue: 'No internal links found',
      impact: 'medium',
      solution: 'Add relevant internal links to improve navigation'
    });
  }

  // External links
  if (page.links?.external > 0) {
    if (page.links?.externalNofollow > 0) {
      score += LINK_SCORES.EXTERNAL_BONUS;
    } else {
      score += LINK_SCORES.EXTERNAL_PARTIAL;
      insights.push({
        category: 'Links',
        issue: 'External links without nofollow',
        impact: 'low',
        solution: 'Consider adding rel="nofollow" to untrusted external links'
      });
    }
  }

  return { score, insights };
};

/**
 * Calculate content score and insights
 * @param {Object} page - Page data
 * @returns {Object} Score and insights
 */
export const calculateContentScore = page => {
  const insights = [];
  const wordCount = page.content?.wordCount || 0;

  let score = 0;
  if (wordCount >= SEO_CONFIG.minWordCount) {
    score = Math.min(
      SEO_CONFIG.scoreExcellent,
      (wordCount / SEO_CONFIG.scoreWordCountDivisor)
    );
  } else {
    insights.push({
      category: 'Content',
      issue: `Low word count (${wordCount} words)`,
      impact: 'high',
      solution: `Add more substantial content (aim for ${SEO_CONFIG.minWordCount}+ words)`
    });
  }

  return { score, insights };
};

/**
 * Calculate technical score
 * @param {Object} page - Page data
 * @returns {number} Technical score
 */
export const calculateTechnicalScore = page => {
  if (!page) {
    return 0;
  }
  
  let score = 0;

  if (page.canonical) {
    score += SEO_CONFIG.technicalFeatureScore;
  }
  if (page.structuredData) {
    score += SEO_CONFIG.technicalFeatureScore;
  }
  if (page.mobileFriendly) {
    score += SEO_CONFIG.technicalFeatureScore;
  }
  if (page.https) {
    score += SEO_CONFIG.technicalFeatureScore;
  }

  return score;
};