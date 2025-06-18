#!/usr/bin/env node

/**
 * ============================================================================
 * BSB PERFORMANCE MONITORING SCRIPT
 * ============================================================================
 * 
 * Real User Monitoring (RUM) and synthetic performance testing for the BSB
 * platform. Provides comprehensive performance insights and regression detection.
 * 
 * 🎯 Features:
 * - Core Web Vitals monitoring
 * - Performance regression detection
 * - Historical performance tracking
 * - Automated performance alerts
 * - Custom metrics collection
 * 
 * 📚 Learn More:
 * - Core Web Vitals documentation
 * - Performance monitoring best practices
 * 
 * 💡 Usage:
 * npm run analyze:performance
 * npm run monitor:performance -- --continuous
 * ============================================================================
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import chalk from 'chalk';

const __dirname = fileURLToPath(new URL('..', import.meta.url));

/**
 * Performance metrics configuration
 * @type {Object}
 */
const PERFORMANCE_CONFIG = {
  // Core Web Vitals thresholds (in milliseconds/score)
  thresholds: {
    lcp: { good: 2500, poor: 4000 },        // Largest Contentful Paint
    fid: { good: 100, poor: 300 },          // First Input Delay
    cls: { good: 0.1, poor: 0.25 },         // Cumulative Layout Shift
    fcp: { good: 1800, poor: 3000 },        // First Contentful Paint
    tti: { good: 3800, poor: 7300 },        // Time to Interactive
    si: { good: 3400, poor: 5800 },         // Speed Index
    tbt: { good: 200, poor: 600 }           // Total Blocking Time
  },
  
  // Lighthouse performance score thresholds
  lighthouse: {
    performance: { good: 90, poor: 50 },
    accessibility: { good: 95, poor: 80 },
    bestPractices: { good: 95, poor: 80 },
    seo: { good: 95, poor: 80 }
  },
  
  // URLs to monitor
  urls: [
    'index.html',
    'pages/design-system.html',
    'docs/tutorials/index.html'
  ],
  
  // Performance budget (in KB)
  budgets: {
    'first-party': 200,
    'third-party': 50,
    'images': 300,
    'fonts': 75,
    'scripts': 150,
    'stylesheets': 50
  }
};

/**
 * Performance data storage path
 * @type {string}
 */
const PERFORMANCE_DATA_PATH = join(__dirname, 'performance-data');

/**
 * Ensures performance data directory exists
 * @function ensureDataDirectory
 * @description Creates performance data directory if it doesn't exist
 * @since 1.0.0
 */
const ensureDataDirectory = function ensureDataDirectory() {
  if (!existsSync(PERFORMANCE_DATA_PATH)) {
    mkdirSync(PERFORMANCE_DATA_PATH, { recursive: true });
  }
}

/**
 * Runs Lighthouse audit for a specific URL
 * @function runLighthouseAudit
 * @description Executes Lighthouse audit and returns performance metrics
 * @param {string} url - URL to audit
 * @param {Object} options - Lighthouse options
 * @returns {Promise<Object>} Lighthouse results
 * @throws {Error} If audit fails
 * @since 1.0.0
 * @example
 * const results = await runLighthouseAudit('index.html');
 */
const runLighthouseAudit = async function runLighthouseAudit(url, options = {}) {
  return new Promise((resolve, reject) => {
    const distPath = join(__dirname, 'dist');
    const fullUrl = `file://${join(distPath, url)}`;
    
    const lighthouseArgs = [
      'lighthouse',
      fullUrl,
      '--output=json',
      '--quiet',
      '--chrome-flags="--headless --no-sandbox --disable-dev-shm-usage"',
      '--no-enable-error-reporting'
    ];
    
    if (options.mobile) {
      lighthouseArgs.push('--preset=perf', '--form-factor=mobile');
    }
    
    const lighthouse = spawn('npx', lighthouseArgs, {
      stdio: ['ignore', 'pipe', 'pipe']
    });
    
    let output = '';
    let error = '';
    
    lighthouse.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    lighthouse.stderr.on('data', (data) => {
      error += data.toString();
    });
    
    lighthouse.on('close', (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(output);
          resolve(result);
        } catch (parseError) {
          reject(new Error(`Failed to parse Lighthouse output: ${parseError.message}`));
        }
      } else {
        reject(new Error(`Lighthouse failed with code ${code}: ${error}`));
      }
    });
  });
}

