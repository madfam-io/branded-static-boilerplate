/**
 * HTML Optimization Script
 * ========================
 * Optimizes HTML files for 100/100 Lighthouse score
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get all HTML files from distribution directory
 * @param {string} distDir - Distribution directory path
 * @returns {Promise<string[]>} Array of HTML file paths
 */
const getHTMLFiles = async distDir => {
  // Get HTML files from root directory
  const rootFiles = await fs.readdir(distDir);
  const rootHtmlFiles = rootFiles
    .filter(file => file.endsWith('.html'))
    .map(file => file);

  // Get HTML files from pages subdirectory
  const pagesDir = path.join(distDir, 'pages');
  let pagesHtmlFiles = [];
  try {
    const pagesFiles = await fs.readdir(pagesDir);
    pagesHtmlFiles = pagesFiles
      .filter(file => file.endsWith('.html'))
      .map(file => path.join('pages', file));
  } catch (error) {
    console.log('Pages directory not found, skipping...');
  }

  return [...rootHtmlFiles, ...pagesHtmlFiles];
};

/**
 * Read critical CSS file
 * @param {string} distDir - Distribution directory path
 * @returns {Promise<string>} Critical CSS content
 */
const readCriticalCSS = async distDir => {
  try {
    return await fs.readFile(path.join(distDir, 'critical.css'), 'utf8');
  } catch (error) {
    console.warn('⚠️  Critical CSS not found. Run extract-critical-css.js first.');
    return '';
  }
};

/**
 * Inline critical CSS into document
 * @param {Document} document - DOM document
 * @param {string} criticalCSS - Critical CSS content
 */
const inlineCriticalCSS = (document, criticalCSS) => {
  if (!criticalCSS) {
    return;
  }

  const criticalStyle = document.createElement('style');
  criticalStyle.textContent = criticalCSS;
  criticalStyle.setAttribute('data-critical', 'true');

  const firstLink = document.querySelector('link[rel="stylesheet"]');
  if (firstLink) {
    firstLink.parentNode.insertBefore(criticalStyle, firstLink);
  } else {
    document.head.appendChild(criticalStyle);
  }
  console.log('  ✅ Inlined critical CSS');
};

/**
 * Make non-critical CSS load asynchronously
 * @param {Document} document - DOM document
 */
const makeStylesAsync = document => {
  const styleLinks = document.querySelectorAll('link[rel="stylesheet"]');
  styleLinks.forEach(link => {
    // Skip third-party styles
    if (link.href.includes('fonts.googleapis.com')) {
      return;
    }

    // Convert to preload + onload pattern
    link.setAttribute('rel', 'preload');
    link.setAttribute('as', 'style');
    link.setAttribute('onload', "this.onload=null;this.rel='stylesheet'");

    // Add noscript fallback
    const noscript = document.createElement('noscript');
    const fallbackLink = document.createElement('link');
    fallbackLink.setAttribute('rel', 'stylesheet');
    fallbackLink.setAttribute('href', link.getAttribute('href'));
    noscript.appendChild(fallbackLink);
    link.parentNode.insertBefore(noscript, link.nextSibling);
  });
  console.log('  ✅ Made CSS async');
};

/**
 * Add resource hints for external resources
 * @param {Document} document - DOM document
 */
const addResourceHints = document => {
  const { head } = document;

  // Preconnect to Google Fonts
  const preconnectFonts = document.createElement('link');
  preconnectFonts.setAttribute('rel', 'preconnect');
  preconnectFonts.setAttribute('href', 'https://fonts.googleapis.com');
  head.insertBefore(preconnectFonts, head.firstChild);

  const preconnectFonts2 = document.createElement('link');
  preconnectFonts2.setAttribute('rel', 'preconnect');
  preconnectFonts2.setAttribute('href', 'https://fonts.gstatic.com');
  preconnectFonts2.setAttribute('crossorigin', '');
  head.insertBefore(preconnectFonts2, head.firstChild);
  console.log('  ✅ Added resource hints');
};

/**
 * Optimize script loading with defer attribute
 * @param {Document} document - DOM document
 */
const optimizeScripts = document => {
  const scripts = document.querySelectorAll('script[src]');
  scripts.forEach(script => {
    // Skip third-party scripts
    if (script.src.includes('http://') || script.src.includes('https://')) {
      return;
    }

    // Add defer to all scripts unless they have async
    if (!script.hasAttribute('async') && !script.hasAttribute('defer')) {
      script.setAttribute('defer', '');
    }
  });
  console.log('  ✅ Optimized script loading');
};

