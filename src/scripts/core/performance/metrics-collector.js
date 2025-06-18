/**
 * Performance Metrics Collector
 * =============================
 *
 * Collects and monitors performance metrics including Web Vitals
 */

import debug from '../debug.js';

// Constants for thresholds
const METRICS_CONSTANTS = {
  // Web Vitals thresholds
  LCP_GOOD_THRESHOLD: 2500,
  LCP_POOR_THRESHOLD: 4000,
  FID_GOOD_THRESHOLD: 100,
  FID_POOR_THRESHOLD: 300,
  CLS_GOOD_THRESHOLD: 0.1,
  CLS_POOR_THRESHOLD: 0.25,

  // Memory and network
  LARGE_RESOURCE_THRESHOLD: 1024 * 1024, // 1MB
  SLOW_RESOURCE_THRESHOLD: 1000, // 1 second
  MEMORY_UPDATE_INTERVAL: 5000, // 5 seconds
  MAX_RESOURCE_COUNT: 50
};

/**
 * Collect Web Vitals metrics
 * @returns {Object} Web Vitals data
 */
export const collectWebVitals = () => {
  const vitals = {
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null
  };

  // Largest Contentful Paint
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver(list => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        vitals.lcp = lastEntry.startTime;
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (error) {
      debug.warn('LCP observation failed:', error);
    }

    // First Input Delay
    try {
      const fidObserver = new PerformanceObserver(list => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          vitals.fid = entry.processingStart - entry.startTime;
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (error) {
      debug.warn('FID observation failed:', error);
    }

    // Cumulative Layout Shift
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver(list => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        vitals.cls = clsValue;
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      debug.warn('CLS observation failed:', error);
    }
  }

  // Time to First Byte
  if ('performance' in window && 'timing' in performance) {
    const { timing } = performance;
    vitals.ttfb = timing.responseStart - timing.requestStart;
  }

  return vitals;
};

/**
 * Collect navigation timing metrics
 * @returns {Object} Navigation timing data
 */
export const collectNavigationTiming = () => {
  if (!('performance' in window) || !('timing' in performance)) {
    return {};
  }

  const { timing } = performance;
  const { navigationStart } = timing;

  return {
    domainLookup: timing.domainLookupEnd - timing.domainLookupStart,
    connection: timing.connectEnd - timing.connectStart,
    request: timing.responseStart - timing.requestStart,
    response: timing.responseEnd - timing.responseStart,
    domProcessing: timing.domComplete - timing.domLoading,
    loadComplete: timing.loadEventEnd - navigationStart,
    totalTime: timing.loadEventEnd - navigationStart
  };
};

/**
 * Get resource type from URL
 * @param {string} url - Resource URL
 * @returns {string} Resource type
 */
const getResourceType = url => {
  if (url.match(/\.(js|mjs)$/)) {return 'script';}
  if (url.match(/\.css$/)) {return 'stylesheet';}
  if (url.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) {return 'image';}
  if (url.match(/\.(woff|woff2|ttf|otf)$/)) {return 'font';}
  return 'other';
};

/**
 * Collect resource performance data
 * @returns {Array} Resource performance entries
 */
export const collectResourceMetrics = () => {
  if (!('performance' in window) || !('getEntriesByType' in performance)) {
    return [];
  }

  const resources = performance.getEntriesByType('resource');

  return resources
    .slice(-METRICS_CONSTANTS.MAX_RESOURCE_COUNT) // Keep only recent entries
    .map(entry => ({
      name: entry.name,
      type: getResourceType(entry.name),
      size: entry.transferSize || entry.encodedBodySize || 0,
      duration: entry.duration,
      startTime: entry.startTime,
      isLarge: (entry.transferSize || 0) > METRICS_CONSTANTS.LARGE_RESOURCE_THRESHOLD,
      isSlow: entry.duration > METRICS_CONSTANTS.SLOW_RESOURCE_THRESHOLD
    }));
};

/**
 * Collect memory usage metrics
 * @returns {Object} Memory usage data
 */
export const collectMemoryMetrics = () => {
  const metrics = {
    available: false,
    used: 0,
    total: 0,
    limit: 0
  };

  if ('memory' in performance) {
    metrics.available = true;
    metrics.used = performance.memory.usedJSHeapSize;
    metrics.total = performance.memory.totalJSHeapSize;
    metrics.limit = performance.memory.jsHeapSizeLimit;
  }

  return metrics;
};

/**
 * Calculate LCP deductions
 * @param {number} lcp - Largest Contentful Paint value
 * @returns {number} Deduction amount
 */
const calculateLCPDeductions = lcp => {
  if (!lcp) return 0;
  if (lcp > METRICS_CONSTANTS.LCP_POOR_THRESHOLD) return 30;
  if (lcp > METRICS_CONSTANTS.LCP_GOOD_THRESHOLD) return 15;
  return 0;
};

/**
 * Calculate FID deductions
 * @param {number} fid - First Input Delay value
 * @returns {number} Deduction amount
 */
const calculateFIDDeductions = fid => {
  if (!fid) return 0;
  if (fid > METRICS_CONSTANTS.FID_POOR_THRESHOLD) return 25;
  if (fid > METRICS_CONSTANTS.FID_GOOD_THRESHOLD) return 10;
  return 0;
};

/**
 * Calculate CLS deductions
 * @param {number} cls - Cumulative Layout Shift value
 * @returns {number} Deduction amount
 */
const calculateCLSDeductions = cls => {
  if (cls === null) return 0;
  if (cls > METRICS_CONSTANTS.CLS_POOR_THRESHOLD) return 25;
  if (cls > METRICS_CONSTANTS.CLS_GOOD_THRESHOLD) return 10;
  return 0;
};

/**
 * Calculate timing deductions
 * @param {number} totalTime - Total loading time
 * @returns {number} Deduction amount
 */
const calculateTimingDeductions = totalTime => {
  const SLOW_TIMING_THRESHOLD = 5000;
  const MODERATE_TIMING_THRESHOLD = 3000;
  
  if (totalTime > SLOW_TIMING_THRESHOLD) return 20;
  if (totalTime > MODERATE_TIMING_THRESHOLD) return 10;
  return 0;
};

/**
 * Calculate performance score based on metrics
 * @param {Object} vitals - Web Vitals data
 * @param {Object} timing - Navigation timing data
 * @returns {number} Performance score (0-100)
 */
export const calculatePerformanceScore = (vitals, timing) => {
  const baseScore = 100;
  let deductions = 0;

  deductions += calculateLCPDeductions(vitals.lcp);
  deductions += calculateFIDDeductions(vitals.fid);
  deductions += calculateCLSDeductions(vitals.cls);
  deductions += calculateTimingDeductions(timing.totalTime);

  return Math.max(0, baseScore - deductions);
};

/**
 * Add LCP recommendation if needed
 * @param {Array} recommendations - Recommendations array
 * @param {number} lcp - LCP value
 */
const addLCPRecommendation = (recommendations, lcp) => {
  if (lcp && lcp > METRICS_CONSTANTS.LCP_GOOD_THRESHOLD) {
    recommendations.push({
      type: 'lcp',
      severity: lcp > METRICS_CONSTANTS.LCP_POOR_THRESHOLD ? 'high' : 'medium',
      message: 'Optimize Largest Contentful Paint by reducing image sizes and improving server response times',
      action: 'optimize-images'
    });
  }
};

/**
 * Add FID recommendation if needed
 * @param {Array} recommendations - Recommendations array
 * @param {number} fid - FID value
 */
const addFIDRecommendation = (recommendations, fid) => {
  if (fid && fid > METRICS_CONSTANTS.FID_GOOD_THRESHOLD) {
    recommendations.push({
      type: 'fid',
      severity: fid > METRICS_CONSTANTS.FID_POOR_THRESHOLD ? 'high' : 'medium',
      message: 'Reduce JavaScript execution time and break up long tasks',
      action: 'optimize-js'
    });
  }
};

/**
 * Add CLS recommendation if needed
 * @param {Array} recommendations - Recommendations array
 * @param {number} cls - CLS value
 */
const addCLSRecommendation = (recommendations, cls) => {
  if (cls && cls > METRICS_CONSTANTS.CLS_GOOD_THRESHOLD) {
    recommendations.push({
      type: 'cls',
      severity: cls > METRICS_CONSTANTS.CLS_POOR_THRESHOLD ? 'high' : 'medium',
      message: 'Prevent layout shifts by setting dimensions for images and ads',
      action: 'fix-layout-shifts'
    });
  }
};

/**
 * Add resource-based recommendations
 * @param {Array} recommendations - Recommendations array
 * @param {Array} resources - Resource metrics
 */
const addResourceRecommendations = (recommendations, resources) => {
  const largeResources = resources.filter(resource => resource.isLarge);
  if (largeResources.length > 0) {
    recommendations.push({
      type: 'resources',
      severity: 'medium',
      message: `${largeResources.length} large resources detected. Consider optimization or lazy loading`,
      action: 'optimize-resources'
    });
  }
};

/**
 * Add memory recommendations
 * @param {Array} recommendations - Recommendations array
 * @param {Object} memory - Memory metrics
 */
const addMemoryRecommendations = (recommendations, memory) => {
  const MEMORY_USAGE_THRESHOLD = 0.8;
  if (memory.available && memory.used > memory.limit * MEMORY_USAGE_THRESHOLD) {
    recommendations.push({
      type: 'memory',
      severity: 'high',
      message: 'High memory usage detected. Check for memory leaks',
      action: 'optimize-memory'
    });
  }
};

/**
 * Add Web Vitals recommendations
 * @param {Array} recommendations - Recommendations array
 * @param {Object} vitals - Web Vitals data
 */
const addVitalsRecommendations = (recommendations, vitals) => {
  addLCPRecommendation(recommendations, vitals.lcp);
  addFIDRecommendation(recommendations, vitals.fid);
  addCLSRecommendation(recommendations, vitals.cls);
};

/**
 * Get performance recommendations based on metrics
 * @param {Object} vitals - Web Vitals data
 * @param {Array} resources - Resource metrics
 * @param {Object} memory - Memory metrics
 * @returns {Array} Recommendations
 */
export const getPerformanceRecommendations = (vitals, resources, memory) => {
  const recommendations = [];

  addVitalsRecommendations(recommendations, vitals);
  addResourceRecommendations(recommendations, resources);
  addMemoryRecommendations(recommendations, memory);

  return recommendations;
};