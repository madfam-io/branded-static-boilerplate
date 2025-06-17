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

class PerformanceOptimizer {
  constructor() {
    this.metrics = {
      pageLoad: {},
      resources: [],
      vitals: {},
      navigation: {}
    };
    this.observers = {};
    this.init();
  }

  /**
   * Initialize performance optimization features
   */
  init() {
    // Wait for page to be interactive
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.setupPerformanceMonitoring();
        this.setupOptimizations();
        this.createPerformanceDashboard();
      });
    } else {
      this.setupPerformanceMonitoring();
      this.setupOptimizations();
      this.createPerformanceDashboard();
    }
    
    debug.log('BSB Performance: Optimization system initialized ⚡');
  }

  /**
   * Setup comprehensive performance monitoring
   */
  setupPerformanceMonitoring() {
    // Core Web Vitals monitoring
    this.measureWebVitals();
    
    // Resource performance tracking
    this.trackResourcePerformance();
    
    // Navigation performance
    this.trackNavigationPerformance();
    
    // User interaction tracking
    this.trackUserInteractions();
    
    // Memory usage monitoring (if available)
    this.trackMemoryUsage();
  }

  /**
   * Measure Core Web Vitals
   */
  measureWebVitals() {
    // Largest Contentful Paint (LCP)
    this.observeLCP();
    
    // First Input Delay (FID)
    this.observeFID();
    
    // Cumulative Layout Shift (CLS)
    this.observeCLS();
    
    // First Contentful Paint (FCP)
    this.observeFCP();
    
    // Time to First Byte (TTFB)
    this.measureTTFB();
  }

  /**
   * Observe Largest Contentful Paint
   */
  observeLCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.vitals.lcp = Math.round(lastEntry.startTime);
        this.updateDashboard();
      });
      
      try {
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.lcp = observer;
      } catch (e) {
        debug.warn('LCP observation not supported');
      }
    }
  }

  /**
   * Observe First Input Delay
   */
  observeFID() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.metrics.vitals.fid = Math.round(entry.processingStart - entry.startTime);
          this.updateDashboard();
        });
      });
      
      try {
        observer.observe({ entryTypes: ['first-input'] });
        this.observers.fid = observer;
      } catch (e) {
        debug.warn('FID observation not supported');
      }
    }
  }

  /**
   * Observe Cumulative Layout Shift
   */
  observeCLS() {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.metrics.vitals.cls = Math.round(clsValue * 10000) / 10000;
            this.updateDashboard();
          }
        });
      });
      
      try {
        observer.observe({ entryTypes: ['layout-shift'] });
        this.observers.cls = observer;
      } catch (e) {
        debug.warn('CLS observation not supported');
      }
    }
  }

  /**
   * Observe First Contentful Paint
   */
  observeFCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.vitals.fcp = Math.round(entry.startTime);
            this.updateDashboard();
          }
        });
      });
      
      try {
        observer.observe({ entryTypes: ['paint'] });
        this.observers.fcp = observer;
      } catch (e) {
        debug.warn('FCP observation not supported');
      }
    }
  }

  /**
   * Measure Time to First Byte
   */
  measureTTFB() {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation) {
        this.metrics.vitals.ttfb = Math.round(navigation.responseStart - navigation.requestStart);
        this.updateDashboard();
      }
    }
  }

  /**
   * Track resource performance
   */
  trackResourcePerformance() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.metrics.resources.push({
            name: entry.name,
            type: this.getResourceType(entry.name),
            size: entry.transferSize || entry.encodedBodySize || 0,
            duration: Math.round(entry.duration),
            startTime: Math.round(entry.startTime)
          });
        });
        this.analyzeResourcePerformance();
      });
      
      try {
        observer.observe({ entryTypes: ['resource'] });
        this.observers.resource = observer;
      } catch (e) {
        debug.warn('Resource observation not supported');
      }
    }
  }

  /**
   * Get resource type from URL
   */
  getResourceType(url) {
    if (url.match(/\.(css)$/i)) return 'stylesheet';
    if (url.match(/\.(js)$/i)) return 'script';
    if (url.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i)) return 'image';
    if (url.match(/\.(woff|woff2|ttf|eot)$/i)) return 'font';
    return 'other';
  }

  /**
   * Analyze resource performance and provide recommendations
   */
  analyzeResourcePerformance() {
    const resources = this.metrics.resources;
    const recommendations = [];
    
    // Check for large resources
    const largeResources = resources.filter(r => r.size > 1024 * 1024); // > 1MB
    if (largeResources.length > 0) {
      recommendations.push({
        type: 'warning',
        message: `${largeResources.length} large resources detected. Consider optimization.`,
        details: largeResources.map(r => `${r.name}: ${this.formatBytes(r.size)}`)
      });
    }
    
    // Check for slow-loading resources
    const slowResources = resources.filter(r => r.duration > 1000); // > 1s
    if (slowResources.length > 0) {
      recommendations.push({
        type: 'warning',
        message: `${slowResources.length} slow-loading resources detected.`,
        details: slowResources.map(r => `${r.name}: ${r.duration}ms`)
      });
    }
    
    // Check for too many requests
    if (resources.length > 50) {
      recommendations.push({
        type: 'info',
        message: `${resources.length} total requests. Consider bundling or HTTP/2 push.`
      });
    }
    
    this.updateRecommendations(recommendations);
  }

  /**
   * Track navigation performance
   */
  trackNavigationPerformance() {
    if ('performance' in window && 'getEntriesByType' in performance) {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
          this.metrics.navigation = {
            domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
            loadComplete: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
            domInteractive: Math.round(navigation.domInteractive - navigation.fetchStart),
            totalLoadTime: Math.round(navigation.loadEventEnd - navigation.fetchStart)
          };
          this.updateDashboard();
        }
      });
    }
  }

  /**
   * Track user interactions for performance impact
   */
  trackUserInteractions() {
    let interactionCount = 0;
    const startTime = performance.now();
    
    ['click', 'touchstart', 'keydown', 'scroll'].forEach(eventType => {
      document.addEventListener(eventType, () => {
        interactionCount++;
        
        // Sample every 10th interaction to avoid performance impact
        if (interactionCount % 10 === 0) {
          const currentTime = performance.now();
          const sessionDuration = currentTime - startTime;
          
          this.metrics.interactions = {
            count: interactionCount,
            sessionDuration: Math.round(sessionDuration),
            interactionsPerMinute: Math.round((interactionCount / sessionDuration) * 60000)
          };
        }
      }, { passive: true });
    });
  }

  /**
   * Track memory usage if available
   */
  trackMemoryUsage() {
    if ('memory' in performance) {
      const updateMemory = () => {
        this.metrics.memory = {
          used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
          limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
        };
        this.updateDashboard();
      };
      
      updateMemory();
      setInterval(updateMemory, 5000); // Update every 5 seconds
    }
  }

  /**
   * Setup performance optimizations
   */
  setupOptimizations() {
    // Enhanced lazy loading
    this.setupIntelligentLazyLoading();
    
    // Resource hints optimization
    this.optimizeResourceHints();
    
    // Critical CSS optimization
    this.optimizeCriticalCSS();
    
    // Image optimization
    this.optimizeImages();
    
    // Font loading optimization
    this.optimizeFonts();
  }

  /**
   * Intelligent lazy loading with intersection observer
   */
  setupIntelligentLazyLoading() {
    if ('IntersectionObserver' in window) {
      // Lazy load images with smart preloading
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            
            // Load image
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            
            // Load srcset if available
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
              img.removeAttribute('data-srcset');
            }
            
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px', // Start loading 50px before entering viewport
        threshold: 0.01
      });
      
      // Observe all lazy images
      document.querySelectorAll('img[data-src]').forEach(img => {
        img.classList.add('lazy');
        imageObserver.observe(img);
      });
      
      // Lazy load other content sections
      const contentObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target;
            element.classList.add('loaded');
            observer.unobserve(element);
          }
        });
      }, {
        rootMargin: '100px 0px',
        threshold: 0.1
      });
      
      document.querySelectorAll('[data-lazy-content]').forEach(element => {
        contentObserver.observe(element);
      });
    }
  }

  /**
   * Optimize resource hints
   */
  optimizeResourceHints() {
    // Add preconnect for external domains
    const externalDomains = new Set();
    
    document.querySelectorAll('link[href^="http"], script[src^="http"], img[src^="http"]').forEach(element => {
      try {
        const url = new URL(element.href || element.src);
        if (url.hostname !== window.location.hostname) {
          externalDomains.add(url.origin);
        }
      } catch (e) {
        // Invalid URL, skip
      }
    });
    
    // Add preconnect links for external domains
    externalDomains.forEach(domain => {
      if (!document.querySelector(`link[rel="preconnect"][href="${domain}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        document.head.appendChild(link);
      }
    });
  }

  /**
   * Optimize images
   */
  optimizeImages() {
    // Check for images without proper sizing
    const unsizedImages = document.querySelectorAll('img:not([width]):not([height])');
    if (unsizedImages.length > 0) {
      debug.warn(`${unsizedImages.length} images without explicit dimensions found. This may cause layout shifts.`);
    }
    
    // Add modern image format support detection
    this.detectImageFormatSupport();
    
    // Optimize image loading
    document.querySelectorAll('img').forEach(img => {
      // Add loading attribute if not present
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
      
      // Add decoding attribute for better performance
      if (!img.hasAttribute('decoding')) {
        img.setAttribute('decoding', 'async');
      }
    });
  }

  /**
   * Detect image format support
   */
  detectImageFormatSupport() {
    const formats = {
      webp: 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
      avif: 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABAAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIAAIAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=',
      jxl: 'data:image/jxl;base64,/woIELASCAgQAFwASxLFgkWAHL8BeQPAjFxKbABwACQAOAUQANwwGA=='
    };
    
    Object.entries(formats).forEach(([format, dataUri]) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        document.documentElement.classList.toggle(`supports-${format}`, img.width === 1);
      };
      img.src = dataUri;
    });
  }

  /**
   * Optimize fonts
   */
  optimizeFonts() {
    // Add font-display: swap to font faces
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
    
    // Preload critical fonts
    const criticalFonts = [
      '/assets/fonts/main-font.woff2',
      '/assets/fonts/heading-font.woff2'
    ];
    
    criticalFonts.forEach(fontUrl => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = fontUrl;
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }

  /**
   * Create performance dashboard
   */
  createPerformanceDashboard() {
    // Only show in development or when explicitly enabled
    const showDashboard = localStorage.getItem('bsb-show-performance') === 'true' || 
                         window.location.hostname === 'localhost';
    
    if (!showDashboard) return;
    
    const dashboard = document.createElement('div');
    dashboard.id = 'bsb-performance-dashboard';
    dashboard.className = 'bsb-perf-dashboard';
    dashboard.innerHTML = `
      <div class="bsb-perf-dashboard__header">
        <h3>Performance Dashboard</h3>
        <button class="bsb-perf-dashboard__toggle">×</button>
      </div>
      <div class="bsb-perf-dashboard__content">
        <div class="bsb-perf-section">
          <h4>Core Web Vitals</h4>
          <div class="bsb-perf-vitals">
            <div class="bsb-perf-metric">
              <span class="bsb-perf-label">LCP</span>
              <span class="bsb-perf-value" data-metric="lcp">-</span>
            </div>
            <div class="bsb-perf-metric">
              <span class="bsb-perf-label">FID</span>
              <span class="bsb-perf-value" data-metric="fid">-</span>
            </div>
            <div class="bsb-perf-metric">
              <span class="bsb-perf-label">CLS</span>
              <span class="bsb-perf-value" data-metric="cls">-</span>
            </div>
          </div>
        </div>
        <div class="bsb-perf-section">
          <h4>Resources</h4>
          <div class="bsb-perf-resources">
            <div class="bsb-perf-metric">
              <span class="bsb-perf-label">Count</span>
              <span class="bsb-perf-value" data-metric="resourceCount">-</span>
            </div>
            <div class="bsb-perf-metric">
              <span class="bsb-perf-label">Size</span>
              <span class="bsb-perf-value" data-metric="totalSize">-</span>
            </div>
          </div>
        </div>
        <div class="bsb-perf-section">
          <h4>Recommendations</h4>
          <div class="bsb-perf-recommendations" data-recommendations></div>
        </div>
      </div>
    `;
    
    document.body.appendChild(dashboard);
    
    // Style the dashboard
    this.styleDashboard();
    
    // Bind toggle functionality
    dashboard.querySelector('.bsb-perf-dashboard__toggle').addEventListener('click', () => {
      dashboard.classList.toggle('minimized');
    });
    
    // Update initially
    this.updateDashboard();
  }

  /**
   * Style the performance dashboard
   */
  styleDashboard() {
    const style = document.createElement('style');
    style.textContent = `
      .bsb-perf-dashboard {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 300px;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-family: system-ui, sans-serif;
        font-size: 12px;
        z-index: 10000;
        max-height: 400px;
        overflow-y: auto;
      }
      
      .bsb-perf-dashboard.minimized .bsb-perf-dashboard__content {
        display: none;
      }
      
      .bsb-perf-dashboard__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        background: #f8f9fa;
        border-bottom: 1px solid #ddd;
        border-radius: 8px 8px 0 0;
      }
      
      .bsb-perf-dashboard__header h3 {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
      }
      
      .bsb-perf-dashboard__toggle {
        background: none;
        border: none;
        font-size: 16px;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .bsb-perf-dashboard__content {
        padding: 12px;
      }
      
      .bsb-perf-section {
        margin-bottom: 16px;
      }
      
      .bsb-perf-section h4 {
        margin: 0 0 8px 0;
        font-size: 12px;
        font-weight: 600;
        color: #666;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .bsb-perf-vitals,
      .bsb-perf-resources {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
      }
      
      .bsb-perf-metric {
        background: #f8f9fa;
        padding: 8px;
        border-radius: 4px;
        text-align: center;
      }
      
      .bsb-perf-label {
        display: block;
        font-weight: 600;
        margin-bottom: 4px;
      }
      
      .bsb-perf-value {
        display: block;
        font-weight: normal;
      }
      
      .bsb-perf-value.good { color: #28a745; }
      .bsb-perf-value.needs-improvement { color: #ffc107; }
      .bsb-perf-value.poor { color: #dc3545; }
      
      .bsb-perf-recommendations {
        font-size: 11px;
        line-height: 1.4;
      }
      
      .bsb-perf-recommendation {
        margin-bottom: 8px;
        padding: 6px;
        border-radius: 4px;
      }
      
      .bsb-perf-recommendation.warning {
        background: #fff3cd;
        color: #856404;
      }
      
      .bsb-perf-recommendation.info {
        background: #d1ecf1;
        color: #0c5460;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Update performance dashboard
   */
  updateDashboard() {
    const dashboard = document.getElementById('bsb-performance-dashboard');
    if (!dashboard) return;
    
    // Update Core Web Vitals
    this.updateMetric('lcp', this.metrics.vitals.lcp, 'ms', { good: 2500, poor: 4000 });
    this.updateMetric('fid', this.metrics.vitals.fid, 'ms', { good: 100, poor: 300 });
    this.updateMetric('cls', this.metrics.vitals.cls, '', { good: 0.1, poor: 0.25 });
    
    // Update resource metrics
    this.updateMetric('resourceCount', this.metrics.resources.length, '');
    const totalSize = this.metrics.resources.reduce((sum, r) => sum + r.size, 0);
    this.updateMetric('totalSize', this.formatBytes(totalSize), '');
  }

  /**
   * Update individual metric
   */
  updateMetric(metricName, value, unit, thresholds = null) {
    const element = document.querySelector(`[data-metric="${metricName}"]`);
    if (!element || value === undefined) return;
    
    element.textContent = value + (unit || '');
    
    if (thresholds && typeof value === 'number') {
      element.className = 'bsb-perf-value';
      if (value <= thresholds.good) {
        element.classList.add('good');
      } else if (value <= thresholds.poor) {
        element.classList.add('needs-improvement');
      } else {
        element.classList.add('poor');
      }
    }
  }

  /**
   * Update recommendations
   */
  updateRecommendations(recommendations) {
    const container = document.querySelector('[data-recommendations]');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (recommendations.length === 0) {
      container.innerHTML = '<div class="bsb-perf-recommendation info">All metrics look good! 🎉</div>';
      return;
    }
    
    recommendations.forEach(rec => {
      const div = document.createElement('div');
      div.className = `bsb-perf-recommendation ${rec.type}`;
      div.innerHTML = `
        <strong>${rec.message}</strong>
        ${rec.details ? `<br><small>${rec.details.join('<br>')}</small>` : ''}
      `;
      container.appendChild(div);
    });
  }

  /**
   * Format bytes to human readable
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  /**
   * Get current performance metrics
   */
  getMetrics() {
    return { ...this.metrics };
  }

  /**
   * Export performance report
   */
  exportReport() {
    const report = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      metrics: this.getMetrics(),
      recommendations: this.generateRecommendations()
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Generate performance recommendations
   */
  generateRecommendations() {
    const recommendations = [];
    
    // LCP recommendations
    if (this.metrics.vitals.lcp > 4000) {
      recommendations.push('Optimize Largest Contentful Paint: Consider reducing server response times, optimizing resource loading, and removing render-blocking resources.');
    }
    
    // FID recommendations
    if (this.metrics.vitals.fid > 300) {
      recommendations.push('Improve First Input Delay: Reduce JavaScript execution time, split code into smaller chunks, and use web workers for heavy computations.');
    }
    
    // CLS recommendations
    if (this.metrics.vitals.cls > 0.25) {
      recommendations.push('Reduce Cumulative Layout Shift: Add dimensions to images and videos, avoid inserting content above existing content, and use CSS transforms instead of changing layout properties.');
    }
    
    return recommendations;
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