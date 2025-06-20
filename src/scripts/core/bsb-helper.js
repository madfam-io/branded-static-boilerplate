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

import { debug } from './debug.js';
import { findComponents, addComponentHelpers, showComponentDocs } from './helpers/component-manager.js';
import { createDevPanel, toggleDevPanel } from './helpers/dev-panel.js';
import { addGridOverlay, toggleGrid, toggleHelpers, InspectionHandler } from './helpers/inspection-tools.js';
import { setupKeyboardShortcuts } from './helpers/keyboard-shortcuts.js';
import { addDevStyles } from './helpers/dev-styles.js';
import { enableLearningMode, disableLearningMode, disableDevFeatures } from './helpers/learning-mode.js';

/**
 * BSB Helper - Development Mode Assistant
 * @class BSBHelper
 * @description Provides interactive documentation and debugging tools for BSB development
 */
class BSBHelper {
  /**
   * Create a BSBHelper instance
   * @constructor
   */
  constructor() {
    this.devMode = localStorage.getItem('bsb-dev-mode') === 'true';
    this.components = new Map();
    this.inspectionHandler = null;
    this.keydownHandler = null;

    if (this.devMode) {
      this.init();
    }
  }

  /**
   * Initialize development helpers
   * @method init
   * @description Sets up all development tools and features
   * @returns {void}
   */
  init() {
    debug.log('BSB Dev Mode: Enabled 🛠️');

    // Wait for DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  /**
   * Setup all dev features
   * @method setup
   * @description Orchestrates the setup of all development features
   * @returns {void}
   */
  setup() {
    findComponents(this.components);
    addDevStyles();
    createDevPanel(this.components, this.getActionHandlers());
    addComponentHelpers(this.components, showComponentDocs);
    this.keydownHandler = setupKeyboardShortcuts(this.devMode, this.getActionHandlers());
    addGridOverlay();
    this.inspectionHandler = new InspectionHandler(showComponentDocs);
  }

  /**
   * Get action handlers for UI components
   * @method getActionHandlers
   * @returns {Object} Action handlers
   */
  getActionHandlers() {
    return {
      toggleGrid,
      toggleHelpers,
      toggleDevPanel,
      toggleInspectMode: () => this.toggleInspectMode()
    };
  }

  /**
   * Toggle inspect mode
   * @method toggleInspectMode
   * @description Enables or disables component inspection mode
   * @returns {void}
   */
  toggleInspectMode() {
    document.body.classList.toggle('bsb-inspect-mode');

    if (document.body.classList.contains('bsb-inspect-mode')) {
      this.inspectionHandler.start();
    } else {
      this.inspectionHandler.stop();
    }
  }

  /**
   * Toggle grid overlay
   * @method toggleGrid
   * @description Shows or hides the CSS grid overlay
   * @returns {void}
   */
  toggleGrid() {
    toggleGrid();
  }

  /**
   * Disable learning mode and clean up features
   * @method disable
   * @description Removes all development mode features and UI elements
   * @returns {void}
   */
  disable() {
    disableDevFeatures(this.components);

    // Remove event listeners
    if (this.keydownHandler) {
      document.removeEventListener('keydown', this.keydownHandler);
    }

    if (this.inspectionHandler) {
      this.inspectionHandler.stop();
    }

    debug.log('🎓 BSB Learning mode disabled');
  }
}

// Initialize BSB Helper
const bsbHelper = new BSBHelper();

// Export for use in other scripts
window.BSBHelper = bsbHelper;
window.enableLearningMode = enableLearningMode;
window.disableLearningMode = disableLearningMode;