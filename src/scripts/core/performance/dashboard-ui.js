/**
 * Performance Dashboard UI
 * ========================
 *
 * Manages the performance dashboard interface and visualization
 */

import { escapeHtml } from '../helpers/safe-html.js';

// UI Constants
const UI_CONSTANTS = {
  ANIMATION_DURATION: 300,
  ANIMATION_DELAY_STEP: 2,
  TOAST_DURATION: 4000,
  FLOAT_PRECISION: 0.25,
  PRECISION_MULTIPLIER: 10000
};

// Performance score thresholds
const SCORE_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 70,
  FAIR: 50
};

// Web Vitals thresholds (in milliseconds or unitless)
const VITALS_THRESHOLDS = {
  LCP_GOOD: 2500,
  LCP_POOR: 4000,
  FID_GOOD: 100,
  FID_POOR: 300,
  CLS_GOOD: 0.1,
  CLS_POOR: 0.25,
  TTFB_GOOD: 600,
  TTFB_POOR: 1500
};

/**
 * Get performance score CSS class
 * @param {number} score - Performance score
 * @returns {string} CSS class
 */
const getScoreClass = score => {
  if (score >= SCORE_THRESHOLDS.EXCELLENT) {
    return 'excellent';
  }
  if (score >= SCORE_THRESHOLDS.GOOD) {
    return 'good';
  }
  if (score >= SCORE_THRESHOLDS.FAIR) {
    return 'fair';
  }
  return 'poor';
};

/**
 * Get vital metric status
 * @param {number} value - Metric value
 * @param {number} goodThreshold - Good threshold
 * @param {number} poorThreshold - Poor threshold
 * @returns {string} Status class
 */
const getVitalStatus = (value, goodThreshold, poorThreshold) => {
  if (value <= goodThreshold) {
    return 'good';
  }
  if (value <= poorThreshold) {
    return 'fair';
  }
  return 'poor';
};

/**
 * Format metric value for display
 * @param {number} value - Raw value
 * @returns {string} Formatted value
 */
const formatMetricValue = value => {
  if (value < 1) {
    const roundedValue = Math.round(value * UI_CONSTANTS.PRECISION_MULTIPLIER) /
      UI_CONSTANTS.PRECISION_MULTIPLIER;
    return roundedValue.toString();
  }
  return Math.round(value).toString();
};

/**
 * Format bytes to human readable format
 * @param {number} bytes - Byte count
 * @returns {string} Formatted string
 */
const formatBytes = bytes => {
  if (bytes === 0) {
    return '0 B';
  }

  const kilobyte = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const index = Math.floor(Math.log(bytes) / Math.log(kilobyte));

  return `${parseFloat((bytes / kilobyte**index).toFixed(1))} ${sizes[index]}`;
};

/**
 * Get recommendation icon
 * @param {string} type - Recommendation type
 * @returns {string} Icon
 */
const getRecommendationIcon = type => {
  const icons = {
    lcp: '🖼️',
    fid: '⚡',
    cls: '📐',
    resources: '📦',
    memory: '💾',
    default: '💡'
  };
  return icons[type] || icons.default;
};

/**
 * Create individual vital metric
 * @param {string} name - Metric name
 * @param {number} value - Metric value
 * @param {string} unit - Value unit
 * @param {number} goodThreshold - Good performance threshold
 * @param {number} poorThreshold - Poor performance threshold
 * @returns {string} Metric HTML
 */
const createVitalMetric = ({ name, value, unit, goodThreshold, poorThreshold }) => {
  if (value === null || typeof value === 'undefined') {
    return `
      <div class="bsb-performance-dashboard__vital">
        <div class="bsb-performance-dashboard__vital-name">${name}</div>
        <div class="bsb-performance-dashboard__vital-value">—</div>
        <div class="bsb-performance-dashboard__vital-status neutral">N/A</div>
      </div>
    `;
  }

  const status = getVitalStatus(value, goodThreshold, poorThreshold);
  const formattedValue = formatMetricValue(value);

  return `
    <div class="bsb-performance-dashboard__vital">
      <div class="bsb-performance-dashboard__vital-name">${name}</div>
      <div class="bsb-performance-dashboard__vital-value">${formattedValue}${unit}</div>
      <div class="bsb-performance-dashboard__vital-status ${status}">${status.toUpperCase()}</div>
    </div>
  `;
};

