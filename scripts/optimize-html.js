/**
 * HTML Optimization Script
 * ========================
 * Optimizes HTML files for 100/100 Lighthouse score
 */

import { promises as fs } from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function optimizeHTML() {
  const distDir = path.join(__dirname, '..', 'dist');
  
  // Get HTML files from both root and pages directory
  const rootFiles = await fs.readdir(distDir);
  const rootHtmlFiles = rootFiles.filter(f => f.endsWith('.html')).map(f => f);
  
  // Get HTML files from pages subdirectory
  const pagesDir = path.join(distDir, 'pages');
  let pagesHtmlFiles = [];
  try {
    const pagesFiles = await fs.readdir(pagesDir);
    pagesHtmlFiles = pagesFiles.filter(f => f.endsWith('.html')).map(f => path.join('pages', f));
  } catch (error) {
    console.log('Pages directory not found, skipping...');
  }
  
  // Combine all HTML files
  const htmlFiles = [...rootHtmlFiles, ...pagesHtmlFiles];
  
  // Read critical CSS
  let criticalCSS = '';
  try {
    criticalCSS = await fs.readFile(path.join(distDir, 'critical.css'), 'utf8');
  } catch (error) {
    console.warn('⚠️  Critical CSS not found. Run extract-critical-css.js first.');
  }
  
  for (const file of htmlFiles) {
    const filePath = path.join(distDir, file);
    const html = await fs.readFile(filePath, 'utf8');
    const dom = new JSDOM(html);
    const { document } = dom.window;
    
    console.log(`\n🔧 Optimizing ${file}...`);
    
    // 1. Inline critical CSS
    if (criticalCSS) {
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
    }
    
    // 2. Make non-critical CSS async
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
    
    // 3. Add resource hints
    const head = document.head;
    
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
    
    // 4. Optimize scripts
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
    
    // 5. Optimize images
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
    
    // 6. Add meta tags for performance
    if (!document.querySelector('meta[name="description"]')) {
      const metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      metaDesc.setAttribute('content', 'BSB - High-performance static site boilerplate');
      head.appendChild(metaDesc);
    }
    
    // 7. Add Web App Manifest link
    if (!document.querySelector('link[rel="manifest"]')) {
      const manifest = document.createElement('link');
      manifest.setAttribute('rel', 'manifest');
      manifest.setAttribute('href', '/manifest.json');
      head.appendChild(manifest);
    }
    
    // 8. Add Service Worker registration
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
    
    // 9. Minify inline scripts and styles
    const inlineScripts = document.querySelectorAll('script:not([src])');
    inlineScripts.forEach(script => {
      if (script.textContent) {
        // Basic minification - remove comments and extra whitespace
        script.textContent = script.textContent
          .replace(/\/\*[\s\S]*?\*\//g, '')
          .replace(/\/\/.*$/gm, '')
          .replace(/\s+/g, ' ')
          .trim();
      }
    });
    
    // Save optimized HTML
    const optimizedHTML = dom.serialize();
    await fs.writeFile(filePath, optimizedHTML);
    console.log(`  ✅ Saved optimized ${file}`);
  }
  
  console.log('\n✨ HTML optimization complete!');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  optimizeHTML().catch(console.error);
}

export { optimizeHTML };