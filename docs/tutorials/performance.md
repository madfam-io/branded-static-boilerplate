# Performance Optimization Tutorial

> ⚡ **Learning Objective**: Master web performance optimization techniques to achieve perfect Lighthouse scores and deliver lightning-fast user experiences.

## Table of Contents

1. [Introduction](#introduction)
2. [Understanding Web Performance](#understanding-web-performance)
3. [Core Web Vitals](#core-web-vitals)
4. [Measuring Performance](#measuring-performance)
5. [Optimizing Loading Performance](#optimizing-loading-performance)
6. [Runtime Performance](#runtime-performance)
7. [Image Optimization](#image-optimization)
8. [Font Optimization](#font-optimization)
9. [JavaScript Performance](#javascript-performance)
10. [CSS Performance](#css-performance)
11. [Caching Strategies](#caching-strategies)
12. [Performance Budgets](#performance-budgets)
13. [Real-World Case Study](#real-world-case-study)
14. [Performance Checklist](#performance-checklist)

## Introduction

Performance is a feature. Fast websites:
- 📈 **Convert better** - 1s delay = 7% fewer conversions
- 🔍 **Rank higher** - Google uses speed as ranking factor
- 😊 **Delight users** - 53% abandon sites that take >3s
- 🌍 **Reach everyone** - Fast sites work on slow connections
- 💰 **Cost less** - Less bandwidth = lower hosting costs

### Prerequisites

Before this tutorial, you should understand:
- Basic HTML, CSS, and JavaScript
- How browsers render pages
- Network basics (HTTP, caching)
- BSB project structure

### What You'll Learn

- Core Web Vitals and how to optimize them
- Tools for measuring performance
- Techniques for faster loading
- JavaScript and CSS optimization
- Image and font best practices
- Creating performance budgets

## Understanding Web Performance

### The Performance Journey

```
User Intent → Page Load → Interaction → Next Action
     ↓            ↓            ↓            ↓
  "I want"    "Show me"   "I can use"   "What's next"
     ↓            ↓            ↓            ↓
   Speed =    Speed =     Speed =      Speed =
  SEO/Ads    Retention  Satisfaction  Conversion
```

### The Waterfall of Web Performance

```
DNS Lookup → TCP Connection → SSL Handshake → HTTP Request
    ↓              ↓               ↓              ↓
  ~20ms         ~40ms           ~60ms          ~40ms
    
→ Server Processing → Download HTML → Parse HTML → Fetch Resources
         ↓                ↓              ↓             ↓
      50-500ms         ~100ms         ~50ms      (parallel)
      
→ Parse CSS → Build DOM → Layout → Paint → Composite
      ↓           ↓          ↓        ↓         ↓
    ~20ms       ~50ms      ~20ms    ~20ms     ~5ms
```

### Performance Metrics Timeline

```
Timeline:  0ms ---------- 1000ms ---------- 2000ms ---------- 3000ms
           |               |                 |                 |
Metrics:   FCP            LCP               TTI              TBT
           ↓              ↓                 ↓                ↓
        "I see"      "Main content"    "I can use"    "Smooth?"
```

## Core Web Vitals

Google's Core Web Vitals measure real-world user experience:

### 1. Largest Contentful Paint (LCP)

**What**: When the largest content element becomes visible
**Target**: < 2.5 seconds
**Factors**: Server response time, render-blocking resources, slow loading resources

```html
<!-- ❌ Bad: Large image without optimization -->
<img src="hero-image.jpg" alt="Hero">

<!-- ✅ Good: Optimized with preload and responsive images -->
<link rel="preload" as="image" href="hero-image.webp" 
      imagesrcset="hero-320w.webp 320w, hero-640w.webp 640w">
<img src="hero-image.webp" 
     srcset="hero-320w.webp 320w, hero-640w.webp 640w"
     sizes="(max-width: 640px) 100vw, 640px"
     alt="Hero"
     loading="eager"
     fetchpriority="high">
```

### 2. First Input Delay (FID) / Interaction to Next Paint (INP)

**What**: Time from user interaction to browser response
**Target**: < 100ms (FID), < 200ms (INP)
**Factors**: JavaScript execution, main thread blocking

```javascript
// ❌ Bad: Long-running task blocks interaction
button.addEventListener('click', () => {
  // Heavy computation
  for (let i = 0; i < 1000000; i++) {
    calculateComplexThing(i);
  }
  updateUI();
});

// ✅ Good: Break up work, use Web Workers
button.addEventListener('click', async () => {
  // Show immediate feedback
  button.classList.add('loading');
  
  // Defer heavy work
  await scheduler.postTask(() => {
    const worker = new Worker('calculator.worker.js');
    worker.postMessage({ command: 'calculate' });
    worker.onmessage = (e) => {
      updateUI(e.data);
      button.classList.remove('loading');
    };
  });
});
```

### 3. Cumulative Layout Shift (CLS)

**What**: Visual stability - how much the page shifts during load
**Target**: < 0.1
**Factors**: Images without dimensions, dynamic content, web fonts

```css
/* ❌ Bad: Content shifts when ad loads */
.ad-container {
  /* No reserved space */
}

/* ✅ Good: Reserve space for dynamic content */
.ad-container {
  min-height: 250px; /* Standard ad height */
  aspect-ratio: 300/250; /* Maintain ratio */
}

/* Prevent font shifting */
@font-face {
  font-family: 'Custom Font';
  src: url('font.woff2') format('woff2');
  font-display: swap; /* Show fallback immediately */
  size-adjust: 105%; /* Match fallback font size */
}
```

## Measuring Performance

### 1. Lighthouse (Lab Data)

```bash
# Run Lighthouse locally
npm run lighthouse

# Run with specific settings
npx lighthouse https://example.com \
  --throttling.cpuSlowdownMultiplier=4 \
  --preset=desktop \
  --output=html \
  --output-path=./lighthouse-report.html
```

BSB Lighthouse configuration:
```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
        throttling: {
          cpuSlowdownMultiplier: 1,
        }
      }
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        
        // Core Web Vitals
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
      }
    }
  }
};
```

### 2. Chrome DevTools

```javascript
// Measure specific operations
performance.mark('myOperation-start');

// Do expensive operation
expensiveOperation();

performance.mark('myOperation-end');
performance.measure('myOperation', 'myOperation-start', 'myOperation-end');

// Log results
const measure = performance.getEntriesByName('myOperation')[0];
console.log(`Operation took ${measure.duration}ms`);
```

### 3. Real User Monitoring (RUM)

```javascript
// Collect real user metrics
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    // Send metrics to analytics
    gtag('event', 'timing_complete', {
      name: entry.name,
      value: Math.round(entry.startTime + entry.duration)
    });
  }
}).observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });

// Report Web Vitals
import { getCLS, getFID, getLCP } from 'web-vitals';

function sendToAnalytics({name, delta, value, id}) {
  gtag('event', name, {
    value: Math.round(name === 'CLS' ? value * 1000 : value),
    metric_id: id,
    metric_delta: Math.round(name === 'CLS' ? delta * 1000 : delta)
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getLCP(sendToAnalytics);
```

## Optimizing Loading Performance

### 1. Reduce Server Response Time

```javascript
// Implement caching headers
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Static assets - long cache
    if (url.pathname.match(/\.(js|css|woff2|png|jpg|webp)$/)) {
      return fetch(request, {
        cf: {
          cacheTtl: 31536000, // 1 year
          cacheEverything: true
        }
      });
    }
    
    // HTML - short cache
    if (url.pathname.endsWith('.html') || url.pathname === '/') {
      const response = await fetch(request);
      const newResponse = new Response(response.body, response);
      newResponse.headers.set('Cache-Control', 'public, max-age=3600'); // 1 hour
      return newResponse;
    }
  }
};
```

### 2. Optimize Critical Rendering Path

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- 1. Preconnect to external origins -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="dns-prefetch" href="https://www.google-analytics.com">
  
  <!-- 2. Inline critical CSS -->
  <style>
    /* Only above-the-fold styles */
    :root { --primary: #0066cc; }
    body { margin: 0; font-family: system-ui; }
    .hero { background: var(--primary); color: white; }
  </style>
  
  <!-- 3. Preload critical resources -->
  <link rel="preload" href="/fonts/main.woff2" as="font" crossorigin>
  <link rel="preload" href="/css/main.css" as="style">
  <link rel="preload" href="/js/main.js" as="script">
  
  <!-- 4. Load non-critical CSS asynchronously -->
  <link rel="stylesheet" href="/css/main.css">
  <link rel="preload" href="/css/below-fold.css" as="style" 
        onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="/css/below-fold.css"></noscript>
</head>
<body>
  <!-- Content -->
  
  <!-- 5. Defer non-critical JavaScript -->
  <script src="/js/main.js" defer></script>
  <script src="/js/analytics.js" async></script>
</body>
</html>
```

### 3. Resource Hints

```html
<!-- DNS Prefetch: Resolve DNS early -->
<link rel="dns-prefetch" href="https://api.example.com">

<!-- Preconnect: DNS + TCP + TLS -->
<link rel="preconnect" href="https://fonts.googleapis.com">

<!-- Prefetch: Download for future navigation -->
<link rel="prefetch" href="/next-page.html">

<!-- Preload: Download for current page -->
<link rel="preload" href="/critical.css" as="style">

<!-- Prerender: Render entire page (use sparingly) -->
<link rel="prerender" href="/likely-next-page.html">

<!-- Module preload: For ES modules -->
<link rel="modulepreload" href="/module.js">
```

### 4. Code Splitting

```javascript
// vite.config.js - Automatic code splitting
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor chunk
          if (id.includes('node_modules')) {
            // Group by package
            if (id.includes('lodash')) return 'lodash';
            if (id.includes('react')) return 'react';
            return 'vendor';
          }
          
          // Feature chunks
          if (id.includes('/features/dashboard')) return 'dashboard';
          if (id.includes('/features/editor')) return 'editor';
          
          // Shared components
          if (id.includes('/components')) return 'components';
        }
      }
    }
  }
};

// Dynamic imports for code splitting
// Before: Everything loads upfront
import Dashboard from './Dashboard';
import Editor from './Editor';
import Analytics from './Analytics';

// After: Load on demand
const Dashboard = lazy(() => import('./Dashboard'));
const Editor = lazy(() => import('./Editor'));
const Analytics = lazy(() => import('./Analytics'));
```

## Runtime Performance

### 1. Efficient DOM Manipulation

```javascript
// ❌ Bad: Multiple reflows
items.forEach(item => {
  element.innerHTML += `<li>${item}</li>`; // Reflow each time
});

// ✅ Good: Batch DOM updates
const fragment = document.createDocumentFragment();
items.forEach(item => {
  const li = document.createElement('li');
  li.textContent = item;
  fragment.appendChild(li);
});
element.appendChild(fragment); // Single reflow

// ✅ Better: Use efficient methods
element.insertAdjacentHTML('beforeend', 
  items.map(item => `<li>${item}</li>`).join('')
);
```

### 2. Debouncing and Throttling

```javascript
// Debounce: Wait until user stops
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Use for search input
const search = debounce((query) => {
  fetch(`/api/search?q=${query}`)
    .then(r => r.json())
    .then(showResults);
}, 300);

// Throttle: Limit execution rate
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Use for scroll events
const updateScrollProgress = throttle(() => {
  const progress = window.scrollY / document.body.scrollHeight;
  progressBar.style.width = `${progress * 100}%`;
}, 16); // ~60fps
```

### 3. Virtual Scrolling

```javascript
// Render only visible items
class VirtualScroller {
  constructor(container, items, itemHeight) {
    this.container = container;
    this.items = items;
    this.itemHeight = itemHeight;
    this.scrollTop = 0;
    this.visibleStart = 0;
    this.visibleEnd = 0;
    
    this.setup();
  }
  
  setup() {
    // Create scrollable area
    this.scroller = document.createElement('div');
    this.scroller.style.height = `${this.items.length * this.itemHeight}px`;
    
    // Create viewport
    this.viewport = document.createElement('div');
    this.viewport.style.overflow = 'auto';
    this.viewport.style.height = '100%';
    
    this.viewport.appendChild(this.scroller);
    this.container.appendChild(this.viewport);
    
    // Handle scroll
    this.viewport.addEventListener('scroll', () => this.handleScroll());
    
    // Initial render
    this.handleScroll();
  }
  
  handleScroll() {
    this.scrollTop = this.viewport.scrollTop;
    
    // Calculate visible range
    const viewportHeight = this.viewport.clientHeight;
    this.visibleStart = Math.floor(this.scrollTop / this.itemHeight);
    this.visibleEnd = Math.ceil((this.scrollTop + viewportHeight) / this.itemHeight);
    
    this.render();
  }
  
  render() {
    // Clear previous items
    this.scroller.innerHTML = '';
    
    // Render only visible items
    for (let i = this.visibleStart; i < this.visibleEnd && i < this.items.length; i++) {
      const item = document.createElement('div');
      item.style.position = 'absolute';
      item.style.top = `${i * this.itemHeight}px`;
      item.style.height = `${this.itemHeight}px`;
      item.textContent = this.items[i];
      this.scroller.appendChild(item);
    }
  }
}
```

## Image Optimization

### 1. Choose the Right Format

```html
<!-- Modern formats with fallbacks -->
<picture>
  <!-- AVIF: Best compression, limited support -->
  <source srcset="image.avif" type="image/avif">
  
  <!-- WebP: Good compression, wide support -->
  <source srcset="image.webp" type="image/webp">
  
  <!-- JPEG: Universal support -->
  <img src="image.jpg" alt="Description"
       width="800" height="600"
       loading="lazy"
       decoding="async">
</picture>
```

Format comparison:
| Format | Compression | Transparency | Animation | Browser Support |
|--------|------------|--------------|-----------|-----------------|
| JPEG   | Good       | ❌           | ❌        | Universal       |
| PNG    | Fair       | ✅           | ❌        | Universal       |
| WebP   | Excellent  | ✅           | ✅        | 95%+           |
| AVIF   | Best       | ✅           | ✅        | 70%+           |

### 2. Responsive Images

```html
<!-- Art direction: Different crops for different screens -->
<picture>
  <source media="(max-width: 640px)" 
          srcset="hero-mobile.jpg 640w, hero-mobile-2x.jpg 1280w"
          sizes="100vw">
  <source media="(max-width: 1024px)" 
          srcset="hero-tablet.jpg 1024w, hero-tablet-2x.jpg 2048w"
          sizes="100vw">
  <img src="hero-desktop.jpg" 
       srcset="hero-desktop.jpg 1920w, hero-desktop-2x.jpg 3840w"
       sizes="100vw"
       alt="Hero image">
</picture>

<!-- Resolution switching: Same image, different sizes -->
<img src="product-400.jpg"
     srcset="product-400.jpg 400w,
             product-800.jpg 800w,
             product-1200.jpg 1200w"
     sizes="(max-width: 640px) 100vw,
            (max-width: 1024px) 50vw,
            400px"
     alt="Product">
```

### 3. Lazy Loading

```javascript
// Native lazy loading
<img src="image.jpg" loading="lazy" alt="...">

// Intersection Observer for custom lazy loading
class LazyLoader {
  constructor() {
    this.images = document.querySelectorAll('[data-lazy]');
    this.imageObserver = new IntersectionObserver(
      this.handleIntersection.bind(this),
      {
        rootMargin: '50px 0px', // Start loading 50px before visible
        threshold: 0.01
      }
    );
    
    this.observe();
  }
  
  observe() {
    this.images.forEach(img => this.imageObserver.observe(img));
  }
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.loadImage(entry.target);
        this.imageObserver.unobserve(entry.target);
      }
    });
  }
  
  loadImage(img) {
    // Set src from data attribute
    img.src = img.dataset.lazy;
    
    // Handle srcset if present
    if (img.dataset.lazySrcset) {
      img.srcset = img.dataset.lazySrcset;
    }
    
    // Add loaded class for CSS transitions
    img.addEventListener('load', () => {
      img.classList.add('lazy-loaded');
    });
  }
}

// Initialize
new LazyLoader();
```

### 4. Image Optimization Pipeline

```javascript
// scripts/optimize-images.js
import sharp from 'sharp';
import glob from 'glob';
import path from 'path';

async function optimizeImages() {
  const images = glob.sync('src/assets/images/**/*.{jpg,png}');
  
  for (const imagePath of images) {
    const image = sharp(imagePath);
    const metadata = await image.metadata();
    
    // Generate WebP version
    await image
      .webp({ quality: 85 })
      .toFile(imagePath.replace(/\.(jpg|png)$/, '.webp'));
    
    // Generate AVIF version
    await image
      .avif({ quality: 80 })
      .toFile(imagePath.replace(/\.(jpg|png)$/, '.avif'));
    
    // Generate responsive sizes
    const sizes = [320, 640, 1024, 1920];
    for (const width of sizes) {
      if (width < metadata.width) {
        await image
          .resize(width)
          .jpeg({ quality: 85, progressive: true })
          .toFile(imagePath.replace(/\.(jpg|png)$/, `-${width}w.jpg`));
      }
    }
    
    console.log(`✓ Optimized ${path.basename(imagePath)}`);
  }
}

optimizeImages();
```

## Font Optimization

### 1. Font Loading Strategies

```css
/* Strategy 1: FOUT (Flash of Unstyled Text) - Recommended */
@font-face {
  font-family: 'CustomFont';
  src: url('font.woff2') format('woff2');
  font-display: swap; /* Show fallback immediately */
}

/* Strategy 2: FOIT (Flash of Invisible Text) */
@font-face {
  font-family: 'CustomFont';
  src: url('font.woff2') format('woff2');
  font-display: block; /* Hide text up to 3s */
}

/* Strategy 3: Optional font loading */
@font-face {
  font-family: 'CustomFont';
  src: url('font.woff2') format('woff2');
  font-display: optional; /* Use only if loaded quickly */
}
```

### 2. Subset Fonts

```bash
# Install fonttools
pip install fonttools

# Subset font to only needed characters
pyftsubset input-font.ttf \
  --output-file=output-font.woff2 \
  --flavor=woff2 \
  --text-file=characters.txt \
  --layout-features="kern,liga,clig" \
  --unicodes="U+0000-00FF,U+0131,U+0152-0153"
```

### 3. Variable Fonts

```css
/* Traditional approach: Multiple files */
@font-face {
  font-family: 'CustomFont';
  src: url('custom-regular.woff2');
  font-weight: 400;
}
@font-face {
  font-family: 'CustomFont';
  src: url('custom-bold.woff2');
  font-weight: 700;
}

/* Variable font: One file, all weights */
@font-face {
  font-family: 'CustomFontVar';
  src: url('custom-variable.woff2') format('woff2-variations');
  font-weight: 100 900; /* Full range */
}

/* Use any weight */
.text {
  font-family: 'CustomFontVar';
  font-weight: 650; /* Custom weight */
}
```

### 4. Font Loading API

```javascript
// Load fonts programmatically
if ('fonts' in document) {
  // Create font face
  const font = new FontFace('CustomFont', 'url(font.woff2)', {
    style: 'normal',
    weight: '400',
    display: 'swap'
  });
  
  // Load font
  font.load().then(loadedFont => {
    // Add to document
    document.fonts.add(loadedFont);
    
    // Apply font
    document.body.classList.add('fonts-loaded');
  }).catch(err => {
    console.error('Font loading failed:', err);
    // Fallback handling
  });
  
  // Check if font is ready
  document.fonts.ready.then(() => {
    console.log('All fonts loaded');
  });
}
```

## JavaScript Performance

### 1. Bundle Optimization

```javascript
// vite.config.js
export default {
  build: {
    // Tree shaking
    rollupOptions: {
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false
      }
    },
    
    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log'],
        passes: 2
      },
      mangle: {
        properties: {
          regex: /^_/ // Mangle private properties
        }
      }
    }
  }
};
```

### 2. Lazy Component Loading

```javascript
// React example
const Dashboard = lazy(() => 
  import(/* webpackChunkName: "dashboard" */ './Dashboard')
);

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Dashboard />
    </Suspense>
  );
}

// Vanilla JS example
async function loadComponent(name) {
  const module = await import(`./components/${name}.js`);
  return module.default;
}

// Usage
button.addEventListener('click', async () => {
  const Modal = await loadComponent('Modal');
  const modal = new Modal();
  modal.show();
});
```

### 3. Web Workers

```javascript
// main.js
const worker = new Worker('processor.worker.js');

// Offload heavy computation
function processLargeDataset(data) {
  return new Promise((resolve, reject) => {
    worker.postMessage({ command: 'process', data });
    
    worker.onmessage = (e) => {
      if (e.data.error) {
        reject(e.data.error);
      } else {
        resolve(e.data.result);
      }
    };
  });
}

// processor.worker.js
self.addEventListener('message', (e) => {
  const { command, data } = e.data;
  
  if (command === 'process') {
    try {
      // Heavy computation
      const result = data.map(item => 
        expensiveOperation(item)
      );
      
      self.postMessage({ result });
    } catch (error) {
      self.postMessage({ error: error.message });
    }
  }
});
```

### 4. Memory Management

```javascript
// Avoid memory leaks
class ComponentWithCleanup {
  constructor() {
    this.listeners = new Map();
    this.timers = new Set();
    this.observers = new Set();
  }
  
  addEventListener(element, event, handler) {
    element.addEventListener(event, handler);
    
    // Track for cleanup
    if (!this.listeners.has(element)) {
      this.listeners.set(element, new Map());
    }
    this.listeners.get(element).set(event, handler);
  }
  
  setTimeout(callback, delay) {
    const timer = setTimeout(callback, delay);
    this.timers.add(timer);
    return timer;
  }
  
  observe(target, observer) {
    observer.observe(target);
    this.observers.add(observer);
  }
  
  destroy() {
    // Remove all event listeners
    this.listeners.forEach((events, element) => {
      events.forEach((handler, event) => {
        element.removeEventListener(event, handler);
      });
    });
    this.listeners.clear();
    
    // Clear all timers
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
    
    // Disconnect all observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}
```

## CSS Performance

### 1. Critical CSS

```javascript
// Extract critical CSS
import { generate } from 'critical';

generate({
  inline: true,
  base: 'dist/',
  src: 'index.html',
  target: {
    html: 'index-critical.html',
    css: 'critical.css'
  },
  dimensions: [
    { height: 568, width: 320 },  // Mobile
    { height: 1024, width: 768 }, // Tablet
    { height: 900, width: 1440 }  // Desktop
  ],
  penthouse: {
    blockJSRequests: false
  }
});
```

### 2. CSS Containment

```css
/* Contain layout calculations */
.card {
  contain: layout style paint;
  /* Tells browser this element's internals don't affect outside */
}

/* Size containment for fixed dimensions */
.sidebar {
  contain: size layout style paint;
  width: 300px;
  height: 100vh;
}

/* Content-visibility for below-fold content */
.section {
  content-visibility: auto;
  contain-intrinsic-size: 0 500px; /* Estimated size */
}
```

### 3. Efficient Selectors

```css
/* ❌ Bad: Overly specific, slow */
body > main > article > section > div > p > span.highlight {
  color: yellow;
}

/* ❌ Bad: Universal selector */
* {
  box-sizing: border-box;
}

/* ✅ Good: Class selector */
.highlight {
  color: yellow;
}

/* ✅ Good: Limit universal selector */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* ✅ Good: Avoid descendant selectors for frequently matched elements */
.nav-link { } /* Instead of: .nav li a */
```

### 4. CSS-in-JS Performance

```javascript
// Use CSS variables for dynamic styles
const theme = {
  primary: '#0066cc',
  spacing: 8
};

// ❌ Bad: Inline styles cause re-renders
<div style={{ 
  color: theme.primary, 
  padding: theme.spacing * 2 
}}>

// ✅ Good: CSS variables don't cause re-renders
<div 
  className="themed-div"
  style={{ 
    '--color': theme.primary,
    '--spacing': `${theme.spacing}px`
  }}
>

// CSS
.themed-div {
  color: var(--color);
  padding: calc(var(--spacing) * 2);
}
```

## Caching Strategies

### 1. Browser Caching

```javascript
// Service Worker caching
const CACHE_NAME = 'bsb-v1';
const urlsToCache = [
  '/',
  '/styles/main.css',
  '/scripts/main.js',
  '/offline.html'
];

// Cache strategies
const cacheStrategies = {
  // Cache First: Good for assets
  cacheFirst: async (request) => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;
    
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  },
  
  // Network First: Good for API calls
  networkFirst: async (request) => {
    try {
      const response = await fetch(request);
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
      return response;
    } catch (error) {
      const cached = await caches.match(request);
      return cached || new Response('Offline', { status: 503 });
    }
  },
  
  // Stale While Revalidate: Balance
  staleWhileRevalidate: async (request) => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    
    const fetchPromise = fetch(request).then(response => {
      cache.put(request, response.clone());
      return response;
    });
    
    return cached || fetchPromise;
  }
};

// Apply strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Choose strategy based on resource type
  if (url.pathname.match(/\.(js|css|woff2)$/)) {
    event.respondWith(cacheStrategies.cacheFirst(request));
  } else if (url.pathname.startsWith('/api/')) {
    event.respondWith(cacheStrategies.networkFirst(request));
  } else {
    event.respondWith(cacheStrategies.staleWhileRevalidate(request));
  }
});
```

### 2. HTTP Caching Headers

```javascript
// Express.js example
app.use((req, res, next) => {
  // Versioned assets - cache forever
  if (req.url.match(/\.[0-9a-f]{8}\./)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }
  // Images - cache for a month
  else if (req.url.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=2592000');
  }
  // CSS/JS - cache for a week
  else if (req.url.match(/\.(css|js)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=604800');
  }
  // HTML - cache for an hour
  else if (req.url.match(/\.html$/) || req.url === '/') {
    res.setHeader('Cache-Control', 'public, max-age=3600');
  }
  
  next();
});
```

### 3. CDN Caching

```javascript
// Cloudflare Worker example
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  // Create cache key
  const cacheKey = new Request(url.toString(), request);
  const cache = caches.default;
  
  // Check cache
  let response = await cache.match(cacheKey);
  
  if (!response) {
    // Fetch from origin
    response = await fetch(request);
    
    // Cache based on content type
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('image')) {
      // Clone response for caching
      const responseToCache = response.clone();
      
      // Add cache headers
      const headers = new Headers(responseToCache.headers);
      headers.set('Cache-Control', 'public, max-age=86400');
      
      // Cache it
      event.waitUntil(
        cache.put(cacheKey, new Response(responseToCache.body, {
          status: responseToCache.status,
          statusText: responseToCache.statusText,
          headers: headers
        }))
      );
    }
  }
  
  return response;
}
```

## Performance Budgets

### 1. Define Budgets

```javascript
// performance-budget.json
{
  "bundles": [
    {
      "name": "main.js",
      "maxSize": "50KB"
    },
    {
      "name": "main.css",
      "maxSize": "20KB"
    }
  ],
  "metrics": {
    "lighthouse": {
      "performance": 90,
      "firstContentfulPaint": 1800,
      "largestContentfulPaint": 2500,
      "totalBlockingTime": 300,
      "cumulativeLayoutShift": 0.1
    },
    "webPageTest": {
      "firstView": {
        "SpeedIndex": 3000,
        "render": 1500
      }
    }
  },
  "assets": {
    "images": {
      "maxSize": "200KB",
      "formats": ["webp", "avif"]
    },
    "fonts": {
      "maxRequests": 2,
      "maxSize": "100KB"
    }
  }
}
```

### 2. Enforce Budgets

```javascript
// webpack.config.js
module.exports = {
  performance: {
    maxAssetSize: 244000, // 244 KB
    maxEntrypointSize: 244000,
    hints: 'error', // Fail build if exceeded
    assetFilter: function(assetFilename) {
      // Only check JS/CSS
      return /\.(js|css)$/.test(assetFilename);
    }
  }
};

