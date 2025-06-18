#!/usr/bin/env node

/**
 * Lighthouse Audit Script
 * ========================
 *
 * Automated performance auditing with Lighthouse.
 * Generates comprehensive reports with Core Web Vitals analysis.
 *
 * Features:
 * - Performance budget enforcement
 * - Accessibility compliance checking
 * - SEO analysis
 * - Best practices validation
 * - Progressive Web App assessment
 *
 * Usage:
 * - npm run lighthouse
 * - node scripts/lighthouse-audit.js [url]
 */

import fs from 'fs';
import path from 'path';

import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

// Constants for scoring and metrics
const SCORING_CONSTANTS = {
  PERCENTAGE_MULTIPLIER: 100,
  MAX_OPPORTUNITIES_DISPLAY: 5
};

/**
 * Performance budgets for BSB
 * These represent our quality standards
 */
const PERFORMANCE_BUDGETS = {
  performance: 95,
  accessibility: 100,
  bestPractices: 95,
  seo: 100,
  pwa: 80,
  firstContentfulPaint: 1200,
  largestContentfulPaint: 2500,
  cumulativeLayoutShift: 0.1,
  firstInputDelay: 100,
  speedIndex: 1300
};

/**
 * Lighthouse configuration optimized for static sites
 */
const LIGHTHOUSE_CONFIG = {
  extends: 'lighthouse:default',
  settings: {
    onlyAudits: [
      'first-contentful-paint',
      'largest-contentful-paint',
      'first-meaningful-paint',
      'speed-index',
      'cumulative-layout-shift',
      'max-potential-fid',
      'total-blocking-time',
      'server-response-time',
      'interactive',
      'redirects-http',
      'redirects',
      'mainthread-work-breakdown',
      'bootup-time',
      'uses-optimized-images',
      'uses-webp-images',
      'uses-text-compression',
      'uses-responsive-images',
      'efficient-animated-content',
      'unused-css-rules',
      'unused-javascript',
      'modern-image-formats',
      'uses-rel-preload',
      'uses-rel-preconnect',
      'font-display',
      'critical-request-chains',
      'user-timings',
      'accessibility',
      'color-contrast',
      'document-title',
      'html-has-lang',
      'meta-description',
      'meta-viewport',
      'aria-allowed-attr',
      'aria-hidden-body',
      'aria-hidden-focus',
      'aria-input-field-name',
      'aria-required-attr',
      'aria-roles',
      'aria-valid-attr-value',
      'aria-valid-attr',
      'button-name',
      'bypass',
      'definition-list',
      'dlitem',
      'duplicate-id-active',
      'duplicate-id-aria',
      'form-field-multiple-labels',
      'frame-title',
      'heading-order',
      'image-alt',
      'input-image-alt',
      'label',
      'link-name',
      'list',
      'listitem',
      'meta-refresh',
      'object-alt',
      'skip-link',
      'tabindex',
      'table-fake-caption',
      'td-headers-attr',
      'th-has-data-cells',
      'valid-lang',
      'video-caption'
    ]
  }
};

/**
 * Launch Chrome and run Lighthouse audit
 * @param {string} url - URL to audit
 * @returns {Promise<Object>} Lighthouse results
 */
const runLighthouseAudit = async function runLighthouseAudit(url) {
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox', '--disable-dev-shm-usage']
  });

  try {
    const options = {
      logLevel: 'info',
      output: 'json',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo', 'pwa'],
      port: chrome.port
    };

    const runnerResult = await lighthouse(url, options, LIGHTHOUSE_CONFIG);
    return runnerResult;
  } finally {
    await chrome.kill();
  }
};

/**
 * Extract key metrics from Lighthouse results
 * @param {Object} results - Lighthouse results
 * @returns {Object} Extracted metrics
 */
