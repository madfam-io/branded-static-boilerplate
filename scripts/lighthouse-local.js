#!/usr/bin/env node

/**
 * =============================================================================
 * LOCAL LIGHTHOUSE AUDIT SCRIPT
 * =============================================================================
 * 
 * This script runs Lighthouse audits locally during development.
 * It provides immediate feedback on performance, accessibility, and SEO.
 * 
 * Usage:
 *   npm run lighthouse:local
 *   npm run lighthouse:local -- --url pages/about.html
 *   npm run lighthouse:local -- --mobile
 * 
 * 🎯 Features:
 * - Run audits on any local page
 * - Desktop and mobile testing
 * - Beautiful terminal output
 * - HTML report generation
 * - Performance budgets
 * =============================================================================
 */

import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { createServer } from 'http';
import { readFileSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import open from 'open';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const projectRoot = resolve(__dirname, '..');
const distDir = join(projectRoot, 'dist');

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    url: 'index.html',
    mobile: false,
    open: true,
    port: 8080
  };
  
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--url':
        options.url = args[++i];
        break;
      case '--mobile':
        options.mobile = true;
        break;
      case '--no-open':
        options.open = false;
        break;
      case '--port':
        options.port = parseInt(args[++i]);
        break;
    }
  }
  
  return options;
}

/**
 * Create a simple static file server
 */
function createStaticServer(port) {
  return createServer((req, res) => {
    let filePath = join(distDir, req.url === '/' ? 'index.html' : req.url);
    
    try {
      const content = readFileSync(filePath);
      const ext = filePath.split('.').pop();
      const contentType = {
        'html': 'text/html',
        'css': 'text/css',
        'js': 'application/javascript',
        'json': 'application/json',
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'svg': 'image/svg+xml',
        'woff2': 'font/woff2'
      }[ext] || 'text/plain';
      
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    } catch (err) {
      res.writeHead(404);
      res.end('File not found');
    }
  }).listen(port);
}

/**
 * Run Lighthouse audit
 */
async function runAudit(url, options) {
  console.log(chalk.blue('\n🚀 Starting Lighthouse audit...\n'));
  
  // Launch Chrome
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox']
  });
  
  // Lighthouse options
  const lighthouseOptions = {
    logLevel: 'error',
    output: 'html',
    port: chrome.port,
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    throttling: {
      cpuSlowdownMultiplier: options.mobile ? 4 : 1
    },
    screenEmulation: options.mobile ? {
      mobile: true,
      width: 375,
      height: 667,
      deviceScaleFactor: 2
    } : {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1
    }
  };
  
  // Run Lighthouse
  const runnerResult = await lighthouse(url, lighthouseOptions);
  
  // Kill Chrome
  await chrome.kill();
  
  return runnerResult;
}

/**
 * Display results in terminal
 */