/**
 * Create Web Vitals section
 * @param {Object} vitals - Web Vitals data
 * @returns {string} Vitals section HTML
 */
const createVitalsSection = vitals => {
  if (!vitals) {
    return '';
  }

  return `
    <div class="bsb-performance-dashboard__section">
      <h4 class="bsb-performance-dashboard__section-title">Web Vitals</h4>
      <div class="bsb-performance-dashboard__vitals">
        ${createVitalMetric({ name: 'LCP', value: vitals.lcp, unit: 'ms', goodThreshold: VITALS_THRESHOLDS.LCP_GOOD, poorThreshold: VITALS_THRESHOLDS.LCP_POOR })}
        ${createVitalMetric({ name: 'FID', value: vitals.fid, unit: 'ms', goodThreshold: VITALS_THRESHOLDS.FID_GOOD, poorThreshold: VITALS_THRESHOLDS.FID_POOR })}
        ${createVitalMetric({ name: 'CLS', value: vitals.cls, unit: '', goodThreshold: VITALS_THRESHOLDS.CLS_GOOD, poorThreshold: VITALS_THRESHOLDS.CLS_POOR })}
        ${createVitalMetric({ name: 'TTFB', value: vitals.ttfb, unit: 'ms', goodThreshold: VITALS_THRESHOLDS.TTFB_GOOD, poorThreshold: VITALS_THRESHOLDS.TTFB_POOR })}
      </div>
    </div>
  `;
};

/**
 * Create resources section
 * @param {Array} resources - Resource metrics
 * @returns {string} Resources section HTML
 */
const createResourcesSection = resources => {
  if (!resources || resources.length === 0) {
    return '';
  }

  const totalSize = resources.reduce((sum, resource) => sum + resource.size, 0);
  const largeResources = resources.filter(resource => resource.isLarge);
  const slowResources = resources.filter(resource => resource.isSlow);

  return `
    <div class="bsb-performance-dashboard__section">
      <h4 class="bsb-performance-dashboard__section-title">Resources</h4>
      <div class="bsb-performance-dashboard__resources-summary">
        <div class="bsb-performance-dashboard__resource-stat">
          <span class="label">Total:</span>
          <span class="value">${escapeHtml(resources.length)}</span>
        </div>
        <div class="bsb-performance-dashboard__resource-stat">
          <span class="label">Size:</span>
          <span class="value">${escapeHtml(formatBytes(totalSize))}</span>
        </div>
        <div class="bsb-performance-dashboard__resource-stat">
          <span class="label">Large:</span>
          <span class="value ${largeResources.length > 0 ? 'warning' : ''}">${escapeHtml(largeResources.length)}</span>
        </div>
        <div class="bsb-performance-dashboard__resource-stat">
          <span class="label">Slow:</span>
          <span class="value ${slowResources.length > 0 ? 'warning' : ''}">${escapeHtml(slowResources.length)}</span>
        </div>
      </div>
    </div>
  `;
};

/**
 * Create recommendations section
 * @param {Array} recommendations - Performance recommendations
 * @returns {string} Recommendations section HTML
 */
