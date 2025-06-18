/**
 * =============================================================================
 * SEO UTILITIES - Search Engine Optimization Tools
 * =============================================================================
 *
 * This module provides comprehensive SEO utilities for optimizing pages
 * and teaching SEO best practices through interactive examples.
 *
 * 🎯 Features:
 * - Meta tag generation and validation
 * - Structured data helpers
 * - SEO score calculation
 * - SERP preview generation
 * - Educational SEO insights
 *
 * 📚 Learn More:
 * - SEO Fundamentals: /docs/tutorials/seo-basics.md
 * - Schema.org: https://schema.org
 * - Google SEO Guide: https://developers.google.com/search/docs/beginner/seo-starter-guide
 * =============================================================================
 */

/**
 * SEO Configuration and Best Practices
 */
const SEO_CONFIG = {
  // Optimal lengths for meta content
  titleLength: { min: 30, max: 60, optimal: 55 },
  descriptionLength: { min: 120, max: 160, optimal: 155 },

  // Social media optimal sizes
  ogImage: { width: 1200, height: 630 },
  twitterImage: { width: 1200, height: 600 },

  // Structured data types for educational content
  schemaTypes: {
    educational: 'LearningResource',
    tutorial: 'HowTo',
    course: 'Course',
    article: 'Article',
    faq: 'FAQPage'
  },

  // Validation thresholds
  excellentThreshold: 5,
  maxTitleSeparators: 2,
  maxDescriptionSeparators: 3,
  // Score weights
  scoreExcellent: 100,
  scoreGood: 80,
  scoreAverage: 60,
  scorePoor: 40,
  scoreHeadingBonus: 50,
  scoreImagePenalty: 20,
  scoreWordCountDivisor: 10,
  minWordCount: 300,
  // Grade thresholds
  gradeAThreshold: 90,
  gradeBThreshold: 80,
  gradeCThreshold: 70,
  gradeDThreshold: 60,
  // SERP display limits
  serpTitleMax: 60,
  serpTitleTruncateAt: 57,
  serpDescriptionMax: 160,
  serpDescriptionTruncateAt: 157
};

/**
 * Validate title tag for SEO best practices
 * @param {string} title - Page title
 * @returns {Object} Validation results with recommendations
 */
export const validateTitle = function validateTitle(title) {
  const { length } = title;
  const { min, max, optimal } = SEO_CONFIG.titleLength;

  const result = {
    length,
    status: 'good',
    message: '',
    recommendations: []
  };

  if (length < min) {
    result.status = 'warning';
    result.message = `Title is too short (${length} chars). Aim for ${min}-${max} characters.`;
    result.recommendations.push('Add more descriptive keywords');
    result.recommendations.push('Include your brand name');
  } else if (length > max) {
    result.status = 'error';
    result.message = `Title is too long (${length} chars) and will be truncated. Keep under ${max} characters.`;
    result.recommendations.push('Remove unnecessary words');
    result.recommendations.push('Focus on primary keywords');
  } else if (Math.abs(length - optimal) <= SEO_CONFIG.excellentThreshold) {
    result.status = 'excellent';
    result.message = `Perfect title length (${length} chars)!`;
  }

  // Check for common issues
  if (title.toLowerCase().includes('untitled') || title.toLowerCase().includes('home')) {
    result.recommendations.push('Avoid generic titles like "Home" or "Untitled"');
  }

  if (title.split('|').length > SEO_CONFIG.maxTitleSeparators || title.split('-').length > SEO_CONFIG.maxDescriptionSeparators) {
    result.recommendations.push('Avoid excessive separators - keep title readable');
  }

  return result;
};

/**
 * Validate meta description for SEO best practices
 * @param {string} description - Meta description
 * @returns {Object} Validation results with recommendations
 */