function displayResults(lhr) {
  console.log(chalk.bold('\n📊 Lighthouse Results\n'));
  
  // Category scores
  const categories = lhr.categories;
  
  Object.entries(categories).forEach(([key, category]) => {
    const score = Math.round(category.score * 100);
    let color;
    let emoji;
    
    if (score >= 90) {
      color = chalk.green;
      emoji = '🟢';
    } else if (score >= 50) {
      color = chalk.yellow;
      emoji = '🟡';
    } else {
      color = chalk.red;
      emoji = '🔴';
    }
    
    console.log(`${emoji} ${color.bold(category.title)}: ${color(score)}`);
  });
  
  // Performance metrics
  console.log(chalk.bold('\n⚡ Performance Metrics\n'));
  
  const metrics = {
    'First Contentful Paint': lhr.audits['first-contentful-paint'],
    'Largest Contentful Paint': lhr.audits['largest-contentful-paint'],
    'Total Blocking Time': lhr.audits['total-blocking-time'],
    'Cumulative Layout Shift': lhr.audits['cumulative-layout-shift'],
    'Speed Index': lhr.audits['speed-index']
  };
  
  Object.entries(metrics).forEach(([name, audit]) => {
    const value = audit.displayValue || audit.score;
    const passed = audit.score >= 0.9;
    const icon = passed ? '✅' : '⚠️';
    
    console.log(`${icon} ${name}: ${value}`);
  });
  
  // Opportunities
  console.log(chalk.bold('\n💡 Top Opportunities\n'));
  
  const opportunities = Object.values(lhr.audits)
    .filter(audit => audit.details && audit.details.type === 'opportunity' && audit.score < 1)
    .sort((a, b) => b.details.overallSavingsMs - a.details.overallSavingsMs)
    .slice(0, 5);
  
  opportunities.forEach(opp => {
    const savings = Math.round(opp.details.overallSavingsMs);
    console.log(`• ${opp.title} (save ~${savings}ms)`);
  });
  
  // Failed audits
  const failedAudits = Object.values(lhr.audits)
    .filter(audit => audit.score === 0)
    .slice(0, 5);
  
  if (failedAudits.length > 0) {
    console.log(chalk.bold.red('\n❌ Failed Audits\n'));
    
    failedAudits.forEach(audit => {
      console.log(chalk.red(`• ${audit.title}`));
      if (audit.description) {
        console.log(chalk.gray(`  ${audit.description.slice(0, 80)}...`));
      }
    });
  }
  
  // Budget results
  console.log(chalk.bold('\n📦 Resource Budgets\n'));
  
  const resourceSummary = lhr.audits['resource-summary'];
  if (resourceSummary && resourceSummary.details) {
    const items = resourceSummary.details.items;
    
    items.forEach(item => {
      const size = (item.transferSize / 1024).toFixed(1);
      const limit = {
        'script': 200,
        'stylesheet': 100,
        'image': 500,
        'font': 200,
        'total': 2000
      }[item.resourceType] || 1000;
      
      const withinBudget = size < limit;
      const icon = withinBudget ? '✅' : '⚠️';
      const color = withinBudget ? chalk.green : chalk.yellow;
      
      console.log(`${icon} ${item.label}: ${color(size + 'KB')} / ${limit}KB`);
    });
  }
}

/**
 * Save HTML report
 */
async function saveReport(report, options) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const device = options.mobile ? 'mobile' : 'desktop';
  const filename = `lighthouse-${device}-${timestamp}.html`;
  const filepath = join(projectRoot, 'lighthouse-reports', filename);
  
  // Ensure directory exists
  const { mkdirSync, writeFileSync } = await import('fs');
  mkdirSync(join(projectRoot, 'lighthouse-reports'), { recursive: true });
  
  // Save report
  writeFileSync(filepath, report);
  
  console.log(chalk.green(`\n✅ Report saved: ${filepath}\n`));
  
  // Open in browser
  if (options.open) {
    await open(filepath);
  }
  
  return filepath;
}

/**
 * Main function
 */
async function main() {
  const options = parseArgs();
  
  console.log(chalk.bold.blue('🔍 BSB Lighthouse Audit Tool\n'));
  console.log(`URL: ${options.url}`);
  console.log(`Mode: ${options.mobile ? 'Mobile' : 'Desktop'}`);
  console.log(`Port: ${options.port}\n`);
  
  // Start server
  const server = createStaticServer(options.port);
  console.log(chalk.green(`✅ Server started on http://localhost:${options.port}\n`));
  
  try {
    // Build full URL
    const fullUrl = `http://localhost:${options.port}/${options.url}`;
    
    // Run audit
    const result = await runAudit(fullUrl, options);
    
    // Display results
    displayResults(result.lhr);
    
    // Save report
    await saveReport(result.report, options);
    
    // Check if passed
    const scores = Object.values(result.lhr.categories).map(c => c.score);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    if (avgScore >= 0.9) {
      console.log(chalk.green.bold('🎉 Excellent scores! Keep up the great work!'));
    } else if (avgScore >= 0.7) {
      console.log(chalk.yellow.bold('👍 Good scores, but there\'s room for improvement.'));
    } else {
      console.log(chalk.red.bold('⚠️  Scores need improvement. Check the report for details.'));
    }
    
  } catch (error) {
    console.error(chalk.red('❌ Error running audit:'), error.message);
    process.exit(1);
  } finally {
    // Close server
    server.close();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { runAudit, displayResults };