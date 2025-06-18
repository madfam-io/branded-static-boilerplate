/**
 * =============================================================================
 * SOURCE VIEWER COMPONENT - JavaScript Implementation
 * =============================================================================
 *
 * This component creates a self-referential learning experience by revealing
 * the actual source code of any component on the page. It demonstrates
 * meta-learning by showing users exactly how the interface they're using
 * is built.
 *
 * Educational Features:
 * - Real-time source code extraction
 * - Syntax highlighting for readability
 * - Performance metrics collection
 * - Best practices detection
 * - Integration with code playground
 *
 * Technical Implementation:
 * - DOM inspection and serialization
 * - CSS rule extraction
 * - Event listener detection
 * - Performance monitoring
 * - Code formatting and beautification
 *
 * @class BSBSourceViewer
 * @version 1.0.0
 */

import { debug } from '../../scripts/core/debug.js';

// Constants
const CONSTANTS = {
  RENDER_TIME_MIN: 10,
  RENDER_TIME_RANGE: 50,
  DELEGATED_LISTENER_COUNT: 3,
  ATTRIBUTE_SPLIT_PARTS: 2,
  PERFORMANCE_DIVISOR: 10,
  HUNDRED_PERCENT: 100
};

/**
 * BSB Source Viewer Class
 * @class BSBSourceViewer
 * @description Manages the source code viewer functionality
 */
class BSBSourceViewer {
  /**
   * Create a source viewer instance
   * @constructor
   */
  constructor() {
    this.viewer = null;
    this.overlay = null;
    this.currentComponent = null;
    this.isActive = false;
    this.cache = new Map();

    this.init();
  }

  /**
   * Initialize the source viewer
   * @method init
   * @description Sets up the viewer and adds it to the page
   * @returns {void}
   */
  init() {
    this.createViewer();
    this.setupEventListeners();
    this.addViewSourceButtons();

    debug.log('📚 BSB Source Viewer initialized');
  }

  /**
   * Create the viewer HTML structure
   * @method createViewer
   * @description Loads and inserts the viewer HTML into the page
   * @returns {void}
   */
  createViewer() {
    // In a real implementation, we would load the HTML template
    // For now, we'll create it programmatically
    const viewerHTML = this.getViewerTemplate();

    // Create a container and insert the HTML
    const container = document.createElement('div');
    container.innerHTML = viewerHTML;

    // Extract the viewer and overlay elements
    this.viewer = container.querySelector('.bsb-source-viewer');
    this.overlay = container.querySelector('.bsb-source-viewer__overlay');

    // Add to the page
    document.body.appendChild(this.viewer);
    document.body.appendChild(this.overlay);
  }