/**
 * Optimize images with lazy loading and dimensions
 * @param {Document} document - DOM document
 */
const optimizeImages = document => {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    // Add lazy loading
    if (!img.hasAttribute('loading')) {
      // Don't lazy load above-fold images
      if (!img.classList.contains('hero__image') && !img.closest('.hero')) {
        img.setAttribute('loading', 'lazy');
      }
    }

    // Add dimensions if missing
    if (!img.hasAttribute('width') && !img.hasAttribute('height')) {
      // Set default dimensions to prevent CLS
      img.setAttribute('width', '100');
      img.setAttribute('height', '100');
    }

    // Add decoding async
    if (!img.hasAttribute('decoding')) {
      img.setAttribute('decoding', 'async');
    }
  });
  console.log('  ✅ Optimized images');
};

/**
 * Add performance-related meta tags
 * @param {Document} document - DOM document
 */
const addMetaTags = document => {
  const { head } = document;

  // Add description meta tag
  if (!document.querySelector('meta[name="description"]')) {
    const metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    metaDesc.setAttribute('content', 'BSB - High-performance static site boilerplate');
    head.appendChild(metaDesc);
  }

  // Add Web App Manifest link
  if (!document.querySelector('link[rel="manifest"]')) {
    const manifest = document.createElement('link');
    manifest.setAttribute('rel', 'manifest');
    manifest.setAttribute('href', '/manifest.json');
    head.appendChild(manifest);
  }
};

/**
 * Add service worker registration
 * @param {Document} document - DOM document
 */
const addServiceWorker = document => {
  const hasServiceWorkerScript = Array.from(document.querySelectorAll('script')).some(
    script => script.textContent && script.textContent.includes('serviceWorker')
  );

  if (!hasServiceWorkerScript) {
    const swScript = document.createElement('script');
    swScript.textContent = `
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('ServiceWorker registration successful');
          }).catch(err => {
            console.log('ServiceWorker registration failed:', err);
          });
        });
      }
    `;
    document.body.appendChild(swScript);
    console.log('  ✅ Added service worker registration');
  }
};

/**
 * Minify inline scripts by removing comments and whitespace
 * @param {Document} document - DOM document
 */
const minifyInlineScripts = document => {
  const inlineScripts = document.querySelectorAll('script:not([src])');
  inlineScripts.forEach(script => {
    if (script.textContent) {
      // Basic minification - remove comments and extra whitespace
      script.textContent = script.textContent
        .replace(/\/\*[\s\S]*?\*\//gu, '')
        .replace(/\/\/.*$/gmu, '')
        .replace(/\s+/gu, ' ')
        .trim();
    }
  });
};

/**
 * Process a single HTML file with all optimizations
 * @param {string} filePath - Path to HTML file
 * @param {string} criticalCSS - Critical CSS content
 */
const processHTMLFile = async(filePath, criticalCSS) => {
  const html = await fs.readFile(filePath, 'utf8');
  const dom = new JSDOM(html);
  const { document } = dom.window;

  console.log(`\n🔧 Optimizing ${path.basename(filePath)}...`);

  // Apply all optimizations
  inlineCriticalCSS(document, criticalCSS);
  makeStylesAsync(document);
  addResourceHints(document);
  optimizeScripts(document);
  optimizeImages(document);
  addMetaTags(document);
  addServiceWorker(document);
  minifyInlineScripts(document);

  // Save optimized HTML
  const optimizedHTML = dom.serialize();
  await fs.writeFile(filePath, optimizedHTML);
  console.log(`  ✅ Saved optimized ${path.basename(filePath)}`);
};

/**
 * Main optimization function
 */
const optimizeHTML = async() => {
  const distDir = path.join(__dirname, '..', 'dist');

  // Get all HTML files
  const htmlFiles = await getHTMLFiles(distDir);

  // Read critical CSS once
  const criticalCSS = await readCriticalCSS(distDir);

  // Process each HTML file
  await Promise.all(
    htmlFiles.map(file => {
      const filePath = path.join(distDir, file);
      return processHTMLFile(filePath, criticalCSS);
    })
  );

  console.log('\n✨ HTML optimization complete!');
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  optimizeHTML().catch(console.error);
}

export { optimizeHTML };