export const validateDescription = function validateDescription(description) {
  const { length } = description;
  const { min, max, optimal } = SEO_CONFIG.descriptionLength;

  const result = {
    length,
    status: 'good',
    message: '',
    recommendations: []
  };

  if (length < min) {
    result.status = 'warning';
    result.message = `Description is too short (${length} chars). Aim for ${min}-${max} characters.`;
    result.recommendations.push('Add more detail about the page content');
    result.recommendations.push('Include a compelling reason to click');
  } else if (length > max) {
    result.status = 'warning';
    result.message = `Description is too long (${length} chars) and will be truncated. Keep under ${max} characters.`;
    result.recommendations.push('Focus on the most important information');
    result.recommendations.push('Move details to the page content');
  } else if (Math.abs(length - optimal) <= SEO_CONFIG.excellentThreshold) {
    result.status = 'excellent';
    result.message = `Perfect description length (${length} chars)!`;
  }

  // Check for common issues
  if (!description.match(/[.!?]$/u)) {
    result.recommendations.push('End with punctuation for better readability');
  }

  if (description.toLowerCase().includes('click here') || description.toLowerCase().includes('read more')) {
    result.recommendations.push('Avoid generic CTAs - be specific about value');
  }

  return result;
};

/**
 * Generate comprehensive meta tags for a page
 * @param {Object} options - Meta tag options
 * @returns {Object} Meta tags object with educational insights
 */
export const generateMetaTags = function generateMetaTags(options) {
  const {
    title,
    description,
    keywords,
    author,
    image,
    url,
    type = 'website',
    locale = 'en_US',
    alternates = [],
    noindex = false,
    canonical
  } = options;

  const metaTags = {
    basic: [],
    openGraph: [],
    twitter: [],
    educational: []
  };

  // Basic meta tags
  metaTags.basic.push({
    tag: 'title',
    content: title,
    insight: validateTitle(title)
  });

  metaTags.basic.push({
    name: 'description',
    content: description,
    insight: validateDescription(description)
  });

  if (keywords && keywords.length > 0) {
    metaTags.basic.push({
      name: 'keywords',
      content: keywords.join(', '),
      insight: {
        note: 'Keywords meta tag has minimal SEO impact but helps with content organization',
        recommendation: 'Focus on natural keyword usage in content instead'
      }
    });
  }

  if (author) {
    metaTags.basic.push({
      name: 'author',
      content: author,
      insight: {
        note: 'Author tag helps establish credibility and authorship',
        recommendation: 'Consider implementing Author schema markup for better attribution'
      }
    });
  }

  // Robots meta tag
  if (noindex) {
    metaTags.basic.push({
      name: 'robots',
      content: 'noindex, nofollow',
      insight: {
        warning: 'This page will not be indexed by search engines',
        use_case: 'Use for private, duplicate, or low-quality content'
      }
    });
  }

  // Canonical URL
  if (canonical || url) {
    metaTags.basic.push({
      tag: 'link',
      rel: 'canonical',
      href: canonical || url,
      insight: {
        note: 'Canonical URL prevents duplicate content issues',
        recommendation: 'Always set canonical URLs for content that appears on multiple URLs'
      }
    });
  }

  // Language alternates
  alternates.forEach(alt => {
    metaTags.basic.push({
      tag: 'link',
      rel: 'alternate',
      hreflang: alt.lang,
      href: alt.url,
      insight: {
        note: 'Helps search engines serve the correct language version',
        example: 'Essential for multilingual sites'
      }
    });
  });

  // Open Graph tags
  metaTags.openGraph = [
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: type },
    { property: 'og:url', content: url },
    { property: 'og:locale', content: locale }
  ];

  if (image) {
    metaTags.openGraph.push(
      { property: 'og:image', content: image },
      { property: 'og:image:width', content: SEO_CONFIG.ogImage.width },
      { property: 'og:image:height', content: SEO_CONFIG.ogImage.height },
      {
        property: 'og:image:alt',
        content: `Preview image for ${title}`,
        insight: {
          note: 'Alt text for social media images improves accessibility',
          recommendation: 'Describe what the image shows, not just repeat the title'
        }
      }
    );
  }

  // Twitter Card tags
  metaTags.twitter = [
    { name: 'twitter:card', content: image ? 'summary_large_image' : 'summary' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description }
  ];

  if (image) {
    metaTags.twitter.push({ name: 'twitter:image', content: image });
  }

  // Educational insights
  metaTags.educational = [
    {
      topic: 'Title Optimization',
      current: title,
      analysis: validateTitle(title),
      tips: [
        'Include primary keyword near the beginning',
        'Make it compelling to increase click-through rate',
        'Avoid keyword stuffing',
        'Consider search intent'
      ]
    },
    {
      topic: 'Description Optimization',
      current: description,
      analysis: validateDescription(description),
      tips: [
        'Include a clear call-to-action',
        'Use active voice',
        'Include secondary keywords naturally',
        'Match search intent'
      ]
    }
  ];

  return metaTags;
};

