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

import { extractComponentSource } from './modules/source-extractor.js';
import {
  getViewerTemplate,
  updateViewerContent,
  switchTab,
  showViewer,
  hideViewer,
  copyToClipboard,
  downloadSource,
  addViewSourceButton
} from './modules/viewer-ui.js';
import { injectViewerStyles } from './modules/viewer-styles.js';

// Constants
const CONSTANTS = {
  NOTIFICATION_DURATION: 3000
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
    this.currentComponent = null;
    this.isActive = false;
    this.currentTab = 'html';

    this.init();
  }

  /**
   * Initialize the source viewer
   * @method init
   * @description Sets up the viewer and adds it to the page
   * @returns {void}
   */
  init() {
    injectViewerStyles();
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
    const viewerHTML = getViewerTemplate();
    const container = document.createElement('div');
    container.innerHTML = viewerHTML;
    this.viewer = container.firstElementChild;
    document.body.appendChild(this.viewer);
  }

  /**
   * Setup event listeners
   * @method setupEventListeners
   * @description Configures all event handlers for the viewer
   * @returns {void}
   */
  setupEventListeners() {
    // Action handlers
    this.viewer.addEventListener('click', event => {
      const { action } = event.target.dataset;
      if (action) {
        this.handleAction(action, event);
      }
    });

    // Tab switching
    this.viewer.addEventListener('click', event => {
      if (event.target.matches('.bsb-source-viewer__tab')) {
        const tabName = event.target.dataset.tab;
        this.switchTab(tabName);
      }
    });

    // Escape key
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && this.isActive) {
        this.close();
      }
    });

    // Backdrop click
    this.viewer.addEventListener('click', event => {
      if (event.target.matches('.bsb-source-viewer__backdrop')) {
        this.close();
      }
    });
  }

  /**
   * Add view source buttons to components
   * @method addViewSourceButtons
   * @description Adds view source buttons to all BSB components
   * @returns {void}
   */
  addViewSourceButtons() {
    // Only show in learning mode
    if (localStorage.getItem('bsb-learning-mode') !== 'true') {
      return;
    }

    const components = document.querySelectorAll('[data-bsb-component]');
    components.forEach(component => {
      const button = addViewSourceButton(component);
      if (button) {
        button.addEventListener('click', event => {
          event.stopPropagation();
          this.showComponentSource(component);
        });
      }
    });
  }

  /**
   * Show source code for a component
   * @method showComponentSource
   * @param {HTMLElement} component - Component to show source for
   */
  showComponentSource(component) {
    this.currentComponent = component;

    // Extract source code
    const sourceData = extractComponentSource(component);

    // Update viewer content
    updateViewerContent(sourceData);

    // Show the viewer
    this.show();
  }

  /**
   * Switch between tabs
   * @method switchTab
   * @param {string} tabName - Name of tab to switch to
   */
  switchTab(tabName) {
    this.currentTab = tabName;
    switchTab(tabName);
  }

  /**
   * Handle action button clicks
   * @method handleAction
   * @param {string} action - Action to perform
   * @param {Event} event - Click event
   */
  handleAction(action, event) {
    switch (action) {
      case 'close':
        this.close();
        break;
      case 'copy-all':
        this.copyAll();
        break;
      case 'copy':
        this.copyCurrentTab();
        break;
      case 'download':
        this.download();
        break;
      case 'playground':
        this.openInPlayground();
        break;
      default:
        // Handle specific copy actions
        if (action.startsWith('copy-')) {
          const type = action.replace('copy-', '');
          this.copyCode(type);
        }
        break;
    }
  }

  /**
   * Copy code of specific type
   * @method copyCode
   * @param {string} type - Type of code (html, css, js)
   */
  copyCode(type) {
    if (!this.currentComponent) {return;}

    const sourceData = extractComponentSource(this.currentComponent);
    const code = sourceData[type];

    if (code) {
      copyToClipboard(code, type);
    }
  }

  /**
   * Copy all source code
   * @method copyAll
   */
  copyAll() {
    if (!this.currentComponent) {return;}

    const sourceData = extractComponentSource(this.currentComponent);
    const allCode = `<!-- HTML -->\n${sourceData.html}\n\n/* CSS */\n${sourceData.css}\n\n// JavaScript\n${sourceData.js}`;

    copyToClipboard(allCode, 'all');
  }

  /**
   * Copy current tab's code
   * @method copyCurrentTab
   */
  copyCurrentTab() {
    this.copyCode(this.currentTab);
  }

  /**
   * Download source files
   * @method download
   */
  download() {
    if (!this.currentComponent) {return;}

    const sourceData = extractComponentSource(this.currentComponent);
    downloadSource(sourceData);
  }

  /**
   * Open in code playground
   * @method openInPlayground
   */
  openInPlayground() {
    if (!this.currentComponent) {return;}

    const sourceData = extractComponentSource(this.currentComponent);

    // Trigger playground open event
    document.dispatchEvent(new CustomEvent('open-playground', {
      detail: sourceData
    }));

    this.close();
  }

  /**
   * Show the viewer
   * @method show
   */
  show() {
    this.isActive = true;
    showViewer(this.viewer);
  }

  /**
   * Close the viewer
   * @method close
   */
  close() {
    this.isActive = false;
    hideViewer(this.viewer);
    this.currentComponent = null;
  }

  /**
   * Check if viewer is currently active
   * @method isOpen
   * @returns {boolean} Whether viewer is open
   */
  isOpen() {
    return this.isActive;
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.bsbSourceViewer = new BSBSourceViewer();
  });
} else {
  window.bsbSourceViewer = new BSBSourceViewer();
}

// Export for use in other modules
export default BSBSourceViewer;