/**
 * UI Updater Module
 * =================
 *
 * Handles updating the SEO analyzer UI with analysis results
 */

import { generateMetaTags, generateSERPPreview } from '../../../scripts/seo/seo-utils.js';

// Constants
const CONSTANTS = {
  CIRCLE_RADIUS: 45,
  PI_MULTIPLIER: 2,
  PERCENTAGE_MAX: 100,
  EXCELLENT_THRESHOLD: 90,
  GOOD_THRESHOLD: 80,
  AVERAGE_THRESHOLD: 70,
  POOR_THRESHOLD: 60,
  ANIMATION_DELAY: 300,
  DECIMAL_PLACES: 1
};

/**
 * Update the score number display
 * @param {number} score - SEO score (0-100)
 * @returns {void}
 */
const updateScoreNumber = score => {
  const scoreElement = document.querySelector('.seo-analyzer__score-number');
  if (scoreElement) {
    scoreElement.textContent = Math.round(score);
  }
};

/**
 * Get color class based on score
 * @param {number} score - SEO score
 * @returns {string} Color class name
 */
const getScoreColorClass = score => {
  if (score >= CONSTANTS.EXCELLENT_THRESHOLD) {return 'excellent';}
  if (score >= CONSTANTS.GOOD_THRESHOLD) {return 'good';}
  if (score >= CONSTANTS.AVERAGE_THRESHOLD) {return 'average';}
  if (score >= CONSTANTS.POOR_THRESHOLD) {return 'poor';}
  return 'critical';
};

/**
 * Update circle progress visualization
 * @param {HTMLElement} circleElement - Circle element
 * @param {number} score - SEO score
 * @returns {void}
 */
const updateCircleProgress = (circleElement, score) => {
  const circumference = CONSTANTS.PI_MULTIPLIER * Math.PI * CONSTANTS.CIRCLE_RADIUS;
  const offset = circumference - (score / CONSTANTS.PERCENTAGE_MAX) * circumference;
  circleElement.style.strokeDasharray = circumference;
  circleElement.style.strokeDashoffset = offset;
};

/**
 * Update circle color based on score
 * @param {HTMLElement} circleElement - Circle element
 * @param {number} score - SEO score
 * @returns {void}
 */
const updateCircleColor = (circleElement, score) => {
  const colorClass = getScoreColorClass(score);
  circleElement.className = `seo-analyzer__score-circle seo-analyzer__score-circle--${colorClass}`;
};

/**
 * Update the score circle visualization
 * @param {number} score - SEO score (0-100)
 * @returns {void}
 */
const updateScoreCircle = score => {
  const circleElement = document.querySelector('.seo-analyzer__score-circle');
  if (!circleElement) {return;}

  updateCircleProgress(circleElement, score);
  updateCircleColor(circleElement, score);
};

/**
 * Get letter grade based on score
 * @param {number} score - SEO score
 * @returns {string} Letter grade
 */
const getScoreGrade = score => {
  if (score >= CONSTANTS.EXCELLENT_THRESHOLD) {return 'A+';}
  if (score >= CONSTANTS.GOOD_THRESHOLD) {return 'A';}
  if (score >= CONSTANTS.AVERAGE_THRESHOLD) {return 'B';}
  if (score >= CONSTANTS.POOR_THRESHOLD) {return 'C';}
  return 'D';
};

/**
 * Update the score grade display
 * @param {number} score - SEO score (0-100)
 * @returns {void}
 */
const updateScoreGrade = score => {
  const gradeElement = document.querySelector('.seo-analyzer__grade');
  if (gradeElement) {
    gradeElement.textContent = getScoreGrade(score);
  }
};

/**
 * Update the SEO score display
 * @param {number} score - SEO score (0-100)
 * @returns {void}
 */
export const updateScore = score => {
  updateScoreNumber(score);
  updateScoreCircle(score);
  updateScoreGrade(score);
};

/**
 * Update the score breakdown display
 * @param {Object} breakdown - Score breakdown by category
 * @returns {void}
 */
export const updateBreakdown = breakdown => {
  Object.entries(breakdown).forEach(([category, data]) => {
    const categoryElement = document.querySelector(`[data-category="${category}"]`);
    if (categoryElement) {
      const scoreElement = categoryElement.querySelector('.breakdown__score');
      const barElement = categoryElement.querySelector('.breakdown__bar-fill');

      if (scoreElement) {
        scoreElement.textContent = `${data.score.toFixed(CONSTANTS.DECIMAL_PLACES)}%`;
      }

      if (barElement) {
        barElement.style.width = `${data.score}%`;
        setTimeout(() => {
          barElement.style.transition = 'width 0.5s ease';
        }, CONSTANTS.ANIMATION_DELAY);
      }
    }
  });
};

