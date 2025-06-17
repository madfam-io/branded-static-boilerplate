/**
 * =============================================================================
 * RESOURCE HINTS - Optimize Resource Loading
 * =============================================================================
 *
 * This module implements resource hints to improve page loading performance
 * by intelligently preloading, prefetching, and preconnecting resources.
 *
 * 🎯 Features:
 * - DNS prefetch for external domains
 * - Preconnect to critical origins
 * - Prefetch next-page resources
 * - Preload critical assets
 * - Intersection Observer for lazy loading
 *
 * 📚 Learn More:
 * - Resource Hints: https://w3c.github.io/resource-hints/
 * - Web Performance: /docs/tutorials/performance.md
 * =============================================================================
 */

/**
 * Resource Hints Manager
 * @class ResourceHints
 */
class ResourceHints {
  /**
   * Initialize resource hints
   * @constructor
   */
  constructor() {
    this.criticalResources = new Set();
    this.prefetchQueue = new Map();
    this.observers = new Map();
    
    this.init();
  }
  
  /**
   * Initialize resource hints system
   * @method init
   */
  init() {
    // Add critical resource hints immediately
    this.addCriticalHints();
    
    // Setup intersection observer for lazy resources
    this.setupLazyLoading();
    
    // Monitor navigation for prefetching
    this.setupNavigationPrefetch();
    
    // Add performance monitoring
    this.monitorPerformance();
  }
  
  /**
   * Add critical resource hints
   * @method addCriticalHints
   */
  addCriticalHints() {
    // DNS prefetch for external domains
    const dnsPrefetchDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com'
    ];
    
    dnsPrefetchDomains.forEach(domain => {
      this.addHint('dns-prefetch', domain);
    });
    
    // Preconnect to critical origins
    const preconnectOrigins = [
      { href: 'https://fonts.googleapis.com', crossorigin: 'anonymous' },
      { href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' }
    ];
    
    preconnectOrigins.forEach(origin => {
      this.addHint('preconnect', origin.href, origin.crossorigin);
    });
    
    // Preload critical fonts
    const criticalFonts = [
      '/fonts/inter-var.woff2',
      '/fonts/jetbrains-mono.woff2'
    ];
    
    criticalFonts.forEach(font => {
      this.preloadResource(font, 'font', 'crossorigin');
    });
  }
  
  /**
   * Add resource hint to document head
   * @method addHint
   * @param {string} rel - Hint relationship type
   * @param {string} href - Resource URL
   * @param {string} [crossorigin] - Crossorigin attribute
   */
  addHint(rel, href, crossorigin = null) {
    // Check if hint already exists
    const existing = document.querySelector(`link[rel="${rel}"][href="${href}"]`);
    if (existing) return;
    
    const link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    
    if (crossorigin) {
      link.crossOrigin = crossorigin;
    }
    
    document.head.appendChild(link);
  }
  
  /**
   * Preload a specific resource
   * @method preloadResource
   * @param {string} href - Resource URL
   * @param {string} as - Resource type
   * @param {string} [crossorigin] - Crossorigin attribute
   */
  preloadResource(href, as, crossorigin = null) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    
    if (crossorigin) {
      link.crossOrigin = crossorigin;
    }
    
    // Add importance hint for critical resources
    if (this.criticalResources.has(href)) {
      link.importance = 'high';
    }
    
