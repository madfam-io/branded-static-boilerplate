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

import {
  generateMetaTags,
  calculateSEOScore,
  generateSERPPreview,
  validateTitle,
  validateDescription
} from '../../scripts/seo/seo-utils.js';

// Constants
const CONSTANTS = {
  // Circle dimensions
  CIRCLE_RADIUS: 45,
  PI_MULTIPLIER: 2,
  // Score thresholds
  EXCELLENT_THRESHOLD: 90,
  GOOD_THRESHOLD: 80,
  AVERAGE_THRESHOLD: 70,
  POOR_THRESHOLD: 60,
  // Content thresholds
  MIN_WORD_COUNT: 300,
  PERCENTAGE_MAX: 100,
  KEYWORD_BASE: 10,
  MIN_WORD_LENGTH: 2,
  // Animation
  ANIMATION_DELAY: 300,
  DECIMAL_PLACES: 1,
  ATTRIBUTE_SPLIT_PARTS: 2,
  DEFAULT_PARTS: 3
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

    // Re-analyze on relevant page changes
    this.observePageChanges();
  }

  /**
   * Cache DOM elements
   * @method cacheElements
   */
  cacheElements() {
    // Main elements
    this.toggleBtn = this.element.querySelector('[data-seo-toggle]');
    this.content = this.element.querySelector('[data-seo-content]');
    this.minimized = this.element.querySelector('[data-seo-minimized]');

    // Score elements
    this.scoreRing = this.element.querySelector('[data-seo-score-ring]');
    this.scoreNumber = this.element.querySelector('[data-seo-score-number]');
    this.scoreGrade = this.element.querySelector('[data-seo-score-grade]');
    this.scoreMessage = this.element.querySelector('[data-seo-score-message]');
    this.scoreCircle = this.element.querySelector('[data-seo-score]');

    // Tab elements
    this.tabs = this.element.querySelectorAll('[data-tab]');
    this.panels = this.element.querySelectorAll('[data-panel]');

    // Content areas
    this.breakdownArea = this.element.querySelector('[data-seo-breakdown]');
    this.insightsArea = this.element.querySelector('[data-seo-insights-list]');
    this.metaListArea = this.element.querySelector('[data-seo-meta-list]');
    this.contentStatsArea = this.element.querySelector('[data-seo-content-stats]');
    this.keywordsArea = this.element.querySelector('[data-seo-keywords]');
    this.tipsArea = this.element.querySelector('[data-seo-tips]');

    // SERP preview
    this.serpUrl = this.element.querySelector('[data-serp-url]');
    this.serpTitle = this.element.querySelector('[data-serp-title]');
    this.serpDescription = this.element.querySelector('[data-serp-description]');

    // Meta editor
    this.titleInput = this.element.querySelector('[data-seo-title-input]');
    this.titleCount = this.element.querySelector('[data-seo-title-count]');
    this.titleStatus = this.element.querySelector('[data-seo-title-status]');
    this.descriptionInput = this.element.querySelector('[data-seo-description-input]');
    this.descriptionCount = this.element.querySelector('[data-seo-description-count]');
    this.descriptionStatus = this.element.querySelector('[data-seo-description-status]');

    // Other elements
    this.refreshBtn = this.element.querySelector('[data-seo-refresh]');
    this.miniScore = this.element.querySelector('[data-seo-mini-score]');
  }

  /**
   * Bind event listeners
   * @method bindEvents
   */
  bindEvents() {
    // Toggle collapse
    this.toggleBtn.addEventListener('click', () => this.toggleCollapse());
    this.minimized.addEventListener('click', () => this.toggleCollapse());

    // Tab switching
    this.tabs.forEach(tab => {
      tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
    });

    // Refresh analysis
    this.refreshBtn.addEventListener('click', () => this.analyzePage());

    // Meta editor
    if (this.titleInput) {
      this.titleInput.addEventListener('input', () => this.updateMetaPreview());
    }

    if (this.descriptionInput) {
      this.descriptionInput.addEventListener('input', () => this.updateMetaPreview());
    }

    // Device toggle for SERP preview
    const deviceToggles = this.element.querySelectorAll('[data-device-toggle]');
    deviceToggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        deviceToggles.forEach(t => t.classList.remove('active'));
        toggle.classList.add('active');
        // In a real implementation, adjust preview for device
      });
    });
  }

  /**
   * Toggle collapsed state
   * @method toggleCollapse
   */
  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    this.element.classList.toggle('bsb-seo-analyzer--collapsed', this.isCollapsed);
    this.toggleBtn.setAttribute('aria-expanded', !this.isCollapsed);
    this.content.setAttribute('aria-hidden', this.isCollapsed);
  }

  /**
   * Switch active tab
   * @method switchTab
   * @param {string} tabName - Tab to activate
   */
  switchTab(tabName) {
    this.currentTab = tabName;

    // Update tabs
    this.tabs.forEach(tab => {
      const isActive = tab.dataset.tab === tabName;
      tab.classList.toggle('bsb-seo-analyzer__tab--active', isActive);
      tab.setAttribute('aria-selected', isActive);
    });

    // Update panels
    this.panels.forEach(panel => {
      const isActive = panel.dataset.panel === tabName;
      panel.classList.toggle('bsb-seo-analyzer__panel--active', isActive);
    });
  }

  /**
   * Analyze current page
   * @method analyzePage
   */
  async analyzePage() {
    // Show loading state
    this.scoreMessage.textContent = 'Analyzing page...';

    // Gather page data
    this.pageData = this.gatherPageData();

    // Calculate SEO score
    const seoScore = calculateSEOScore(this.pageData);

    // Update UI
    this.updateScore(seoScore);
    this.updateBreakdown(seoScore.breakdown);
    this.updateInsights(seoScore.insights);
    this.updateMetaTags();
    this.updateContentStats();
    this.updateSERPPreview();
    this.updateTips(seoScore);

    // Update minimized score
    this.miniScore.textContent = seoScore.overall;
  }

  /**
   * Gather page data for analysis
   * @method gatherPageData
   * @returns {Object} Page data
   */
  gatherPageData() {
    const data = {
      // Basic meta
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.content || '',
      keywords: document.querySelector('meta[name="keywords"]')?.content || '',
      canonical: document.querySelector('link[rel="canonical"]')?.href,

      // URL
      url: window.location.href,

      // Headings
      h1Count: document.querySelectorAll('h1').length,
      headings: this.analyzeHeadings(),
      headingHierarchy: this.checkHeadingHierarchy(),

      // Images
      images: this.analyzeImages(),

      // Links
      links: this.analyzeLinks(),

      // Content
      content: this.analyzeContent(),

      // Technical
      structuredData: this.hasStructuredData(),
      mobileFriendly: this.isMobileFriendly(),
      https: window.location.protocol === 'https:'
    };

    return data;
  }

  /**
   * Analyze heading structure
   * @method analyzeHeadings
   * @returns {Array} Heading analysis
   */
  analyzeHeadings() {
    const headings = [];
    const allHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

    allHeadings.forEach(heading => {
      headings.push({
        level: parseInt(heading.tagName.charAt(1), 10),
        text: heading.textContent.trim(),
        length: heading.textContent.trim().length
      });
    });

    return headings;
  }

  /**
   * Check heading hierarchy
   * @method checkHeadingHierarchy
   * @returns {boolean} True if hierarchy is correct
   */
  checkHeadingHierarchy() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let lastLevel = 0;
    let isValid = true;

    headings.forEach(heading => {
      const level = parseInt(heading.tagName.charAt(1), 10);
      if (level > lastLevel + 1) {
        isValid = false;
      }
      lastLevel = level;
    });

    return isValid;
  }

  /**
   * Analyze images
   * @method analyzeImages
   * @returns {Array} Image analysis
   */
  analyzeImages() {
    const images = [];
    const allImages = document.querySelectorAll('img');

    allImages.forEach(img => {
      images.push({
        src: img.src,
        alt: img.alt,
        width: img.width,
        height: img.height,
        loading: img.loading
      });
    });

    return images;
  }

  /**
   * Analyze links
   * @method analyzeLinks
   * @returns {Object} Link analysis
   */
  analyzeLinks() {
    const links = document.querySelectorAll('a[href]');
    let internal = 0;
    let external = 0;
    let externalNofollow = 0;

    links.forEach(link => {
      const { href } = link;
      const isExternal = !href.includes(window.location.hostname);

      if (isExternal) {
        external += 1;
        if (link.rel && link.rel.includes('nofollow')) {
          externalNofollow += 1;
        }
      } else {
        internal += 1;
      }
    });

    return { internal, external, externalNofollow, total: links.length };
  }

  /**
   * Analyze content
   * @method analyzeContent
   * @returns {Object} Content analysis
   */
  analyzeContent() {
    const textContent = document.body.innerText || document.body.textContent || '';
    const words = textContent.trim().split(/\s+/u)
      .filter(word => word.length > CONSTANTS.MIN_WORD_LENGTH);

    // Calculate keyword density
    const wordFrequency = {};
    words.forEach(word => {
      const normalized = word.toLowerCase().replace(/[^a-z0-9]/gu, '');
      if (normalized.length > 3) {
        wordFrequency[normalized] = (wordFrequency[normalized] || 0) + 1;
      }
    });

    // Get top keywords
    const topKeywords = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, CONSTANTS.KEYWORD_BASE)
      .map(([word, count]) => ({
        word,
        count,
        density: ((count / words.length) * CONSTANTS.PERCENTAGE_MAX)
          .toFixed(CONSTANTS.DECIMAL_PLACES)
      }));

    return {
      wordCount: words.length,
      characterCount: textContent.length,
      topKeywords
    };
  }

  /**
   * Check for structured data
   * @method hasStructuredData
   * @returns {boolean} True if structured data exists
   */
  hasStructuredData() {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    return scripts.length > 0;
  }

  /**
   * Check if mobile friendly
   * @method isMobileFriendly
   * @returns {boolean} True if mobile friendly
   */
  isMobileFriendly() {
    const viewport = document.querySelector('meta[name="viewport"]');
    return viewport && viewport.content.includes('width=device-width');
  }

  /**
   * Update SEO score display
   * @method updateScore
   * @param {Object} score - SEO score data
   */
  updateScore(score) {
    // Update score number
    this.scoreNumber.textContent = score.overall;
    this.scoreGrade.textContent = score.grade;

    // Update score ring
    const circumference = CONSTANTS.PI_MULTIPLIER * Math.PI * CONSTANTS.CIRCLE_RADIUS;
    const offset = circumference - (score.overall / CONSTANTS.PERCENTAGE_MAX) * circumference;
    this.scoreRing.style.strokeDashoffset = offset;

    // Update score circle color
    this.scoreCircle.setAttribute('data-grade', score.grade);

    // Update message
    let message = '';
    if (score.overall >= CONSTANTS.EXCELLENT_THRESHOLD) {
      message = 'Excellent SEO! Your page is well-optimized.';
    } else if (score.overall >= CONSTANTS.GOOD_THRESHOLD) {
      message = 'Good SEO, but there\'s room for improvement.';
    } else if (score.overall >= CONSTANTS.AVERAGE_THRESHOLD) {
      message = 'Average SEO. Consider implementing suggestions.';
    } else if (score.overall >= CONSTANTS.POOR_THRESHOLD) {
      message = 'Below average SEO. Several improvements needed.';
    } else {
      message = 'Poor SEO. Significant improvements required.';
    }

    this.scoreMessage.textContent = message;
  }

  /**
   * Update score breakdown
   * @method updateBreakdown
   * @param {Object} breakdown - Score breakdown
   */
  updateBreakdown(breakdown) {
    const items = Object.entries(breakdown).map(([category, score]) => {
      const percentage = Math.round(score);
      return `
        <div class="bsb-seo-analyzer__breakdown-item">
          <span class="bsb-seo-analyzer__breakdown-label">${this.formatCategory(category)}</span>
          <div class="bsb-seo-analyzer__breakdown-score">
            <div class="bsb-seo-analyzer__breakdown-bar">
              <div class="bsb-seo-analyzer__breakdown-fill" style="width: ${percentage}%"></div>
            </div>
            <span>${percentage}%</span>
          </div>
        </div>
      `;
    }).join('');

    this.breakdownArea.innerHTML = items;
  }

  /**
   * Update insights list
   * @method updateInsights
   * @param {Array} insights - SEO insights
   */
  updateInsights(insights) {
    if (insights.length === 0) {
      this.insightsArea.innerHTML = 
        '<li class="bsb-seo-analyzer__insight">No major issues found! 🎉</li>';
      return;
    }

    const items = insights.map(insight => {
      let icon = 'ℹ️';
      if (insight.impact === 'high') {
        icon = '❗';
      } else if (insight.impact === 'medium') {
        icon = '⚠️';
      } else {
        icon = 'ℹ️';
      }

      return `
        <li class="bsb-seo-analyzer__insight bsb-seo-analyzer__insight--${insight.impact}">
          <span class="bsb-seo-analyzer__insight-icon">${icon}</span>
          <div>
            <strong>${insight.category}:</strong> ${insight.issue}
            <br><small>${insight.solution}</small>
          </div>
        </li>
      `;
    }).join('');

    this.insightsArea.innerHTML = items;
  }

  /**
   * Update meta tags display
   * @method updateMetaTags
   */
  updateMetaTags() {
    const metaTags = [];

    // Title
    metaTags.push({
      name: 'Title',
      content: this.pageData.title,
      status: validateTitle(this.pageData.title)
    });

    // Description
    metaTags.push({
      name: 'Description',
      content: this.pageData.description,
      status: validateDescription(this.pageData.description)
    });

    // Other meta tags
    const metas = document.querySelectorAll('meta[name], meta[property]');
    metas.forEach(meta => {
      const name = meta.name || meta.getAttribute('property');
      const { content } = meta;

      if (name && !['description', 'keywords'].includes(name.toLowerCase())) {
        metaTags.push({ name, content, status: { status: 'info' } });
      }
    });

    // Display meta tags
    const html = metaTags.map(tag => `
      <div class="bsb-seo-analyzer__meta-item">
        <strong>${tag.name}:</strong> ${tag.content || '(empty)'}
        ${tag.status ? `<br><small class="bsb-seo-analyzer__field-status--${tag.status.status}">${tag.status.message || ''}</small>` : ''}
      </div>
    `).join('');

    this.metaListArea.innerHTML = html;

    // Update editor inputs
    if (this.titleInput) {
      this.titleInput.value = this.pageData.title;
      this.updateMetaPreview();
    }

    if (this.descriptionInput) {
      this.descriptionInput.value = this.pageData.description;
      this.updateMetaPreview();
    }
  }

  /**
   * Update content statistics
   * @method updateContentStats
   */
  updateContentStats() {
    const stats = this.pageData.content;

    const html = `
      <div class="bsb-seo-analyzer__stat">
        <strong>Word Count:</strong> ${stats.wordCount}
        ${stats.wordCount < CONSTANTS.MIN_WORD_COUNT ? `<span class="bsb-seo-analyzer__field-status--warning"> (aim for ${CONSTANTS.MIN_WORD_COUNT}+)</span>` : ''}
      </div>
      <div class="bsb-seo-analyzer__stat">
        <strong>Character Count:</strong> ${stats.characterCount}
      </div>
      <div class="bsb-seo-analyzer__stat">
        <strong>Images:</strong> ${this.pageData.images.length}
        ${this.pageData.images.filter(img => !img.alt).length > 0 ?
    `<span class="bsb-seo-analyzer__field-status--error"> (${this.pageData.images.filter(img => !img.alt).length} missing alt text)</span>` : ''}
      </div>
      <div class="bsb-seo-analyzer__stat">
        <strong>Internal Links:</strong> ${this.pageData.links.internal}
      </div>
      <div class="bsb-seo-analyzer__stat">
        <strong>External Links:</strong> ${this.pageData.links.external}
      </div>
    `;

    this.contentStatsArea.innerHTML = html;

    // Update keywords
    const keywordsHtml = stats.topKeywords.map(keyword => `
      <span class="bsb-seo-analyzer__keyword">
        ${keyword.word}
        <span class="bsb-seo-analyzer__keyword-count">${keyword.density}%</span>
      </span>
    `).join('');

    this.keywordsArea.innerHTML = keywordsHtml;
  }

  /**
   * Update SERP preview
   * @method updateSERPPreview
   */
  updateSERPPreview() {
    const preview = generateSERPPreview({
      title: this.titleInput?.value || this.pageData.title,
      description: this.descriptionInput?.value || this.pageData.description,
      url: this.pageData.url
    });

    this.serpTitle.textContent = preview.title;
    this.serpDescription.textContent = preview.description;
    this.serpUrl.textContent = preview.url;

    // Add truncation indicators
    if (preview.titleTruncated) {
      this.serpTitle.classList.add('truncated');
    }

    if (preview.descriptionTruncated) {
      this.serpDescription.classList.add('truncated');
    }
  }

  /**
   * Update meta preview from inputs
   * @method updateMetaPreview
   */
  updateMetaPreview() {
    // Title validation
    const titleValue = this.titleInput.value;
    const titleValidation = validateTitle(titleValue);
    this.titleCount.textContent = titleValue.length;
    let titleStatusText = '';
    if (titleValidation.status === 'excellent') {
      titleStatusText = '✓ Perfect!';
    } else if (titleValidation.status === 'good') {
      titleStatusText = '✓ Good';
    } else if (titleValidation.status === 'warning') {
      titleStatusText = '⚠️ Warning';
    } else {
      titleStatusText = '❌ Too long/short';
    }
    this.titleStatus.textContent = titleStatusText;
    this.titleStatus.className = `bsb-seo-analyzer__field-status bsb-seo-analyzer__field-status--${titleValidation.status}`;

    // Description validation
    const descValue = this.descriptionInput.value;
    const descValidation = validateDescription(descValue);
    this.descriptionCount.textContent = descValue.length;
    let descStatusText = '';
    if (descValidation.status === 'excellent') {
      descStatusText = '✓ Perfect!';
    } else if (descValidation.status === 'good') {
      descStatusText = '✓ Good';
    } else if (descValidation.status === 'warning') {
      descStatusText = '⚠️ Warning';
    } else {
      descStatusText = '❌ Too long/short';
    }
    this.descriptionStatus.textContent = descStatusText;
    this.descriptionStatus.className = `bsb-seo-analyzer__field-status bsb-seo-analyzer__field-status--${descValidation.status}`;

    // Update SERP preview
    this.updateSERPPreview();
  }

  /**
   * Update educational tips
   * @method updateTips
   * @param {Object} score - SEO score data
   */
  updateTips(score) {
    const tips = [];

    // Add contextual tips based on score
    if (score.overall < CONSTANTS.AVERAGE_THRESHOLD) {
      tips.push('Focus on fixing high-impact issues first, especially title and meta description optimization.');
    }

    if (score.breakdown.images < CONSTANTS.GOOD_THRESHOLD) {
      tips.push('Always add descriptive alt text to images for better accessibility and SEO.');
    }

    if (score.breakdown.content < CONSTANTS.GOOD_THRESHOLD) {
      tips.push(`Aim for at least ${CONSTANTS.MIN_WORD_COUNT} words of quality content that provides value to users.`);
    }

    if (!this.pageData.structuredData) {
      tips.push('Consider adding structured data (JSON-LD) to help search engines understand your content better.');
    }

    // Add a random general tip
    const generalTips = [
      'Use your primary keyword in the title, preferably near the beginning.',
      'Write meta descriptions that encourage clicks with clear value propositions.',
      'Use heading tags (H1-H6) to create a logical content hierarchy.',
      'Internal linking helps search engines understand your site structure.',
      'Page speed is a ranking factor - optimize images and minimize JavaScript.',
      'Mobile-friendliness is crucial - over 50% of searches are on mobile devices.',
      'Fresh content signals relevance - update pages regularly.',
      'Use semantic HTML5 elements for better content structure.'
    ];

    tips.push(generalTips[Math.floor(Math.random() * generalTips.length)]);

    // Display tips
    this.tipsArea.innerHTML = tips.map(tip => `<p>💡 ${tip}</p>`).join('');
  }

  /**
   * Observe page changes
   * @method observePageChanges
   */
  observePageChanges() {
    // Re-analyze when title changes
    const titleElement = document.querySelector('title');
    if (titleElement) {
      const observer = new MutationObserver(() => {
        this.analyzePage();
      });

      observer.observe(titleElement, { childList: true, characterData: true, subtree: true });
    }

    // Re-analyze when meta tags change
    const metaObserver = new MutationObserver(mutations => {
      const relevantChange = mutations.some(mutation => mutation.type === 'attributes' &&
               (mutation.attributeName === 'content' || mutation.attributeName === 'name'));

      if (relevantChange) {
        this.analyzePage();
      }
    });

    document.querySelectorAll('meta').forEach(meta => {
      metaObserver.observe(meta, { attributes: true });
    });
  }

  /**
   * Format category name
   * @method formatCategory
   * @param {string} category - Category key
   * @returns {string} Formatted name
   */
  formatCategory(category) {
    const names = {
      title: 'Title Tag',
      description: 'Meta Description',
      headings: 'Heading Structure',
      images: 'Image Optimization',
      links: 'Link Structure',
      content: 'Content Quality',
      technical: 'Technical SEO'
    };

    return names[category] || category.charAt(0).toUpperCase() + category.slice(1);
  }
}

// Initialize all SEO analyzer components
document.addEventListener('DOMContentLoaded', () => {
  const analyzers = document.querySelectorAll('[data-bsb-component="seo-analyzer"]');

  analyzers.forEach(analyzer => {
    const seoAnalyzer = new BSBSEOAnalyzer(analyzer);
    // Store reference if needed for later access
    analyzer.seoAnalyzerInstance = seoAnalyzer;
  });
});

// Export for use in other modules
export default BSBSEOAnalyzer;