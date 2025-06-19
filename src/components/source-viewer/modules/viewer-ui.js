/**
 * Source Viewer UI Management
 * ===========================
 *
 * Manages the source viewer interface and interactions
 */

// UI Constants
const UI_CONSTANTS = {
  NOTIFICATION_DURATION: 3000,
  ANIMATION_DURATION: 300,
  FOCUS_DELAY: 100
};

/**
 * Update statistics display
 * @param {Object} stats - Statistics data
 */
const updateStats = stats => {
  Object.entries(stats).forEach(([key, value]) => {
    const statElement = document.querySelector(`[data-stat="${key}"]`);
    if (statElement) {
      statElement.textContent = value;
    }
  });
};

/**
 * Apply syntax highlighting to code blocks
 */
const applySyntaxHighlighting = () => {
  // If Prism.js is available, highlight the code
  if (window.Prism) {
    Prism.highlightAll();
  }
};

/**
 * Show notification message
 * @param {string} message - Notification message
 * @param {string} type - Notification type
 */
const showNotification = (message, type = 'info') => {
  const notification = document.createElement('div');
  notification.className = `bsb-source-viewer__notification bsb-source-viewer__notification--${type}`;
  notification.textContent = message;

  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--bsb-${type === 'success' ? 'success' : 'primary'});
    color: white;
    padding: 12px 16px;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10001;
    font-size: 14px;
    animation: slideInRight 0.3s ease;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), UI_CONSTANTS.ANIMATION_DURATION);
  }, UI_CONSTANTS.NOTIFICATION_DURATION);
};

/**
 * Download individual file
 * @param {string} filename - Name of file
 * @param {string} content - File content
 * @param {string} mimeType - MIME type
 */
const downloadFile = (filename, content, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
};

/**
 * Generate the source viewer template
 * @returns {string} HTML template for the viewer
 */
export const getViewerTemplate = () => `
    <div class="bsb-source-viewer" id="source-viewer">
      <div class="bsb-source-viewer__backdrop"></div>
      <div class="bsb-source-viewer__container">
        <div class="bsb-source-viewer__header">
          <h2 class="bsb-source-viewer__title">
            <span class="bsb-source-viewer__icon">📄</span>
            Component Source Code
          </h2>
          <div class="bsb-source-viewer__actions">
            <button class="bsb-source-viewer__action" data-action="copy-all" title="Copy All">
              📋
            </button>
            <button class="bsb-source-viewer__action" data-action="playground" title="Open in Playground">
              ⚡
            </button>
            <button class="bsb-source-viewer__action" data-action="download" title="Download">
              💾
            </button>
            <button class="bsb-source-viewer__action bsb-source-viewer__close" data-action="close" title="Close">
              ✕
            </button>
          </div>
        </div>

        <div class="bsb-source-viewer__tabs">
          <button class="bsb-source-viewer__tab bsb-source-viewer__tab--active" data-tab="html">
            HTML
          </button>
          <button class="bsb-source-viewer__tab" data-tab="css">
            CSS
          </button>
          <button class="bsb-source-viewer__tab" data-tab="js">
            JavaScript
          </button>
        </div>

        <div class="bsb-source-viewer__content">
          <div class="bsb-source-viewer__panel bsb-source-viewer__panel--active" data-panel="html">
            <div class="bsb-source-viewer__code-header">
              <span class="bsb-source-viewer__code-label">HTML Structure</span>
              <button class="bsb-source-viewer__copy" data-copy="html">Copy HTML</button>
            </div>
            <pre class="bsb-source-viewer__code"><code class="language-html" id="html-code"></code></pre>
          </div>

          <div class="bsb-source-viewer__panel" data-panel="css">
            <div class="bsb-source-viewer__code-header">
              <span class="bsb-source-viewer__code-label">CSS Styles</span>
              <button class="bsb-source-viewer__copy" data-copy="css">Copy CSS</button>
            </div>
            <pre class="bsb-source-viewer__code"><code class="language-css" id="css-code"></code></pre>
          </div>

          <div class="bsb-source-viewer__panel" data-panel="js">
            <div class="bsb-source-viewer__code-header">
              <span class="bsb-source-viewer__code-label">JavaScript Logic</span>
              <button class="bsb-source-viewer__copy" data-copy="js">Copy JavaScript</button>
            </div>
            <pre class="bsb-source-viewer__code"><code class="language-javascript" id="js-code"></code></pre>
          </div>
        </div>

        <div class="bsb-source-viewer__footer">
          <div class="bsb-source-viewer__component-info">
            <span class="bsb-source-viewer__component-name"></span>
          </div>
          <div class="bsb-source-viewer__stats">
            <span class="bsb-source-viewer__stat">
              <span class="bsb-source-viewer__stat-label">HTML:</span>
              <span class="bsb-source-viewer__stat-value" data-stat="html-lines">0</span> lines
            </span>
            <span class="bsb-source-viewer__stat">
              <span class="bsb-source-viewer__stat-label">CSS:</span>
              <span class="bsb-source-viewer__stat-value" data-stat="css-lines">0</span> lines
            </span>
            <span class="bsb-source-viewer__stat">
              <span class="bsb-source-viewer__stat-label">JS:</span>
              <span class="bsb-source-viewer__stat-value" data-stat="js-lines">0</span> lines
            </span>
          </div>
        </div>
      </div>
    </div>
  `;