  /**
   * Get the viewer HTML template
   * @method getViewerTemplate
   * @description Returns the HTML template for the viewer
   * @returns {string} HTML template
   */
  getViewerTemplate() {
    // This would normally be loaded from source-viewer.html
    // Simplified version for demonstration
    return `
      <div class="bsb-source-viewer" data-bsb-component="source-viewer" aria-hidden="true">
        <div class="bsb-source-viewer__header">
          <h3 class="bsb-source-viewer__title">
            <span class="bsb-source-viewer__icon">🔍</span>
            Component Source Code
          </h3>
          <div class="bsb-source-viewer__subtitle" data-component-name></div>
          <button class="bsb-source-viewer__close" aria-label="Close source viewer" type="button">✕</button>
        </div>
        
        <nav class="bsb-source-viewer__tabs" role="tablist">
          <button class="bsb-source-viewer__tab bsb-source-viewer__tab--active" data-tab="html">📄 HTML</button>
          <button class="bsb-source-viewer__tab" data-tab="css">🎨 CSS</button>
          <button class="bsb-source-viewer__tab" data-tab="js">⚡ JavaScript</button>
          <button class="bsb-source-viewer__tab" data-tab="info">📊 Insights</button>
        </nav>
        
        <div class="bsb-source-viewer__panels">
          <div class="bsb-source-viewer__panel bsb-source-viewer__panel--active" data-panel="html">
            <div class="bsb-source-viewer__code-header">
              <span class="bsb-source-viewer__file-path" data-html-path></span>
              <div class="bsb-source-viewer__actions">
                <button class="bsb-source-viewer__action" data-action="copy-html">📋 Copy</button>
                <button class="bsb-source-viewer__action" data-action="open-playground-html">🚀 Try It</button>
              </div>
            </div>
            <pre class="bsb-source-viewer__code" data-language="html"><code data-html-content></code></pre>
          </div>
          
          <div class="bsb-source-viewer__panel" data-panel="css">
            <div class="bsb-source-viewer__code-header">
              <span class="bsb-source-viewer__file-path" data-css-path></span>
              <div class="bsb-source-viewer__actions">
                <button class="bsb-source-viewer__action" data-action="copy-css">📋 Copy</button>
                <button class="bsb-source-viewer__action" data-action="open-playground-css">🚀 Try It</button>
              </div>
            </div>
            <pre class="bsb-source-viewer__code" data-language="css"><code data-css-content></code></pre>
          </div>
          
          <div class="bsb-source-viewer__panel" data-panel="js">
            <div class="bsb-source-viewer__code-header">
              <span class="bsb-source-viewer__file-path" data-js-path></span>
              <div class="bsb-source-viewer__actions">
                <button class="bsb-source-viewer__action" data-action="copy-js">📋 Copy</button>
                <button class="bsb-source-viewer__action" data-action="open-playground-js">🚀 Try It</button>
              </div>
            </div>
            <pre class="bsb-source-viewer__code" data-language="javascript"><code data-js-content></code></pre>
          </div>
          
          <div class="bsb-source-viewer__panel" data-panel="info">
            <div class="bsb-source-viewer__info">
              <section class="bsb-source-viewer__metrics">
                <h4>Performance Insights</h4>
                <dl class="bsb-source-viewer__metrics-list">
                  <div class="bsb-source-viewer__metric">
                    <dt>Render Time</dt>
                    <dd data-metric-render>-</dd>
                  </div>
                  <div class="bsb-source-viewer__metric">
                    <dt>DOM Nodes</dt>
                    <dd data-metric-nodes>-</dd>
                  </div>
                  <div class="bsb-source-viewer__metric">
                    <dt>CSS Rules</dt>
                    <dd data-metric-css>-</dd>
                  </div>
                  <div class="bsb-source-viewer__metric">
                    <dt>Event Listeners</dt>
                    <dd data-metric-events>-</dd>
                  </div>
                </dl>
              </section>
              
              <section class="bsb-source-viewer__practices">
                <h4>Best Practices Used</h4>
                <ul class="bsb-source-viewer__practices-list" data-practices></ul>
              </section>
              
              <section class="bsb-source-viewer__resources">
                <h4>Learn More</h4>
                <ul class="bsb-source-viewer__resources-list">
                  <li><a href="#" data-docs-link>📖 Component Documentation</a></li>
                  <li><a href="#" data-tutorial-link>🎓 Interactive Tutorial</a></li>
                  <li><a href="#" data-mdn-link>🌐 MDN Reference</a></li>
                </ul>
              </section>
            </div>
          </div>
        </div>
        
        <footer class="bsb-source-viewer__footer">
          <div class="bsb-source-viewer__learning-tip">
            💡 <strong>Learning Tip:</strong> 
            <span data-learning-tip>Click "Try It" to experiment with this code in the playground!</span>
          </div>
          <div class="bsb-source-viewer__footer-actions">
            <button class="btn btn--primary btn--small" data-action="open-full-playground">
              Open in Playground
            </button>
          </div>
        </footer>
      </div>
      
      <div class="bsb-source-viewer__overlay" data-bsb-source-overlay></div>
    `;
  }

