/**
 * =============================================================================
 * SEO ANALYZER COMPONENT - Interactive SEO Analysis
 * =============================================================================
 *
 * This component provides real-time SEO analysis and education, helping
 * developers understand and improve their pages' search engine optimization.
 *
 * 🎯 Features:
 * - Real-time page analysis
 * - Meta tag validation
 * - Content analysis
 * - SERP preview
 * - Educational insights
 *
 * 📚 Educational Value:
 * - Learn by doing with instant feedback
 * - Understand SEO scoring factors
 * - See how changes affect SEO
 * - Get actionable recommendations
 * =============================================================================
 */

import { logger } from '../../scripts/core/logger.js';
import { calculateSEOScore } from '../../scripts/seo/seo-utils.js';

import { gatherPageData } from './modules/page-analyzer.js';
import {
  updateScore,
  updateBreakdown,
  updateInsights,
  updateMetaTags,
  updateContentStats,
  updateTechnicalSEO
} from './modules/ui-updater.js';
import { bindEvents, cleanup, toggleCollapse, switchTab } from './modules/event-handlers.js';

// SEO Analyzer constants
const SEO_ANALYZER_CONSTANTS = {
  ERROR_DISPLAY_DURATION: 5000 // 5 seconds
};

/**
 * SEO Analyzer Component
 * @class BSBSEOAnalyzer
 */
class BSBSEOAnalyzer {
  /**
   * Create SEO analyzer instance
   * @constructor
   * @param {HTMLElement} element - Component element
   */
  constructor(element) {
    this.element = element;
    this.isCollapsed = false;
    this.currentTab = 'overview';
    this.pageData = {};

    this.init();
  }

  /**
   * Initialize component
   * @method init
   */
  init() {
    this.cacheElements();
    this.bindEvents();
    this.analyzePage();
  }

  /**
   * Cache DOM elements
   * @method cacheElements
   */
  cacheElements() {
    this.toggleBtn = this.element.querySelector('.seo-analyzer__toggle');
    this.refreshBtn = this.element.querySelector('.seo-analyzer__refresh');
    this.tabButtons = this.element.querySelectorAll('.seo-analyzer__tab');
    this.tabPanels = this.element.querySelectorAll('.seo-analyzer__panel');
    this.scoreElement = this.element.querySelector('.seo-analyzer__score-number');
    this.gradeElement = this.element.querySelector('.seo-analyzer__grade');
  }

  /**
   * Bind event listeners
   * @method bindEvents
   */
  bindEvents() {
    const handlers = {
      onToggle: () => this.toggleCollapse(),
      onTabSwitch: tabName => this.switchTab(tabName),
      onRefresh: () => this.analyzePage(),
      onAutoRefresh: () => this.analyzePage()
    };

    bindEvents(this.element, handlers);
  }

  /**
   * Toggle analyzer collapse state
   * @method toggleCollapse
   */
  toggleCollapse() {
    this.isCollapsed = toggleCollapse(this.element, this.isCollapsed);
  }

  /**
   * Switch between tabs
   * @method switchTab
   * @param {string} tabName - Tab to switch to
   */
  switchTab(tabName) {
    this.currentTab = tabName;
    switchTab(this.element, tabName);
  }

  /**
   * Analyze the current page
   * @method analyzePage
   */
  async analyzePage() {
    try {
      // Gather page data
      this.pageData = gatherPageData();

      // Calculate SEO score
      const seoResult = await calculateSEOScore(this.pageData);

      // Update UI components
      this.updateAllDisplays(seoResult);

    } catch (error) {
      logger.error('SEO Analysis Error:', error);
      this.showError('Failed to analyze page. Please try again.');
    }
  }

  /**
   * Update all display components
   * @method updateAllDisplays
   * @param {Object} seoResult - SEO analysis result
   */
  updateAllDisplays(seoResult) {
    // Update score and breakdown
    updateScore(seoResult.score);
    updateBreakdown(seoResult.breakdown);

    // Update insights and recommendations
    updateInsights(seoResult.insights);

    // Update meta tags and SERP preview
    updateMetaTags(this.pageData);

    // Update content statistics
    updateContentStats(this.pageData.content);

    // Update technical SEO information
    updateTechnicalSEO(this.pageData);
  }

  /**
   * Show error message
   * @method showError
   * @param {string} message - Error message
   */
  showError(message) {
    const errorContainer = this.element.querySelector('.seo-analyzer__error');
    if (errorContainer) {
      errorContainer.textContent = message;
      errorContainer.style.display = 'block';
      setTimeout(() => {
        errorContainer.style.display = 'none';
      }, SEO_ANALYZER_CONSTANTS.ERROR_DISPLAY_DURATION);
    }
  }

  /**
   * Destroy component and cleanup
   * @method destroy
   */
  destroy() {
    cleanup(this.element);
  }
}

// Auto-initialize all SEO analyzer components
document.addEventListener('DOMContentLoaded', () => {
  const analyzers = document.querySelectorAll('[data-bsb-component="seo-analyzer"]');
  analyzers.forEach(element => {
    if (!element._bsbSEOAnalyzer) {
      element._bsbSEOAnalyzer = new BSBSEOAnalyzer(element);
    }
  });
});

// Export for manual initialization
export default BSBSEOAnalyzer;