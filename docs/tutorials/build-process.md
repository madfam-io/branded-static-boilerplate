# Build Process Tutorial

> 🏗️ **Learning Objective**: Understand how BSB transforms source files into optimized production assets using Vite, and learn to customize the build pipeline for your needs.

## Table of Contents

1. [Introduction](#introduction)
2. [Understanding Modern Build Tools](#understanding-modern-build-tools)
3. [BSB Build Architecture](#bsb-build-architecture)
4. [The Build Pipeline](#the-build-pipeline)
5. [Development vs Production](#development-vs-production)
6. [Customizing the Build](#customizing-the-build)
7. [Asset Optimization](#asset-optimization)
8. [Build Performance](#build-performance)
9. [Debugging Build Issues](#debugging-build-issues)
10. [Advanced Build Techniques](#advanced-build-techniques)

## Introduction

The build process is the bridge between the code you write and the optimized assets users download. BSB uses Vite, a modern build tool that provides:

- ⚡ **Lightning-fast HMR** - See changes instantly during development
- 📦 **Optimal bundling** - Smart code splitting for production
- 🔧 **Zero config** - Works out of the box with sensible defaults
- 🎯 **Tree shaking** - Removes unused code automatically
- 🖼️ **Asset optimization** - Compresses images, minifies code
- 🚀 **Modern output** - ES modules with legacy fallbacks

### Prerequisites

Before this tutorial, you should understand:
- Basic terminal/command line usage
- How npm scripts work
- Basic JavaScript module concepts
- File paths and project structure

### What You'll Learn

- How Vite transforms your source code
- The difference between dev and production builds
- How to optimize assets for performance
- Customizing the build for your needs
- Debugging common build issues

## Understanding Modern Build Tools

### Why Do We Need Build Tools?

Modern web development involves:

1. **Language Transformation**
   - TypeScript → JavaScript
   - JSX → JavaScript
   - Modern JS → Compatible JS

2. **Module Resolution**
   ```javascript
   // You write:
   import { utils } from './helpers'
   
   // Build tool resolves to:
   import { utils } from '/src/scripts/helpers/index.js'
   ```

3. **Asset Optimization**
   - Minification (removing whitespace)
   - Compression (gzip/brotli)
   - Image optimization
   - Dead code elimination

4. **Development Experience**
   - Hot Module Replacement (HMR)
   - Error overlay
   - Source maps

### Evolution of Build Tools

```
1. Manual Concatenation (2000s)
   └── cat file1.js file2.js > bundle.js

2. Task Runners (Early 2010s)
   └── Grunt, Gulp
       └── Sequential tasks

3. Module Bundlers (Mid 2010s)
   └── Webpack, Browserify
       └── Dependency graphs

4. Modern Build Tools (2020s)
   └── Vite, esbuild, SWC
       └── Native speed, ES modules
```

## BSB Build Architecture

### Project Structure

```
branded-static-boilerplate/
├── src/                    # Source files
│   ├── index.html         # Entry point
│   ├── styles/            # CSS files
│   ├── scripts/           # JavaScript files
│   ├── components/        # Component files
│   └── assets/            # Images, fonts
├── dist/                  # Build output (git-ignored)
├── vite.config.js         # Build configuration
├── package.json           # Scripts and dependencies
└── postcss.config.js      # CSS processing config
```

### Build Configuration Overview

BSB's `vite.config.js`:

```javascript
import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { resolve } from 'path';

export default defineConfig({
  // Root directory for source files
  root: 'src',
  
  // Base path for deployment (GitHub Pages)
  base: '/branded-static-boilerplate/',
  
  // Build configuration
  build: {
    outDir: '../dist',           // Output directory
    emptyOutDir: true,           // Clean before build
    sourcemap: process.env.NODE_ENV === 'development',
    chunkSizeWarningLimit: 1000, // KB
    
    // Rollup options for advanced control
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        // Multiple entry points for pages
      }
    }
  },
  
  // Development server
  server: {
    port: 3000,
    open: true,
    cors: true
  },
  
  // Plugins extend functionality
  plugins: [
    // HTML minification
    createHtmlPlugin({ minify: true }),
    
    // Compression
    viteCompression({ algorithm: 'gzip' }),
    viteCompression({ algorithm: 'brotliCompress' }),
    
    // Image optimization
    ViteImageOptimizer({
      png: { quality: 90 },
      jpeg: { quality: 90 }
    })
  ]
});
```

## The Build Pipeline

### 1. Entry Point Resolution

Vite starts with HTML files as entry points:

```html
<!-- src/index.html -->
<!DOCTYPE html>
<html>
<head>
  <!-- Vite processes these imports -->
  <link rel="stylesheet" href="/styles/main.css">
</head>
<body>
  <!-- Vite finds and bundles this script -->
  <script type="module" src="/scripts/main.js"></script>
</body>
</html>
```

### 2. Dependency Discovery

Vite builds a dependency graph:

```javascript
// main.js
import { initComponents } from './components';  // Found!
import { theme } from './theme';               // Found!

// components.js
import { Header } from '../components/header'; // Found!
import { Footer } from '../components/footer'; // Found!

// Result: Complete dependency tree
```

### 3. Transformation Pipeline

Each file type goes through specific transformations:

#### JavaScript Pipeline
```
source.js 
  → Parse (AST)
  → Transform (Modern → Compatible)
  → Tree Shake (Remove unused)
  → Minify (Compress)
  → Bundle (Combine)
  → Output
```

#### CSS Pipeline
```
source.css
  → Import Resolution (@import)
  → PostCSS Processing
  → Autoprefixer (Browser compatibility)
  → Minification
  → Bundle
  → Output
```

#### Asset Pipeline
```
image.png
  → Optimization (Compress)
  → Hashing (Cache busting)
  → Copy to dist
  → Update references
```

### 4. Output Generation

The build creates optimized files:

```
dist/
├── index.html                    # Minified HTML
├── assets/
│   ├── main-[hash].js           # Bundled JS
│   ├── main-[hash].css          # Bundled CSS
│   └── logo-[hash].png          # Optimized image
├── index.html.gz                # Gzipped version
└── index.html.br                # Brotli version
```

## Development vs Production

### Development Mode

```bash
npm run dev
```

Features:
- **Hot Module Replacement (HMR)** - Instant updates
- **Source Maps** - Debug original code
- **No Minification** - Readable output
- **Error Overlay** - Clear error messages
- **Fast Refresh** - Preserve component state

```javascript
// Development: Full error messages
if (!user) {
  throw new Error('User not found. Please check the user ID and try again.');
}

// Development: Detailed logging
console.log('Component initialized:', { 
  props, 
  state, 
  timestamp: Date.now() 
});
```

### Production Mode

```bash
npm run build
```

Features:
- **Minification** - Smallest file size
- **Tree Shaking** - Remove dead code
- **Compression** - Gzip/Brotli
- **Hashing** - Cache busting
- **No Source Maps** - Protect source code

```javascript
// Production: Minified
if(!u)throw new Error("User not found");

// Production: Console stripped
// console.log removed entirely
```

### Build Analysis

```bash
npm run build -- --analyze
```

Generates a visual report:

```
┌─────────────────────────────────────┐
│ Bundle Analyzer                      │
├─────────────────────────────────────┤
│ main.js (45.2 KB)                   │
│ ├── components (25.1 KB)            │
│ │   ├── header.js (8.2 KB)         │
│ │   ├── footer.js (6.5 KB)         │
│ │   └── card.js (10.4 KB)          │
│ ├── utils (15.3 KB)                 │
│ └── vendors (4.8 KB)                │
└─────────────────────────────────────┘
```

## Customizing the Build

### 1. Multiple Entry Points

Handle multiple HTML pages:

```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        about: resolve(__dirname, 'src/pages/about.html'),
        contact: resolve(__dirname, 'src/pages/contact.html'),
      }
    }
  }
});
```

### 2. Custom Output Structure

Control where files are placed:

```javascript
build: {
  rollupOptions: {
    output: {
      // Organize by file type
      assetFileNames: (assetInfo) => {
        const extType = assetInfo.name.split('.').pop();
        if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
          return 'images/[name]-[hash][extname]';
        }
        if (/woff2?|ttf|eot/i.test(extType)) {
          return 'fonts/[name]-[hash][extname]';
        }
        return 'assets/[name]-[hash][extname]';
      },
      chunkFileNames: 'js/[name]-[hash].js',
      entryFileNames: 'js/[name]-[hash].js',
    }
  }
}
```

### 3. Environment Variables

Use different configs for different environments:

```javascript
// .env.development
VITE_API_URL=http://localhost:3001
VITE_DEBUG=true

// .env.production
VITE_API_URL=https://api.example.com
VITE_DEBUG=false

// In your code
const apiUrl = import.meta.env.VITE_API_URL;
const debug = import.meta.env.VITE_DEBUG === 'true';
```

### 4. Custom Plugins

Create your own Vite plugin:

```javascript
// plugins/bsb-meta-plugin.js
export default function bsbMetaPlugin() {
  return {
    name: 'bsb-meta',
    
    transformIndexHtml(html) {
      // Add build timestamp
      return html.replace(
        '</head>',
        `<meta name="build-time" content="${new Date().toISOString()}">\n</head>`
      );
    },
    
    generateBundle(options, bundle) {
      // Create a manifest file
      const manifest = Object.keys(bundle).map(fileName => ({
        file: fileName,
        size: bundle[fileName].code?.length || 0
      }));
      
      this.emitFile({
        type: 'asset',
        fileName: 'build-manifest.json',
        source: JSON.stringify(manifest, null, 2)
      });
    }
  };
}

// Use in vite.config.js
import bsbMetaPlugin from './plugins/bsb-meta-plugin';

export default defineConfig({
  plugins: [bsbMetaPlugin()]
});
```

### 5. Conditional Builds

Build differently based on target:

```javascript
// vite.config.js
const isGitHubPages = process.env.DEPLOY_TARGET === 'github';

export default defineConfig({
  base: isGitHubPages ? '/repo-name/' : '/',
  
  build: {
    // GitHub Pages specific optimizations
    ...(isGitHubPages && {
      assetsInlineLimit: 0, // Don't inline assets
      cssCodeSplit: false,  // Single CSS file
    })
  }
});
```

## Asset Optimization

### 1. Image Optimization

BSB automatically optimizes images:

```javascript
// vite.config.js
ViteImageOptimizer({
  // PNG optimization
  png: {
    quality: 90,
    compressionLevel: 9,
  },
  
  // JPEG optimization
  jpeg: {
    quality: 85,
    progressive: true,
    mozjpeg: true,
  },
  
  // WebP generation
  webp: {
    quality: 85,
    lossless: false,
  },
  
  // SVG optimization
  svg: {
    plugins: [
      { name: 'removeViewBox', active: false },
      { name: 'removeEmptyAttrs', active: true },
      { name: 'removeDimensions', active: true },
    ]
  }
});
```

Usage in HTML:

```html
<!-- Original -->
<img src="/assets/hero-image.png" alt="Hero">

<!-- After build -->
<img src="/assets/hero-image-a8f3d2.webp" alt="Hero">
```

### 2. CSS Optimization

PostCSS handles CSS optimization:

```javascript
// postcss.config.js
export default {
  plugins: {
    // Import CSS files
    'postcss-import': {},
    
    // Future CSS features
    'postcss-preset-env': {
      stage: 3,
      features: {
        'nesting-rules': true,
        'custom-properties': true,
      }
    },
    
    // Add vendor prefixes
    autoprefixer: {},
    
    // Minify CSS
    cssnano: {
      preset: ['default', {
        discardComments: { removeAll: true },
        normalizeWhitespace: true,
      }]
    }
  }
};
```

### 3. JavaScript Optimization

Vite uses Rollup for JS optimization:

```javascript
// vite.config.js
build: {
  // Target modern browsers
  target: 'es2018',
  
  // Minification settings
  minify: 'terser',
  terserOptions: {
    compress: {
      drop_console: true,      // Remove console.log
      drop_debugger: true,     // Remove debugger
      pure_funcs: ['console.log', 'console.info'],
      passes: 2,               // Multiple passes
    },
    mangle: {
      safari10: true,          // Safari 10 bug workaround
    },
    format: {
      comments: false,         // Remove comments
    }
  },
  
  // Tree shaking
  rollupOptions: {
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
    }
  }
}
```

### 4. Font Optimization

Subset and compress fonts:

```css
/* Before: Full font file (300KB) */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter.woff2') format('woff2');
}

/* After: Subset font (50KB) */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-subset.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153;
}
```

### 5. Code Splitting

Split code for better caching:

```javascript
// Manual chunks
build: {
  rollupOptions: {
    output: {
      manualChunks(id) {
        // Vendor chunk
        if (id.includes('node_modules')) {
          return 'vendor';
        }
        
        // Components chunk
        if (id.includes('/components/')) {
          return 'components';
        }
        
        // Utils chunk
        if (id.includes('/utils/')) {
          return 'utils';
        }
      }
    }
  }
}
```

Result:
```
dist/js/
├── vendor-d3f4a2.js     # Third-party code (rarely changes)
├── components-8b2c1f.js # Component library (sometimes changes)
├── utils-5a3d8e.js      # Utilities (sometimes changes)
└── main-1f2e3d.js       # App code (frequently changes)
```

## Build Performance

### 1. Measuring Build Time

```bash
# Time your build
time npm run build

# Verbose output
VITE_VERBOSE=true npm run build

# Profile build
npm run build -- --profile
```

### 2. Optimizing Build Speed

#### Use Dependencies Wisely

```javascript
// vite.config.js
optimizeDeps: {
  // Pre-bundle heavy dependencies
  include: ['lodash-es', 'axios'],
  
  // Exclude from optimization
  exclude: ['your-local-lib']
}
```

#### Parallel Processing

```javascript
// Enable parallel CSS processing
css: {
  postcss: {
    plugins: [
      require('postcss-import')(),
      require('postcss-preset-env')({ 
        stage: 3,
        // Enable parallel processing
        browsers: 'last 2 versions',
        autoprefixer: { grid: true }
      })
    ]
  }
}
```

#### Conditional Plugins

```javascript
plugins: [
  // Only in production
  ...(process.env.NODE_ENV === 'production' ? [
    viteCompression(),
    ViteImageOptimizer(),
  ] : []),
  
  // Only in development
  ...(process.env.NODE_ENV === 'development' ? [
    viteInspect(),
  ] : [])
]
```

### 3. Caching Strategies

```javascript
build: {
  rollupOptions: {
    output: {
      // Content-based hashing
      entryFileNames: ({ name, hash }) => {
        // Main files get shorter hash
        if (name === 'main') {
          return `js/[name]-${hash.substr(0, 8)}.js`;
        }
        return 'js/[name]-[hash].js';
      },
      
      // Stable vendor chunk hash
      manualChunks: {
        vendor: ['vue', 'vue-router', 'pinia'],
      }
    }
  }
}
```

### 4. Memory Optimization

For large projects:

```javascript
// Increase Node memory
// package.json
{
  "scripts": {
    "build": "node --max-old-space-size=4096 ./node_modules/.bin/vite build"
  }
}

// Or use environment variable
export NODE_OPTIONS="--max-old-space-size=4096"
```

## Debugging Build Issues

### 1. Common Build Errors

#### Module Not Found

```
Error: Failed to resolve module specifier "utils"
```

**Solution**: Check import paths
```javascript
// ❌ Wrong
import { helper } from 'utils';

// ✅ Correct
import { helper } from './utils';
// or
import { helper } from '@/utils'; // with alias
```

#### Build Size Too Large

```
Warning: chunk size 500KB exceeds limit
```

**Solution**: Implement code splitting
```javascript
// Dynamic imports for code splitting
const HeavyComponent = () => import('./HeavyComponent.vue');

// Route-based splitting
const routes = [
  {
    path: '/dashboard',
    component: () => import('./views/Dashboard.vue')
  }
];
```

#### CSS Import Order

```
Error: Cannot find module './styles.css'
```

**Solution**: Check CSS imports
```css
/* ❌ Wrong: Relative from node_modules */
@import './variables.css';

/* ✅ Correct: From project root */
@import '/src/styles/variables.css';
```

### 2. Debug Tools

#### Vite Debug Mode

```bash
# Enable debug logging
DEBUG=vite:* npm run build

# Specific debug namespace
DEBUG=vite:transform npm run build
```

#### Build Analysis

```javascript
// vite.config.js
import { visualizer } from 'rollup-plugin-visualizer';

plugins: [
  visualizer({
    filename: './dist/stats.html',
    open: true,
    gzipSize: true,
    brotliSize: true,
  })
]
```

#### Source Map Explorer

```bash
# Install
npm install -D source-map-explorer

# Analyze bundle
npm run build
npx source-map-explorer dist/js/*.js
```

### 3. Build Verification

Create a build verification script:

```javascript
// scripts/verify-build.js
import { readdir, stat } from 'fs/promises';
import { join } from 'path';

async function verifyBuild() {
  const distPath = './dist';
  const required = [
    'index.html',
    'robots.txt',
    'sitemap.xml',
  ];
  
  // Check required files
  for (const file of required) {
    try {
      await stat(join(distPath, file));
      console.log(`✓ ${file} exists`);
    } catch {
      console.error(`✗ ${file} missing!`);
      process.exit(1);
    }
  }
  
  // Check file sizes
  const files = await readdir(distPath, { recursive: true });
  for (const file of files) {
    const stats = await stat(join(distPath, file));
    if (stats.size > 500 * 1024) { // 500KB
      console.warn(`⚠ ${file} is ${(stats.size / 1024).toFixed(2)}KB`);
    }
  }
  
  console.log('✅ Build verification passed!');
}

verifyBuild();
```

## Advanced Build Techniques

### 1. Multi-Stage Builds

Build for different targets:

```javascript
// build-all.js
import { build } from 'vite';
import config from './vite.config.js';

async function buildAll() {
  // Modern build
  await build({
    ...config,
    build: {
      ...config.build,
      target: 'es2020',
      outDir: 'dist/modern',
    }
  });
  
  // Legacy build
  await build({
    ...config,
    plugins: [
      ...config.plugins,
      legacy({
        targets: ['ie >= 11'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime']
      })
    ],
    build: {
      ...config.build,
      target: 'es5',
      outDir: 'dist/legacy',
    }
  });
}

buildAll();
```

### 2. Service Worker Build

Add offline support:

```javascript
// vite.config.js
import { VitePWA } from 'vite-plugin-pwa';

plugins: [
  VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
    manifest: {
      name: 'BSB App',
      short_name: 'BSB',
      theme_color: '#0066cc',
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
            }
          }
        }
      ]
    }
  })
]
```

### 3. Build-Time Data

Inject data during build:

```javascript
// vite.config.js
import siteData from './src/data/site.json';

plugins: [
  {
    name: 'inject-site-data',
    transformIndexHtml(html) {
      return html.replace(
        '<!-- SITE_DATA -->',
        `<script>window.SITE_DATA = ${JSON.stringify(siteData)}</script>`
      );
    }
  }
]
```

### 4. Conditional Features

Include features based on build flags:

```javascript
// vite.config.js
const features = {
  analytics: process.env.ENABLE_ANALYTICS === 'true',
  experiments: process.env.ENABLE_EXPERIMENTS === 'true',
};

define: {
  __FEATURES__: JSON.stringify(features),
}

// In your code
if (__FEATURES__.analytics) {
  import('./analytics').then(({ init }) => init());
}
```

### 5. Build Notifications

Get notified when build completes:

```javascript
// plugins/build-notifier.js
import notifier from 'node-notifier';

export default function buildNotifier() {
  return {
    name: 'build-notifier',
    closeBundle() {
      notifier.notify({
        title: 'Build Complete',
        message: 'BSB build finished successfully!',
        sound: true,
      });
    }
  };
}
```

## Real-World Example

Let's create a complete build setup for a documentation site:

```javascript
// vite.config.docs.js
import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { VitePWA } from 'vite-plugin-pwa';
import viteCompression from 'vite-plugin-compression';
import { searchPlugin } from './plugins/search-plugin';
import { docPlugin } from './plugins/doc-plugin';

export default defineConfig({
  root: 'src',
  base: '/docs/',
  
  build: {
    outDir: '../dist-docs',
    emptyOutDir: true,
    
    rollupOptions: {
      input: {
        // Auto-discover all docs
        ...discoverDocPages(),
      },
      
      output: {
        // Group by section
        manualChunks(id) {
          if (id.includes('/api/')) return 'api';
          if (id.includes('/guides/')) return 'guides';
          if (id.includes('/tutorials/')) return 'tutorials';
        }
      }
    }
  },
  
  plugins: [
    // Process markdown to HTML
    docPlugin({
      markdown: {
        theme: 'github-dark',
        lineNumbers: true,
      }
    }),
    
    // Generate search index
    searchPlugin({
      fields: ['title', 'content', 'tags'],
      outputFile: 'search-index.json',
    }),
    
    // PWA for offline docs
    VitePWA({
      workbox: {
        globPatterns: ['**/*.{html,js,css,json}'],
      }
    }),
    
    // Compression
    viteCompression({ algorithm: 'brotliCompress' }),
    
    // HTML optimization
    createHtmlPlugin({
      minify: {
        collapseWhitespace: true,
        removeComments: false, // Keep docs comments
      }
    }),
  ],
  
  // Optimize for documentation
  optimizeDeps: {
    include: [
      'prismjs',
      'markdown-it',
      'search-index',
    ]
  }
});

// Helper to discover doc pages
function discoverDocPages() {
  const pages = {};
  const docsDir = './src/docs';
  
  // Recursively find all .md files
  const files = glob.sync('**/*.md', { cwd: docsDir });
  
  files.forEach(file => {
    const name = file.replace(/\.md$/, '');
    pages[name] = resolve(docsDir, file);
  });
  
  return pages;
}
```

## Summary

You now understand the complete BSB build process! Key takeaways:

### 🎯 Best Practices

1. **Optimize for production** - Minify, compress, tree-shake
2. **Split code wisely** - Balance file size and HTTP requests
3. **Cache effectively** - Use content hashing
4. **Monitor bundle size** - Use analysis tools
5. **Test your builds** - Verify output regularly

### 🚀 Next Steps

1. Customize the build for your project
2. Implement build-time optimizations
3. Create custom Vite plugins
4. Explore the [Performance Optimization](./performance.md) tutorial

### 📚 Resources

- [Vite Documentation](https://vitejs.dev/)
- [Rollup Documentation](https://rollupjs.org/)
- [PostCSS Documentation](https://postcss.org/)
- [Web Performance](https://web.dev/performance/)

### Build Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run dev -- --host    # Expose to network
npm run dev -- --port 4000  # Custom port

# Production
npm run build            # Production build
npm run preview          # Preview production build
npm run build -- --watch # Watch mode

# Analysis
npm run build -- --analyze  # Bundle analysis
npm run build -- --sourcemap # Generate source maps

# Custom builds
NODE_ENV=staging npm run build  # Staging build
DEPLOY_TARGET=netlify npm run build  # Platform-specific
```

---

*Remember: The best build setup is invisible to users but invaluable to developers. Keep optimizing!* 🚀