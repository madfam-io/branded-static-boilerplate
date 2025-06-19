/**
 * SEO Score Calculators Tests
 * ============================
 * 
 * Tests for the SEO scoring calculation helpers
 */

import {
  calculateContentScore,
  calculateHeadingScore,
  calculateImageScore,
  calculateLinkScore,
  calculateTechnicalScore
} from '../../src/scripts/seo/seo-score-calculators.js';

describe('SEO Score Calculators', () => {
  describe('calculateContentScore', () => {
    test('should return 0 for empty content', () => {
      const result = calculateContentScore('');
      expect(result).toBe(0);
    });

    test('should return 0 for null content', () => {
      const result = calculateContentScore(null);
      expect(result).toBe(0);
    });

    test('should return 0 for undefined content', () => {
      const result = calculateContentScore(undefined);
      expect(result).toBe(0);
    });

    test('should calculate score based on word count', () => {
      const shortContent = 'This is a short text with few words.';
      const longContent = 'This is a much longer piece of content. '.repeat(10);
      
      const shortScore = calculateContentScore(shortContent);
      const longScore = calculateContentScore(longContent);
      
      expect(shortScore).toBeGreaterThan(0);
      expect(longScore).toBeGreaterThan(shortScore);
    });

    test('should handle content with HTML tags', () => {
      const htmlContent = '<p>This is <strong>content</strong> with <em>HTML</em> tags.</p>';
      const result = calculateContentScore(htmlContent);
      
      expect(result).toBeGreaterThan(0);
      expect(typeof result).toBe('number');
    });

    test('should handle very long content appropriately', () => {
      const veryLongContent = 'Word '.repeat(1000);
      const result = calculateContentScore(veryLongContent);
      
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThanOrEqual(100);
    });
  });

  describe('calculateHeadingScore', () => {
    test('should return 0 for no headings', () => {
      const result = calculateHeadingScore([]);
      expect(result).toBe(0);
    });

    test('should return score for single heading', () => {
      const headings = [{ level: 1, text: 'Main Title' }];
      const result = calculateHeadingScore(headings);
      
      expect(result).toBeGreaterThan(0);
      expect(typeof result).toBe('number');
    });

    test('should score multiple headings', () => {
      const headings = [
        { level: 1, text: 'Main Title' },
        { level: 2, text: 'Subtitle' },
        { level: 3, text: 'Section' }
      ];
      const result = calculateHeadingScore(headings);
      
      expect(result).toBeGreaterThan(0);
    });

    test('should handle headings with different levels', () => {
      const h1Only = [{ level: 1, text: 'Title' }];
      const mixed = [
        { level: 1, text: 'Title' },
        { level: 2, text: 'Subtitle' }
      ];
      
      const h1Score = calculateHeadingScore(h1Only);
      const mixedScore = calculateHeadingScore(mixed);
      
      expect(h1Score).toBeGreaterThan(0);
      expect(mixedScore).toBeGreaterThan(0);
    });

    test('should handle empty heading text', () => {
      const headings = [
        { level: 1, text: '' },
        { level: 2, text: 'Valid heading' }
      ];
      const result = calculateHeadingScore(headings);
      
      expect(result).toBeGreaterThan(0);
    });

    test('should handle invalid heading objects', () => {
      const headings = [
        null,
        { level: 1, text: 'Valid heading' },
        undefined,
        { text: 'Missing level' }
      ];
      
      expect(() => {
        calculateHeadingScore(headings);
      }).not.toThrow();
    });
  });

  describe('calculateImageScore', () => {
    test('should return 100 for no images', () => {
      const result = calculateImageScore([]);
      expect(result).toBe(100);
    });

    test('should return 100 for all images with alt text', () => {
      const images = [
        { alt: 'Image 1 description' },
        { alt: 'Image 2 description' },
        { alt: 'Image 3 description' }
      ];
      const result = calculateImageScore(images);
      
      expect(result).toBe(100);
    });

    test('should penalize images without alt text', () => {
      const images = [
        { alt: 'Good alt text' },
        { alt: '' },
        { alt: null }
      ];
      const result = calculateImageScore(images);
      
      expect(result).toBeLessThan(100);
      expect(result).toBeGreaterThan(0);
    });

    test('should handle images with undefined alt', () => {
      const images = [
        { alt: 'Good alt text' },
        {},
        { alt: undefined }
      ];
      const result = calculateImageScore(images);
      
      expect(result).toBeLessThan(100);
    });

    test('should handle all images missing alt text', () => {
      const images = [
        { alt: '' },
        { alt: null },
        {}
      ];
      const result = calculateImageScore(images);
      
      expect(result).toBe(0);
    });

    test('should handle large number of images', () => {
      const images = new Array(50).fill(null).map((_, i) => ({
        alt: i % 2 === 0 ? 'Alt text' : ''
      }));
      const result = calculateImageScore(images);
      
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(100);
    });
  });

  describe('calculateLinkScore', () => {
    test('should return 0 for no links', () => {
      const result = calculateLinkScore([]);
      expect(result).toBe(0);
    });

    test('should score internal links', () => {
      const links = [
        { href: '/page1', internal: true },
        { href: '/page2', internal: true }
      ];
      const result = calculateLinkScore(links);
      
      expect(result).toBeGreaterThan(0);
    });

    test('should score external links', () => {
      const links = [
        { href: 'https://example.com', internal: false },
        { href: 'https://another.com', internal: false }
      ];
      const result = calculateLinkScore(links);
      
      expect(result).toBeGreaterThan(0);
    });

    test('should score mixed internal and external links', () => {
      const links = [
        { href: '/internal', internal: true },
        { href: 'https://external.com', internal: false }
      ];
      const result = calculateLinkScore(links);
      
      expect(result).toBeGreaterThan(0);
    });

    test('should handle links without href', () => {
      const links = [
        { href: '/valid-link', internal: true },
        {},
        { href: '', internal: true }
      ];
      
      expect(() => {
        calculateLinkScore(links);
      }).not.toThrow();
    });

    test('should handle links with missing internal property', () => {
      const links = [
        { href: '/page' },
        { href: 'https://example.com' }
      ];
      
      const result = calculateLinkScore(links);
      expect(typeof result).toBe('number');
    });
  });

  describe('calculateTechnicalScore', () => {
    test('should return 0 for no technical features', () => {
      const features = {};
      const result = calculateTechnicalScore(features);
      
      expect(result).toBe(0);
    });

    test('should score SSL presence', () => {
      const features = { hasSSL: true };
      const result = calculateTechnicalScore(features);
      
      expect(result).toBeGreaterThan(0);
    });

    test('should score mobile responsive', () => {
      const features = { isMobileResponsive: true };
      const result = calculateTechnicalScore(features);
      
      expect(result).toBeGreaterThan(0);
    });

    test('should score page speed', () => {
      const features = { hasGoodPageSpeed: true };
      const result = calculateTechnicalScore(features);
      
      expect(result).toBeGreaterThan(0);
    });

    test('should score structured data', () => {
      const features = { hasStructuredData: true };
      const result = calculateTechnicalScore(features);
      
      expect(result).toBeGreaterThan(0);
    });

    test('should score multiple technical features', () => {
      const allFeatures = {
        hasSSL: true,
        isMobileResponsive: true,
        hasGoodPageSpeed: true,
        hasStructuredData: true
      };
      const result = calculateTechnicalScore(allFeatures);
      
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThanOrEqual(100);
    });

    test('should handle false technical features', () => {
      const features = {
        hasSSL: false,
        isMobileResponsive: true,
        hasGoodPageSpeed: false,
        hasStructuredData: true
      };
      const result = calculateTechnicalScore(features);
      
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(100);
    });

    test('should handle mixed true/false/undefined features', () => {
      const features = {
        hasSSL: true,
        isMobileResponsive: undefined,
        hasGoodPageSpeed: false,
        hasStructuredData: null,
        unknownFeature: true
      };
      
      expect(() => {
        calculateTechnicalScore(features);
      }).not.toThrow();
    });

    test('should handle empty object', () => {
      const result = calculateTechnicalScore({});
      expect(result).toBe(0);
    });

    test('should handle null/undefined input', () => {
      expect(() => {
        calculateTechnicalScore(null);
      }).not.toThrow();
      
      expect(() => {
        calculateTechnicalScore(undefined);
      }).not.toThrow();
    });
  });

  describe('Score Boundaries', () => {
    test('all functions should return numeric values', () => {
      const contentScore = calculateContentScore('Some content');
      const headingScore = calculateHeadingScore([{ level: 1, text: 'Title' }]);
      const imageScore = calculateImageScore([{ alt: 'Alt text' }]);
      const linkScore = calculateLinkScore([{ href: '/page', internal: true }]);
      const technicalScore = calculateTechnicalScore({ hasSSL: true });

      expect(typeof contentScore).toBe('number');
      expect(typeof headingScore).toBe('number');
      expect(typeof imageScore).toBe('number');
      expect(typeof linkScore).toBe('number');
      expect(typeof technicalScore).toBe('number');
    });

    test('scores should be within reasonable bounds', () => {
      const contentScore = calculateContentScore('Some content');
      const headingScore = calculateHeadingScore([{ level: 1, text: 'Title' }]);
      const imageScore = calculateImageScore([{ alt: 'Alt text' }]);
      const linkScore = calculateLinkScore([{ href: '/page', internal: true }]);
      const technicalScore = calculateTechnicalScore({ hasSSL: true });

      [contentScore, headingScore, imageScore, linkScore, technicalScore].forEach(score => {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(200); // Allow some flexibility for bonuses
      });
    });

    test('should handle edge cases without throwing', () => {
      expect(() => calculateContentScore('')).not.toThrow();
      expect(() => calculateHeadingScore([])).not.toThrow();
      expect(() => calculateImageScore([])).not.toThrow();
      expect(() => calculateLinkScore([])).not.toThrow();
      expect(() => calculateTechnicalScore({})).not.toThrow();
    });
  });
});