/**
 * Extracts key performance metrics from Lighthouse results
 * @function extractMetrics
 * @description Parses Lighthouse results and extracts performance data
 * @param {Object} lighthouseResult - Raw Lighthouse results
 * @returns {Object} Extracted metrics
 * @since 1.0.0
 */
const extractMetrics = function extractMetrics(lighthouseResult) {
  const audits = lighthouseResult.audits;
  const categories = lighthouseResult.categories;
  
  return {
    timestamp: new Date().toISOString(),
    url: lighthouseResult.finalUrl,
    
    // Core Web Vitals
    lcp: audits['largest-contentful-paint']?.numericValue || null,
    fid: audits['max-potential-fid']?.numericValue || null,
    cls: audits['cumulative-layout-shift']?.numericValue || null,
    fcp: audits['first-contentful-paint']?.numericValue || null,
    tti: audits['interactive']?.numericValue || null,
    si: audits['speed-index']?.numericValue || null,
    tbt: audits['total-blocking-time']?.numericValue || null,
    
    // Lighthouse scores
    performance: categories.performance?.score * 100 || null,
    accessibility: categories.accessibility?.score * 100 || null,
    bestPractices: categories['best-practices']?.score * 100 || null,
    seo: categories.seo?.score * 100 || null,
    
    // Resource breakdown
    resources: {
      'first-party': audits['network-rtt']?.details?.items || [],
      scripts: audits['bootup-time']?.details?.items || [],
      stylesheets: audits['unused-css-rules']?.details?.items || [],
      images: audits['uses-optimized-images']?.details?.items || [],
      fonts: audits['font-display']?.details?.items || []
    },
    
    // Opportunities
    opportunities: Object.keys(audits)
      .filter(key => audits[key].scoreDisplayMode === 'binary' && audits[key].score < 1)
      .map(key => ({
        id: key,
        title: audits[key].title,
        description: audits[key].description,
        savings: audits[key].details?.overallSavingsMs || 0
      }))
  };
}

/**
 * Evaluates metric against thresholds
 * @function evaluateMetric
 * @description Determines if metric is good, needs improvement, or poor
 * @param {number} value - Metric value
 * @param {Object} thresholds - Good/poor thresholds
 * @returns {string} Evaluation result
 * @since 1.0.0
 */
const evaluateMetric = function evaluateMetric(value, thresholds) {
  if (value === null || typeof value === 'undefined') {
    return 'unknown';
  }
  if (value <= thresholds.good) {
    return 'good';
  }
  if (value <= thresholds.poor) {
    return 'needs-improvement';
  }
  return 'poor';
}

/**
 * Stores performance data to file
 * @function storePerformanceData
 * @description Saves performance metrics to historical data file
 * @param {Object} metrics - Performance metrics
 * @param {string} filename - Output filename
 * @since 1.0.0
 */
const storePerformanceData = function storePerformanceData(metrics, filename) {
  ensureDataDirectory();
  
  const filePath = join(PERFORMANCE_DATA_PATH, filename);
  const data = [];
  
  // Load existing data
  if (existsSync(filePath)) {
    try {
      const existingData = JSON.parse(readFileSync(filePath, 'utf8'));
      data.push(...existingData);
    } catch (error) {
      console.warn(`Warning: Could not load existing data from ${filename}`);
    }
  }
  
  // Add new metrics
  data.push(metrics);
  
  // Keep only last 100 entries
  if (data.length > 100) {
    data.splice(0, data.length - 100);
  }
  
  // Save data
  writeFileSync(filePath, JSON.stringify(data, null, 2));
}

/**
 * Detects performance regressions
 * @function detectRegressions
 * @description Compares current metrics with historical data
 * @param {Object} currentMetrics - Current performance metrics
 * @param {string} filename - Historical data filename
 * @returns {Array} List of detected regressions
 * @since 1.0.0
 */
