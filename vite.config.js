import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { resolve } from 'path';
import { readdirSync } from 'fs';

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
  base: './',
  
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: getHtmlEntries(),
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
      }
    },
    // Minification settings
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  
  plugins: [
    createHtmlPlugin({
      minify: {
        collapseWhitespace: true,
        keepClosingSlash: true,
        removeComments: false, // Keep our educational comments in dev
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      }
    })
  ],
  
  server: {
    port: 3000,
    open: true,
    // Enable CORS for development
    cors: true
  },
  
  preview: {
    port: 4000,
    open: true
  },
  
  // CSS optimization is handled by postcss.config.js
  css: {
    postcss: './postcss.config.js'
  }
});