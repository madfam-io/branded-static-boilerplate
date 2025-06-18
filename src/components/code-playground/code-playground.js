/**
 * ============================================================================
 * BSB CODE PLAYGROUND COMPONENT
 * ============================================================================
 *
 * Interactive code editing component with live preview capabilities.
 * Provides real-time HTML, CSS, and JavaScript editing with immediate feedback.
 *
 * Features:
 * - Live code editing with syntax highlighting
 * - Real-time preview updates
 * - Error handling and console output
 * - Performance metrics
 * - Accessibility support
 * - Keyboard shortcuts
 * - Code sharing functionality
 *
 * Educational Features:
 * - Progressive difficulty levels
 * - Guided tutorials
 * - Code completion hints
 * - Best practices suggestions
 * - Performance monitoring
 *
 * @class BSBCodePlayground
 * @version 1.0.0
 */

import debug from '../../scripts/core/debug.js';

// Constants
const CONSTANTS = {
  TAB_SIZE: 2,
  DEBOUNCE_DELAY: 500,
  CONSOLE_SCROLL_THRESHOLD: 50,
  AUTO_SAVE_INTERVAL: 60000, // 1 minute
  PERFORMANCE_SAMPLE_SIZE: 100,
  HOURS_PER_DAY: 24,
  MINUTES_PER_HOUR: 60,
  SECONDS_PER_MINUTE: 60,
  MS_PER_SECOND: 1000,
  FOCUS_DELAY: 100,
  MAX_CONSOLE_MESSAGES: 50,
  MAX_CODE_AGE_HOURS: 24
};

/**
 * BSB Code Playground Class
 * @class BSBCodePlayground
 * @description Main class for managing interactive code playground functionality
 */
class BSBCodePlayground {
  /**
   * Create a code playground instance
   * @constructor
   * @param {HTMLElement} element - The playground container element
   */
  constructor(element) {
    this.element = element;
    this.editors = new Map();
    this.currentTab = 'html';
    this.previewFrame = null;
    this.consoleContainer = null;
    this.metrics = new Map();
    this.isFullscreen = false;
    this.autoSave = true;
    this.debounceTimeout = null;

    this.init();
  }

  /**
   * Initialize the playground
   * @method init
   * @description Sets up all playground functionality and event listeners
   * @returns {void}
   */
  init() {
    this.setupElements();
    this.setupEventListeners();
    this.setupEditors();
    this.setupKeyboardShortcuts();
    this.loadSavedCode();
    this.updatePreview();

    // Initialization complete - logging disabled for production
  }

  /**
   * Setup DOM element references
   * @method setupElements
   * @description Caches references to important DOM elements
   * @returns {void}
   */
  setupElements() {
    this.tabs = this.element.querySelectorAll('.bsb-code-playground__tab');
    this.panels = this.element.querySelectorAll('.bsb-code-playground__panel');
    this.previewFrame = this.element.querySelector('.bsb-code-playground__preview');
    this.consoleContainer = this.element.querySelector('.bsb-code-playground__console');
    this.loadingIndicator = this.element.querySelector('.bsb-code-playground__preview-loading');

    // Cache editor textareas
    this.editors.set('html', this.element.querySelector('#html-editor'));
    this.editors.set('css', this.element.querySelector('#css-editor'));
    this.editors.set('js', this.element.querySelector('#js-editor'));
  }

  /**
   * Setup event listeners
   * @method setupEventListeners
   * @description Configures all event handlers for the playground
   * @returns {void}
   */
  setupEventListeners() {
    // Tab switching
    this.tabs.forEach(tab => {
      tab.addEventListener('click', event => this.switchTab(event.target.dataset.tab));
    });

    // Control buttons
    this.element.addEventListener('click', event => {
      const { action } = event.target.dataset;
      if (action) {
        this.handleAction(action);
      }
    });

    // Editor changes
    this.editors.forEach((editor, language) => {
      editor.addEventListener('input', () => {
        this.onCodeChange(language);
      });

      editor.addEventListener('keydown', event => {
        this.handleEditorKeydown(event, language);
      });
    });

    // Window events
    window.addEventListener('beforeunload', () => {
      this.saveCode();
    });
  }