// Custom budget checker
import budgets from './performance-budget.json';

function checkBudgets(stats) {
  const failures = [];
  
  // Check bundle sizes
  budgets.bundles.forEach(budget => {
    const asset = stats.assets.find(a => a.name.includes(budget.name));
    if (asset && asset.size > parseSize(budget.maxSize)) {
      failures.push(
        `${budget.name}: ${formatSize(asset.size)} exceeds ${budget.maxSize}`
      );
    }
  });
  
  if (failures.length > 0) {
    throw new Error(`Performance budget exceeded:\n${failures.join('\n')}`);
  }
}
```

### 3. Continuous Monitoring

```yaml
# .github/workflows/performance.yml
name: Performance Check

on: [push, pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          budgetPath: ./budget.json
          urls: |
            http://localhost:3000
            http://localhost:3000/about
          uploadArtifacts: true
          
      - name: Check bundle size
        uses: andresz1/size-limit-action@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          
      - name: WebPageTest
        uses: webpagetest/webpagetest-github-action@v1
        with:
          apiKey: ${{ secrets.WPT_API_KEY }}
          urls: https://example.com
          budget: performance-budget.json
```

## Real-World Case Study

Let's optimize a typical BSB page:

### Before Optimization

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="bootstrap.min.css">
  <link rel="stylesheet" href="font-awesome.min.css">
  <link rel="stylesheet" href="styles.css">
  <script src="jquery.min.js"></script>
  <script src="bootstrap.min.js"></script>
</head>
<body>
  <img src="hero-image.jpg" alt="Hero">
  <h1>Welcome to BSB</h1>
  <!-- More content -->
  <script src="app.js"></script>
</body>
</html>
```

**Performance Issues:**
- Render-blocking CSS (3 files)
- Render-blocking JS (2 files)
- No image optimization
- No lazy loading
- Large dependencies

**Metrics:**
- LCP: 4.2s
- FID: 250ms
- CLS: 0.25
- Total size: 850KB

### After Optimization

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Preconnect to CDNs -->
  <link rel="preconnect" href="https://cdn.example.com">
  
  <!-- Critical CSS inline -->
  <style>
    /* Only above-the-fold styles */
    :root{--primary:#0066cc}body{margin:0;font-family:system-ui}
    .hero{height:100vh;background:var(--primary)}
  </style>
  
  <!-- Preload hero image -->
  <link rel="preload" as="image" href="hero-opt.webp" 
        imagesrcset="hero-320w.webp 320w, hero-640w.webp 640w">
  
  <!-- Non-critical CSS -->
  <link rel="preload" href="styles.css" as="style" 
        onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="styles.css"></noscript>
</head>
<body>
  <!-- Optimized hero image -->
  <picture>
    <source type="image/webp" 
            srcset="hero-320w.webp 320w, hero-640w.webp 640w"
            sizes="100vw">
    <img src="hero-opt.jpg" alt="Hero" 
         width="1920" height="1080"
         fetchpriority="high">
  </picture>
  
  <h1>Welcome to BSB</h1>
  
  <!-- Lazy loaded content -->
  <div data-lazy-container>
    <!-- Content loaded on scroll -->
  </div>
  
  <!-- Deferred scripts -->
  <script type="module" src="app.js"></script>
</body>
</html>
```

**Optimizations Applied:**
1. Inline critical CSS
2. Async load non-critical CSS
3. Preload hero image
4. Use WebP with fallback
5. Remove jQuery dependency
6. Use ES modules
7. Implement lazy loading

**New Metrics:**
- LCP: 1.8s (57% improvement)
- FID: 50ms (80% improvement)
- CLS: 0.05 (80% improvement)
- Total size: 250KB (70% reduction)

## Performance Checklist

### Pre-Development

- [ ] Set performance budget
- [ ] Choose appropriate tech stack
- [ ] Plan for code splitting
- [ ] Design with performance in mind
- [ ] Set up performance monitoring

### During Development

- [ ] Use performance-first CSS
- [ ] Optimize images as you add them
- [ ] Implement lazy loading
- [ ] Use efficient JavaScript patterns
- [ ] Regular performance testing

### Pre-Deployment

- [ ] Run Lighthouse audit
- [ ] Check bundle sizes
- [ ] Verify lazy loading works
- [ ] Test on slow connections
- [ ] Validate caching headers

### Post-Deployment

- [ ] Monitor Real User Metrics
- [ ] Set up alerts for regressions
- [ ] Regular performance audits
- [ ] A/B test optimizations
- [ ] Update performance budget

### Image Checklist

- [ ] Use modern formats (WebP/AVIF)
- [ ] Implement responsive images
- [ ] Add width/height attributes
- [ ] Enable lazy loading
- [ ] Optimize file sizes

### JavaScript Checklist

- [ ] Remove unused code
- [ ] Implement code splitting
- [ ] Use tree shaking
- [ ] Defer non-critical scripts
- [ ] Minimize main thread work

### CSS Checklist

- [ ] Inline critical CSS
- [ ] Remove unused CSS
- [ ] Optimize selector performance
- [ ] Use CSS containment
- [ ] Minimize specificity

### Font Checklist

- [ ] Subset fonts
- [ ] Use font-display: swap
- [ ] Preload critical fonts
- [ ] Limit font variants
- [ ] Consider system fonts

## Summary

Performance optimization is an ongoing process. Key takeaways:

### 🎯 Core Principles

1. **Measure first** - Don't optimize blindly
2. **User-centric metrics** - Focus on Core Web Vitals
3. **Progressive enhancement** - Start fast, enhance gradually
4. **Performance budget** - Set limits and stick to them
5. **Continuous monitoring** - Catch regressions early

### 🚀 Quick Wins

- Optimize images (biggest impact)
- Remove unused CSS/JS
- Implement lazy loading
- Use resource hints
- Enable compression

### 📚 Resources

- [Web.dev Performance](https://web.dev/performance/)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- [WebPageTest](https://www.webpagetest.org/)
- [PageSpeed Insights](https://pagespeed.web.dev/)

---

*Remember: The fastest request is the one never made. Always question whether you need that resource, feature, or dependency.* ⚡