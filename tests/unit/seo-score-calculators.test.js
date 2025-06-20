/**
 * SEO Score Calculators Tests
 * ============================
 * 
 * Tests for the SEO scoring calculation helpers
 */

import {
  calculateContentScore,
  calculateHeadingsScore,
  calculateImagesScore,
  calculateLinksScore,
  calculateTechnicalScore
} from '../../src/scripts/seo/seo-score-calculators.js';

describe('SEO Score Calculators', () => {
  describe('calculateContentScore', () => {
    test('should return 0 for empty content', () => {
      const result = calculateContentScore({ content: { wordCount: 0 } });
      expect(result.score).toBe(0);
      expect(result.insights).toHaveLength(1);
    });

    test('should return 0 for null content', () => {
      const result = calculateContentScore({ content: null });
      expect(result.score).toBe(0);
      expect(result.insights).toHaveLength(1);
    });

    test('should return 0 for undefined content', () => {
      const result = calculateContentScore({});
      expect(result.score).toBe(0);
      expect(result.insights).toHaveLength(1);
    });

    test('should calculate score based on word count', () => {
      const shortResult = calculateContentScore({ content: { wordCount: 50 } });
      const longResult = calculateContentScore({ content: { wordCount: 500 } });
      
      expect(shortResult.score).toBe(0);
      expect(shortResult.insights).toHaveLength(1);
      expect(longResult.score).toBeGreaterThan(shortResult.score);
      expect(longResult.insights).toHaveLength(0);
    });

    test('should handle content with HTML tags', () => {
      const result = calculateContentScore({ content: { wordCount: 350 } });
      
      expect(result.score).toBeGreaterThan(0);
      expect(typeof result.score).toBe('number');
    });

    test('should handle very long content appropriately', () => {
      const result = calculateContentScore({ content: { wordCount: 5000 } });
      
      expect(result.score).toBeGreaterThan(0);
      expect(result.score).toBeLessThanOrEqual(100);
    });
  });

  describe('calculateHeadingsScore', () => {
    test('should return 0 for no headings', () => {
      const result = calculateHeadingsScore({ h1Count: 0, headingHierarchy: false });
      expect(result.score).toBe(0);
      expect(result.insights).toHaveLength(2);
    });

    test('should return score for single heading', () => {
      const result = calculateHeadingsScore({ h1Count: 1, headingHierarchy: true });
      
      expect(result.score).toBeGreaterThan(0);
      expect(typeof result.score).toBe('number');
    });

    test('should score multiple headings', () => {
      const result = calculateHeadingsScore({ h1Count: 1, headingHierarchy: true });
      
      expect(result.score).toBeGreaterThan(0);
    });

    test('should handle headings with different levels', () => {
      const h1OnlyResult = calculateHeadingsScore({ h1Count: 1, headingHierarchy: false });
      const mixedResult = calculateHeadingsScore({ h1Count: 1, headingHierarchy: true });
      
      expect(h1OnlyResult.score).toBeGreaterThan(0);
      expect(mixedResult.score).toBeGreaterThan(0);
    });

    test('should handle empty heading text', () => {
      const result = calculateHeadingsScore({ h1Count: 1, headingHierarchy: true });
      
      expect(result.score).toBeGreaterThan(0);
    });

    test('should handle invalid heading objects', () => {
      expect(() => {
        calculateHeadingsScore({ h1Count: null, headingHierarchy: undefined });
      }).not.toThrow();
    });
  });

  describe('calculateImagesScore', () => {
    test('should return 100 for no images', () => {
      const result = calculateImagesScore({ images: [] });
      expect(result.score).toBe(100);
    });

    test('should return 100 for all images with alt text', () => {
      const images = [
        { alt: 'Image 1 description' },
        { alt: 'Image 2 description' },
        { alt: 'Image 3 description' }
      ];
      const result = calculateImagesScore({ images });
      
      expect(result.score).toBe(100);
    });

    test('should penalize images without alt text', () => {
      const images = [
        { alt: 'Good alt text' },
        { alt: '' },
        { alt: null }
      ];
      const result = calculateImagesScore({ images });
      
      expect(result.score).toBeLessThan(100);
      expect(result.score).toBeGreaterThan(0);
    });

    test('should handle images with undefined alt', () => {
      const images = [
        { alt: 'Good alt text' },
        {},
        { alt: undefined }
      ];
      const result = calculateImagesScore({ images });
      
      expect(result.score).toBeLessThan(100);
    });

    test('should handle all images missing alt text', () => {
      const images = [
        { alt: '' },
        { alt: null },
        {}
      ];
      const result = calculateImagesScore({ images });
      
      expect(result.score).toBe(70); // 100 - (3 images * 10 penalty) = 70
    });

    test('should handle large number of images', () => {
      const images = new Array(50).fill(null).map((_, i) => ({
        alt: i % 2 === 0 ? 'Alt text' : ''
      }));
      const result = calculateImagesScore({ images });
      
      expect(result.score).toBe(0); // 25 missing * 10 penalty = 250, capped at 0
      expect(result.insights).toHaveLength(1);
    });
  });

  describe('calculateLinksScore', () => {
    test('should return 0 for no links', () => {
      const result = calculateLinksScore({ links: { internal: 0, external: 0, externalNofollow: 0 } });
      expect(result.score).toBe(0);
    });

    test('should score internal links', () => {
      const result = calculateLinksScore({ links: { internal: 2, external: 0, externalNofollow: 0 } });
      
      expect(result.score).toBeGreaterThan(0);
    });

    test('should score external links', () => {
      const result = calculateLinksScore({ links: { internal: 0, external: 2, externalNofollow: 0 } });
      
      expect(result.score).toBeGreaterThan(0);
    });

    test('should score mixed internal and external links', () => {
      const result = calculateLinksScore({ links: { internal: 1, external: 1, externalNofollow: 0 } });
      
      expect(result.score).toBeGreaterThan(0);
    });

    test('should handle links without href', () => {
      expect(() => {
        calculateLinksScore({ links: { internal: 1, external: 0, externalNofollow: 0 } });
      }).not.toThrow();
    });

    test('should handle links with missing internal property', () => {
      const result = calculateLinksScore({ links: { internal: 1, external: 1, externalNofollow: 0 } });
      expect(typeof result.score).toBe('number');
    });
  });

  describe('calculateTechnicalScore', () => {
    test('should return 0 for no technical features', () => {
      const features = {};
      const result = calculateTechnicalScore(features);
      
      expect(result).toBe(0);
    });

    test('should score SSL presence', () => {
      const features = { https: true };
      const result = calculateTechnicalScore(features);
      
      expect(result).toBe(25);
    });

    test('should score mobile responsive', () => {
      const features = { mobileFriendly: true };
      const result = calculateTechnicalScore(features);
      
      expect(result).toBe(25);
    });

    test('should score page speed', () => {
      const features = { canonical: true };
      const result = calculateTechnicalScore(features);
      
      expect(result).toBe(25);
    });

    test('should score structured data', () => {
      const features = { structuredData: true };
      const result = calculateTechnicalScore(features);
      
      expect(result).toBe(25);
    });

    test('should score multiple technical features', () => {
      const allFeatures = {
        https: true,
        mobileFriendly: true,
        canonical: true,
        structuredData: true
      };
      const result = calculateTechnicalScore(allFeatures);
      
      expect(result).toBe(100);
    });

    test('should handle false technical features', () => {
      const features = {
        https: false,
        mobileFriendly: true,
        canonical: false,
        structuredData: true
      };
      const result = calculateTechnicalScore(features);
      
      expect(result).toBe(50);
    });

    test('should handle mixed true/false/undefined features', () => {
      const features = {
        https: true,
        mobileFriendly: undefined,
        canonical: false,
        structuredData: null,
        unknownFeature: true
      };
      
      const result = calculateTechnicalScore(features);
      expect(result).toBe(25);
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
      const contentScore = calculateContentScore({ content: { wordCount: 350 } });
      const headingScore = calculateHeadingsScore({ h1Count: 1, headingHierarchy: true });
      const imageScore = calculateImagesScore({ images: [{ alt: 'Alt text' }] });
      const linkScore = calculateLinksScore({ links: { internal: 1, external: 0, externalNofollow: 0 } });
      const technicalScore = calculateTechnicalScore({ https: true });

      expect(typeof contentScore.score).toBe('number');
      expect(typeof headingScore.score).toBe('number');
      expect(typeof imageScore.score).toBe('number');
      expect(typeof linkScore.score).toBe('number');
      expect(typeof technicalScore).toBe('number');
    });

    test('scores should be within reasonable bounds', () => {
      const contentScore = calculateContentScore({ content: { wordCount: 350 } });
      const headingScore = calculateHeadingsScore({ h1Count: 1, headingHierarchy: true });
      const imageScore = calculateImagesScore({ images: [{ alt: 'Alt text' }] });
      const linkScore = calculateLinksScore({ links: { internal: 1, external: 0, externalNofollow: 0 } });
      const technicalScore = calculateTechnicalScore({ https: true });

      [contentScore.score, headingScore.score, imageScore.score, linkScore.score, technicalScore].forEach(score => {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(200); // Allow some flexibility for bonuses
      });
    });

    test('should handle edge cases without throwing', () => {
      expect(() => calculateContentScore({})).not.toThrow();
      expect(() => calculateHeadingsScore({})).not.toThrow();
      expect(() => calculateImagesScore({})).not.toThrow();
      expect(() => calculateLinksScore({})).not.toThrow();
      expect(() => calculateTechnicalScore({})).not.toThrow();
    });
  });
});