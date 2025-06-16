/**
 * =============================================================================
 * BSB HELPER - Development Mode Assistant
 * =============================================================================
 *
 * This script provides interactive documentation and debugging tools
 * when in development mode. It helps developers understand the codebase
 * by providing contextual information about components.
 *
 * 🎯 Features:
 * - Component documentation overlay
 * - Performance metrics
 * - Grid overlay for layout debugging
 * - Component inspector
 *
 * 📚 Learn More:
 * - Developer Tools: /docs/tutorials/dev-tools.md
 * - Component Inspection: /docs/tutorials/component-inspection.md
 *
 * 💡 Enable dev mode: localStorage.setItem('bsb-dev-mode', 'true')
 * =============================================================================
 */

class BSBHelper {
  constructor() {
    this.devMode = localStorage.getItem('bsb-dev-mode') === 'true';
    this.components = new Map();

    if (this.devMode) {
      this.init();
    }
  }

  /**
   * Initialize development helpers
   */
  init() {
    console.log('BSB Dev Mode: Enabled 🛠️');

    // Wait for DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  /**
   * Setup all dev features
   */
  setup() {
    this.findComponents();
    this.createDevPanel();
    this.addComponentHelpers();
    this.setupKeyboardShortcuts();
    this.addGridOverlay();
  }

  /**
   * Find all BSB components on the page
   */
  findComponents() {
    const components = document.querySelectorAll('[data-bsb-component]');

    components.forEach(component => {
      const name = component.dataset.bsbComponent;
      if (!this.components.has(name)) {
        this.components.set(name, []);
      }
      this.components.get(name).push(component);
    });

    console.log(`BSB Dev Mode: Found ${components.length} components`);
  }

  /**
   * Create floating dev panel
   */
  createDevPanel() {
    const panel = document.createElement('div');
    panel.className = 'bsb-dev-panel';
    panel.innerHTML = `
      <div class="bsb-dev-panel__header">
        <h5>BSB Dev Mode</h5>
        <button class="bsb-dev-panel__close" aria-label="Close dev panel">×</button>
      </div>
      <div class="bsb-dev-panel__content">
        <div class="bsb-dev-panel__section">
          <h6>Page Info</h6>
          <p>Components: <span class="bsb-dev-panel__component-count">${this.components.size}</span></p>
          <p>Load Time: <span class="bsb-dev-panel__load-time">-</span>ms</p>
        </div>
        <div class="bsb-dev-panel__section">
          <h6>Quick Actions</h6>
          <button class="bsb-dev-panel__action" data-action="toggle-grid">
            Toggle Grid (G)
          </button>
          <button class="bsb-dev-panel__action" data-action="toggle-helpers">
            Toggle Helpers (H)
          </button>
          <button class="bsb-dev-panel__action" data-action="inspect">
            Inspect Mode (I)
          </button>
        </div>
        <div class="bsb-dev-panel__section">
          <h6>Documentation</h6>
          <a href="/src/README.md" target="_blank">Source Docs</a>
          <a href="/docs/tutorials/" target="_blank">Tutorials</a>
          <a href="/docs/api/" target="_blank">API Reference</a>
        </div>
      </div>
    `;

    document.body.appendChild(panel);

    // Add styles
    this.addDevStyles();

    // Setup panel interactions
    this.setupPanelInteractions(panel);

    // Update load time
    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      panel.querySelector('.bsb-dev-panel__load-time').textContent = Math.round(loadTime);
    });
  }

  /**
   * Add helper buttons to components
   */
  addComponentHelpers() {
    this.components.forEach((elements, name) => {
      elements.forEach(element => {
        const helper = document.createElement('button');
        helper.className = 'bsb-dev-helper';
        helper.setAttribute('aria-label', `View ${name} component docs`);
        helper.innerHTML = '?';
        helper.addEventListener('click', (e) => {
          e.stopPropagation();
          this.showComponentDocs(name, element);
        });

        element.style.position = 'relative';
        element.appendChild(helper);
      });
    });
  }

  /**
   * Show component documentation
   */
  showComponentDocs(componentName, element) {
    const modal = document.createElement('div');
    modal.className = 'bsb-dev-modal';
    modal.innerHTML = `
      <div class="bsb-dev-modal__content">
        <h3>${componentName} Component</h3>
        <div class="bsb-dev-modal__info">
          <h4>Location</h4>
          <p><code>/src/components/${componentName}/</code></p>
          
          <h4>Files</h4>
          <ul>
            <li><code>${componentName}.html</code> - HTML structure</li>
            <li><code>${componentName}.css</code> - Styles</li>
            <li><code>${componentName}.js</code> - JavaScript (if applicable)</li>
            <li><code>README.md</code> - Documentation</li>
          </ul>
          
          <h4>CSS Classes</h4>
          <p>${Array.from(element.classList).map(c => `<code>.${c}</code>`).join(', ')}</p>
          
          <h4>Attributes</h4>
          <ul>
            ${Array.from(element.attributes).map(attr =>
    `<li><code>${attr.name}="${attr.value}"</code></li>`
  ).join('')}
          </ul>
        </div>
        <div class="bsb-dev-modal__actions">
          <a href="/src/components/${componentName}/README.md" target="_blank" class="btn btn--primary">
            View Docs
          </a>
          <button class="btn btn--secondary" onclick="this.closest('.bsb-dev-modal').remove()">
            Close
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  /**
   * Setup keyboard shortcuts
   */
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Only in dev mode
      if (!this.devMode) {
        return;
      }

      // Ctrl/Cmd + key combinations
      if (e.ctrlKey || e.metaKey) {
        switch(e.key.toLowerCase()) {
        case 'g':
          e.preventDefault();
          this.toggleGrid();
          break;
        case 'h':
          e.preventDefault();
          this.toggleHelpers();
          break;
        case 'i':
          e.preventDefault();
          this.toggleInspectMode();
          break;
        case 'd':
          e.preventDefault();
          this.toggleDevPanel();
          break;
        }
      }
    });
  }

  /**
   * Add grid overlay for layout debugging
   */
  addGridOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'bsb-grid-overlay';
    overlay.innerHTML = '<div class="container"><div class="bsb-grid-overlay__grid"></div></div>';
    document.body.appendChild(overlay);
  }

  /**
   * Toggle grid visibility
   */
  toggleGrid() {
    document.body.classList.toggle('bsb-show-grid');
  }

  /**
   * Toggle component helpers
   */
  toggleHelpers() {
    document.body.classList.toggle('bsb-show-helpers');
  }

  /**
   * Toggle inspect mode
   */
  toggleInspectMode() {
    document.body.classList.toggle('bsb-inspect-mode');

    if (document.body.classList.contains('bsb-inspect-mode')) {
      this.startInspecting();
    } else {
      this.stopInspecting();
    }
  }

  /**
   * Toggle dev panel visibility
   */
  toggleDevPanel() {
    const panel = document.querySelector('.bsb-dev-panel');
    if (panel) {
      panel.classList.toggle('bsb-dev-panel--hidden');
    }
  }

  /**
   * Start component inspection
   */
  startInspecting() {
    document.addEventListener('click', this.inspectHandler);
    document.addEventListener('mouseover', this.highlightHandler);
  }

  /**
   * Stop component inspection
   */
  stopInspecting() {
    document.removeEventListener('click', this.inspectHandler);
    document.removeEventListener('mouseover', this.highlightHandler);

    // Remove any highlights
    document.querySelectorAll('.bsb-highlight').forEach(el => {
      el.classList.remove('bsb-highlight');
    });
  }

  /**
   * Handle inspection clicks
   */
  inspectHandler = (e) => {
    const component = e.target.closest('[data-bsb-component]');
    if (component) {
      e.preventDefault();
      e.stopPropagation();
      const name = component.dataset.bsbComponent;
      this.showComponentDocs(name, component);
    }
  };

  /**
   * Handle hover highlighting
   */
  highlightHandler = (e) => {
    // Remove previous highlights
    document.querySelectorAll('.bsb-highlight').forEach(el => {
      el.classList.remove('bsb-highlight');
    });

    const component = e.target.closest('[data-bsb-component]');
    if (component) {
      component.classList.add('bsb-highlight');
    }
  };

  /**
   * Setup panel interactions
   */
  setupPanelInteractions(panel) {
    // Close button
    panel.querySelector('.bsb-dev-panel__close').addEventListener('click', () => {
      this.toggleDevPanel();
    });

    // Action buttons
    panel.querySelectorAll('.bsb-dev-panel__action').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        switch(action) {
        case 'toggle-grid':
          this.toggleGrid();
          break;
        case 'toggle-helpers':
          this.toggleHelpers();
          break;
        case 'inspect':
          this.toggleInspectMode();
          break;
        }
      });
    });
  }

  /**
   * Add development styles
   */
  addDevStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Dev Panel */
      .bsb-dev-panel {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 300px;
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-size: 14px;
        transition: transform 0.3s ease;
      }
      
      .bsb-dev-panel--hidden {
        transform: translateX(320px);
      }
      
      .bsb-dev-panel__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        border-bottom: 1px solid #e0e0e0;
        background: #f5f5f5;
        border-radius: 8px 8px 0 0;
      }
      
      .bsb-dev-panel__header h5 {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
      }
      
      .bsb-dev-panel__close {
        width: 24px;
        height: 24px;
        border: none;
        background: none;
        font-size: 20px;
        cursor: pointer;
        opacity: 0.5;
        transition: opacity 0.2s;
      }
      
      .bsb-dev-panel__close:hover {
        opacity: 1;
      }
      
      .bsb-dev-panel__content {
        padding: 16px;
      }
      
      .bsb-dev-panel__section {
        margin-bottom: 16px;
      }
      
      .bsb-dev-panel__section:last-child {
        margin-bottom: 0;
      }
      
      .bsb-dev-panel__section h6 {
        margin: 0 0 8px 0;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        color: #666;
      }
      
      .bsb-dev-panel__section p {
        margin: 4px 0;
        font-size: 13px;
      }
      
      .bsb-dev-panel__section a {
        display: block;
        margin: 4px 0;
        color: #007bff;
        text-decoration: none;
      }
      
      .bsb-dev-panel__action {
        display: block;
        width: 100%;
        padding: 8px 12px;
        margin: 4px 0;
        border: 1px solid #e0e0e0;
        background: white;
        font-size: 13px;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .bsb-dev-panel__action:hover {
        background: #f5f5f5;
      }
      
      /* Component Helpers */
      .bsb-dev-helper {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 24px;
        height: 24px;
        border: none;
        background: #007bff;
        color: white;
        font-size: 14px;
        font-weight: bold;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s;
        z-index: 100;
      }
      
      .bsb-show-helpers .bsb-dev-helper,
      [data-bsb-component]:hover .bsb-dev-helper {
        opacity: 1;
      }
      
      /* Grid Overlay */
      .bsb-grid-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        z-index: 9999;
        display: none;
      }
      
      .bsb-show-grid .bsb-grid-overlay {
        display: block;
      }
      
      .bsb-grid-overlay__grid {
        height: 100vh;
        background-image: repeating-linear-gradient(
          90deg,
          rgba(255, 0, 0, 0.1) 0,
          rgba(255, 0, 0, 0.1) 1px,
          transparent 1px,
          transparent 8px
        );
      }
      
      /* Inspect Mode */
      .bsb-inspect-mode * {
        cursor: crosshair !important;
      }
      
      .bsb-highlight {
        outline: 2px solid #007bff !important;
        outline-offset: 2px;
      }
      
      /* Dev Modal */
      .bsb-dev-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10001;
      }
      
      .bsb-dev-modal__content {
        background: white;
        padding: 32px;
        border-radius: 8px;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
      }
      
      .bsb-dev-modal__content h3 {
        margin-top: 0;
      }
      
      .bsb-dev-modal__info h4 {
        margin-top: 24px;
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 600;
      }
      
      .bsb-dev-modal__actions {
        margin-top: 32px;
        display: flex;
        gap: 12px;
      }
      
      /* Dark mode support */
      [data-bsb-theme="dark"] .bsb-dev-panel,
      [data-bsb-theme="dark"] .bsb-dev-modal__content {
        background: #1a1a1a;
        color: #e0e0e0;
        border-color: #333;
      }
      
      [data-bsb-theme="dark"] .bsb-dev-panel__header {
        background: #2a2a2a;
        border-color: #333;
      }
      
      [data-bsb-theme="dark"] .bsb-dev-panel__action {
        background: #2a2a2a;
        color: #e0e0e0;
        border-color: #333;
      }
    `;

    document.head.appendChild(style);
  }
}

// Initialize BSB Helper
const bsbHelper = new BSBHelper();

// Export for use in other scripts
window.BSBHelper = bsbHelper;

/**
 * Enable learning mode for educational tooltips
 */
window.enableLearningMode = function() {
  localStorage.setItem('bsb-dev-mode', 'true');

  // Show a notification
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--bsb-primary);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: var(--bsb-radius-base);
    z-index: 1000;
    font-size: var(--bsb-text-sm);
    box-shadow: var(--bsb-shadow-lg);
  `;
  notification.textContent = '🎓 Learning mode enabled! Refresh to see interactive tooltips.';

  document.body.appendChild(notification);

  // Auto-remove notification after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
};