const extractMetrics = function extractMetrics(results) {
  const { lhr } = results;
  const { audits } = lhr;

  return {
    scores: {
      performance: Math.round(lhr.categories.performance.score * SCORING_CONSTANTS.PERCENTAGE_MULTIPLIER),
      accessibility: Math.round(lhr.categories.accessibility.score * SCORING_CONSTANTS.PERCENTAGE_MULTIPLIER),
      bestPractices: Math.round(lhr.categories['best-practices'].score * SCORING_CONSTANTS.PERCENTAGE_MULTIPLIER),
      seo: Math.round(lhr.categories.seo.score * SCORING_CONSTANTS.PERCENTAGE_MULTIPLIER),
      pwa: Math.round(lhr.categories.pwa.score * SCORING_CONSTANTS.PERCENTAGE_MULTIPLIER)
    },
    metrics: {
      firstContentfulPaint: audits['first-contentful-paint']?.numericValue || 0,
      largestContentfulPaint: audits['largest-contentful-paint']?.numericValue || 0,
      cumulativeLayoutShift: audits['cumulative-layout-shift']?.numericValue || 0,
      firstInputDelay: audits['max-potential-fid']?.numericValue || 0,
      speedIndex: audits['speed-index']?.numericValue || 0,
      totalBlockingTime: audits['total-blocking-time']?.numericValue || 0,
      interactive: audits.interactive?.numericValue || 0
    },
    opportunities: lhr.categories.performance.auditRefs
      .filter(ref => audits[ref.id]?.details?.type === 'opportunity')
      .map(ref => ({
        id: ref.id,
        title: audits[ref.id].title,
        description: audits[ref.id].description,
        savings: audits[ref.id].details?.overallSavingsMs || 0
      }))
      .sort((a, b) => b.savings - a.savings),
    accessibility: {
      violations: lhr.categories.accessibility.auditRefs
        .filter(ref => audits[ref.id]?.score !== null && audits[ref.id]?.score < 1)
        .map(ref => ({
          id: ref.id,
          title: audits[ref.id].title,
          description: audits[ref.id].description,
          score: audits[ref.id].score
        }))
    }
  };
};

/**
 * Check metrics against performance budgets
 * @param {Object} metrics - Extracted metrics
 * @returns {Object} Budget analysis
 */
const checkBudgets = function checkBudgets(metrics) {
  const results = {
    passed: [],
    failed: [],
    warnings: []
  };

  // Check category scores
  Object.entries(PERFORMANCE_BUDGETS).forEach(([key, budget]) => {
    if (typeof metrics.scores[key] !== 'undefined') {
      const score = metrics.scores[key];
      const status = score >= budget ? 'passed' : 'failed';
      results[status].push({
        metric: key,
        actual: score,
        budget,
        difference: score - budget
      });
    }
  });

  // Check Core Web Vitals
  const coreWebVitals = [
    {
      key: 'firstContentfulPaint',
      actual: metrics.metrics.firstContentfulPaint,
      budget: PERFORMANCE_BUDGETS.firstContentfulPaint,
      unit: 'ms'
    },
    {
      key: 'largestContentfulPaint',
      actual: metrics.metrics.largestContentfulPaint,
      budget: PERFORMANCE_BUDGETS.largestContentfulPaint,
      unit: 'ms'
    },
    {
      key: 'cumulativeLayoutShift',
      actual: metrics.metrics.cumulativeLayoutShift,
      budget: PERFORMANCE_BUDGETS.cumulativeLayoutShift,
      unit: 'score'
    }
  ];

  coreWebVitals.forEach(({ key, actual, budget, unit }) => {
    const status = actual <= budget ? 'passed' : 'failed';
    results[status].push({
      metric: key,
      actual: `${actual}${unit}`,
      budget: `${budget}${unit}`,
      difference: actual - budget
    });
  });

  return results;
};

/**
 * Get CSS class for score display
 * @param {number} score - The score to classify
 * @returns {string} CSS class name
 */
const getScoreClass = function getScoreClass(score) {
  if (score >= 90) {
    return 'score-90-100';
  }
  if (score >= 50) {
    return 'score-50-89';
  }
  return 'score-0-49';

};

/**
 * Get status icon for score display
 * @param {number} score - The score to classify
 * @returns {string} Status icon
 */
