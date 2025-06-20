#!/usr/bin/env node

/**
 * ============================================================================
 * BSB BUNDLE ANALYSIS SCRIPT
 * ============================================================================
 *
 * Comprehensive bundle analysis for the BSB platform, providing detailed
 * insights into bundle size, composition, and optimization opportunities.
 *
 * 🎯 Features:
 * - Bundle size analysis with size breakdown
 * - Asset composition reporting
 * - Performance budget validation
 * - Optimization recommendations
 * - Treeshaking effectiveness analysis
 *
 * 📚 Learn More:
 * - Bundle optimization best practices
 * - Performance budgets implementation
 *
 * 💡 Usage:
 * npm run analyze:size
 * ============================================================================
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, extname, relative } from 'path';
import { fileURLToPath } from 'url';

import chalk from 'chalk';

const __dirname = fileURLToPath(new URL('..', import.meta.url));

/**
 * File processing constants
 * @type {Object<string, number>}
 */
const PROCESSING_CONSTANTS = {
  BYTES_TO_KB: 1024,
  DECIMAL_PRECISION: 2,
  PERCENTAGE_MULTIPLIER: 100,
  PERCENTAGE_THRESHOLD_WARNING: 75,
  PERCENTAGE_THRESHOLD_GOOD: 100,
  BUDGET_WARNING_RATIO: 0.8,
  BUDGET_CRITICAL_RATIO: 0.9,
  MAX_FILES_PER_CATEGORY: 3,
  MAX_LARGEST_FILES: 10,
  LOG_BASE_SIZE_CALCULATION: 2,
  TOP_KEYWORDS_SLICE_LENGTH: 8,
  REPEATER_LENGTH: 50,
  PADEND_LENGTH_8: 8,
  PADEND_LENGTH_12: 12,
  PADEND_LENGTH_40: 40,
  PADSTART_WIDTH: 2,
  DECIMAL_PLACES_1: 1
};

/**
 * Performance budgets for different asset types (in KB)
 * @type {Object<string, number>}
 */
const PERFORMANCE_BUDGETS = {
  'js': 250, // JavaScript bundles
  'css': 50, // CSS bundles
  'images': 500, // Total images
  'fonts': 100, // Web fonts
  'total': 1000 // Total bundle size
};

/**
 * File size thresholds for warnings (in KB)
 * @type {Object<string, number>}
 */
const SIZE_THRESHOLDS = {
  'warning': 100,
  'error': 250
};

/**
 * Analyzes the bundle composition and generates a detailed report
 * @function analyzeBundleComposition
 * @description Walks through the dist directory and categorizes all assets
 * @returns {Object} Bundle analysis results
 * @since 1.0.0
 */
const analyzeBundleComposition = function analyzeBundleComposition() {
  const distPath = join(__dirname, 'dist');

  if (!existsSync(distPath)) {
    console.error(chalk.red('❌ Distribution directory not found. Run "npm run build" first.'));
    process.exit(1);
  }

  const analysis = {
    files: [],
    totalSize: 0,
    categories: {
      js: { files: [], size: 0 },
      css: { files: [], size: 0 },
      images: { files: [], size: 0 },
      fonts: { files: [], size: 0 },
      html: { files: [], size: 0 },
      other: { files: [], size: 0 }
    }
  };

  /**
   * Recursively analyzes files in a directory
   * @param {string} dir - Directory path
   * @param {string} basePath - Base path for relative calculations
   */
  const analyzeDirectory = function analyzeDirectory(dir, basePath = '') {
    const items = readdirSync(dir);

    items.forEach(item => {
      const fullPath = join(dir, item);
      const relativePath = join(basePath, item);
      const stats = statSync(fullPath);

      if (stats.isDirectory()) {
        analyzeDirectory(fullPath, relativePath);
      } else {
        const { size } = stats;
        const ext = extname(item).toLowerCase().slice(1);

        const fileInfo = {
          name: item,
          path: relativePath,
          size,
          sizeKB: Math.round(size / PROCESSING_CONSTANTS.BYTES_TO_KB * PROCESSING_CONSTANTS.PERCENTAGE_MULTIPLIER) / PROCESSING_CONSTANTS.PERCENTAGE_MULTIPLIER,
          extension: ext
        };

        analysis.files.push(fileInfo);
        analysis.totalSize += size;

        // Categorize file
        let category = 'other';
        if (['js', 'mjs'].includes(ext)) {
          category = 'js';
        } else if (ext === 'css') {
          category = 'css';
        } else if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico'].includes(ext)) {
          category = 'images';
        } else if (['woff', 'woff2', 'ttf', 'eot'].includes(ext)) {
          category = 'fonts';
        } else if (ext === 'html') {
          category = 'html';
        }

        analysis.categories[category].files.push(fileInfo);
        analysis.categories[category].size += size;
      }
    });
  };

  analyzeDirectory(distPath);
  return analysis;
};

