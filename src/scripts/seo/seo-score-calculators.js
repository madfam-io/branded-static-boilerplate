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
  scoreWordCountDivisor: 10
};

// Simple validators (copied to avoid circular import)
function validateTitle(title) {
  if (!title) {return { status: 'error' };}
  if (title.length < 30) {return { status: 'warning' };}
  if (title.length > 60) {return { status: 'warning' };}
  if (title.length >= 50 && title.length <= 60) {return { status: 'excellent' };}
  return { status: 'good' };
}

function validateDescription(description) {
  if (!description) {return { status: 'error' };}
  if (description.length < 120) {return { status: 'warning' };}
  if (description.length > 160) {return { status: 'warning' };}
  if (description.length >= 150 && description.length <= 160) {return { status: 'excellent' };}
  return { status: 'good' };
}

/**
 * Calculate title score
 * @param {string} title - Page title
 * @returns {number} Title score
 */
export function calculateTitleScore(title) {
  const validation = validateTitle(title || '');
  const scoreMap = {
    excellent: SEO_CONFIG.scoreExcellent,
    good: SEO_CONFIG.scoreGood,
    warning: SEO_CONFIG.scoreAverage,
    error: SEO_CONFIG.scorePoor
  };
  return scoreMap[validation.status] || SEO_CONFIG.scorePoor;
}

/**
 * Calculate description score
 * @param {string} description - Page description
 * @returns {number} Description score
 */
export function calculateDescriptionScore(description) {
  const validation = validateDescription(description || '');
  const scoreMap = {
    excellent: SEO_CONFIG.scoreExcellent,
    good: SEO_CONFIG.scoreGood,
    warning: SEO_CONFIG.scoreAverage,
    error: SEO_CONFIG.scorePoor
  };
  return scoreMap[validation.status] || SEO_CONFIG.scorePoor;
}

/**
 * Calculate headings score and insights
 * @param {Object} page - Page data
 * @returns {Object} Score and insights
 */
export function calculateHeadingsScore(page) {
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
}

/**
 * Calculate images score and insights
 * @param {Object} page - Page data
 * @returns {Object} Score and insights
 */
export function calculateImagesScore(page) {
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
}

/**
 * Calculate links score and insights
 * @param {Object} page - Page data
 * @returns {Object} Score and insights
 */
export function calculateLinksScore(page) {
  let score = 0;
  const insights = [];

  // Internal links
  if (page.links?.internal > 0) {
    score += 50;
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
      score += 50;
    } else {
      score += 25;
      insights.push({
        category: 'Links',
        issue: 'External links without nofollow',
        impact: 'low',
        solution: 'Consider adding rel="nofollow" to untrusted external links'
      });
    }
  }

  return { score, insights };
}

/**
 * Calculate content score and insights
 * @param {Object} page - Page data
 * @returns {Object} Score and insights
 */
export function calculateContentScore(page) {
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
}

/**
 * Calculate technical score
 * @param {Object} page - Page data
 * @returns {number} Technical score
 */
export function calculateTechnicalScore(page) {
  let score = 0;

  if (page.canonical) {score += 25;}
  if (page.structuredData) {score += 25;}
  if (page.mobileFriendly) {score += 25;}
  if (page.https) {score += 25;}

  return score;
}