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
    const timing = performance.timing;
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

  const timing = performance.timing;
  const navigationStart = timing.navigationStart;

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
 * Get resource type from URL
 * @param {string} url - Resource URL
 * @returns {string} Resource type
 */
const getResourceType = (url) => {
  if (url.match(/\.(js|mjs)$/)) return 'script';
  if (url.match(/\.css$/)) return 'stylesheet';
  if (url.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) return 'image';
  if (url.match(/\.(woff|woff2|ttf|otf)$/)) return 'font';
  return 'other';
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
 * Calculate performance score based on metrics
 * @param {Object} vitals - Web Vitals data
 * @param {Object} timing - Navigation timing data
 * @returns {number} Performance score (0-100)
 */
export const calculatePerformanceScore = (vitals, timing) => {
  let score = 100;
  let deductions = 0;

  // LCP scoring
  if (vitals.lcp) {
    if (vitals.lcp > METRICS_CONSTANTS.LCP_POOR_THRESHOLD) {
      deductions += 30;
    } else if (vitals.lcp > METRICS_CONSTANTS.LCP_GOOD_THRESHOLD) {
      deductions += 15;
    }
  }

  // FID scoring
  if (vitals.fid) {
    if (vitals.fid > METRICS_CONSTANTS.FID_POOR_THRESHOLD) {
      deductions += 25;
    } else if (vitals.fid > METRICS_CONSTANTS.FID_GOOD_THRESHOLD) {
      deductions += 10;
    }
  }

  // CLS scoring
  if (vitals.cls !== null) {
    if (vitals.cls > METRICS_CONSTANTS.CLS_POOR_THRESHOLD) {
      deductions += 25;
    } else if (vitals.cls > METRICS_CONSTANTS.CLS_GOOD_THRESHOLD) {
      deductions += 10;
    }
  }

  // Navigation timing scoring
  if (timing.totalTime > 5000) {
    deductions += 20;
  } else if (timing.totalTime > 3000) {
    deductions += 10;
  }

  return Math.max(0, score - deductions);
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

  // LCP recommendations
  if (vitals.lcp && vitals.lcp > METRICS_CONSTANTS.LCP_GOOD_THRESHOLD) {
    recommendations.push({
      type: 'lcp',
      severity: vitals.lcp > METRICS_CONSTANTS.LCP_POOR_THRESHOLD ? 'high' : 'medium',
      message: 'Optimize Largest Contentful Paint by reducing image sizes and improving server response times',
      action: 'optimize-images'
    });
  }

  // FID recommendations
  if (vitals.fid && vitals.fid > METRICS_CONSTANTS.FID_GOOD_THRESHOLD) {
    recommendations.push({
      type: 'fid',
      severity: vitals.fid > METRICS_CONSTANTS.FID_POOR_THRESHOLD ? 'high' : 'medium',
      message: 'Reduce JavaScript execution time and break up long tasks',
      action: 'optimize-js'
    });
  }

  // CLS recommendations
  if (vitals.cls && vitals.cls > METRICS_CONSTANTS.CLS_GOOD_THRESHOLD) {
    recommendations.push({
      type: 'cls',
      severity: vitals.cls > METRICS_CONSTANTS.CLS_POOR_THRESHOLD ? 'high' : 'medium',
      message: 'Prevent layout shifts by setting dimensions for images and ads',
      action: 'fix-layout-shifts'
    });
  }

  // Resource-based recommendations
  const largeResources = resources.filter(r => r.isLarge);
  if (largeResources.length > 0) {
    recommendations.push({
      type: 'resources',
      severity: 'medium',
      message: `${largeResources.length} large resources detected. Consider optimization or lazy loading`,
      action: 'optimize-resources'
    });
  }

  // Memory recommendations
  if (memory.available && memory.used > memory.limit * 0.8) {
    recommendations.push({
      type: 'memory',
      severity: 'high',
      message: 'High memory usage detected. Check for memory leaks',
      action: 'optimize-memory'
    });
  }

  return recommendations;
};