const createRecommendationsSection = recommendations => {
  if (!recommendations || recommendations.length === 0) {
    return `
      <div class="bsb-performance-dashboard__section">
        <h4 class="bsb-performance-dashboard__section-title">Recommendations</h4>
        <div class="bsb-performance-dashboard__no-recommendations">
          ✅ No performance issues detected!
        </div>
      </div>
    `;
  }

  const recommendationsHTML = recommendations.map(rec => `
    <div class="bsb-performance-dashboard__recommendation ${rec.severity}">
      <div class="bsb-performance-dashboard__rec-icon">
        ${getRecommendationIcon(rec.type)}
      </div>
      <div class="bsb-performance-dashboard__rec-content">
        <div class="bsb-performance-dashboard__rec-message">${escapeHtml(rec.message)}</div>
        <div class="bsb-performance-dashboard__rec-severity">${escapeHtml(rec.severity.toUpperCase())}</div>
      </div>
    </div>
  `).join('');

  return `
    <div class="bsb-performance-dashboard__section">
      <h4 class="bsb-performance-dashboard__section-title">Recommendations</h4>
      <div class="bsb-performance-dashboard__recommendations">
        ${recommendationsHTML}
      </div>
    </div>
  `;
};

/**
 * Create performance dashboard HTML template
 * @param {Object} metrics - Performance metrics
 * @returns {string} Dashboard HTML
 */
export const createDashboardTemplate = metrics => {
  const score = metrics.score || 0;
  const scoreClass = getScoreClass(score);

  return `
    <div class="bsb-performance-dashboard" id="performance-dashboard">
      <div class="bsb-performance-dashboard__header">
        <h3 class="bsb-performance-dashboard__title">
          ⚡ Performance Monitor
        </h3>
        <div class="bsb-performance-dashboard__score">
          <div class="bsb-performance-dashboard__score-circle ${scoreClass}">
            <span class="bsb-performance-dashboard__score-value">${escapeHtml(score)}</span>
          </div>
        </div>
        <button class="bsb-performance-dashboard__toggle"
                aria-label="Toggle dashboard">
          <span>−</span>
        </button>
      </div>

      <div class="bsb-performance-dashboard__content">
        ${createVitalsSection(metrics.vitals)}
        ${createResourcesSection(metrics.resources)}
        ${createRecommendationsSection(metrics.recommendations)}
      </div>
    </div>
  `;
};


/**
 * Update dashboard with new metrics
 * @param {HTMLElement} dashboard - Dashboard element
 * @param {Object} metrics - New metrics data
 */
export const updateDashboard = (dashboard, metrics) => {
  if (!dashboard) {
    return;
  }

  // Update score
  const scoreElement = dashboard.querySelector('.bsb-performance-dashboard__score-value');
  const scoreCircle = dashboard.querySelector('.bsb-performance-dashboard__score-circle');

  if (scoreElement && scoreCircle) {
    const newScore = metrics.score || 0;
    scoreElement.textContent = newScore;
    scoreCircle.className = `bsb-performance-dashboard__score-circle ${getScoreClass(newScore)}`;
  }

  // Update content sections
  const content = dashboard.querySelector('.bsb-performance-dashboard__content');
  if (content) {
    content.innerHTML = `
      ${createVitalsSection(metrics.vitals)}
      ${createResourcesSection(metrics.resources)}
      ${createRecommendationsSection(metrics.recommendations)}
    `;
  }
};

/**
 * Get toast type color
 * @param {string} type - Toast type
 * @returns {string} Color variable name
 */
const getToastTypeColor = type => {
  if (type === 'error') {
    return 'error';
  }
  if (type === 'warning') {
    return 'warning';
  }
  return 'success';
};

/**
 * Show performance toast notification
 * @param {string} message - Toast message
 * @param {string} type - Toast type (success, warning, error)
 */
export const showPerformanceToast = (message, type = 'info') => {
  const toast = document.createElement('div');
  toast.className = `bsb-performance-toast bsb-performance-toast--${type}`;
  toast.textContent = message;

  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--bsb-${getToastTypeColor(type)});
    color: white;
    padding: 12px 16px;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    font-size: 14px;
    max-width: 300px;
    animation: slideInRight 0.3s ease;
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => toast.remove(), UI_CONSTANTS.ANIMATION_DURATION);
  }, UI_CONSTANTS.TOAST_DURATION);
};