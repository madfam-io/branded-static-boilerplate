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
  EXCELLENT_THRESHOLD: 90,
  GOOD_THRESHOLD: 80,
  AVERAGE_THRESHOLD: 70,
  POOR_THRESHOLD: 60,
  ANIMATION_DELAY: 300,
  DECIMAL_PLACES: 1
};

/**
 * Update the SEO score display
 * @param {number} score - SEO score (0-100)
 * @returns {void}
 */
export const updateScore = (score) => {
  const scoreElement = document.querySelector('.seo-analyzer__score-number');
  const circleElement = document.querySelector('.seo-analyzer__score-circle');
  const gradeElement = document.querySelector('.seo-analyzer__grade');

  if (scoreElement) {
    scoreElement.textContent = Math.round(score);
  }

  if (circleElement) {
    const circumference = CONSTANTS.PI_MULTIPLIER * Math.PI * CONSTANTS.CIRCLE_RADIUS;
    const offset = circumference - (score / 100) * circumference;
    circleElement.style.strokeDasharray = circumference;
    circleElement.style.strokeDashoffset = offset;

    // Update circle color based on score
    let colorClass = 'poor';
    if (score >= CONSTANTS.EXCELLENT_THRESHOLD) colorClass = 'excellent';
    else if (score >= CONSTANTS.GOOD_THRESHOLD) colorClass = 'good';
    else if (score >= CONSTANTS.AVERAGE_THRESHOLD) colorClass = 'average';
    else if (score >= CONSTANTS.POOR_THRESHOLD) colorClass = 'poor';
    else colorClass = 'critical';

    circleElement.className = `seo-analyzer__score-circle seo-analyzer__score-circle--${colorClass}`;
  }

  if (gradeElement) {
    let grade = 'F';
    if (score >= CONSTANTS.EXCELLENT_THRESHOLD) grade = 'A+';
    else if (score >= CONSTANTS.GOOD_THRESHOLD) grade = 'A';
    else if (score >= CONSTANTS.AVERAGE_THRESHOLD) grade = 'B';
    else if (score >= CONSTANTS.POOR_THRESHOLD) grade = 'C';
    else grade = 'D';

    gradeElement.textContent = grade;
  }
};

/**
 * Update the score breakdown display
 * @param {Object} breakdown - Score breakdown by category
 * @returns {void}
 */
export const updateBreakdown = (breakdown) => {
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
 * Update the insights and recommendations
 * @param {Array} insights - Array of insight objects
 * @returns {void}
 */
export const updateInsights = (insights) => {
  const insightsContainer = document.querySelector('.seo-analyzer__insights');
  if (!insightsContainer) return;

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
 * Get icon for insight type
 * @param {string} type - Insight type
 * @returns {string} Icon HTML
 */
const getInsightIcon = (type) => {
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
 * Update meta tags preview
 * @param {Object} pageData - Page data object
 * @returns {void}
 */
export const updateMetaTags = (pageData) => {
  const metaContainer = document.querySelector('.seo-analyzer__meta-tags');
  if (!metaContainer) return;

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
export const updateContentStats = (contentData) => {
  const statsContainer = document.querySelector('.seo-analyzer__content-stats');
  if (!statsContainer) return;

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
export const updateTechnicalSEO = (techData) => {
  const techContainer = document.querySelector('.seo-analyzer__technical');
  if (!techContainer) return;

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