/**
 * Get icon for insight type
 * @param {string} type - Insight type
 * @returns {string} Icon HTML
 */
const getInsightIcon = type => {
  const icons = {
    success: '✅',
    warning: '⚠️',
    error: '❌',
    info: 'ℹ️',
    tip: '💡'
  };
  return icons[type] || icons.info;
};

/**
 * Update the insights and recommendations
 * @param {Array} insights - Array of insight objects
 * @returns {void}
 */
export const updateInsights = insights => {
  const insightsContainer = document.querySelector('.seo-analyzer__insights');
  if (!insightsContainer) {return;}

  insightsContainer.innerHTML = insights.map(insight => `
    <div class="insight insight--${insight.type}">
      <div class="insight__icon">
        ${getInsightIcon(insight.type)}
      </div>
      <div class="insight__content">
        <h4 class="insight__title">${insight.title}</h4>
        <p class="insight__description">${insight.description}</p>
        ${insight.action ? `<button class="insight__action" data-action="${insight.action}">${insight.actionText}</button>` : ''}
      </div>
    </div>
  `).join('');
};

/**
 * Update meta tags preview
 * @param {Object} pageData - Page data object
 * @returns {void}
 */
export const updateMetaTags = pageData => {
  const metaContainer = document.querySelector('.seo-analyzer__meta-tags');
  if (!metaContainer) {return;}

  const metaTags = generateMetaTags(pageData);
  const serpPreview = generateSERPPreview(pageData);

  metaContainer.innerHTML = `
    <div class="meta-tags__preview">
      <h4>Meta Tags Preview</h4>
      <div class="meta-tags__code">
        <pre><code>${metaTags}</code></pre>
      </div>
    </div>
    <div class="serp-preview">
      <h4>SERP Preview</h4>
      <div class="serp-preview__result">
        <div class="serp-preview__title">${serpPreview.title}</div>
        <div class="serp-preview__url">${serpPreview.url}</div>
        <div class="serp-preview__description">${serpPreview.description}</div>
      </div>
    </div>
  `;
};

/**
 * Update content statistics display
 * @param {Object} contentData - Content analysis data
 * @returns {void}
 */
export const updateContentStats = contentData => {
  const statsContainer = document.querySelector('.seo-analyzer__content-stats');
  if (!statsContainer) {return;}

  statsContainer.innerHTML = `
    <div class="content-stats__item">
      <span class="content-stats__label">Word Count:</span>
      <span class="content-stats__value">${contentData.wordCount}</span>
    </div>
    <div class="content-stats__item">
      <span class="content-stats__label">Reading Time:</span>
      <span class="content-stats__value">${contentData.readingTime} min</span>
    </div>
    <div class="content-stats__item">
      <span class="content-stats__label">Top Keywords:</span>
      <div class="content-stats__keywords">
        ${contentData.topKeywords.slice(0, 5).map(keyword =>
    `<span class="keyword-tag">${keyword.word} (${keyword.density}%)</span>`
  ).join('')}
      </div>
    </div>
  `;
};

/**
 * Update technical SEO display
 * @param {Object} techData - Technical SEO data
 * @returns {void}
 */
export const updateTechnicalSEO = techData => {
  const techContainer = document.querySelector('.seo-analyzer__technical');
  if (!techContainer) {return;}

  techContainer.innerHTML = `
    <div class="technical-item">
      <span class="technical-item__label">Mobile Friendly:</span>
      <span class="technical-item__status technical-item__status--${techData.isMobileFriendly ? 'success' : 'error'}">
        ${techData.isMobileFriendly ? '✅ Yes' : '❌ No'}
      </span>
    </div>
    <div class="technical-item">
      <span class="technical-item__label">Structured Data:</span>
      <span class="technical-item__status technical-item__status--${techData.hasStructuredData ? 'success' : 'warning'}">
        ${techData.hasStructuredData ? '✅ Found' : '⚠️ None'}
      </span>
    </div>
    <div class="technical-item">
      <span class="technical-item__label">Heading Hierarchy:</span>
      <span class="technical-item__status technical-item__status--${techData.headings.hierarchy.isValid ? 'success' : 'warning'}">
        ${techData.headings.hierarchy.isValid ? '✅ Valid' : '⚠️ Issues'}
      </span>
    </div>
    <div class="technical-item">
      <span class="technical-item__label">Image Alt Tags:</span>
      <span class="technical-item__status technical-item__status--${techData.images.altCoverage >= 90 ? 'success' : 'warning'}">
        ${Math.round(techData.images.altCoverage)}% Coverage
      </span>
    </div>
  `;
};