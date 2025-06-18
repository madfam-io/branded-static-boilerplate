/**
 * ============================================================================
 * BSB PLAYWRIGHT GLOBAL TEARDOWN
 * ============================================================================
 *
 * Global teardown configuration for Playwright E2E tests. Handles cleanup
 * operations, test result processing, and performance data aggregation.
 *
 * 🎯 Features:
 * - Test result aggregation
 * - Performance metrics collection
 * - Cleanup operations
 * - Report generation
 *
 * @function teardown
 * @description Cleans up the testing environment after all tests complete
 * @param {Object} config - Playwright configuration object
 * @returns {Promise<void>}
 * @since 1.0.0
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Global teardown function
 * @param {import('@playwright/test').FullConfig} config
 */
async function globalTeardown(config) {
  console.log('🧹 BSB E2E Testing - Global Teardown');

  try {
    // Process test results if available
    const resultsPath = join(process.cwd(), 'test-results/e2e-results.json');

    if (existsSync(resultsPath)) {
      const results = JSON.parse(readFileSync(resultsPath, 'utf8'));

      // Generate summary statistics
      const summary = {
        totalTests: results.stats?.total || 0,
        passed: results.stats?.passed || 0,
        failed: results.stats?.failed || 0,
        skipped: results.stats?.skipped || 0,
        duration: results.stats?.duration || 0,
        timestamp: new Date().toISOString(),
        projects: results.suites?.map(suite => ({
          name: suite.title,
          tests: suite.specs?.length || 0,
          passed: suite.specs?.filter(spec => spec.ok).length || 0
        })) || []
      };

      console.log(`📊 Test Summary:`);
      console.log(`  Total: ${summary.totalTests}`);
      console.log(`  Passed: ${summary.passed}`);
      console.log(`  Failed: ${summary.failed}`);
      console.log(`  Skipped: ${summary.skipped}`);
      console.log(`  Duration: ${(summary.duration / 1000).toFixed(2)}s`);

      // Save summary
      const summaryPath = join(process.cwd(), 'test-results/e2e-summary.json');
      writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
      console.log(`✓ Test summary saved to: ${summaryPath}`);

      // Check for failed tests
      if (summary.failed > 0) {
        console.warn(`⚠️  ${summary.failed} test(s) failed`);
      } else {
        console.log('✅ All tests passed');
      }
    }

    // Cleanup temporary files if needed
    console.log('🧽 Cleanup completed');

  } catch (error) {
    console.error(`❌ Global teardown error: ${error.message}`);
    // Don't throw error to avoid masking test failures
  }

  console.log('✅ Global teardown completed');
}

export default globalTeardown;