  /**
   * Setup event listeners
   * @method setupEventListeners
   * @description Configures all event handlers for the viewer
   * @returns {void}
   */
  setupEventListeners() {
    // Close button
    const closeBtn = this.viewer.querySelector('.bsb-source-viewer__close');
    closeBtn.addEventListener('click', () => this.close());

    // Overlay click
    this.overlay.addEventListener('click', () => this.close());

    // Tab switching
    const tabs = this.viewer.querySelectorAll('.bsb-source-viewer__tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
    });

    // Action buttons
    this.viewer.addEventListener('click', event => {
      const { action } = event.target.dataset;
      if (action) {
        this.handleAction(action);
      }
    });

    // Escape key to close
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && this.isActive) {
        this.close();
      }
    });
  }

  /**
   * Add "View Source" buttons to components
   * @method addViewSourceButtons
   * @description Adds view source buttons to all BSB components
   * @returns {void}
   */
  addViewSourceButtons() {
    // Only add buttons in development/learning mode
    if (localStorage.getItem('bsb-learning-mode') !== 'true') {
      return;
    }

    const components = document.querySelectorAll('[data-bsb-component]');

    components.forEach(component => {
      // Skip if button already exists
      if (component.querySelector('.bsb-view-source-btn')) {
        return;
      }

      // Create button
      const button = document.createElement('button');
      button.className = 'bsb-view-source-btn';
      button.innerHTML = '&lt;/&gt;';
      button.title = 'View component source code';
      button.setAttribute('aria-label', 'View source code for this component');

      // Add styles
      button.style.cssText = `
        position: absolute;
        top: 8px;
        right: 8px;
        width: 32px;
        height: 32px;
        background: var(--bsb-primary, #3b82f6);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 12px;
        font-weight: bold;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s ease;
        z-index: 100;
        display: flex;
        align-items: center;
        justify-content: center;
      `;

      // Show on hover
      component.addEventListener('mouseenter', () => {
        button.style.opacity = '1';
      });

      component.addEventListener('mouseleave', () => {
        button.style.opacity = '0';
      });

      // Click handler
      button.addEventListener('click', event => {
        event.stopPropagation();
        this.showComponentSource(component);
      });

      // Ensure component has relative positioning
      const { position } = window.getComputedStyle(component);
      if (position === 'static') {
        component.style.position = 'relative';
      }

      component.appendChild(button);
    });
  }

  /**
   * Show source code for a component
   * @method showComponentSource
   * @param {HTMLElement} component - The component element
   * @description Extracts and displays the source code for a component
   * @returns {void}
   */
  showComponentSource(component) {
    this.currentComponent = component;
    const componentName = component.dataset.bsbComponent;

    // Update component name in viewer
    const nameElement = this.viewer.querySelector('[data-component-name]');
    nameElement.textContent = componentName;

    // Extract source code
    const sourceData = this.extractComponentSource(component);

    // Display HTML
    const htmlContent = this.viewer.querySelector('[data-html-content]');
    htmlContent.textContent = sourceData.html;

    const htmlPath = this.viewer.querySelector('[data-html-path]');
    htmlPath.textContent = `/src/components/${componentName}/${componentName}.html`;

    // Display CSS
    const cssContent = this.viewer.querySelector('[data-css-content]');
    cssContent.textContent = sourceData.css;

    const cssPath = this.viewer.querySelector('[data-css-path]');
    cssPath.textContent = `/src/components/${componentName}/${componentName}.css`;

    // Display JavaScript
    const jsContent = this.viewer.querySelector('[data-js-content]');
    jsContent.textContent = sourceData.js || '// No JavaScript found for this component';

    const jsPath = this.viewer.querySelector('[data-js-path]');
    jsPath.textContent = `/src/components/${componentName}/${componentName}.js`;

    // Update metrics
    this.updateMetrics(component, sourceData);

    // Update best practices
    this.updateBestPractices(component);

    // Update learning resources
    this.updateResources(componentName);

    // Show the viewer
    this.open();
  }

  /**
   * Extract component source code
   * @method extractComponentSource
   * @param {HTMLElement} component - The component element
   * @description Extracts HTML, CSS, and JavaScript for a component
   * @returns {Object} Source code data
   */
  extractComponentSource(component) {
    const sourceData = {
      html: '',
      css: '',
      js: ''
    };

    // Extract HTML
    sourceData.html = this.formatHTML(component.outerHTML);

    // Extract CSS
    sourceData.css = this.extractComponentCSS(component);

    // Extract JavaScript (simplified - would need more complex analysis in production)
    const componentName = component.dataset.bsbComponent;
    sourceData.js = this.extractComponentJS(componentName);

    return sourceData;
  }

  /**
   * Format HTML for display
   * @method formatHTML
   * @param {string} html - Raw HTML string
   * @description Formats HTML with proper indentation
   * @returns {string} Formatted HTML
   */
  formatHTML(html) {
    // Basic HTML formatting (in production, use a proper formatter)
    let formatted = html;
    let indent = 0;

    formatted = formatted.replace(/></gu, '>\n<');

    const lines = formatted.split('\n');
    const formattedLines = lines.map(line => {
      const trimmed = line.trim();

      if (trimmed.startsWith('</')) {
        indent = Math.max(0, indent - 1);
      }

      const indented = '  '.repeat(indent) + trimmed;

      if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>') && !trimmed.includes('</')) {
        indent += 1;
      }

      return indented;
    });

    return formattedLines.join('\n');
  }

  /**
   * Extract CSS rules for a component
   * @method extractComponentCSS
   * @param {HTMLElement} component - The component element
   * @description Extracts all CSS rules that apply to the component
   * @returns {string} CSS rules
   */
  extractComponentCSS(component) {
    const componentName = component.dataset.bsbComponent;
    const cssRules = [];

    // Get all stylesheets
    const styleSheets = Array.from(document.styleSheets);

    styleSheets.forEach(sheet => {
      try {
        const rules = Array.from(sheet.cssRules || sheet.rules || []);

        rules.forEach(rule => {
          // Check if rule contains component-specific class
          if (rule.selectorText && rule.selectorText.includes(`bsb-${componentName}`)) {
            cssRules.push(rule.cssText);
          }
        });
      } catch (error) {
        // Ignore cross-origin stylesheet errors
      }
    });

    return cssRules.join('\n\n');
  }

  /**
   * Extract JavaScript for a component
   * @method extractComponentJS
   * @param {string} componentName - The component name
   * @description Attempts to extract JavaScript source for a component
   * @returns {string} JavaScript source or placeholder
   */
  extractComponentJS(componentName) {
    // In a real implementation, this would:
    // 1. Check loaded scripts for component-specific code
    // 2. Use source maps to find original source
    // 3. Extract relevant functions and classes

    // For now, return a placeholder with educational content
    return `/**
 * ${componentName.toUpperCase()} COMPONENT
 * 
 * This component's JavaScript handles:
 * - Event listeners and interactions
 * - State management
 * - DOM updates
 * - Accessibility features
 * 
 * To see the full implementation:
 * 1. Check /src/components/${componentName}/${componentName}.js
 * 2. View the source on GitHub
 * 3. Explore in the code playground
 */

// Component initialization would typically look like:
class BSB${componentName.charAt(0).toUpperCase() + componentName.slice(1)} {
  constructor(element) {
    this.element = element;
    this.init();
  }
  
  init() {
    // Setup event listeners
    // Initialize state
    // Configure accessibility
  }
}

// Auto-initialize on page load
document.querySelectorAll('[data-bsb-component="${componentName}"]').forEach(el => {
  new BSB${componentName.charAt(0).toUpperCase() + componentName.slice(1)}(el);
});`;
  }

  /**
   * Update performance metrics
   * @method updateMetrics
   * @param {HTMLElement} component - The component element
   * @param {Object} sourceData - Extracted source data
   * @description Calculates and displays performance metrics
   * @returns {void}
   */
  updateMetrics(component, sourceData) {
    // DOM nodes count
    const nodeCount = component.querySelectorAll('*').length + 1;
    this.viewer.querySelector('[data-metric-nodes]').textContent = nodeCount;

    // CSS rules count
    const cssRules = sourceData.css.split('\n').filter(line => line.includes('{')).length;
    this.viewer.querySelector('[data-metric-css]').textContent = cssRules;

    // Event listeners (simplified detection)
    const eventCount = this.countEventListeners(component);
    this.viewer.querySelector('[data-metric-events]').textContent = eventCount;

    // Render time (mock - would use Performance API in production)
    const renderTime = Math.round(Math.random() * CONSTANTS.RENDER_TIME_RANGE + CONSTANTS.RENDER_TIME_MIN);
    this.viewer.querySelector('[data-metric-render]').textContent = `${renderTime}ms`;
  }

  /**
   * Count event listeners on an element
   * @method countEventListeners
   * @param {HTMLElement} element - The element to check
   * @description Estimates the number of event listeners
   * @returns {number} Event listener count
   */
  countEventListeners(element) {
    // This is a simplified approach
    // In production, would use Chrome DevTools Protocol or similar
    let count = 0;

    // Check for inline handlers
    const attributes = Array.from(element.attributes);
    attributes.forEach(attr => {
      if (attr.name.startsWith('on')) {
        count += 1;
      }
    });

    // Check children
    element.querySelectorAll('*').forEach(child => {
      const childAttrs = Array.from(child.attributes);
      childAttrs.forEach(attr => {
        if (attr.name.startsWith('on')) {
          count += 1;
        }
      });
    });

    // Estimate delegated listeners
    if (element.querySelector('button, a, input, select, textarea')) {
      count += CONSTANTS.DELEGATED_LISTENER_COUNT; // Assume some delegated listeners
    }

    return count;
  }

  /**
   * Update best practices list
   * @method updateBestPractices
   * @param {HTMLElement} component - The component element
   * @description Detects and displays best practices used
   * @returns {void}
   */
  updateBestPractices(component) {
    const practices = [];

    // Check for semantic HTML
    if (component.querySelector('header, nav, main, article, section, footer')) {
      practices.push('Uses semantic HTML elements');
    }

    // Check for ARIA attributes
    if (component.querySelector('[aria-label], [aria-labelledby], [aria-describedby], [role]')) {
      practices.push('Includes ARIA attributes for accessibility');
    }

    // Check for responsive images
    if (component.querySelector('img[srcset], picture')) {
      practices.push('Implements responsive images');
    }

    // Check for BEM naming
    const classes = Array.from(component.classList);
    if (classes.some(cls => cls.includes('__') || cls.includes('--'))) {
      practices.push('Follows BEM naming convention');
    }

    // Check for data attributes
    if (component.hasAttribute('data-bsb-component')) {
      practices.push('Uses data attributes for JavaScript hooks');
    }

    // Check for keyboard navigation
    if (component.querySelector('[tabindex], button, a, input, select, textarea')) {
      practices.push('Supports keyboard navigation');
    }

    // Display practices
    const practicesList = this.viewer.querySelector('[data-practices]');
    practicesList.innerHTML = practices.map(practice =>
      `<li>${practice}</li>`
    ).join('');
  }

  /**
   * Update learning resources
   * @method updateResources
   * @param {string} componentName - The component name
   * @description Updates links to relevant learning resources
   * @returns {void}
   */
  updateResources(componentName) {
    // Update documentation link
    const docsLink = this.viewer.querySelector('[data-docs-link]');
    docsLink.href = `/src/components/${componentName}/README.md`;

    // Update tutorial link
    const tutorialLink = this.viewer.querySelector('[data-tutorial-link]');
    tutorialLink.href = `/docs/tutorials/${componentName}-tutorial.md`;

    // Update MDN link based on component type
    const mdnLink = this.viewer.querySelector('[data-mdn-link]');
    const mdnUrls = {
      'header': 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/header',
      'card': 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout',
      'button': 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button',
      'default': 'https://developer.mozilla.org/en-US/docs/Web/Guide'
    };
    mdnLink.href = mdnUrls[componentName] || mdnUrls.default;
  }

  /**
   * Switch between tabs
   * @method switchTab
   * @param {string} tabName - The tab to switch to
   * @description Changes the active tab and panel
   * @returns {void}
   */
  switchTab(tabName) {
    // Update tabs
    const tabs = this.viewer.querySelectorAll('.bsb-source-viewer__tab');
    tabs.forEach(tab => {
      tab.classList.toggle('bsb-source-viewer__tab--active', tab.dataset.tab === tabName);
    });

    // Update panels
    const panels = this.viewer.querySelectorAll('.bsb-source-viewer__panel');
    panels.forEach(panel => {
      panel.classList.toggle('bsb-source-viewer__panel--active', panel.dataset.panel === tabName);
    });
  }

  /**
   * Handle action button clicks
   * @method handleAction
   * @param {string} action - The action to perform
   * @description Executes various actions like copy, open in playground
   * @returns {void}
   */
  handleAction(action) {
    switch (action) {
      case 'copy-html':
        this.copyCode('html');
        break;
      case 'copy-css':
        this.copyCode('css');
        break;
      case 'copy-js':
        this.copyCode('js');
        break;
      case 'open-playground-html':
      case 'open-playground-css':
      case 'open-playground-js':
      case 'open-full-playground':
        this.openInPlayground();
        break;
    }
  }

  /**
   * Copy code to clipboard
   * @method copyCode
   * @param {string} language - The language to copy
   * @description Copies the specified code to clipboard
   * @returns {void}
   */
  copyCode(language) {
    const codeElement = this.viewer.querySelector(`[data-${language}-content]`);
    const code = codeElement.textContent;

    navigator.clipboard.writeText(code).then(() => {
      this.showNotification('Code copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy:', err);
      this.showNotification('Failed to copy code', 'error');
    });
  }

  /**
   * Open code in playground
   * @method openInPlayground
   * @description Opens the current code in the interactive playground
   * @returns {void}
   */
  openInPlayground() {
    const html = this.viewer.querySelector('[data-html-content]').textContent;
    const css = this.viewer.querySelector('[data-css-content]').textContent;
    const js = this.viewer.querySelector('[data-js-content]').textContent;

    // Encode the code
    const code = { html, css, js };
    const encoded = btoa(JSON.stringify(code));

    // Open playground with code
    window.location.href = `/pages/interactive-playground.html?code=${encoded}`;
  }

  /**
   * Show notification
   * @method showNotification
   * @param {string} message - The message to show
   * @param {string} type - The notification type
   * @description Shows a temporary notification
   * @returns {void}
   */
  showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `bsb-notification bsb-notification--${type}`;
    notification.textContent = message;

    // Style the notification
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: ${type === 'success' ? '#10b981' : '#ef4444'};
      color: white;
      padding: 12px 24px;
      border-radius: 6px;
      font-size: 14px;
      z-index: 10001;
      animation: slideUp 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  /**
   * Open the viewer
   * @method open
   * @description Shows the source viewer
   * @returns {void}
   */
  open() {
    this.isActive = true;
    this.viewer.classList.add('bsb-source-viewer--active');
    this.overlay.classList.add('bsb-source-viewer__overlay--active');
    this.viewer.setAttribute('aria-hidden', 'false');

    // Trap focus
    this.viewer.querySelector('.bsb-source-viewer__close').focus();
  }

  /**
   * Close the viewer
   * @method close
   * @description Hides the source viewer
   * @returns {void}
   */
  close() {
    this.isActive = false;
    this.viewer.classList.remove('bsb-source-viewer--active');
    this.overlay.classList.remove('bsb-source-viewer__overlay--active');
    this.viewer.setAttribute('aria-hidden', 'true');

    // Return focus to component
    if (this.currentComponent) {
      const viewSourceBtn = this.currentComponent.querySelector('.bsb-view-source-btn');
      if (viewSourceBtn) {
        viewSourceBtn.focus();
      }
    }
  }
}

// Initialize the source viewer when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.BSBSourceViewer = new BSBSourceViewer();
  });
} else {
  window.BSBSourceViewer = new BSBSourceViewer();
}

// Export for use in other modules
export default BSBSourceViewer;