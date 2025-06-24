/**
 * Performance Optimization System
 * ==============================
 *
 * Provides comprehensive performance monitoring and optimization features:
 * - Real-time performance metrics
 * - Lazy loading optimizations
 * - Critical resource prioritization
 * - Image optimization
 * - Code splitting insights
 * - Network efficiency monitoring
 *
 * Educational Features:
 * - Performance learning dashboard
 * - Best practice recommendations
 * - Real-time optimization suggestions
 * - Performance budget monitoring
 */

import debug from './debug.js';
import {
  collectWebVitals,
  collectNavigationTiming,
  collectResourceMetrics,
  collectMemoryMetrics,
  calculatePerformanceScore,
  getPerformanceRecommendations
} from './performance/metrics-collector.js';
import {
  createDashboardTemplate,
  updateDashboard,
  showPerformanceToast
} from './performance/dashboard-ui.js';
import { createElementFromHTML } from './helpers/safe-html.js';
import {
  initializeLazyLoading,
  preloadCriticalResources,
  optimizeJavaScriptExecution,
  debounce,
  throttle
} from './performance/optimization-engine.js';

// Constants
const CONSTANTS = {
  MEMORY_UPDATE_INTERVAL: 5000, // 5 seconds
  DASHBOARD_UPDATE_INTERVAL: 10000, // 10 seconds
  TOAST_DURATION: 4000
};

class PerformanceOptimizer {
  constructor() {
    this.metrics = {
      pageLoad: {},
      resources: [],
      vitals: {},
      navigation: {},
      memory: {},
      score: 0,
      recommendations: []
    };
    this.dashboard = null;
    this.updateInterval = null;
    this.observers = {}; // Track IntersectionObserver instances
    this.init();
  }

