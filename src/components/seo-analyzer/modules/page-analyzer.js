/**
 * Page Analysis Module
 * ====================
 *
 * Analyzes various aspects of the page for SEO scoring
 */

import {
  generateMetaTags,
  calculateSEOScore,
  validateTitle,
  validateDescription
} from '../../../scripts/seo/seo-utils.js';

// Constants
const CONSTANTS = {
  MIN_WORD_COUNT: 300,
  PERCENTAGE_MAX: 100,
  KEYWORD_BASE: 10,
  MIN_WORD_LENGTH: 2,
  MIN_KEYWORD_LENGTH: 3,
  DECIMAL_PLACES: 1
};

/**
 * Gather comprehensive page data for analysis
 * @returns {Object} Page data
 */

/**
 * Check heading hierarchy for SEO best practices
 * @returns {Object} Hierarchy analysis
 */
const checkHeadingHierarchy = () => {
  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
    .map(heading => ({
      level: parseInt(heading.tagName.charAt(1)),
      text: heading.textContent.trim()
    }));

  const issues = [];
  let previousLevel = 0;

  headings.forEach((heading, index) => {
    if (index === 0 && heading.level !== 1) {
      issues.push('Page should start with an H1 heading');
    }
    if (heading.level > previousLevel + 1) {
      issues.push(`Heading hierarchy skips levels (H${previousLevel} to H${heading.level})`);
    }
    previousLevel = heading.level;
  });

  return {
    isValid: issues.length === 0,
    issues
  };
};

/**
 * Analyze page headings structure
 * @returns {Object} Heading analysis
 */
export const analyzeHeadings = () => {
  const headings = {
    h1: document.querySelectorAll('h1').length,
    h2: document.querySelectorAll('h2').length,
    h3: document.querySelectorAll('h3').length,
    h4: document.querySelectorAll('h4').length,
    h5: document.querySelectorAll('h5').length,
    h6: document.querySelectorAll('h6').length
  };

  return {
    ...headings,
    total: Object.values(headings).reduce((sum, count) => sum + count, 0),
    hierarchy: checkHeadingHierarchy()
  };
};

/**
 * Analyze images for SEO optimization
 * @returns {Object} Image analysis
 */
export const analyzeImages = () => {
  const images = Array.from(document.querySelectorAll('img'));
  const withAlt = images.filter(img => img.alt && img.alt.trim().length > 0);
  const withTitle = images.filter(img => img.title);
  const withoutAlt = images.filter(img => !img.alt || img.alt.trim().length === 0);

  return {
    total: images.length,
    withAlt: withAlt.length,
    withTitle: withTitle.length,
    withoutAlt: withoutAlt.length,
    altCoverage: images.length > 0 ? (withAlt.length / images.length) * CONSTANTS.PERCENTAGE_MAX : CONSTANTS.PERCENTAGE_MAX
  };
};

/**
 * Analyze links for SEO factors
 * @returns {Object} Link analysis
 */
export const analyzeLinks = () => {
  const links = Array.from(document.querySelectorAll('a[href]'));
  const internal = links.filter(link => {
    try {
      const url = new URL(link.href, window.location.origin);
      return url.hostname === window.location.hostname;
    } catch {
      return false;
    }
  });
  const external = links.filter(link => {
    try {
      const url = new URL(link.href, window.location.origin);
      return url.hostname !== window.location.hostname;
    } catch {
      return false;
    }
  });
  const withoutTitle = links.filter(link => !link.title || link.title.trim().length === 0);

  return {
    total: links.length,
    internal: internal.length,
    external: external.length,
    withoutTitle: withoutTitle.length
  };
};

/**
 * Analyze content for SEO factors
 * @returns {Object} Content analysis
 */
export const analyzeContent = () => {
  const textContent = document.body.textContent || '';
  const words = textContent
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length >= CONSTANTS.MIN_WORD_LENGTH);

  const wordCount = words.length;
  const readingTime = Math.ceil(wordCount / 200); // 200 words per minute

  // Calculate keyword density (simple version)
  const wordFrequency = {};
  words.forEach(word => {
    if (word.length >= CONSTANTS.MIN_KEYWORD_LENGTH) {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    }
  });

  const sortedWords = Object.entries(wordFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, CONSTANTS.KEYWORD_BASE);

  const topKeywords = sortedWords.map(([word, count]) => ({
    word,
    count,
    density: ((count / wordCount) * CONSTANTS.PERCENTAGE_MAX).toFixed(1)
  }));

  return {
    wordCount,
    readingTime,
    topKeywords,
    hasMinContent: wordCount >= CONSTANTS.MIN_WORD_COUNT
  };
};

/**
 * Check if page has structured data
 * @returns {boolean} Has structured data
 */
const hasStructuredData = () => {
  const jsonLd = document.querySelectorAll('script[type="application/ld+json"]');
  const microdata = document.querySelectorAll('[itemscope]');
  return jsonLd.length > 0 || microdata.length > 0;
};

/**
 * Check if page is mobile-friendly
 * @returns {boolean} Is mobile-friendly
 */
const isMobileFriendly = () => {
  const viewport = document.querySelector('meta[name="viewport"]');
  return viewport && viewport.content.includes('width=device-width');
};

/**
 * Gather comprehensive page data for analysis
 * @returns {Object} Page data
 */
export const gatherPageData = () => {
  return {
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.content || '',
    keywords: document.querySelector('meta[name="keywords"]')?.content || '',
    url: window.location.href,
    headings: analyzeHeadings(),
    images: analyzeImages(),
    links: analyzeLinks(),
    content: analyzeContent(),
    hasStructuredData: hasStructuredData(),
    isMobileFriendly: isMobileFriendly()
  };
};