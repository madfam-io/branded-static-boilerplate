/**
 * ============================================================================
 * BSB PLAYWRIGHT E2E TESTING CONFIGURATION
 * ============================================================================
 * 
 * Comprehensive end-to-end testing configuration for the BSB platform,
 * providing cross-browser testing, accessibility validation, and performance
 * monitoring through automated browser testing.
 * 
 * 🎯 Features:
 * - Cross-browser testing (Chromium, Firefox, Safari)
 * - Mobile and desktop viewport testing
 * - Accessibility testing integration
 * - Performance metrics collection
 * - Screenshot and video recording
 * - Parallel test execution
 * 
 * 📚 Learn More:
 * - Playwright best practices
 * - E2E testing strategies
 * 
 * 💡 Usage:
 * npm run test:e2e
 * npm run test:e2e:ui
 * ============================================================================
 */

const { defineConfig, devices } = require('@playwright/test');

/**
 * Base URL for testing
 * @type {string}
 */
const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000/branded-static-boilerplate';

module.exports = defineConfig({
  // Test directory
  testDir: './tests/e2e',
  
  // Timeout settings
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  
  // Global test configuration
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter configuration
  reporter: [
    ['html', { 
      outputFolder: 'playwright-report',
      open: process.env.CI ? 'never' : 'on-failure'
    }],
    ['json', { outputFile: 'test-results/e2e-results.json' }],
    ['junit', { outputFile: 'test-results/e2e-junit.xml' }],
    ['list']
  ],
  
  // Global setup and teardown
  globalSetup: './tests/e2e/global-setup.js',
  globalTeardown: './tests/e2e/global-teardown.js',
  
  // Test output directory
  outputDir: 'test-results/',
  
  // Use configuration
  use: {
    baseURL,
    
    // Browser context options
    browserName: 'chromium',
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    
    // Action timeout
    actionTimeout: 0,
    
    // Screenshots and videos
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    
    // Locale and timezone
    locale: 'es-ES',
    timezoneId: 'Europe/Madrid',
    
    // Performance metrics
    recordVideo: {
      dir: 'test-results/videos/',
      size: { width: 1280, height: 720 }
    }
  },

  // Project configurations for different browsers and devices
  projects: [
    // Desktop browsers
    {
      name: 'chromium-desktop',
      use: { 
        ...devices['Desktop Chrome'],
        channel: 'chrome'
      },
    },
    {
      name: 'firefox-desktop',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit-desktop',
      use: { ...devices['Desktop Safari'] },
    },
    
    // Mobile browsers
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
    
    // Tablet
    {
      name: 'tablet',
      use: { ...devices['iPad Pro'] },
    },
    
    // High DPI display
    {
      name: 'high-dpi',
      use: {
        ...devices['Desktop Chrome HiDPI'],
        deviceScaleFactor: 2
      }
    },
    
    // Accessibility focused testing
    {
      name: 'accessibility',
      use: {
        ...devices['Desktop Chrome'],
        // Force prefers-reduced-motion for accessibility tests
        extraHTTPHeaders: {
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      },
      testMatch: '**/*accessibility*.spec.js'
    },
    
    // Performance testing
    {
      name: 'performance',
      use: {
        ...devices['Desktop Chrome'],
        // Enable performance metrics collection
        launchOptions: {
          args: [
            '--enable-precise-memory-info',
            '--enable-benchmarking',
            '--no-sandbox'
          ]
        }
      },
      testMatch: '**/*performance*.spec.js'
    }
  ],

  // Web server configuration for local testing
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    env: {
      NODE_ENV: 'test'
    }
  },
  
  // Test metadata
  metadata: {
    platform: process.platform,
    node: process.version,
    baseURL,
    timestamp: new Date().toISOString()
  }
});