    document.head.appendChild(link);
  }
  
  /**
   * Setup lazy loading with Intersection Observer
   * @method setupLazyLoading
   */
  setupLazyLoading() {
    // Lazy load images
    const lazyImages = document.querySelectorAll('img[data-src]');
    if (lazyImages.length > 0) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });
      
      lazyImages.forEach(img => imageObserver.observe(img));
      this.observers.set('images', imageObserver);
    }
    
    // Lazy load scripts
    const lazyScripts = document.querySelectorAll('script[data-lazy]');
    if (lazyScripts.length > 0) {
      const scriptObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const script = entry.target;
            const newScript = document.createElement('script');
            newScript.src = script.dataset.src;
            newScript.type = 'module';
            document.body.appendChild(newScript);
            scriptObserver.unobserve(script);
          }
        });
      }, {
        rootMargin: '100px 0px'
      });
      
      lazyScripts.forEach(script => scriptObserver.observe(script));
      this.observers.set('scripts', scriptObserver);
    }
  }
  
  /**
   * Setup navigation prefetching
   * @method setupNavigationPrefetch
   */
  setupNavigationPrefetch() {
    // Prefetch on hover
    document.addEventListener('mouseover', (e) => {
      const link = e.target.closest('a[href]');
      if (link && this.shouldPrefetch(link)) {
        this.prefetchPage(link.href);
      }
    });
    
    // Prefetch visible links
    const linkObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const link = entry.target;
          if (this.shouldPrefetch(link)) {
            // Delay prefetch to avoid overwhelming the browser
            setTimeout(() => {
              this.prefetchPage(link.href);
            }, 1000);
          }
        }
      });
    }, {
      rootMargin: '0px 0px 50px 0px',
      threshold: 0.5
    });
    
    const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="./"]');
    internalLinks.forEach(link => linkObserver.observe(link));
    this.observers.set('links', linkObserver);
  }
  
  /**
   * Check if URL should be prefetched
   * @method shouldPrefetch
   * @param {HTMLAnchorElement} link - Link element
   * @returns {boolean}
   */
  shouldPrefetch(link) {
    // Don't prefetch if already visited
    if (this.prefetchQueue.has(link.href)) return false;
    
    // Don't prefetch external links
    if (link.host !== window.location.host) return false;
    
    // Don't prefetch downloads
    if (link.hasAttribute('download')) return false;
    
    // Don't prefetch if user has data saver enabled
    if (navigator.connection && navigator.connection.saveData) return false;
    
    // Don't prefetch on slow connections
    if (navigator.connection && navigator.connection.effectiveType === 'slow-2g') return false;
    
    return true;
  }
  
  /**
   * Prefetch a page and its resources
   * @method prefetchPage
   * @param {string} url - Page URL to prefetch
   */
  prefetchPage(url) {
    if (this.prefetchQueue.has(url)) return;
    
    this.prefetchQueue.set(url, true);
    
    // Prefetch the HTML
    this.addHint('prefetch', url);
    
    // Prefetch associated resources based on page type
    const pageName = url.split('/').pop().replace('.html', '');
    
    // Map pages to their likely resources
    const pageResources = {
      'interactive-playground': [
        '/js/interactive-*.js',
        '/assets/interactive-playground-*.css'
      ],
      'project-structure': [
        '/js/project-structure-*.js',
        '/assets/project-structure-*.css'
      ],
      'design-system': [
        '/js/design-system-*.js',
        '/assets/design-system-*.css'
      ]
    };
    
    if (pageResources[pageName]) {
      pageResources[pageName].forEach(resource => {
        // Note: In production, these would be actual hashed filenames
        this.addHint('prefetch', resource);
      });
    }
  }
  
  /**
   * Monitor performance and adjust strategies
   * @method monitorPerformance
   */
  monitorPerformance() {
    // Monitor resource timing
    if ('PerformanceObserver' in window) {
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // Track slow resources
          if (entry.duration > 1000) {
            console.warn(`Slow resource: ${entry.name} took ${entry.duration}ms`);
            
            // Add to critical resources for next visit
            if (entry.initiatorType === 'css' || entry.initiatorType === 'script') {
              this.criticalResources.add(entry.name);
              this.saveCriticalResources();
            }
          }
        }
      });
      
      resourceObserver.observe({ entryTypes: ['resource'] });
    }
    
    // Monitor long tasks
    if ('PerformanceObserver' in window && 'PerformanceLongTaskTiming' in window) {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.warn(`Long task detected: ${entry.duration}ms`);
        }
      });
      
      try {
        longTaskObserver.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        // Long task timing might not be supported
      }
    }
  }
  
  /**
   * Save critical resources to localStorage
   * @method saveCriticalResources
   */
  saveCriticalResources() {
    try {
      localStorage.setItem('bsb-critical-resources', 
        JSON.stringify([...this.criticalResources])
      );
    } catch (e) {
      // Storage might be full
    }
  }
  
  /**
   * Load saved critical resources
   * @method loadCriticalResources
   */
  loadCriticalResources() {
    try {
      const saved = localStorage.getItem('bsb-critical-resources');
      if (saved) {
        const resources = JSON.parse(saved);
        resources.forEach(resource => this.criticalResources.add(resource));
      }
    } catch (e) {
      // Invalid data
    }
  }
  
  /**
   * Clean up observers
   * @method cleanup
   */
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

// Initialize resource hints
if (typeof window !== 'undefined') {
  window.BSBResourceHints = new ResourceHints();
}

// Export for module usage
export default ResourceHints;