  /**
   * Initialize performance optimization features
   */
  init() {
    // Wait for page to be interactive
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.setupMonitoring();
        this.setupOptimizations();
        this.createDashboard();
        this.startPeriodicUpdates();
      });
    } else {
      this.setupMonitoring();
      this.setupOptimizations();
      this.createDashboard();
      this.startPeriodicUpdates();
    }

    debug.log('BSB Performance: Optimization system initialized ⚡');
  }

  /**
   * Setup performance monitoring
   */
  setupMonitoring() {
    this.collectMetrics();
  }

  /**
   * Collect all performance metrics
   */
  collectMetrics() {
    this.metrics.vitals = collectWebVitals();
    this.metrics.navigation = collectNavigationTiming();
    this.metrics.resources = collectResourceMetrics();
    this.metrics.memory = collectMemoryMetrics();

    // Calculate overall score
    this.metrics.score = calculatePerformanceScore(
      this.metrics.vitals,
      this.metrics.navigation
    );

    // Get recommendations
    this.metrics.recommendations = getPerformanceRecommendations(
      this.metrics.vitals,
      this.metrics.resources,
      this.metrics.memory
    );
  }

  /**
   * Setup performance optimizations
   */
  setupOptimizations() {
    // Initialize lazy loading for images
    initializeLazyLoading();

    // Preload critical resources
    const criticalResources = [
      { url: '/styles/critical.css', type: 'style' },
      { url: '/scripts/core.js', type: 'script' }
    ];
    preloadCriticalResources(criticalResources);

    debug.log('Performance optimizations applied');
  }

  /**
   * Create performance dashboard
   */
  createDashboard() {
    const template = createDashboardTemplate(this.metrics);
    this.dashboard = createElementFromHTML(template);

    // Add to page
    document.body.appendChild(this.dashboard);

    // Setup event listeners
    this.setupDashboardEvents();
  }

  /**
   * Setup dashboard event listeners
   */
  setupDashboardEvents() {
    if (!this.dashboard) {
      return;
    }

    const toggleBtn = this.dashboard.querySelector('.bsb-performance-dashboard__toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this.toggleDashboard();
      });
    }
  }

  /**
   * Toggle dashboard visibility
   */
  toggleDashboard() {
    if (!this.dashboard) {
      return;
    }

    this.dashboard.classList.toggle('minimized');
    const toggleBtn = this.dashboard.querySelector('.bsb-performance-dashboard__toggle span');
    if (toggleBtn) {
      toggleBtn.textContent = this.dashboard.classList.contains('minimized') ? '+' : '−';
    }
  }

  /**
   * Start periodic metric updates
   */
  startPeriodicUpdates() {
    this.updateInterval = setInterval(() => {
      this.updateMetrics();
    }, CONSTANTS.DASHBOARD_UPDATE_INTERVAL);
  }

  /**
   * Update metrics and dashboard
   */
  updateMetrics() {
    this.collectMetrics();
    updateDashboard(this.dashboard, this.metrics);
  }

  /**
   * Show performance notification
   * @param {string} message - Notification message
   * @param {string} type - Notification type
   */
  showNotification(message, type = 'info') {
    showPerformanceToast(message, type);
  }

  /**
   * Get current metrics
   * @returns {Object} Current performance metrics
   */
  getMetrics() {
    return { ...this.metrics };
  }

  /**
   * Optimize resource hints for better loading performance
   */
  optimizeResourceHints() {
    // Add preconnect hints for external resources
    const externalHosts = new Set();

    // Find all external resources
    const resources = document.querySelectorAll('link[href], script[src], img[src]');
    resources.forEach(resource => {
      const url = resource.href || resource.src;
      if (url && url.startsWith('http')) {
        try {
          const urlObj = new URL(url);
          if (urlObj.host !== window.location.host) {
            externalHosts.add(urlObj.origin);
          }
        } catch (error) {
          // Invalid URL
        }
      }
    });

    // Add preconnect hints
    externalHosts.forEach(host => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = host;
      document.head.appendChild(link);
    });

    debug.log(`Added preconnect hints for ${externalHosts.size} external hosts`);
  }

  /**
   * Optimize critical CSS delivery
   */
  optimizeCriticalCSS() {
    // Find all stylesheets
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');

    stylesheets.forEach(stylesheet => {
      // Skip already optimized sheets
      if (stylesheet.dataset.critical === 'true') {
        return;
      }

      // For non-critical stylesheets, load them asynchronously
      if (!stylesheet.href.includes('critical')) {
        const newLink = document.createElement('link');
        newLink.rel = 'preload';
        newLink.as = 'style';
        newLink.href = stylesheet.href;
        newLink.onload = function onload() {
          this.onload = null;
          this.rel = 'stylesheet';
        };

        // Insert before the original link
        stylesheet.parentNode.insertBefore(newLink, stylesheet);
        // Remove the original blocking link
        stylesheet.remove();
      }
    });

    debug.log('Optimized critical CSS delivery');
  }

  /**
   * Measure Web Vitals metrics
   */
  measureWebVitals() {
    // Measure Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver(entryList => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.vitals.lcp = lastEntry.renderTime || lastEntry.loadTime;
          debug.log(`LCP: ${this.metrics.vitals.lcp}ms`);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.lcp = lcpObserver;
      } catch (error) {
        // LCP observer not supported
      }

      // Measure First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver(entryList => {
          const entries = entryList.getEntries();
          entries.forEach(entry => {
            this.metrics.vitals.fid = entry.processingStart - entry.startTime;
            debug.log(`FID: ${this.metrics.vitals.fid}ms`);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.fid = fidObserver;
      } catch (error) {
        // FID observer not supported
      }

      // Measure Cumulative Layout Shift (CLS)
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver(entryList => {
          for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
              this.metrics.vitals.cls = clsValue;
            }
          }
          debug.log(`CLS: ${this.metrics.vitals.cls}`);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.cls = clsObserver;
      } catch (error) {
        // CLS observer not supported
      }
    }
  }

  /**
   * Cleanup resources
   */
  cleanup() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    if (this.dashboard) {
      this.dashboard.remove();
    }

    // Disconnect all observers
    Object.values(this.observers).forEach(observer => {
      if (observer && observer.disconnect) {
        observer.disconnect();
      }
    });
  }
}

// Initialize performance optimizer when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.bsbPerformance = new PerformanceOptimizer();
  });
} else {
  window.bsbPerformance = new PerformanceOptimizer();
}

export default PerformanceOptimizer;