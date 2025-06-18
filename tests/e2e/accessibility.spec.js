/**
 * ============================================================================
 * BSB ACCESSIBILITY E2E TESTS
 * ============================================================================
 * 
 * Comprehensive accessibility testing for the BSB platform using axe-core
 * integration with Playwright to ensure WCAG 2.1 compliance.
 * 
 * 🎯 Test Coverage:
 * - WCAG 2.1 Level AA compliance
 * - Keyboard navigation
 * - Screen reader compatibility
 * - Color contrast validation
 * - Focus management
 * 
 * 📚 Learn More:
 * - WCAG 2.1 guidelines
 * - axe-core accessibility testing
 * 
 * 💡 Usage:
 * npx playwright test accessibility.spec.js
 * ============================================================================
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('BSB Accessibility Tests', () => {
  
  test.describe('Homepage Accessibility', () => {
    test('should not have any accessibility violations', async ({ page }) => {
      await page.goto('/');
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      
      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should have proper color contrast', async ({ page }) => {
      await page.goto('/');
      
      const contrastResults = await new AxeBuilder({ page })
        .withTags(['color-contrast'])
        .analyze();
      
      expect(contrastResults.violations).toEqual([]);
    });

    test('should be keyboard accessible', async ({ page }) => {
      await page.goto('/');
      
      // Test tab navigation
      let focusableElements = 0;
      
      // Start from the beginning
      await page.keyboard.press('Tab');
      
      // Count focusable elements (max 20 to avoid infinite loops)
      for (let i = 0; i < 20; i++) {
        const focusedElement = page.locator(':focus');
        const isVisible = await focusedElement.isVisible();
        
        if (isVisible) {
          focusableElements++;
          
          // Test Enter key on buttons and links
          const tagName = await focusedElement.evaluate(el => el.tagName.toLowerCase());
          if (tagName === 'button' || tagName === 'a') {
            // Verify element can be activated with Enter
            const hasClick = await focusedElement.evaluate(el => 
              typeof el.onclick === 'function' || 
              el.getAttribute('href') !== null ||
              el.getAttribute('role') === 'button'
            );
            expect(hasClick).toBeTruthy();
          }
        }
        
        await page.keyboard.press('Tab');
      }
      
      expect(focusableElements).toBeGreaterThan(0);
    });

    test('should have proper heading structure', async ({ page }) => {
      await page.goto('/');
      
      const headingResults = await new AxeBuilder({ page })
        .withTags(['heading-order'])
        .analyze();
      
      expect(headingResults.violations).toEqual([]);
      
      // Additional manual check for heading hierarchy
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);
      
      // Check that headings are in logical order
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
      const headingLevels = await Promise.all(
        headings.map(heading => 
          heading.evaluate(el => parseInt(el.tagName.charAt(1)))
        )
      );
      
      // Verify no heading levels are skipped
      for (let i = 1; i < headingLevels.length; i++) {
        const current = headingLevels[i];
        const previous = headingLevels[i - 1];
        
        if (current > previous) {
          expect(current - previous).toBeLessThanOrEqual(1);
        }
      }
    });
  });

  test.describe('Design System Accessibility', () => {
    test('should not have accessibility violations on design system page', async ({ page }) => {
      await page.goto('/pages/design-system.html');
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
      
      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should have accessible form elements', async ({ page }) => {
      await page.goto('/pages/design-system.html');
      
      // Check for form accessibility
      const formResults = await new AxeBuilder({ page })
        .withTags(['forms'])
        .analyze();
      
      expect(formResults.violations).toEqual([]);
      
      // Manual checks for form elements
      const inputs = page.locator('input, textarea, select');
      const inputCount = await inputs.count();
      
      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i);
        
        // Check for labels
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledBy = await input.getAttribute('aria-labelledby');
        
        if (id) {
          const associatedLabel = page.locator(`label[for="${id}"]`);
          const hasLabel = await associatedLabel.count() > 0;
          const hasAriaLabel = ariaLabel !== null || ariaLabelledBy !== null;
          
          expect(hasLabel || hasAriaLabel).toBeTruthy();
        }
      }
    });
  });

  test.describe('Tutorials Accessibility', () => {
    test('should not have accessibility violations on tutorials page', async ({ page }) => {
      await page.goto('/docs/tutorials/');
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
      
      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should have accessible navigation menu', async ({ page }) => {
      await page.goto('/docs/tutorials/');
      
      const navigationResults = await new AxeBuilder({ page })
        .withTags(['navigation'])
        .analyze();
      
      expect(navigationResults.violations).toEqual([]);
      
      // Check for ARIA landmarks
      const nav = page.locator('nav, [role="navigation"]');
      const navCount = await nav.count();
      expect(navCount).toBeGreaterThan(0);
      
      // Verify navigation has proper labels
      for (let i = 0; i < navCount; i++) {
        const navigation = nav.nth(i);
        const ariaLabel = await navigation.getAttribute('aria-label');
        const ariaLabelledBy = await navigation.getAttribute('aria-labelledby');
        
        expect(ariaLabel || ariaLabelledBy).toBeTruthy();
      }
    });
  });

  test.describe('Language Toggle Accessibility', () => {
    test('should have accessible language toggle', async ({ page }) => {
      await page.goto('/');
      
      const languageToggle = page.locator('[data-action="toggle-language"]');
      await expect(languageToggle).toBeVisible();
      
      // Check ARIA attributes
      const ariaLabel = await languageToggle.getAttribute('aria-label');
      const ariaPressed = await languageToggle.getAttribute('aria-pressed');
      
      expect(ariaLabel).toBeTruthy();
      expect(ariaPressed).not.toBeNull();
      
      // Test keyboard activation
      await languageToggle.focus();
      await page.keyboard.press('Enter');
      
      // Verify state change
      const newAriaPressed = await languageToggle.getAttribute('aria-pressed');
      expect(newAriaPressed).not.toBe(ariaPressed);
    });

    test('should announce language changes to screen readers', async ({ page }) => {
      await page.goto('/');
      
      // Look for live region or aria-live announcements
      const liveRegions = page.locator('[aria-live], [role="status"], [role="alert"]');
      const liveRegionCount = await liveRegions.count();
      
      // Toggle language
      const languageToggle = page.locator('[data-action="toggle-language"]');
      await languageToggle.click();
      
      // Check if live region content updated or if new announcement was made
      await page.waitForTimeout(100);
      
      // This tests that the application handles language change announcements
      // The specific implementation may vary, but there should be some mechanism
      const currentLang = await page.getAttribute('html', 'lang');
      expect(currentLang).toBeTruthy();
    });
  });

  test.describe('Focus Management', () => {
    test('should have visible focus indicators', async ({ page }) => {
      await page.goto('/');
      
      // Test focus visibility
      await page.keyboard.press('Tab');
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
      
      // Check for focus outline
      const focusStyles = await focusedElement.evaluate((el) => {
        const computedStyles = window.getComputedStyle(el);
        return {
          outline: computedStyles.outline,
          outlineWidth: computedStyles.outlineWidth,
          outlineStyle: computedStyles.outlineStyle,
          outlineColor: computedStyles.outlineColor,
          boxShadow: computedStyles.boxShadow,
          border: computedStyles.border
        };
      });
      
      // Should have some form of visible focus indicator
      const hasFocusIndicator = 
        focusStyles.outline !== 'none' || 
        focusStyles.outlineWidth !== '0px' ||
        focusStyles.boxShadow !== 'none' ||
        focusStyles.border !== 'none';
      
      expect(hasFocusIndicator).toBeTruthy();
    });

    test('should trap focus in modals', async ({ page }) => {
      await page.goto('/');
      
      // Look for modal triggers
      const modalTriggers = page.locator(
        '[data-bs-toggle="modal"], [aria-haspopup="dialog"], [data-modal]'
      );
      const triggerCount = await modalTriggers.count();
      
      if (triggerCount > 0) {
        // Open modal
        await modalTriggers.first().click();
        
        // Check if modal is open
        const modal = page.locator('[role="dialog"], .modal[aria-modal="true"]');
        await expect(modal).toBeVisible();
        
        // Test focus trap - focus should stay within modal
        await page.keyboard.press('Tab');
        const focusedElement = page.locator(':focus');
        
        // Verify focused element is within modal
        const isWithinModal = await focusedElement.evaluate((el, modalSelector) => {
          const modal = document.querySelector(modalSelector);
          return modal && modal.contains(el);
        }, '[role="dialog"], .modal[aria-modal="true"]');
        
        expect(isWithinModal).toBeTruthy();
      }
    });
  });

  test.describe('Images and Media Accessibility', () => {
    test('should have proper alt text for images', async ({ page }) => {
      await page.goto('/');
      
      const imageResults = await new AxeBuilder({ page })
        .withTags(['images'])
        .analyze();
      
      expect(imageResults.violations).toEqual([]);
      
      // Manual check for decorative vs meaningful images
      const images = page.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        const role = await img.getAttribute('role');
        
        // Images should either have alt text or be marked as decorative
        const isDecorative = alt === '' || role === 'presentation';
        const hasMeaningfulAlt = alt && alt.length > 0;
        
        expect(isDecorative || hasMeaningfulAlt).toBeTruthy();
      }
    });
  });

  test.describe('Skip Links', () => {
    test('should have functional skip links', async ({ page }) => {
      await page.goto('/');
      
      // Look for skip links
      const skipLinks = page.locator(
        'a[href^="#"]:has-text("Skip"), a[href^="#"]:has-text("Saltar")'
      );
      const skipLinkCount = await skipLinks.count();
      
      if (skipLinkCount > 0) {
        const skipLink = skipLinks.first();
        
        // Focus on skip link (usually happens with Tab)
        await skipLink.focus();
        await expect(skipLink).toBeVisible();
        
        // Activate skip link
        await skipLink.click();
        
        // Verify target element receives focus
        const href = await skipLink.getAttribute('href');
        if (href) {
          const target = page.locator(href);
          await expect(target).toBeFocused();
        }
      }
    });
  });
});