/**
 * Generate structured data for educational content
 * @param {Object} data - Content data
 * @returns {Object} JSON-LD structured data
 */
export const generateEducationalSchema = function generateEducationalSchema(data) {
  const {
    type = 'LearningResource',
    name,
    description,
    url,
    datePublished,
    dateModified,
    author,
    educationalLevel = 'Beginner',
    timeRequired,
    teaches = [],
    requires = [],
    image
  } = data;

  const schema = {
    '@context': 'https://schema.org',
    '@type': type,
    name,
    description,
    url,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Organization',
      name: author || 'BSB Learning Platform'
    },
    provider: {
      '@type': 'Organization',
      name: 'Branded Static Boilerplate',
      url: 'https://github.com/madfam-io/branded-static-boilerplate'
    },
    educationalLevel,
    learningResourceType: 'Interactive Tutorial',
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    license: 'https://opensource.org/licenses/MIT'
  };

  // Add optional fields
  if (timeRequired) {
    schema.timeRequired = timeRequired;
  }

  if (teaches.length > 0) {
    schema.teaches = teaches.map(skill => ({
      '@type': 'DefinedTerm',
      name: skill
    }));
  }

  if (requires.length > 0) {
    schema.competencyRequired = requires.map(skill => ({
      '@type': 'DefinedTerm',
      name: skill
    }));
  }

  if (image) {
    schema.image = image;
  }

  return schema;
};

/**
 * Generate FAQ structured data
 * @param {Array} faqs - Array of FAQ items
 * @returns {Object} FAQ schema
 */
export const generateFAQSchema = function generateFAQSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
};

/**
 * Generate breadcrumb structured data
 * @param {Array} breadcrumbs - Array of breadcrumb items
 * @returns {Object} Breadcrumb schema
 */
export const generateBreadcrumbSchema = function generateBreadcrumbSchema(breadcrumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
};

/**
 * Get letter grade from numeric score
 * @param {number} score - Numeric score (0-100)
 * @returns {string} Letter grade
 */
const getGradeFromScore = function getGradeFromScore(score) {
  if (score >= SEO_CONFIG.gradeAThreshold) {
    return 'A';
  }
  if (score >= SEO_CONFIG.gradeBThreshold) {
    return 'B';
  }
  if (score >= SEO_CONFIG.gradeCThreshold) {
    return 'C';
  }
  if (score >= SEO_CONFIG.gradeDThreshold) {
    return 'D';
  }
  return 'F';

};

/**
 * Calculate comprehensive SEO score
 * @param {Object} page - Page data to analyze
 * @returns {Object} SEO score with detailed breakdown
 */
