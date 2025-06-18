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
    const container = document.createElement('div');
    container.innerHTML = template;
    this.dashboard = container.firstElementChild;
    
    // Add to page
    document.body.appendChild(this.dashboard);
    
    // Setup event listeners
    this.setupDashboardEvents();
  }

  /**
   * Setup dashboard event listeners
   */
  setupDashboardEvents() {
    if (!this.dashboard) return;
    
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
    if (!this.dashboard) return;
    
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
   * Cleanup resources
   */
  cleanup() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    
    if (this.dashboard) {
      this.dashboard.remove();
    }
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