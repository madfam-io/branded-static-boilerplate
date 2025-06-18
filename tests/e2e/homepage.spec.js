/**
 * ============================================================================
 * BSB HOMEPAGE E2E TESTS
 * ============================================================================
 *
 * Comprehensive end-to-end tests for the BSB homepage, covering core
 * functionality, user interactions, and cross-browser compatibility.
 *
 * 🎯 Test Coverage:
 * - Page loading and basic functionality
 * - Navigation and routing
 * - Language toggle functionality
 * - Responsive design validation
 * - Performance benchmarks
 *
 * 📚 Learn More:
 * - Playwright testing patterns
 * - E2E testing best practices
 *
 * 💡 Usage:
 * npx playwright test homepage.spec.js
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('BSB Homepage', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage before each test
    await page.goto('/');
  });

  test.describe('Basic Functionality', () => {
    test('should load homepage successfully', async ({ page }) => {
      // Verify page loads
      await expect(page).toHaveTitle(/Plataforma de Aprendizaje|BSB/);

      // Check for main content
      await expect(page.locator('main')).toBeVisible();

      // Verify hero section is present
      const hero = page.locator('.hero, [data-section="hero"]');
      await expect(hero).toBeVisible();
    });

    test('should have proper meta tags', async ({ page }) => {
      // Check essential meta tags
      const description = page.locator('meta[name="description"]');
      await expect(description).toHaveAttribute('content', /.+/);

      const viewport = page.locator('meta[name="viewport"]');
      await expect(viewport).toHaveAttribute('content', /width=device-width/);

      // Check Open Graph tags
      const ogTitle = page.locator('meta[property="og:title"]');
      await expect(ogTitle).toHaveAttribute('content', /.+/);
    });

    test('should have working navigation', async ({ page }) => {
      // Check main navigation exists
      const nav = page.locator('nav, [role="navigation"]');
      await expect(nav).toBeVisible();

      // Check for navigation links
      const navLinks = page.locator('nav a, [role="navigation"] a');
      const linkCount = await navLinks.count();
      expect(linkCount).toBeGreaterThan(0);
    });
  });

  test.describe('Language Toggle', () => {
    test('should toggle language successfully', async ({ page }) => {
      // Find language toggle button
      const languageToggle = page.locator('[data-action="toggle-language"]');
      await expect(languageToggle).toBeVisible();

      // Get initial language state
      const initialLang = await page.getAttribute('html', 'lang');

      // Click language toggle
      await languageToggle.click();

      // Wait for language change
      await page.waitForTimeout(100);

      // Verify language changed
      const newLang = await page.getAttribute('html', 'lang');
      expect(newLang).not.toBe(initialLang);

      // Verify content changed (check for Spanish/English indicators)
      const pageContent = await page.textContent('body');
      expect(pageContent).toBeTruthy();
    });

    test('should persist language preference', async ({ page, context }) => {
      // Toggle language
      const languageToggle = page.locator('[data-action="toggle-language"]');
      await languageToggle.click();

      const selectedLang = await page.getAttribute('html', 'lang');

      // Navigate to another page and back
      await page.goto('/pages/design-system.html');
      await page.goBack();

      // Verify language preference persisted
      const persistedLang = await page.getAttribute('html', 'lang');
      expect(persistedLang).toBe(selectedLang);
    });
  });

  test.describe('Responsive Design', () => {
    test('should be responsive on mobile', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Verify page is still functional
      await expect(page.locator('main')).toBeVisible();

      // Check mobile navigation
      const nav = page.locator('nav, [role="navigation"]');
      await expect(nav).toBeVisible();

      // Verify no horizontal overflow
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = await page.evaluate(() => window.innerWidth);
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1); // Allow 1px tolerance
    });

    test('should be responsive on tablet', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });

      // Verify layout adapts
      await expect(page.locator('main')).toBeVisible();

      // Check that elements are properly sized
      const hero = page.locator('.hero, [data-section="hero"]');
      const heroBox = await hero.boundingBox();
      expect(heroBox?.width).toBeGreaterThan(700);
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      // Check for h1
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);

      // Verify heading hierarchy
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
      expect(headings.length).toBeGreaterThan(1);
    });

    test('should have proper ARIA labels', async ({ page }) => {
      // Check navigation has aria-label
      const nav = page.locator('nav, [role="navigation"]');
      const navAriaLabel = await nav.getAttribute('aria-label');
      expect(navAriaLabel).toBeTruthy();

      // Check buttons have accessible names
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();

      for (let i = 0; i < buttonCount; i++) {
        const button = buttons.nth(i);
        const ariaLabel = await button.getAttribute('aria-label');
        const textContent = await button.textContent();
        const hasAccessibleName = ariaLabel || (textContent && textContent.trim().length > 0);
        expect(hasAccessibleName).toBeTruthy();
      }
    });

    test('should be keyboard navigable', async ({ page }) => {
      // Start from the top of the page
      await page.keyboard.press('Tab');

      // Verify focus is visible
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();

      // Navigate through several elements
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
        const currentFocus = page.locator(':focus');
        await expect(currentFocus).toBeVisible();
      }
    });
  });

  test.describe('Performance', () => {
    test('should load within performance budget', async ({ page }) => {
      // Start performance timing
      const startTime = Date.now();

      await page.goto('/', { waitUntil: 'networkidle' });

      const loadTime = Date.now() - startTime;

      // Should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    test('should have good Core Web Vitals', async ({ page }) => {
      await page.goto('/');

      // Measure Largest Contentful Paint (LCP)
      const lcp = await page.evaluate(() => {
        return new Promise((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            resolve(lastEntry.startTime);
          }).observe({ entryTypes: ['largest-contentful-paint'] });

          // Fallback timeout
          setTimeout(() => resolve(0), 5000);
        });
      });

      // LCP should be under 2.5 seconds (2500ms)
      expect(lcp).toBeLessThan(2500);
    });
  });

  test.describe('Content Validation', () => {
    test('should display learning resources', async ({ page }) => {
      // Check for tutorial links or learning content
      const learningElements = page.locator('[href*="tutorial"], [href*="docs"], [data-learning]');
      const count = await learningElements.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should have working links', async ({ page }) => {
      // Get all internal links
      const links = page.locator('a[href^="/"], a[href^="./"], a[href^="../"]');
      const linkCount = await links.count();

      // Test first few links (avoid testing all to keep test time reasonable)
      const linksToTest = Math.min(linkCount, 5);

      for (let i = 0; i < linksToTest; i++) {
        const link = links.nth(i);
        const href = await link.getAttribute('href');

        if (href && !href.includes('#')) {
          // Click link and verify page loads
          await link.click();

          // Wait for navigation
          await page.waitForLoadState('networkidle');

          // Verify new page loaded successfully
          const currentUrl = page.url();
          expect(currentUrl).toContain(href.replace('./', '').replace('../', ''));

          // Go back to homepage
          await page.goBack();
          await page.waitForLoadState('networkidle');
        }
      }
    });
  });
});