/**
 * Update the viewer with source code
 * @param {Object} sourceData - Source code data
 */
export const updateViewerContent = sourceData => {
  const { html, css, js, componentName } = sourceData;

  // Update code content
  const htmlCode = document.getElementById('html-code');
  const cssCode = document.getElementById('css-code');
  const jsCode = document.getElementById('js-code');

  if (htmlCode) {
    htmlCode.textContent = html;
  }
  if (cssCode) {
    cssCode.textContent = css;
  }
  if (jsCode) {
    jsCode.textContent = js;
  }

  // Update component name
  const componentNameEl = document.querySelector('.bsb-source-viewer__component-name');
  if (componentNameEl) {
    componentNameEl.textContent = `Component: ${componentName}`;
  }

  // Update stats
  updateStats({
    'html-lines': html.split('\n').length,
    'css-lines': css.split('\n').length,
    'js-lines': js.split('\n').length
  });

  // Apply syntax highlighting if available
  applySyntaxHighlighting();
};

/**
 * Switch between tabs
 * @param {string} tabName - Name of tab to switch to
 */
export const switchTab = tabName => {
  // Update tab states
  const tabs = document.querySelectorAll('.bsb-source-viewer__tab');
  tabs.forEach(tab => {
    const isActive = tab.dataset.tab === tabName;
    tab.classList.toggle('bsb-source-viewer__tab--active', isActive);
  });

  // Update panel states
  const panels = document.querySelectorAll('.bsb-source-viewer__panel');
  panels.forEach(panel => {
    const isActive = panel.dataset.panel === tabName;
    panel.classList.toggle('bsb-source-viewer__panel--active', isActive);
  });
};

/**
 * Show the source viewer
 * @param {HTMLElement} viewer - Viewer element
 */
export const showViewer = viewer => {
  viewer.classList.add('bsb-source-viewer--active');
  document.body.style.overflow = 'hidden';

  // Focus the close button for accessibility
  const closeBtn = viewer.querySelector('[data-action="close"]');
  if (closeBtn) {
    setTimeout(() => closeBtn.focus(), UI_CONSTANTS.FOCUS_DELAY);
  }
};

/**
 * Hide the source viewer
 * @param {HTMLElement} viewer - Viewer element
 */
export const hideViewer = viewer => {
  viewer.classList.remove('bsb-source-viewer--active');
  document.body.style.overflow = '';
};

/**
 * Copy code to clipboard
 * @param {string} code - Code to copy
 * @param {string} type - Type of code (html, css, js)
 */
export const copyToClipboard = async(code, type) => {
  try {
    await navigator.clipboard.writeText(code);
    showNotification(`${type.toUpperCase()} code copied to clipboard!`, 'success');
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = code;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showNotification(`${type.toUpperCase()} code copied to clipboard!`, 'success');
  }
};

/**
 * Download source code as files
 * @param {Object} sourceData - Source code data
 */
export const downloadSource = sourceData => {
  const { html, css, js, componentName } = sourceData;

  // Create a zip-like structure by downloading individual files
  downloadFile(`${componentName}.html`, html, 'text/html');
  downloadFile(`${componentName}.css`, css, 'text/css');
  downloadFile(`${componentName}.js`, js, 'text/javascript');

  showNotification('Source files downloaded!', 'success');
};

/**
 * Add view source button to component
 * @param {HTMLElement} component - Component element
 */
export const addViewSourceButton = component => {
  // Check if button already exists
  if (component.querySelector('.bsb-view-source-btn')) {
    return;
  }

  const button = document.createElement('button');
  button.className = 'bsb-view-source-btn';
  button.setAttribute('aria-label', 'View source code');
  button.innerHTML = '📄';
  button.title = 'View Source Code';

  // Position the button appropriately
  const { position } = window.getComputedStyle(component);
  if (position === 'static') {
    component.style.position = 'relative';
  }

  component.appendChild(button);
  return button;
};