export const calculateSEOScore = function calculateSEOScore(page) {
  const scores = {
    title: 0,
    description: 0,
    headings: 0,
    images: 0,
    links: 0,
    content: 0,
    technical: 0
  };

  const insights = [];

  // Title score
  const titleValidation = validateTitle(page.title || '');
  if (titleValidation.status === 'excellent') {
    scores.title = SEO_CONFIG.scoreExcellent;
  } else if (titleValidation.status === 'good') {
    scores.title = SEO_CONFIG.scoreGood;
  } else if (titleValidation.status === 'warning') {
    scores.title = SEO_CONFIG.scoreAverage;
  } else {
    scores.title = SEO_CONFIG.scorePoor;
  }

  // Description score
  const descValidation = validateDescription(page.description || '');
  if (descValidation.status === 'excellent') {
    scores.description = SEO_CONFIG.scoreExcellent;
  } else if (descValidation.status === 'good') {
    scores.description = SEO_CONFIG.scoreGood;
  } else if (descValidation.status === 'warning') {
    scores.description = SEO_CONFIG.scoreAverage;
  } else {
    scores.description = SEO_CONFIG.scorePoor;
  }

  // Headings score
  if (page.h1Count === 1) {
    scores.headings += SEO_CONFIG.scoreHeadingBonus;
  } else {
    insights.push({
      category: 'Headings',
      issue: page.h1Count === 0 ? 'Missing H1 tag' : 'Multiple H1 tags found',
      impact: 'high',
      solution: 'Use exactly one H1 tag per page'
    });
  }

  if (page.headingHierarchy) {
    scores.headings += SEO_CONFIG.scoreHeadingBonus;
  } else {
    insights.push({
      category: 'Headings',
      issue: 'Improper heading hierarchy',
      impact: 'medium',
      solution: 'Use headings in sequential order (H1 → H2 → H3)'
    });
  }

  // Images score
  const imagesWithoutAlt = page.images?.filter(img => !img.alt).length || 0;
  if (imagesWithoutAlt === 0) {
    scores.images = SEO_CONFIG.scoreExcellent;
  } else {
    scores.images = Math.max(0, SEO_CONFIG.scoreExcellent - (imagesWithoutAlt * SEO_CONFIG.scoreImagePenalty));
    insights.push({
      category: 'Images',
      issue: `${imagesWithoutAlt} images missing alt text`,
      impact: 'high',
      solution: 'Add descriptive alt text to all images'
    });
  }

  // Links score
  if (page.links?.internal > 0) {
    scores.links += 50;
  } else {
    insights.push({
      category: 'Links',
      issue: 'No internal links found',
      impact: 'medium',
      solution: 'Add relevant internal links to improve navigation'
    });
  }

  if (page.links?.external > 0 && page.links?.externalNofollow > 0) {
    scores.links += 50;
  } else if (page.links?.external > 0) {
    scores.links += 25;
    insights.push({
      category: 'Links',
      issue: 'External links without nofollow',
      impact: 'low',
      solution: 'Consider adding rel="nofollow" to untrusted external links'
    });
  }

  // Content score
  const wordCount = page.content?.wordCount || 0;
  if (wordCount >= SEO_CONFIG.minWordCount) {
    scores.content = Math.min(SEO_CONFIG.scoreExcellent, (wordCount / SEO_CONFIG.scoreWordCountDivisor));
  } else {
    insights.push({
      category: 'Content',
      issue: `Low word count (${wordCount} words)`,
      impact: 'high',
      solution: `Add more substantial content (aim for ${SEO_CONFIG.minWordCount}+ words)`
    });
  }

  // Technical score
  if (page.canonical) {
    scores.technical += 25;
  }
  if (page.structuredData) {
    scores.technical += 25;
  }
  if (page.mobileFriendly) {
    scores.technical += 25;
  }
  if (page.https) {
    scores.technical += 25;
  }

  // Calculate overall score
  const overallScore = Math.round(
    Object.values(scores).reduce((accumulator, currentValue) => accumulator + currentValue, 0) / Object.keys(scores).length
  );

  return {
    overall: overallScore,
    breakdown: scores,
    insights,
    grade: getGradeFromScore(overallScore)
  };
};

/**
 * Generate SERP (Search Engine Results Page) preview
 * @param {Object} data - Page data
 * @returns {Object} SERP preview data
 */
export const generateSERPPreview = function generateSERPPreview(data) {
  const { title, description, url } = data;

  // Truncate title if needed
  const displayTitle = title.length > SEO_CONFIG.serpTitleMax
    ? `${title.substring(0, SEO_CONFIG.serpTitleTruncateAt)}...`
    : title;

  // Truncate description if needed
  const displayDescription = description.length > SEO_CONFIG.serpDescriptionMax
    ? `${description.substring(0, SEO_CONFIG.serpDescriptionTruncateAt)}...`
    : description;

  // Format URL for display
  const urlParts = new URL(url);
  const breadcrumb = urlParts.hostname + urlParts.pathname.replace(/\/$/u, '');

  return {
    title: displayTitle,
    titleTruncated: title.length > SEO_CONFIG.serpTitleMax,
    description: displayDescription,
    descriptionTruncated: description.length > SEO_CONFIG.serpDescriptionMax,
    url: breadcrumb,
    preview: {
      desktop: {
        width: 600,
        titleColor: '#1a0dab',
        urlColor: '#006621',
        descriptionColor: '#545454'
      },
      mobile: {
        width: 400,
        titleColor: '#1a0dab',
        urlColor: '#006621',
        descriptionColor: '#545454'
      }
    }
  };
};

/**
 * Export all SEO utilities
 */
export default {
  generateMetaTags,
  validateTitle,
  validateDescription,
  generateEducationalSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
  calculateSEOScore,
  generateSERPPreview,
  SEO_CONFIG
};