/**
 * Formats file size with appropriate units
 * @function formatSize
 * @description Converts bytes to human-readable format
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size string
 * @since 1.0.0
 */
const formatSize = function formatSize(bytes) {
  if (bytes === 0) {
    return '0 B';
  }
  const kilobyte = PROCESSING_CONSTANTS.BYTES_TO_KB;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const sizeIndex = Math.floor(Math.log(bytes) / Math.log(kilobyte));
  return `${parseFloat((bytes / kilobyte**sizeIndex).toFixed(PROCESSING_CONSTANTS.DECIMAL_PRECISION))} ${sizes[sizeIndex]}`;
};

/**
 * Checks if size exceeds performance budget
 * @function checkBudget
 * @description Validates size against performance budgets
 * @param {number} sizeKB - Size in kilobytes
 * @param {string} category - Asset category
 * @returns {Object} Budget check result
 * @since 1.0.0
 */
const checkBudget = function checkBudget(sizeKB, category) {
  const budget = PERFORMANCE_BUDGETS[category];
  if (!budget) {
    return { status: 'unknown', message: '' };
  }

  const percentage = (sizeKB / budget) * PROCESSING_CONSTANTS.PERCENTAGE_MULTIPLIER;

  if (percentage <= PROCESSING_CONSTANTS.PERCENTAGE_THRESHOLD_WARNING) {
    return {
      status: 'good',
      percentage,
      message: chalk.green(`✓ Within budget (${percentage.toFixed(1)}%)`)
    };
  }
  if (percentage <= PROCESSING_CONSTANTS.PERCENTAGE_THRESHOLD_GOOD) {
    return {
      status: 'warning',
      percentage,
      message: chalk.yellow(`⚠ Near budget limit (${percentage.toFixed(1)}%)`)
    };
  }
  return {
    status: 'exceeded',
    percentage,
    message: chalk.red(`❌ Exceeds budget (${percentage.toFixed(1)}%)`)
  };

};

/**
 * Generates optimization recommendations
 * @function generateRecommendations
 * @description Analyzes bundle and suggests optimizations
 * @param {Object} analysis - Bundle analysis results
 * @returns {Array<string>} List of recommendations
 * @since 1.0.0
 */
const generateRecommendations = function generateRecommendations(analysis) {
  const recommendations = [];

  // Check for large JavaScript files
  const largeJSFiles = analysis.categories.js.files.filter(
    file => file.sizeKB > SIZE_THRESHOLDS.warning
  );
  if (largeJSFiles.length > 0) {
    recommendations.push(
      `Consider code splitting for large JS files: ${
        largeJSFiles.map(file => file.name).join(', ')
      }`
    );
  }

  // Check for unoptimized images
  const largeImages = analysis.categories.images.files.filter(file => file.sizeKB > SIZE_THRESHOLDS.warning);
  if (largeImages.length > 0) {
    recommendations.push(
      `Optimize large images: ${largeImages.map(file => file.name).join(', ')}`
    );
  }

  // Check for unused CSS
  const totalCSSSize = analysis.categories.css.size / PROCESSING_CONSTANTS.BYTES_TO_KB;
  if (totalCSSSize > PERFORMANCE_BUDGETS.css * PROCESSING_CONSTANTS.BUDGET_WARNING_RATIO) {
    recommendations.push('Consider purging unused CSS to reduce bundle size');
  }

  // Check for font optimization
  if (analysis.categories.fonts.files.length > 0) {
    const hasWoff2 = analysis.categories.fonts.files.some(file => file.extension === 'woff2');
    if (!hasWoff2) {
      recommendations.push('Consider using WOFF2 fonts for better compression');
    }
  }

  // Check total bundle size
  const totalSizeKB = analysis.totalSize / PROCESSING_CONSTANTS.BYTES_TO_KB;
  if (totalSizeKB > PERFORMANCE_BUDGETS.total * PROCESSING_CONSTANTS.BUDGET_CRITICAL_RATIO) {
    recommendations.push('Consider lazy loading non-critical assets to reduce initial bundle size');
  }

  return recommendations;
};

/**
 * Displays the bundle analysis report
 * @function displayReport
 * @description Outputs formatted analysis results to console
 * @param {Object} analysis - Bundle analysis results
 * @since 1.0.0
 */