  /**
   * Setup code editors
   * @method setupEditors
   * @description Initializes code editors with syntax highlighting preparation
   * @returns {void}
   */
  setupEditors() {
    this.editors.forEach((editor, language) => {
      // Add line numbers and syntax highlighting classes
      editor.classList.add(`language-${language}`);

      // Configure editor settings
      editor.addEventListener('keydown', event => {
        // Tab key handling for indentation
        if (event.key === 'Tab') {
          event.preventDefault();
          const start = editor.selectionStart;
          const end = editor.selectionEnd;

          if (event.shiftKey) {
            // Unindent
            const lineStart = editor.value.lastIndexOf('\n', start - 1) + 1;
            const lineText = editor.value.substring(lineStart, start);
            if (lineText.startsWith('  ')) {
              editor.value = editor.value.substring(0, lineStart) +
                           lineText.substring(CONSTANTS.TAB_SIZE) +
                           editor.value.substring(start);
              editor.selectionStart = start - CONSTANTS.TAB_SIZE;
              editor.selectionEnd = start - CONSTANTS.TAB_SIZE;
            }
          } else {
            // Indent
            editor.value = `${editor.value.substring(0, start)}  ${editor.value.substring(end)}`;
            editor.selectionStart = start + CONSTANTS.TAB_SIZE;
            editor.selectionEnd = start + CONSTANTS.TAB_SIZE;
          }
        }
      });
    });
  }

