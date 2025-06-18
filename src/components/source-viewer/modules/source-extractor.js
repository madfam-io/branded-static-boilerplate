/**
 * Source Code Extractor
 * =====================
 *
 * Extracts HTML, CSS, and JavaScript source code from components
 */

import { debug } from '../../../scripts/core/debug.js';

/**
 * Get component name from element
 * @param {HTMLElement} component - Component element
 * @returns {string} Component name
 */
const getComponentName = component => component.dataset.bsbComponent ||
         component.className.split(' ').find(cls => cls.startsWith('bsb-'))?.replace('bsb-', '') ||
         'unknown-component';

/**
 * Format HTML with proper indentation
 * @param {string} html - Raw HTML string
 * @returns {string} Formatted HTML
 */
const formatHTML = html => {
  const lines = html.split(/>\s*</);
  let formatted = '';
  let indent = 0;

  lines.forEach((line, index) => {
    let trimmed = line.trim();

    // Add missing brackets
    if (index > 0 && !trimmed.startsWith('<')) {
      trimmed = `<${trimmed}`;
    }
    if (index < lines.length - 1 && !trimmed.endsWith('>')) {
      trimmed += '>';
    }

    // Adjust indentation
    if (trimmed.startsWith('</')) {
      indent = Math.max(0, indent - 1);
    }

    formatted += `${'  '.repeat(indent) + trimmed}\n`;

    if (trimmed.startsWith('<') && !trimmed.startsWith('</') &&
        !trimmed.endsWith('/>') && !trimmed.includes('</')) {
      indent++;
    }
  });

  return formatted.trim();
};

/**
 * Extract HTML source from component
 * @param {HTMLElement} component - Component element
 * @returns {string} Formatted HTML
 */
const extractComponentHTML = component => {
  // Clone the element to avoid modifying the original
  const clone = component.cloneNode(true);

  // Remove view source buttons from clone
  const viewSourceBtns = clone.querySelectorAll('.bsb-view-source-btn');
  viewSourceBtns.forEach(btn => btn.remove());

  // Get the HTML and format it
  const html = clone.outerHTML;
  return formatHTML(html);
};

/**
 * Extract CSS rules for component
 * @param {HTMLElement} component - Component element
 * @returns {string} Formatted CSS
 */
const extractComponentCSS = component => {
  const componentName = getComponentName(component);
  const cssRules = [];

  try {
    // Iterate through all stylesheets
    Array.from(document.styleSheets).forEach(stylesheet => {
      try {
        Array.from(stylesheet.cssRules || []).forEach(rule => {
          if (rule.selectorText && rule.selectorText.includes(`bsb-${componentName}`)) {
            cssRules.push(`${rule.selectorText} {\n  ${rule.style.cssText}\n}`);
          }
        });
      } catch (error) {
        // Cross-origin stylesheets will throw, skip them
        debug.warn('Cannot access stylesheet rules:', error);
      }
    });
  } catch (error) {
    debug.warn('Error extracting CSS:', error);
  }

  return cssRules.length > 0 ? cssRules.join('\n\n') : '/* No CSS rules found for this component */';
};

/**
 * Generate a basic component JavaScript template
 * @param {string} componentName - Component name
 * @returns {string} Template code
 */
const generateComponentTemplate = componentName => {
  const className = componentName.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  return `// ${className} Component JavaScript Template
class BSB${className} {
  constructor(element) {
    this.element = element;
    this.init();
  }

  init() {
    this.setupEventListeners();
    console.log('${className} component initialized');
  }

  setupEventListeners() {
    // Add your event listeners here
    this.element.addEventListener('click', (event) => {
      this.handleClick(event);
    });
  }

  handleClick(event) {
    // Handle click events
    console.log('${className} clicked:', event.target);
  }
}

// Initialize all ${componentName} components
document.addEventListener('DOMContentLoaded', () => {
  const components = document.querySelectorAll('[data-bsb-component="${componentName}"]');
  components.forEach(element => {
    new BSB${className}(element);
  });
});`;
};

/**
 * Extract JavaScript code for component
 * @param {string} componentName - Name of the component
 * @returns {string} Component JavaScript
 */
const extractComponentJS = componentName => {
  // Try to find component class or initialization code
  const scripts = Array.from(document.querySelectorAll('script'));
  let jsCode = '';

  scripts.forEach(script => {
    if (script.src) {
      // External script - show the src
      if (script.src.includes(componentName)) {
        jsCode += `// External script: ${script.src}\n`;
      }
    } else if (script.textContent) {
      // Inline script - check if it mentions the component
      if (script.textContent.includes(componentName) ||
          script.textContent.includes(`bsb-${componentName}`)) {
        jsCode += `${script.textContent}\n`;
      }
    }
  });

  // If no specific JS found, provide a generic template
  if (!jsCode.trim()) {
    jsCode = generateComponentTemplate(componentName);
  }

  return jsCode;
};

/**
 * Extract complete source code for a component
 * @param {HTMLElement} component - Component element
 * @returns {Object} Extracted source code
 */
export const extractComponentSource = component => {
  const componentName = getComponentName(component);

  return {
    html: extractComponentHTML(component),
    css: extractComponentCSS(component),
    js: extractComponentJS(componentName),
    componentName
  };
};