const detectRegressions = function detectRegressions(currentMetrics, filename) {
  const filePath = join(PERFORMANCE_DATA_PATH, filename);
  const regressions = [];
  
  if (!existsSync(filePath)) {
    return regressions;
  }
  
  try {
    const historicalData = JSON.parse(readFileSync(filePath, 'utf8'));
    if (historicalData.length < 2) {
      return regressions;
    }
    
    // Get last 5 data points for baseline
    const baseline = historicalData.slice(-5);
    const metrics = ['lcp', 'fcp', 'tti', 'si', 'tbt', 'performance'];
    
    metrics.forEach(metric => {
      const currentValue = currentMetrics[metric];
      if (currentValue === null || typeof currentValue === 'undefined') {
        return;
      }
      
      const baselineValues = baseline
        .map(data => data[metric])
        .filter(val => val !== null && typeof val !== 'undefined');
      
      if (baselineValues.length === 0) {
        return;
      }
      
      const baselineAvg = baselineValues.reduce((sum, val) => sum + val, 0) / baselineValues.length;
      // 10% worse for scores, 20% worse for times
      const regressionThreshold = metric === 'performance' ? 0.9 : 1.2;
      
      const isRegression = metric === 'performance' 
        ? currentValue < baselineAvg * regressionThreshold
        : currentValue > baselineAvg * regressionThreshold;
      
      if (isRegression) {
        const change = metric === 'performance'
          ? ((currentValue - baselineAvg) / baselineAvg * 100).toFixed(1)
          : ((currentValue - baselineAvg) / baselineAvg * 100).toFixed(1);
        
        regressions.push({
          metric,
          current: currentValue,
          baseline: baselineAvg.toFixed(2),
          change: `${change}%`,
          severity: Math.abs(parseFloat(change)) > 30 ? 'high' : 'medium'
        });
      }
    });
    
  } catch (error) {
    console.warn(`Warning: Could not analyze regressions: ${error.message}`);
  }
  
  return regressions;
}

/**
 * Displays performance report
 * @function displayPerformanceReport
 * @description Outputs formatted performance metrics and analysis
 * @param {Object} metrics - Performance metrics
 * @param {Array} regressions - Detected regressions
 * @since 1.0.0
 */
const displayPerformanceReport = function displayPerformanceReport(metrics, regressions = []) {
  console.log(chalk.cyan('\n⚡ BSB Performance Monitoring Report'));
  console.log(chalk.cyan('=' .repeat(50)));
  
  console.log(`\n🌐 URL: ${metrics.url}`);
  console.log(`📅 Timestamp: ${new Date(metrics.timestamp).toLocaleString()}`);
  
  // Core Web Vitals
  console.log('\n📊 Core Web Vitals:');
  const vitals = [
    { name: 'LCP', value: metrics.lcp, unit: 'ms', thresholds: PERFORMANCE_CONFIG.thresholds.lcp },
    { name: 'FID', value: metrics.fid, unit: 'ms', thresholds: PERFORMANCE_CONFIG.thresholds.fid },
    { name: 'CLS', value: metrics.cls, unit: '', thresholds: PERFORMANCE_CONFIG.thresholds.cls },
    { name: 'FCP', value: metrics.fcp, unit: 'ms', thresholds: PERFORMANCE_CONFIG.thresholds.fcp },
    { name: 'TTI', value: metrics.tti, unit: 'ms', thresholds: PERFORMANCE_CONFIG.thresholds.tti },
    { name: 'SI', value: metrics.si, unit: 'ms', thresholds: PERFORMANCE_CONFIG.thresholds.si },
    { name: 'TBT', value: metrics.tbt, unit: 'ms', thresholds: PERFORMANCE_CONFIG.thresholds.tbt }
  ];
  
  vitals.forEach(vital => {
    if (vital.value === null) {
      return;
    }
    
    const evaluation = evaluateMetric(vital.value, vital.thresholds);
    const color = evaluation === 'good' ? chalk.green : 
                  evaluation === 'needs-improvement' ? chalk.yellow : chalk.red;
    const icon = evaluation === 'good' ? '✅' : 
                 evaluation === 'needs-improvement' ? '⚠️' : '❌';
    
    const displayValue = vital.unit === 'ms' ? `${Math.round(vital.value)}${vital.unit}` : 
                        vital.value.toFixed(3);
    
    console.log(
      `  ${icon} ${vital.name.padEnd(4)} ${color(displayValue.padEnd(8))} (${evaluation})`
    );
  });
  
  // Lighthouse Scores
  console.log('\n🏆 Lighthouse Scores:');
  const scores = [
    {
      name: 'Performance',
      value: metrics.performance,
      thresholds: PERFORMANCE_CONFIG.lighthouse.performance
    },
    {
      name: 'Accessibility',
      value: metrics.accessibility,
      thresholds: PERFORMANCE_CONFIG.lighthouse.accessibility
    },
    {
      name: 'Best Practices',
      value: metrics.bestPractices,
      thresholds: PERFORMANCE_CONFIG.lighthouse.bestPractices
    },
    { name: 'SEO', value: metrics.seo, thresholds: PERFORMANCE_CONFIG.lighthouse.seo }
  ];
  
  scores.forEach(score => {
    if (score.value === null) {
      return;
    }
    
    const evaluation = score.value >= score.thresholds.good ? 'good' :
                      score.value >= score.thresholds.poor ? 'needs-improvement' : 'poor';
    const color = evaluation === 'good' ? chalk.green : 
                  evaluation === 'needs-improvement' ? chalk.yellow : chalk.red;
    const icon = evaluation === 'good' ? '✅' : 
                 evaluation === 'needs-improvement' ? '⚠️' : '❌';
    
    console.log(
      `  ${icon} ${score.name.padEnd(15)} ${color(Math.round(score.value).toString().padStart(3))} ` +
      `(${evaluation})`
    );
  });
  
  // Performance Regressions
  if (regressions.length > 0) {
    console.log('\n📉 Performance Regressions Detected:');
    regressions.forEach(regression => {
      const severity = regression.severity === 'high' ? chalk.red : chalk.yellow;
      const icon = regression.severity === 'high' ? '🔴' : '🟡';
      
      console.log(
        `  ${icon} ${regression.metric.toUpperCase()}: ${severity(regression.change)} change`
      );
      console.log(`     Current: ${regression.current} | Baseline: ${regression.baseline}`);
    });
  }
  
  // Optimization Opportunities
  if (metrics.opportunities && metrics.opportunities.length > 0) {
    console.log('\n💡 Top Optimization Opportunities:');
    const topOpportunities = metrics.opportunities
      .sort((a, b) => b.savings - a.savings)
      .slice(0, 5);
    
    topOpportunities.forEach((opp, index) => {
      const savings = opp.savings > 1000 ? 
        `${(opp.savings / 1000).toFixed(1)}s` : `${opp.savings}ms`;
      console.log(`  ${index + 1}. ${opp.title} (saves ~${savings})`);
    });
  }
  
  console.log(chalk.cyan('\n=' .repeat(50)));
}