const getStatusIcon = function getStatusIcon(score) {
  if (score >= 90) {
    return '✅';
  }
  if (score >= 50) {
    return '⚠️';
  }
  return '❌';

};

/**
 * Generate comprehensive audit report
 * @param {string} url - Audited URL
 * @param {Object} metrics - Extracted metrics
 * @param {Object} budgetResults - Budget analysis
 * @returns {string} HTML report
 */
const generateReport = function generateReport(url, metrics, budgetResults) {
  const timestamp = new Date().toISOString();
  const overallPassed = budgetResults.failed.length === 0;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BSB Performance Audit Report</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      line-height: 1.6;
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      background: #f8f9fa;
    }
    .header {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .status-${overallPassed ? 'pass' : 'fail'} {
      color: ${overallPassed ? '#28a745' : '#dc3545'};
      font-size: 1.5rem;
      font-weight: bold;
    }
    .scores {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin: 2rem 0;
    }
    .score-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .score-value {
      font-size: 2.5rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }
    .score-90-100 { color: #28a745; }
    .score-50-89 { color: #ffc107; }
    .score-0-49 { color: #dc3545; }
    .metrics {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .metric-row {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem 0;
      border-bottom: 1px solid #e9ecef;
    }
    .metric-pass { color: #28a745; }
    .metric-fail { color: #dc3545; }
    .opportunities {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .opportunity {
      padding: 1rem;
      margin: 1rem 0;
      background: #f8f9fa;
      border-left: 4px solid #007bff;
      border-radius: 0 4px 4px 0;
    }
    .savings {
      font-weight: bold;
      color: #007bff;
    }
    .timestamp {
      color: #6c757d;
      font-size: 0.875rem;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🚀 BSB Performance Audit</h1>
    <p><strong>URL:</strong> <code>${url}</code></p>
    <p class="status-${overallPassed ? 'pass' : 'fail'}">
      ${overallPassed ? '✅ All budgets passed!' : '❌ Performance budget violations detected'}
    </p>
    <p class="timestamp">Generated: ${timestamp}</p>
  </div>

  <div class="scores">
    ${Object.entries(metrics.scores).map(([category, score]) => {
    const scoreClass = getScoreClass(score);
    return `
        <div class="score-card">
          <div class="score-value ${scoreClass}">${score}</div>
          <div>
            ${category.charAt(0).toUpperCase() +
              category.slice(1).replace(/(?<letter>[A-Z])/gu, ' $<letter>')}
          </div>
        </div>
      `;
  }).join('')}
  </div>

  <div class="metrics">
    <h2>📊 Core Web Vitals</h2>
    <div class="metric-row">
      <span>First Contentful Paint</span>
      <span class="${metrics.metrics.firstContentfulPaint <= 1200 ? 'metric-pass' : 'metric-fail'}">
        ${Math.round(metrics.metrics.firstContentfulPaint)}ms
      </span>
    </div>
    <div class="metric-row">
      <span>Largest Contentful Paint</span>
      <span class="${
  metrics.metrics.largestContentfulPaint <= 2500 ? 'metric-pass' : 'metric-fail'
}">
        ${Math.round(metrics.metrics.largestContentfulPaint)}ms
      </span>
    </div>
    <div class="metric-row">
      <span>Cumulative Layout Shift</span>
      <span class="${metrics.metrics.cumulativeLayoutShift <= 0.1 ? 'metric-pass' : 'metric-fail'}">
        ${metrics.metrics.cumulativeLayoutShift.toFixed(3)}
      </span>
    </div>
    <div class="metric-row">
      <span>Total Blocking Time</span>
      <span class="${metrics.metrics.totalBlockingTime <= 200 ? 'metric-pass' : 'metric-fail'}">
        ${Math.round(metrics.metrics.totalBlockingTime)}ms
      </span>
    </div>
    <div class="metric-row">
      <span>Speed Index</span>
      <span class="${metrics.metrics.speedIndex <= 1300 ? 'metric-pass' : 'metric-fail'}">
        ${Math.round(metrics.metrics.speedIndex)}ms
      </span>
    </div>
  </div>

  ${metrics.opportunities.length > 0 ? `
  <div class="opportunities">
    <h2>⚡ Performance Opportunities</h2>
    ${metrics.opportunities.slice(0, SCORING_CONSTANTS.MAX_OPPORTUNITIES_DISPLAY).map(opp => `
      <div class="opportunity">
        <h4>${opp.title}</h4>
        <p>${opp.description}</p>
        <p class="savings">Potential savings: ${Math.round(opp.savings)}ms</p>
      </div>
    `).join('')}
  </div>
  ` : ''}

  ${metrics.accessibility.violations.length > 0 ? `
  <div class="opportunities">
    <h2>♿ Accessibility Issues</h2>
    ${metrics.accessibility.violations.map(violation => `
      <div class="opportunity">
        <h4>${violation.title}</h4>
        <p>${violation.description}</p>
        <p>Score: ${violation.score}</p>
      </div>
    `).join('')}
  </div>
  ` : `
  <div class="opportunities">
    <h2>♿ Accessibility</h2>
    <p class="metric-pass">✅ All accessibility audits passed!</p>
  </div>
  `}

  <div class="opportunities">
    <h3>💡 Recommendations</h3>
    <ul>
      <li>Monitor Core Web Vitals regularly in production</li>
      <li>Test on various devices and network conditions</li>
      <li>Use performance budgets in CI/CD pipeline</li>
      <li>Optimize images and implement lazy loading</li>
      <li>Minimize and compress CSS/JavaScript</li>
      <li>Use a Content Delivery Network (CDN)</li>
    </ul>
  </div>
</body>
</html>
  `.trim();
};

/**
 * Main execution function
 */
const main = async function main() {
  const url = process.argv[2] || 'https://localhost:3000';

  console.log('🚀 Starting Lighthouse audit...');
  console.log(`📍 URL: ${url}`);

  try {
    // Run Lighthouse audit
    const results = await runLighthouseAudit(url);

    // Extract metrics
    const metrics = extractMetrics(results);

    // Check against budgets
    const budgetResults = checkBudgets(metrics);

    // Generate reports
    const reportDir = path.join(process.cwd(), 'coverage', 'lighthouse');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    // Save raw Lighthouse results
    const rawResultsPath = path.join(reportDir, 'lighthouse-results.json');
    fs.writeFileSync(rawResultsPath, JSON.stringify(results.lhr, null, 2));

    // Save extracted metrics
    const metricsPath = path.join(reportDir, 'metrics.json');
    fs.writeFileSync(metricsPath, JSON.stringify({
      url,
      timestamp: new Date().toISOString(),
      metrics,
      budgetResults
    }, null, 2));

    // Generate HTML report
    const htmlReport = generateReport(url, metrics, budgetResults);
    const htmlReportPath = path.join(reportDir, 'lighthouse-report.html');
    fs.writeFileSync(htmlReportPath, htmlReport);

    // Console summary
    console.log('\\n📊 Audit Results Summary:');
    console.log('='.repeat(50));

    Object.entries(metrics.scores).forEach(([category, score]) => {
      const status = getStatusIcon(score);
      console.log(`${status} ${category}: ${score}/100`);
    });

    console.log('\\n⚡ Core Web Vitals:');
    console.log(`  FCP: ${Math.round(metrics.metrics.firstContentfulPaint)}ms`);
    console.log(`  LCP: ${Math.round(metrics.metrics.largestContentfulPaint)}ms`);
    console.log(`  CLS: ${metrics.metrics.cumulativeLayoutShift.toFixed(3)}`);

    if (budgetResults.failed.length > 0) {
      console.log('\\n❌ Budget Violations:');
      budgetResults.failed.forEach(result => {
        console.log(`  ${result.metric}: ${result.actual} (budget: ${result.budget})`);
      });
    }

    console.log(`\\n📄 Detailed report: ${htmlReportPath}`);

    // Exit with error code if budgets failed
    if (budgetResults.failed.length > 0) {
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Lighthouse audit failed:', error.message);
    process.exit(1);
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}