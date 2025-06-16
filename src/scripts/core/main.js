/**
 * =============================================================================
 * BSB MAIN JAVASCRIPT FILE
 * =============================================================================
 * 
 * This is the main entry point for all JavaScript functionality.
 * It initializes components and sets up global features.
 * 
 * 🎯 Features:
 * - Component initialization
 * - Smooth scrolling
 * - Form enhancements
 * - Performance monitoring
 * 
 * 📚 Learn More:
 * - JavaScript Architecture: /docs/tutorials/javascript-architecture.md
 * - Progressive Enhancement: /docs/tutorials/progressive-enhancement.md
 * 
 * 💡 This file uses ES6 modules - ensure your HTML uses type="module"
 * =============================================================================
 */

// Import component modules
import './bsb-helper.js';
import '../../components/header/header.js';

/**
 * Initialize all BSB features
 */
function initializeBSB() {
  // Initialize smooth scrolling
  initSmoothScrolling();
  
  // Initialize form enhancements
  initFormEnhancements();
  
  // Initialize lazy loading
  initLazyLoading();
  
  // Initialize accessibility features
  initAccessibility();
  
  // Log initialization
  console.log('BSB: All systems initialized 🚀');
}

/**
 * Smooth scrolling for anchor links
 */
function initSmoothScrolling() {
  // Find all links that point to anchors
  const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        // Calculate offset for fixed header
        const header = document.querySelector('.bsb-header');
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;
        
        // Smooth scroll to target
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Update URL without jumping
        history.pushState(null, null, targetId);
        
        // Focus target for accessibility
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus();
      }
    });
  });
}

/**
 * Form enhancements
 */
function initFormEnhancements() {
  // Add floating labels
  const formInputs = document.querySelectorAll('.form-input, .form-textarea');
  
  formInputs.forEach(input => {
    // Check if input has value on load
    if (input.value) {
      input.classList.add('has-value');
    }
    
    // Add class when input has value
    input.addEventListener('blur', () => {
      if (input.value) {
        input.classList.add('has-value');
      } else {
        input.classList.remove('has-value');
      }
    });
  });
  
  // Form validation feedback
  const forms = document.querySelectorAll('form[data-bsb-validate]');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
        
        // Add validation classes
        form.classList.add('was-validated');
        
        // Focus first invalid input
        const firstInvalid = form.querySelector(':invalid');
        if (firstInvalid) {
          firstInvalid.focus();
        }
      }
    });
  });
}

/**
 * Lazy loading for images
 */
function initLazyLoading() {
  // Check if browser supports IntersectionObserver
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // Load the image
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          
          // Stop observing this image
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px' // Start loading 50px before entering viewport
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  }
}

/**
 * Accessibility enhancements
 */
function initAccessibility() {
  // Add keyboard navigation indicators
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });
  
  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
  });
  
  // Enhance skip links
  const skipLinks = document.querySelectorAll('.skip-link');
  
  skipLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
        target.scrollIntoView();
      }
    });
  });
}

/**
 * Performance monitoring
 */
function monitorPerformance() {
  // Only in development
  if (window.location.hostname === 'localhost') {
    window.addEventListener('load', () => {
      const perfData = performance.getEntriesByType('navigation')[0];
      
      console.log('BSB Performance Metrics:');
      console.log(`- DOM Content Loaded: ${Math.round(perfData.domContentLoadedEventEnd)}ms`);
      console.log(`- Page Load Complete: ${Math.round(perfData.loadEventEnd)}ms`);
      console.log(`- Total Resources: ${performance.getEntriesByType('resource').length}`);
    });
  }
}

/**
 * Utility: Debounce function
 */
window.BSBUtils = {
  debounce: function(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  throttle: function(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeBSB);
} else {
  initializeBSB();
}

// Monitor performance
monitorPerformance();