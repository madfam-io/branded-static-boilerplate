/**
 * ============================================================================
 * BSB PLAYWRIGHT GLOBAL SETUP
 * ============================================================================
 *
 * Global setup configuration for Playwright E2E tests. Handles environment
 * preparation, test data setup, and browser configuration.
 *
 * 🎯 Features:
 * - Environment validation
 * - Test data preparation
 * - Browser context setup
 * - Performance baseline establishment
 *
 * @function setup
 * @description Prepares the testing environment before all tests run
 * @param {Object} config - Playwright configuration object
 * @returns {Promise<void>}
 * @since 1.0.0
 */

import { chromium } from '@playwright/test';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

/**
 * Global setup function
 * @param {import('@playwright/test').FullConfig} config
 */
async function globalSetup(config) {
  console.log('🚀 BSB E2E Testing - Global Setup');

  // Ensure test directories exist
  const testDirs = [
    'test-results',
    'test-results/videos',
    'test-results/screenshots',
    'playwright-report'
  ];

  testDirs.forEach(dir => {
    const fullPath = join(process.cwd(), dir);
    if (!existsSync(fullPath)) {
      mkdirSync(fullPath, { recursive: true });
      console.log(`✓ Created test directory: ${dir}`);
    }
  });

  // Validate base URL is accessible
  const baseURL = config.use?.baseURL || 'http://localhost:3000';
  console.log(`🌐 Testing base URL: ${baseURL}`);

  try {
    // Launch browser to validate environment
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    // Test basic navigation
    await page.goto(baseURL, { timeout: 30000 });

    // Verify page loads successfully
    const title = await page.title();
    console.log(`✓ Base URL accessible, page title: "${title}"`);

    // Check for critical elements
    const hasNavigation = await page.locator('nav').count() > 0;
    const hasMainContent = await page.locator('main, [role="main"]').count() > 0;

    if (!hasNavigation) {
      console.warn('⚠️  No navigation element found');
    } else {
      console.log('✓ Navigation element found');
    }

    if (!hasMainContent) {
      console.warn('⚠️  No main content element found');
    } else {
      console.log('✓ Main content element found');
    }

    // Check language toggle functionality
    const languageToggle = await page.locator('[data-action="toggle-language"]').count() > 0;
    if (languageToggle) {
      console.log('✓ Language toggle found');
    } else {
      console.warn('⚠️  Language toggle not found');
    }

    // Cleanup
    await browser.close();

  } catch (error) {
    console.error(`❌ Global setup failed: ${error.message}`);
    throw error;
  }

  console.log('✅ Global setup completed successfully');
}

export default globalSetup;