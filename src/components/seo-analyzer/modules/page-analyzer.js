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
  // Content analysis
  MIN_WORD_COUNT: 300,
  WORDS_PER_MINUTE: 200, // Average reading speed
  MIN_WORD_LENGTH: 2,
  MIN_KEYWORD_LENGTH: 3,
  KEYWORD_BASE: 10,

  // Calculations
  PERCENTAGE_MAX: 100,
  DECIMAL_PLACES: 1,

  // Array and indexing
  ARRAY_EMPTY: 0,
  FIRST_INDEX: 0,
  INCREMENT: 1,

  // Heading levels
  H1_LEVEL: 1,
  HEADING_CHAR_POSITION: 1
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
      level: parseInt(heading.tagName.charAt(CONSTANTS.HEADING_CHAR_POSITION), 10),
      text: heading.textContent.trim()
    }));

  const issues = [];
  let previousLevel = CONSTANTS.ARRAY_EMPTY;

  headings.forEach((heading, index) => {
    if (index === CONSTANTS.FIRST_INDEX && heading.level !== CONSTANTS.H1_LEVEL) {
      issues.push('Page should start with an H1 heading');
    }
    if (heading.level > previousLevel + CONSTANTS.INCREMENT) {
      issues.push(`Heading hierarchy skips levels (H${previousLevel} to H${heading.level})`);
    }
    previousLevel = heading.level;
  });

  return {
    isValid: issues.length === CONSTANTS.ARRAY_EMPTY,
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
    total: Object.values(headings).reduce((sum, count) => sum + count, CONSTANTS.ARRAY_EMPTY),
    hierarchy: checkHeadingHierarchy()
  };
};

/**
 * Analyze images for SEO optimization
 * @returns {Object} Image analysis
 */
export const analyzeImages = () => {
  const images = Array.from(document.querySelectorAll('img'));
  const withAlt = images.filter(img => img.alt &&
    img.alt.trim().length > CONSTANTS.ARRAY_EMPTY);
  const withTitle = images.filter(img => img.title);
  const withoutAlt = images.filter(img => !img.alt ||
    img.alt.trim().length === CONSTANTS.ARRAY_EMPTY);

  return {
    total: images.length,
    withAlt: withAlt.length,
    withTitle: withTitle.length,
    withoutAlt: withoutAlt.length,
    altCoverage: images.length > CONSTANTS.ARRAY_EMPTY
      ? (withAlt.length / images.length) * CONSTANTS.PERCENTAGE_MAX
      : CONSTANTS.PERCENTAGE_MAX
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
  const withoutTitle = links.filter(link => !link.title ||
    link.title.trim().length === CONSTANTS.ARRAY_EMPTY);

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
    .split(/\s+/u)
    .filter(word => word.length >= CONSTANTS.MIN_WORD_LENGTH);

  const wordCount = words.length;
  const readingTime = Math.ceil(wordCount / CONSTANTS.WORDS_PER_MINUTE);

  // Calculate keyword density (simple version)
  const wordFrequency = {};
  words.forEach(word => {
    if (word.length >= CONSTANTS.MIN_KEYWORD_LENGTH) {
      wordFrequency[word] = (wordFrequency[word] || CONSTANTS.ARRAY_EMPTY) + CONSTANTS.INCREMENT;
    }
  });

  const sortedWords = Object.entries(wordFrequency)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(CONSTANTS.FIRST_INDEX, CONSTANTS.KEYWORD_BASE);

  const topKeywords = sortedWords.map(([word, count]) => ({
    word,
    count,
    density: ((count / wordCount) * CONSTANTS.PERCENTAGE_MAX).toFixed(CONSTANTS.DECIMAL_PLACES)
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
  return jsonLd.length > CONSTANTS.ARRAY_EMPTY || microdata.length > CONSTANTS.ARRAY_EMPTY;
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
export const gatherPageData = () => ({
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
});