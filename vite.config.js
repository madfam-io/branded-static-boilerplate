import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { resolve } from 'path';
import { readdirSync, copyFileSync, mkdirSync } from 'fs';

// Get all HTML files in src and src/pages
const getHtmlEntries = () => {
  const entries = {};
  
  // Add index.html
  entries.main = resolve(__dirname, 'src/index.html');
  
  // Add all pages
  try {
    const pagesDir = resolve(__dirname, 'src/pages');
    const pageFiles = readdirSync(pagesDir).filter(file => file.endsWith('.html'));
    
    pageFiles.forEach(file => {
      const name = file.replace('.html', '');
      entries[name] = resolve(pagesDir, file);
    });
  } catch (e) {
    // Pages directory might not exist yet
  }
  
  return entries;
};

export default defineConfig({
  root: 'src',
  base: '/branded-static-boilerplate/',
  
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    // Enable source maps for debugging
    sourcemap: process.env.NODE_ENV === 'development',
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    
    rollupOptions: {
      input: getHtmlEntries(),
      output: {
        // Optimize file names for caching
        assetFileNames: (assetInfo) => {
          // Keep educational assets recognizable
          if (assetInfo.name.includes('learning') || assetInfo.name.includes('tutorial')) {
            return 'assets/[name]-[hash][extname]';
          }
          // Group assets by type
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
        
        // Manual chunk splitting for optimal loading
        manualChunks(id) {
          // Only create vendor chunk if there are actual node_modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          
          // Don't create separate chunks for small modules
          // Let Vite handle automatic chunking based on imports
          return null;
        }
      },
      
      // Optimize tree shaking
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false
      }
    },
    
    // Minification settings
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: true,
        pure_funcs: process.env.NODE_ENV === 'production' ? ['console.log', 'console.info'] : [],
        passes: 2
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false,
        // Preserve license comments
        preserve_annotations: true
      }
    },
    
    // CSS code splitting
    cssCodeSplit: true,
    
    // Asset inlining threshold (4kb)
    assetsInlineLimit: 4096,
    
    // Enable rollup watcher for better rebuilds
    watch: process.env.NODE_ENV === 'development' ? {} : null
  },
  
  plugins: [
    // HTML optimization
    createHtmlPlugin({
      minify: {
        collapseWhitespace: true,
        keepClosingSlash: true,
        removeComments: false, // Keep our educational comments
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
        minifyCSS: true,
        minifyJS: true
      }
    }),
    
    // Gzip compression
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240, // Only compress files > 10kb
      algorithm: 'gzip',
      ext: '.gz'
    }),
    
    // Brotli compression for modern browsers
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'brotliCompress',
      ext: '.br'
    }),
    
    // Image optimization
    ViteImageOptimizer({
      png: {
        quality: 90,
      },
      jpeg: {
        quality: 90,
      },
      jpg: {
        quality: 90,
      },
      webp: {
        lossless: true,
      },
      svg: {
        plugins: [
          {
            name: 'removeViewBox',
            active: false
          },
          {
            name: 'removeEmptyAttrs',
            active: true
          }
        ]
      }
    }),
    
    // Bundle visualization (only in analyze mode)
    process.env.ANALYZE && visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html',
      template: 'treemap', // Use treemap for better visualization
      title: 'BSB Bundle Analysis',
      projectRoot: process.cwd()
    }),
    
    // Copy static files plugin
    {
      name: 'copy-static-files',
      writeBundle() {
        // Copy robots.txt
        try {
          copyFileSync(
            resolve(__dirname, 'src/robots.txt'),
            resolve(__dirname, 'dist/robots.txt')
          );
          if (process.env.VITE_VERBOSE !== 'false') {
            console.log('✓ Copied robots.txt to dist');
          }
        } catch (err) {
          console.error('Failed to copy robots.txt:', err);
        }
        
        // Copy manifest.json
        try {
          copyFileSync(
            resolve(__dirname, 'src/manifest.json'),
            resolve(__dirname, 'dist/manifest.json')
          );
          if (process.env.VITE_VERBOSE !== 'false') {
            console.log('✓ Copied manifest.json to dist');
          }
        } catch (err) {
          console.error('Failed to copy manifest.json:', err);
        }
        
        // Copy icon files
        const iconFiles = [
          'icon-192.png',
          'icon-512.png',
          'playground-icon.png',
          'components-icon.png'
        ];
        
        try {
          // Create assets/images directory if it doesn't exist
          const imagesDir = resolve(__dirname, 'dist/assets/images');
          mkdirSync(imagesDir, { recursive: true });
          
          iconFiles.forEach(file => {
            try {
              copyFileSync(
                resolve(__dirname, 'src/assets/images', file),
                resolve(imagesDir, file)
              );
              if (process.env.VITE_VERBOSE !== 'false') {
                console.log(`✓ Copied ${file} to dist/assets/images`);
              }
            } catch (err) {
              console.error(`Failed to copy ${file}:`, err);
            }
          });
        } catch (err) {
          console.error('Failed to create images directory:', err);
        }
      }
    }
  ].filter(Boolean),
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      // Pre-bundle heavy dependencies
    ],
    exclude: [
      // Exclude dependencies that should be loaded dynamically
    ]
  },
  
  server: {
    port: 3000,
    open: true,
    // Enable CORS for development
    cors: true,
    // Optimize HMR
    hmr: {
      overlay: true
    },
    // Enable dependency pre-bundling
    warmup: {
      clientFiles: [
        './scripts/core/main.js',
        './components/**/*.js'
      ]
    }
  },
  
  preview: {
    port: 4000,
    open: true
  },
  
  // CSS optimization
  css: {
    postcss: './postcss.config.js',
    // CSS modules configuration
    modules: {
      localsConvention: 'camelCaseOnly'
    },
    // Extract CSS for better caching
    extract: true
  },
  
  // Define global constants
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    '__BUILD_TIME__': JSON.stringify(new Date().toISOString()),
    '__VERSION__': JSON.stringify(process.env.npm_package_version)
  },
  
  // Worker optimization
  worker: {
    format: 'es',
    rollupOptions: {
      output: {
        entryFileNames: 'workers/[name]-[hash].js'
      }
    }
  }
});