/**
 * Extract Critical CSS
 * ===================
 * Extracts above-the-fold CSS for inlining
 */

import { promises as fs } from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import css from 'css';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Critical CSS rules that should always be included
const CRITICAL_SELECTORS = [
  // Reset and base styles
  '*', 'html', 'body',
  // Typography
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a',
  // Layout
  '.container', '.row', '.col', 'header', 'nav', 'main',
  // Hero sections (above fold)
  '.hero', '.hero__content', '.hero__title', '.hero__subtitle',
  // Navigation
  '.navbar', '.navbar__brand', '.navbar__menu', '.navbar__link',
  // Critical components
  '.btn', '.btn--primary', '.btn--secondary',
  // Performance critical
  '[data-critical]', '.above-fold'
];

async function extractCriticalCSS() {
  try {
    // Read all CSS files
    const cssDir = path.join(__dirname, '..', 'src', 'styles');
    const cssFiles = await fs.readdir(cssDir);
    
    let allCSS = '';
    
    // Combine all CSS
    for (const file of cssFiles) {
      if (file.endsWith('.css')) {
        const content = await fs.readFile(path.join(cssDir, file), 'utf8');
        allCSS += content + '\n';
      }
    }
    
    // Parse CSS
    const ast = css.parse(allCSS);
    const criticalRules = [];
    
    // Extract critical rules
    ast.stylesheet.rules.forEach(rule => {
      if (rule.type === 'rule') {
        // Check if any selector matches critical selectors
        const isCritical = rule.selectors.some(selector => {
          return CRITICAL_SELECTORS.some(critical => {
            return selector.includes(critical) || 
                   selector.startsWith(critical) ||
                   selector === critical;
          });
        });
        
        if (isCritical) {
          criticalRules.push(rule);
        }
      } else if (rule.type === 'media') {
        // Include critical media queries
        const criticalMediaRules = rule.rules.filter(mediaRule => {
          if (mediaRule.type === 'rule') {
            return mediaRule.selectors.some(selector => {
              return CRITICAL_SELECTORS.some(critical => {
                return selector.includes(critical);
              });
            });
          }
          return false;
        });
        
        if (criticalMediaRules.length > 0) {
          rule.rules = criticalMediaRules;
          criticalRules.push(rule);
        }
      } else if (rule.type === 'font-face') {
        // Include font-face rules for critical fonts
        criticalRules.push(rule);
      }
    });
    
    // Generate critical CSS
    const criticalAST = {
      type: 'stylesheet',
      stylesheet: {
        rules: criticalRules,
        parsingErrors: []
      }
    };
    
    const criticalCSS = css.stringify(criticalAST, { compress: true });
    
    // Save critical CSS
    await fs.writeFile(
      path.join(__dirname, '..', 'dist', 'critical.css'),
      criticalCSS
    );
    
    console.log('✅ Critical CSS extracted successfully');
    console.log(`📏 Size: ${(criticalCSS.length / 1024).toFixed(2)}KB`);
    
    return criticalCSS;
  } catch (error) {
    console.error('❌ Error extracting critical CSS:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  extractCriticalCSS();
}

export { extractCriticalCSS };