  /**
   * Setup keyboard shortcuts
   * @method setupKeyboardShortcuts
   * @description Configures global keyboard shortcuts for the playground
   * @returns {void}
   */
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', event => {
      // Only handle shortcuts when playground is focused
      if (!this.element.contains(document.activeElement)) {
        return;
      }

      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'Enter':
            event.preventDefault();
            this.updatePreview();
            break;
          case 's':
            event.preventDefault();
            this.saveCode();
            this.showConsoleMessage('💾 Code saved!', 'info');
            break;
          case '1':
          case '2':
          case '3': {
            event.preventDefault();
            const tabIndex = parseInt(event.key, 10);
            const [htmlTab, cssTab, jsTab] = ['html', 'css', 'js'];
            const selectedTab = [htmlTab, cssTab, jsTab][tabIndex - 1];
            if (selectedTab) {
              this.switchTab(selectedTab);
            }
            break;
          }
          default:
            // Other key combinations are ignored
            break;
        }
      }

      // Escape key handling
      if (event.key === 'Escape' && this.isFullscreen) {
        this.toggleFullscreen();
      }
    });
  }

  /**
   * Handle tab switching
   * @method switchTab
   * @param {string} tabName - The tab to switch to ('html', 'css', 'js')
   * @description Switches between code editor tabs
   * @returns {void}
   */
  switchTab(tabName) {
    if (tabName && this.currentTab !== tabName) {
      this.performTabSwitch(tabName);
    }
  }

  /**
   * Perform the actual tab switch
   * @param {string} tabName - Name of the tab to switch to
   */
  performTabSwitch(tabName) {

    // Update tab states
    this.tabs.forEach(tab => {
      const isActive = tab.dataset.tab === tabName;
      tab.classList.toggle('bsb-code-playground__tab--active', isActive);
      tab.setAttribute('aria-selected', isActive);
    });

    // Update panel states
    this.panels.forEach(panel => {
      const isActive = panel.dataset.panel === tabName;
      panel.classList.toggle('bsb-code-playground__panel--active', isActive);
    });

    this.currentTab = tabName;

    // Focus the active editor
    const activeEditor = this.editors.get(tabName);
    if (activeEditor) {
      setTimeout(() => activeEditor.focus(), CONSTANTS.FOCUS_DELAY);
    }
  }

  /**
   * Handle control actions
   * @method handleAction
   * @param {string} action - The action to perform
   * @description Handles clicks on control buttons
   * @returns {void}
   */
  handleAction(action) {
    switch (action) {
      case 'reset':
        this.resetCode();
        break;
      case 'fullscreen':
        this.toggleFullscreen();
        break;
      case 'share':
        this.shareCode();
        break;
      case 'run':
        this.updatePreview();
        break;
      case 'refresh':
        this.updatePreview();
        break;
      case 'new-window':
        this.openInNewWindow();
        break;
      default:
        // Unknown action - no operation needed
        break;
    }
  }

  /**
   * Handle code changes
   * @method onCodeChange
   * @param {string} _language - The language that changed (unused but required for API consistency)
   * @description Handles live code updates with debouncing
   * @returns {void}
   */
  onCodeChange(_language) {
    // Update metrics
    this.updateMetrics();

    // Debounced preview update
    clearTimeout(this.debounceTimeout);
    this.debounceTimeout = setTimeout(() => {
      this.updatePreview();
      if (this.autoSave) {
        this.saveCode();
      }
    }, CONSTANTS.DEBOUNCE_DELAY);
  }

  /**
   * Handle editor keydown events
   * @method handleEditorKeydown
   * @param {KeyboardEvent} event - The keyboard event
   * @param {string} language - The editor language
   * @description Handles special keydown events in editors
   * @returns {void}
   */
  handleEditorKeydown(event, language) {
    // Auto-closing brackets and quotes
    const editor = this.editors.get(language);
    const pairs = {
      '(': ')',
      '[': ']',
      '{': '}',
      '"': '"',
      "'": "'"
    };

    if (pairs[event.key]) {
      const start = editor.selectionStart;
      const end = editor.selectionEnd;

      if (start === end) {
        event.preventDefault();
        const closingChar = pairs[event.key];
        editor.value = editor.value.substring(0, start) +
                      event.key + closingChar +
                      editor.value.substring(end);
        editor.selectionStart = start + 1;
        editor.selectionEnd = start + 1;
      }
    }
  }

  /**
   * Update the live preview
   * @method updatePreview
   * @description Generates and displays the live preview of the code
   * @returns {void}
   */
  async updatePreview() {
    const startTime = performance.now();
    this.showLoading();

    try {
      const html = this.editors.get('html').value;
      const css = this.editors.get('css').value;
      const js = this.editors.get('js').value;

      // Create preview document
      const previewDoc = await this.generatePreviewDocument(html, css, js);

      // Update iframe
      const iframe = this.previewFrame;
      iframe.srcdoc = previewDoc;

      // Handle iframe load
      iframe.onload = () => {
        const endTime = performance.now();
        const renderTime = Math.round(endTime - startTime);

        this.hideLoading();
        this.updateMetric('render', `${renderTime}ms`);
        this.showConsoleMessage(`✅ Preview updated in ${renderTime}ms`, 'info');

        // Setup console capture in iframe
        this.setupConsoleCapture(iframe);
      };

      iframe.onerror = error => {
        this.hideLoading();
        this.showConsoleMessage(`❌ Preview error: ${error.message}`, 'error');
      };

    } catch (error) {
      this.hideLoading();
      this.showConsoleMessage(`❌ Preview error: ${error.message}`, 'error');
    }
  }

  /**
   * Generate preview document
   * @method generatePreviewDocument
   * @param {string} html - HTML content
   * @param {string} css - CSS content
   * @param {string} js - JavaScript content
   * @description Creates a complete HTML document for the preview
   * @returns {string} Complete HTML document
   */
  async generatePreviewDocument(html, css, js) {
    const { generatePreviewDocument } = await import('./preview-document-generator.js');
    return generatePreviewDocument(html, css, js);
  }

  /**
   * Setup console capture from iframe
   * @method setupConsoleCapture
   * @param {HTMLIFrameElement} iframe - The preview iframe
   * @description Sets up message handling for console output from preview
   * @returns {void}
   */
  setupConsoleCapture(iframe) {
    const messageHandler = event => {
      if (event.source === iframe.contentWindow && event.data.type === 'console') {
        const { method, message } = event.data;
        const type = method === 'log' ? 'info' : method;
        this.showConsoleMessage(message, type);
      }
    };

    window.addEventListener('message', messageHandler);

    // Clean up old listeners
    if (this.consoleMessageHandler) {
      window.removeEventListener('message', this.consoleMessageHandler);
    }
    this.consoleMessageHandler = messageHandler;
  }

  /**
   * Show console message
   * @method showConsoleMessage
   * @param {string} message - The message to show
   * @param {string} type - Message type ('info', 'warn', 'error')
   * @description Displays a message in the console area
   * @returns {void}
   */
  showConsoleMessage(message, type = 'info') {
    const messageElement = document.createElement('div');
    messageElement.className =
      `bsb-code-playground__console-message bsb-code-playground__console-message--${type}`;

    const icons = {
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌'
    };

    const time = new Date().toLocaleTimeString();

    messageElement.innerHTML = `
      <span class="bsb-code-playground__console-icon">${icons[type] || 'ℹ️'}</span>
      <span class="bsb-code-playground__console-text">${message}</span>
      <span class="bsb-code-playground__console-time">${time}</span>
    `;

    this.consoleContainer.appendChild(messageElement);
    this.consoleContainer.scrollTop = this.consoleContainer.scrollHeight;

    // Limit console messages
    const messages = this.consoleContainer.children;
    if (messages.length > CONSTANTS.MAX_CONSOLE_MESSAGES) {
      const [firstMessage] = messages;
      this.consoleContainer.removeChild(firstMessage);
    }
  }

  /**
   * Update metrics display
   * @method updateMetrics
   * @description Updates the metrics display with current code statistics
   * @returns {void}
   */
  updateMetrics() {
    let totalLines = 0;
    let totalSize = 0;

    this.editors.forEach(editor => {
      const content = editor.value;
      totalLines += content.split('\n').length;
      totalSize += new Blob([content]).size;
    });

    this.updateMetric('lines', totalLines.toString());
    this.updateMetric('size', this.formatBytes(totalSize));
  }

  /**
   * Update specific metric
   * @method updateMetric
   * @param {string} metric - The metric name
   * @param {string} value - The metric value
   * @description Updates a specific metric display
   * @returns {void}
   */
  updateMetric(metric, value) {
    const metricElement = this.element.querySelector(`[data-metric="${metric}"]`);
    if (metricElement) {
      metricElement.textContent = value;
    }
  }

  /**
   * Format bytes to human readable
   * @method formatBytes
   * @param {number} bytes - Number of bytes
   * @description Converts bytes to human-readable format
   * @returns {string} Formatted bytes string
   */
  formatBytes(bytes) {
    if (bytes === 0) {
      return '0b';
    }
    const kilobyte = 1024;
    const sizes = ['b', 'kb', 'mb'];
    const sizeIndex = Math.floor(Math.log(bytes) / Math.log(kilobyte));
    return parseFloat((bytes / kilobyte**sizeIndex).toFixed(1)) + sizes[sizeIndex];
  }

  /**
   * Show loading indicator
   * @method showLoading
   * @description Shows the preview loading indicator
   * @returns {void}
   */
  showLoading() {
    if (this.loadingIndicator) {
      this.loadingIndicator.classList.add('bsb-code-playground__preview-loading--visible');
    }
  }

  /**
   * Hide loading indicator
   * @method hideLoading
   * @description Hides the preview loading indicator
   * @returns {void}
   */
  hideLoading() {
    if (this.loadingIndicator) {
      this.loadingIndicator.classList.remove('bsb-code-playground__preview-loading--visible');
    }
  }

  /**
   * Reset code to defaults
   * @method resetCode
   * @description Resets all editors to their default content
   * @returns {void}
   */
  resetCode() {
    this.showResetConfirmation();
  }

  /**
   * Show reset confirmation dialog
   * @method showResetConfirmation
   * @description Shows a custom confirmation dialog for code reset
   * @returns {void}
   */
  async showResetConfirmation() {
    const { showResetConfirmation } = await import('./reset-confirmation-dialog.js');
    
    showResetConfirmation(() => {
      // Reset to original values from HTML
      this.editors.forEach(editor => {
        const originalContent = editor.defaultValue || editor.getAttribute('data-original');
        if (originalContent) {
          editor.value = originalContent;
        }
      });

      this.updatePreview();
      this.updateMetrics();
      this.showConsoleMessage('🔄 Code reset to defaults', 'info');
    });
  }

  /**
   * Toggle fullscreen mode
   * @method toggleFullscreen
   * @description Toggles the playground fullscreen mode
   * @returns {void}
   */
  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
    this.element.classList.toggle('bsb-code-playground--fullscreen', this.isFullscreen);

    const button = this.element.querySelector('[data-action="fullscreen"]');
    if (button) {
      button.textContent = this.isFullscreen ? '🗗 Exit Fullscreen' : '🖥️ Fullscreen';
    }

    if (this.isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  /**
   * Share code functionality
   * @method shareCode
   * @description Creates a shareable link for the current code
   * @returns {void}
   */
  shareCode() {
    const code = {
      html: this.editors.get('html').value,
      css: this.editors.get('css').value,
      js: this.editors.get('js').value
    };

    // Encode the code for URL sharing
    const encodedCode = btoa(JSON.stringify(code));
    const shareUrl = `${window.location.origin}${window.location.pathname}?code=${encodedCode}`;

    if (navigator.share) {
      navigator.share({
        title: 'BSB Code Playground',
        text: 'Check out my code!',
        url: shareUrl
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(shareUrl).then(() => {
        this.showConsoleMessage('📤 Share link copied to clipboard!', 'info');
      }).catch(() => {
        this.showConsoleMessage('❌ Could not copy share link', 'error');
      });
    }
  }

  /**
   * Open preview in new window
   * @method openInNewWindow
   * @description Opens the current preview in a new browser window
   * @returns {void}
   */
  openInNewWindow() {
    const html = this.editors.get('html').value;
    const css = this.editors.get('css').value;
    const js = this.editors.get('js').value;

    const previewDoc = this.generatePreviewDocument(html, css, js);
    const newWindow = window.open('', '_blank');

    if (newWindow) {
      // Use modern DOM methods instead of document.write
      newWindow.document.documentElement.innerHTML = previewDoc;

      // Re-execute scripts since innerHTML doesn't execute them
      const scripts = newWindow.document.querySelectorAll('script');
      scripts.forEach(oldScript => {
        const newScript = newWindow.document.createElement('script');
        newScript.textContent = oldScript.textContent;
        oldScript.parentNode.replaceChild(newScript, oldScript);
      });
    } else {
      this.showConsoleMessage('❌ Could not open new window - popup blocked?', 'error');
    }
  }

  /**
   * Save code to localStorage
   * @method saveCode
   * @description Saves current code to localStorage for persistence
   * @returns {void}
   */
  saveCode() {
    if (this.autoSave) {
      this.performSave();
    }
  }

  /**
   * Perform the actual save operation
   */
  performSave() {

    const code = {
      html: this.editors.get('html').value,
      css: this.editors.get('css').value,
      js: this.editors.get('js').value,
      timestamp: Date.now()
    };

    try {
      localStorage.setItem('bsb-playground-code', JSON.stringify(code));
    } catch (error) {
      debug.warn('Could not save code to localStorage:', error);
    }
  }

  /**
   * Load code from localStorage
   * @method loadSavedCode
   * @description Loads previously saved code from localStorage
   * @returns {void}
   */
  loadSavedCode() {
    // Check for URL-encoded code first
    const urlParams = new URLSearchParams(window.location.search);
    const encodedCode = urlParams.get('code');

    if (encodedCode) {
      try {
        const code = JSON.parse(atob(encodedCode));
        this.editors.get('html').value = code.html || '';
        this.editors.get('css').value = code.css || '';
        this.editors.get('js').value = code.js || '';
        this.showConsoleMessage('📤 Loaded shared code!', 'info');
        return;
      } catch (error) {
        debug.warn('Could not load shared code:', error);
      }
    }

    // Load from localStorage
    try {
      const savedCode = localStorage.getItem('bsb-playground-code');
      if (savedCode) {
        const code = JSON.parse(savedCode);
        const age = Date.now() - code.timestamp;

        // Only load if saved within last 24 hours
        if (age < CONSTANTS.MAX_CODE_AGE_HOURS * CONSTANTS.MINUTES_PER_HOUR *
             CONSTANTS.SECONDS_PER_MINUTE * CONSTANTS.MS_PER_SECOND) {
          this.editors.get('html').value = code.html || '';
          this.editors.get('css').value = code.css || '';
          this.editors.get('js').value = code.js || '';
          this.showConsoleMessage('💾 Restored previous session', 'info');
        }
      }
    } catch (error) {
      debug.warn('Could not load saved code:', error);
    }
  }
}

/**
 * Initialize all code playgrounds on the page
 * @function initializeCodePlaygrounds
 * @description Finds and initializes all code playground components
 * @returns {void}
 */
const initializeCodePlaygrounds = function initializeCodePlaygrounds() {
  const playgrounds = document.querySelectorAll('[data-bsb-component="code-playground"]');

  playgrounds.forEach(playground => {
    const codePlayground = new BSBCodePlayground(playground);
    // Store reference if needed for later access
    playground.codePlaygroundInstance = codePlayground;
  });

  // Initialization complete - playground count: playgrounds.length
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeCodePlaygrounds);
} else {
  initializeCodePlaygrounds();
}

// Export for use in other scripts
window.BSBCodePlayground = BSBCodePlayground;