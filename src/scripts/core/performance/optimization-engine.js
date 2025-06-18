/**
 * Performance Optimization Engine
 * ===============================
 *
 * Implements automatic performance optimizations and lazy loading
 */

import debug from '../debug.js';

// Optimization constants
const OPTIMIZATION_CONSTANTS = {
  LAZY_LOAD_THRESHOLD: 0.1,
  MIN_INTERSECTION_RATIO: 0.01,
  MAX_FID_DELAY: 10000,
  PRELOAD_THRESHOLD: 3, // Seconds
  CRITICAL_RESOURCE_DELAY: 100
};

/**
 * Load individual image
 * @param {HTMLImageElement} img - Image element
 */
const loadImage = img => {
  const { src } = img.dataset;
  const { srcset } = img.dataset;

  if (src) {
    img.src = src;
    img.removeAttribute('data-src');
  }

  if (srcset) {
    img.srcset = srcset;
    img.removeAttribute('data-srcset');
  }

  img.classList.add('loaded');
};

/**
 * Fallback to load all images immediately
 * @param {string} selector - Image selector
 */
const loadAllImages = selector => {
  document.querySelectorAll(selector).forEach(loadImage);
};

/**
 * Initialize lazy loading for images
 * @param {string} selector - Image selector (default: 'img[data-src]')
 */
export const initializeLazyLoading = (selector = 'img[data-src]') => {
  if (!('IntersectionObserver' in window)) {
    // Fallback for older browsers
    loadAllImages(selector);
    return;
  }

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        loadImage(img);
        observer.unobserve(img);
      }
    });
  }, {
    threshold: OPTIMIZATION_CONSTANTS.LAZY_LOAD_THRESHOLD,
    rootMargin: '50px 0px'
  });

  document.querySelectorAll(selector).forEach(img => {
    imageObserver.observe(img);
  });

  debug.log(`Lazy loading initialized for ${document.querySelectorAll(selector).length} images`);
};

/**
 * Preload critical resources
 * @param {Array} resources - Array of resource URLs
 */
export const preloadCriticalResources = resources => {
  if (!Array.isArray(resources)) {return;}

  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.url;
    link.as = resource.type || 'fetch';

    if (resource.type === 'font') {
      link.crossOrigin = 'anonymous';
    }

    document.head.appendChild(link);
    debug.log(`Preloading critical resource: ${resource.url}`);
  });
};

/**
 * Optimize JavaScript execution with requestIdleCallback
 * @param {Function} callback - Function to execute when idle
 * @param {Object} options - Options for idle callback
 */
export const optimizeJavaScriptExecution = (callback, options = {}) => {
  const { timeout = OPTIMIZATION_CONSTANTS.MAX_FID_DELAY } = options;

  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback, { timeout });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(callback, 1);
  }
};

/**
 * Implement resource hints for better loading
 * @param {Array} hints - Array of resource hint objects
 */
export const addResourceHints = hints => {
  if (!Array.isArray(hints)) {return;}

  hints.forEach(hint => {
    const link = document.createElement('link');
    link.rel = hint.rel; // Dns-prefetch, preconnect, etc.
    link.href = hint.href;

    if (hint.crossorigin) {
      link.crossOrigin = hint.crossorigin;
    }

    document.head.appendChild(link);
  });
};

/**
 * Optimize font loading with font-display
 * @param {Array} fontFaces - Array of font face objects
 */
export const optimizeFontLoading = fontFaces => {
  if (!Array.isArray(fontFaces)) {return;}

  fontFaces.forEach(font => {
    const fontFace = new FontFace(
      font.family,
      `url(${font.url})`,
      {
        display: font.display || 'swap',
        weight: font.weight || 'normal',
        style: font.style || 'normal'
      }
    );

    fontFace.load().then(loadedFont => {
      document.fonts.add(loadedFont);
      debug.log(`Font loaded: ${font.family}`);
    }).catch(error => {
      debug.warn(`Font loading failed: ${font.family}`, error);
    });
  });
};

/**
 * Reduce layout thrashing by batching DOM reads/writes
 * @param {Function} readCallback - Function that reads from DOM
 * @param {Function} writeCallback - Function that writes to DOM
 */
export const batchDOMOperations = (readCallback, writeCallback) => {
  // Schedule reads in current frame
  const readResults = readCallback();

  // Schedule writes in next frame
  requestAnimationFrame(() => {
    writeCallback(readResults);
  });
};

/**
 * Debounce function for performance-sensitive operations
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function for scroll/resize events
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * Monitor and optimize long tasks
 * @param {Function} callback - Callback for long task detection
 */
export const monitorLongTasks = callback => {
  if (!('PerformanceObserver' in window)) {
    debug.warn('PerformanceObserver not supported for long task monitoring');
    return;
  }

  try {
    const observer = new PerformanceObserver(list => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.duration > 50) { // Tasks longer than 50ms
          callback({
            duration: entry.duration,
            startTime: entry.startTime,
            name: entry.name
          });
        }
      });
    });

    observer.observe({ entryTypes: ['longtask'] });
    debug.log('Long task monitoring enabled');
  } catch (error) {
    debug.warn('Failed to initialize long task monitoring:', error);
  }
};

/**
 * Implement code splitting recommendations
 * @param {Array} modules - Array of module objects to lazy load
 * @returns {Object} Module loading utilities
 */
export const implementCodeSplitting = modules => {
  const loadedModules = new Map();

  return {
    async loadModule(moduleName) {
      if (loadedModules.has(moduleName)) {
        return loadedModules.get(moduleName);
      }

      const moduleConfig = modules.find(m => m.name === moduleName);
      if (!moduleConfig) {
        throw new Error(`Module ${moduleName} not found`);
      }

      try {
        const module = await import(moduleConfig.path);
        loadedModules.set(moduleName, module);
        debug.log(`Module loaded: ${moduleName}`);
        return module;
      } catch (error) {
        debug.error(`Failed to load module ${moduleName}:`, error);
        throw error;
      }
    },

    preloadModule(moduleName) {
      const moduleConfig = modules.find(m => m.name === moduleName);
      if (moduleConfig) {
        const link = document.createElement('link');
        link.rel = 'modulepreload';
        link.href = moduleConfig.path;
        document.head.appendChild(link);
      }
    },

    isModuleLoaded(moduleName) {
      return loadedModules.has(moduleName);
    }
  };
};

/**
 * Optimize third-party script loading
 * @param {Array} scripts - Array of third-party script configs
 */
export const optimizeThirdPartyScripts = scripts => {
  scripts.forEach(script => {
    const scriptElement = document.createElement('script');

    // Use appropriate loading strategy
    if (script.critical) {
      scriptElement.src = script.src;
    } else {
      // Defer non-critical scripts
      scriptElement.async = true;
      scriptElement.src = script.src;
    }

    if (script.defer) {
      scriptElement.defer = true;
    }

    // Add to document
    if (script.critical) {
      document.head.appendChild(scriptElement);
    } else {
      // Load after initial page load
      setTimeout(() => {
        document.head.appendChild(scriptElement);
      }, OPTIMIZATION_CONSTANTS.CRITICAL_RESOURCE_DELAY);
    }
  });
};