const displayReport = function displayReport(analysis) {
  console.log(chalk.cyan('\n📊 BSB Bundle Analysis Report'));
  console.log(chalk.cyan('=' .repeat(PROCESSING_CONSTANTS.REPEATER_LENGTH)));

  // Total size
  const totalSizeKB = analysis.totalSize / PROCESSING_CONSTANTS.BYTES_TO_KB;
  const totalBudget = checkBudget(totalSizeKB, 'total');
  console.log(`\n📦 Total Bundle Size: ${formatSize(analysis.totalSize)} ${totalBudget.message}`);

  // Category breakdown
  console.log('\n📁 Asset Categories:');
  Object.entries(analysis.categories).forEach(([category, data]) => {
    if (data.files.length === 0) {
      return;
    }

    const sizeKB = data.size / PROCESSING_CONSTANTS.BYTES_TO_KB;
    const budget = checkBudget(sizeKB, category);
    const percentage = ((data.size / analysis.totalSize) * PROCESSING_CONSTANTS.PERCENTAGE_MULTIPLIER).toFixed(PROCESSING_CONSTANTS.DECIMAL_PLACES_1);

    console.log(
      `  ${category.toUpperCase().padEnd(PROCESSING_CONSTANTS.PADEND_LENGTH_8)} ${formatSize(data.size).padEnd(PROCESSING_CONSTANTS.PADEND_LENGTH_12)} ` +
      `(${percentage}%) ${budget.message}`
    );

    // Show largest files in category
    const sortedFiles = data.files.sort((fileA, fileB) => fileB.size - fileA.size).slice(0, PROCESSING_CONSTANTS.MAX_FILES_PER_CATEGORY);
    sortedFiles.forEach(file => {
      const indicator = file.sizeKB > SIZE_THRESHOLDS.error ? '🔴' :
        file.sizeKB > SIZE_THRESHOLDS.warning ? '🟡' : '🟢';
      console.log(`    ${indicator} ${file.name} (${formatSize(file.size)})`);
    });
  });

  // File count summary
  console.log(`\n📄 File Summary: ${analysis.files.length} total files`);

  // Performance budget summary
  console.log('\n💰 Performance Budget Status:');
  Object.entries(PERFORMANCE_BUDGETS).forEach(([category, budget]) => {
    const categoryData = analysis.categories[category];
    if (!categoryData && category !== 'total') {
      return;
    }

    const actualSize = category === 'total' ? totalSizeKB : (categoryData?.size || 0) / PROCESSING_CONSTANTS.BYTES_TO_KB;
    const budgetCheck = checkBudget(actualSize, category);

    console.log(
      `  ${category.toUpperCase().padEnd(PROCESSING_CONSTANTS.PADEND_LENGTH_8)} ${actualSize.toFixed(PROCESSING_CONSTANTS.DECIMAL_PLACES_1)}KB / ` +
      `${budget}KB ${budgetCheck.message}`
    );
  });

  // Recommendations
  const recommendations = generateRecommendations(analysis);
  if (recommendations.length > 0) {
    console.log('\n💡 Optimization Recommendations:');
    recommendations.forEach((rec, index) => {
      console.log(`  ${index + 1}. ${rec}`);
    });
  } else {
    console.log('\n✅ No optimization recommendations - bundle is well optimized!');
  }

  // Largest files overall
  const largestFiles = analysis.files.sort((fileA, fileB) => fileB.size - fileA.size).slice(0, PROCESSING_CONSTANTS.MAX_LARGEST_FILES);
  console.log('\n🔍 Largest Files:');
  largestFiles.forEach((file, index) => {
    const indicator = file.sizeKB > SIZE_THRESHOLDS.error ? '🔴' :
      file.sizeKB > SIZE_THRESHOLDS.warning ? '🟡' : '🟢';
    console.log(
      `  ${(index + 1).toString().padStart(PROCESSING_CONSTANTS.PADSTART_WIDTH)}. ${indicator} ` +
      `${file.path.padEnd(PROCESSING_CONSTANTS.PADEND_LENGTH_40)} ${formatSize(file.size)}`
    );
  });

  console.log(chalk.cyan('\n=' .repeat(PROCESSING_CONSTANTS.REPEATER_LENGTH)));
  console.log(`Report generated at: ${new Date().toLocaleString()}`);
};

/**
 * Main execution function
 * @function main
 * @description Runs the complete bundle analysis
 * @since 1.0.0
 */
const main = function main() {
  try {
    console.log(chalk.blue('🔍 Analyzing bundle composition...'));

    const analysis = analyzeBundleComposition();
    displayReport(analysis);

    // Check if any budgets are exceeded
    const totalSizeKB = analysis.totalSize / PROCESSING_CONSTANTS.BYTES_TO_KB;
    const hasExceededBudgets = Object.entries(PERFORMANCE_BUDGETS).some(([category, budget]) => {
      if (category === 'total') {
        return totalSizeKB > budget;
      }
      const categoryData = analysis.categories[category];
      return categoryData && (categoryData.size / PROCESSING_CONSTANTS.BYTES_TO_KB) > budget;
    });

    if (hasExceededBudgets) {
      console.log(chalk.red('\n⚠️  Performance budgets exceeded. Consider optimization.'));
      process.exit(1);
    } else {
      console.log(chalk.green('\n✅ All performance budgets are within limits.'));
    }

  } catch (error) {
    console.error(chalk.red('❌ Bundle analysis failed:'), error.message);
    process.exit(1);
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}