/**
 * Monitors performance for a single URL
 * @function monitorURL
 * @description Runs performance monitoring for a specific URL
 * @param {string} url - URL to monitor
 * @param {Object} options - Monitoring options
 * @returns {Promise<Object>} Performance metrics
 * @since 1.0.0
 */
const monitorURL = async function monitorURL(url, options = {}) {
  console.log(chalk.blue(`\n🔍 Monitoring performance for: ${url}`));
  
  try {
    const lighthouseResult = await runLighthouseAudit(url, options);
    const metrics = extractMetrics(lighthouseResult);
    
    // Store performance data
    const filename = `${url.replace(/[^a-zA-Z0-9]/gu, '_')}_performance.json`;
    storePerformanceData(metrics, filename);
    
    // Detect regressions
    const regressions = detectRegressions(metrics, filename);
    
    // Display report
    displayPerformanceReport(metrics, regressions);
    
    return { metrics, regressions };
    
  } catch (error) {
    console.error(chalk.red(`❌ Performance monitoring failed for ${url}:`), error.message);
    throw error;
  }
}

/**
 * Main performance monitoring function
 * @function main
 * @description Runs complete performance monitoring workflow
 * @param {Array<string>} args - Command line arguments
 * @since 1.0.0
 */
const main = async function main(args = []) {
  const isContinuous = args.includes('--continuous');
  const urls = PERFORMANCE_CONFIG.urls;
  
  console.log(chalk.blue('⚡ Starting BSB Performance Monitoring...'));
  
  if (!existsSync(join(__dirname, 'dist'))) {
    console.error(chalk.red('❌ Distribution directory not found. Run "npm run build" first.'));
    process.exit(1);
  }
  
  try {
    const results = [];
    let hasRegressions = false;
    
    for (const url of urls) {
      const result = await monitorURL(url);
      results.push(result);
      
      if (result.regressions.length > 0) {
        hasRegressions = true;
      }
    }
    
    // Summary
    console.log(chalk.cyan('\n📈 Performance Monitoring Summary'));
    console.log(`✅ Monitored ${results.length} URLs`);
    
    if (hasRegressions) {
      console.log(chalk.yellow('⚠️  Performance regressions detected'));
    } else {
      console.log(chalk.green('✅ No performance regressions detected'));
    }
    
    if (isContinuous) {
      console.log(chalk.blue('\n🔄 Continuous monitoring enabled. Running again in 5 minutes...'));
      setTimeout(() => main(args), 5 * 60 * 1000);
    }
    
  } catch (error) {
    console.error(chalk.red('❌ Performance monitoring failed:'), error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  main(args);
}