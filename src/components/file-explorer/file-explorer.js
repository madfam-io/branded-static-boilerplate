/**
 * BSB File Explorer Component
 * ===========================
 *
 * Interactive file system explorer that teaches project organization
 * through tooltip-enabled navigation and detailed explanations.
 *
 * Features:
 * - Expandable folder tree with smooth animations
 * - Educational tooltips with progressive disclosure
 * - Keyboard navigation support
 * - File type recognition and categorization
 * - Accessibility compliant with ARIA labels
 *
 * @author BSB Team
 * @version 1.0.0
 */

// Constants
const CONSTANTS = {
  TOOLTIP_HIDE_DELAY: 150,
  POSITION_DIVISOR: 2,
  INDENT_LEVEL_0: 0,
  INDENT_LEVEL_1: 1,
  INDENT_LEVEL_2: 2,
  INDENT_LEVEL_3: 3,
  MAX_DEPTH: 10,
  TOOLTIP_SPACING: 10
};

/**
 * File explorer component class
 */
class BSBFileExplorer {
  /**
   * Initialize file explorer component
   * @param {HTMLElement} container - Container element for the component
   */
  constructor(container) {
    this.container = container;
    this.tooltip = container.querySelector('[data-tooltip-container]');
    this.learningPanel = container.querySelector('[data-learning-panel]');
    this.loadingElement = container.querySelector('[data-loading]');
    this.fileTree = container.querySelector('[data-file-tree]');

    // State management
    this.expandedFolders = new Set(['/', '/src', '/src/components']);
    this.currentTooltip = null;
    this.tooltipTimeout = null;

    // Bind methods
    this.handleItemInteraction = this.handleItemInteraction.bind(this);
    this.handleKeyboard = this.handleKeyboard.bind(this);
    this.hideTooltip = this.hideTooltip.bind(this);
    this.closeLearningPanel = this.closeLearningPanel.bind(this);

    this.init();
  }

  /**
   * Initialize the file explorer
   */
  async init() {
    await this.setupFileData();
    this.renderFileTree();
    this.setupEventListeners();
    this.hideLoading();
  }

  /**
   * Define the file structure and educational content
   */
  async setupFileData() {
    const { getAllFileData } = await import('./file-data/index.js');
    this.fileData = getAllFileData();
  }

  /**
   * Render the complete file tree structure
   */
  renderFileTree() {
    const rootList = this.fileTree.querySelector('.bsb-file-explorer__list--nested');

    // Define the file structure hierarchy
    const structure = [
      { path: '/package.json', indent: CONSTANTS.INDENT_LEVEL_0 },
      { path: '/vite.config.js', indent: CONSTANTS.INDENT_LEVEL_0 },
      { path: '/.gitignore', indent: CONSTANTS.INDENT_LEVEL_0 },
      { path: '/README.md', indent: CONSTANTS.INDENT_LEVEL_0 },
      { path: '/src', indent: CONSTANTS.INDENT_LEVEL_0, children: [
        { path: '/src/components', indent: CONSTANTS.INDENT_LEVEL_1, children: [
          { path: '/src/components/header', indent: CONSTANTS.INDENT_LEVEL_2, children: [
            { path: '/src/components/header/header.html', indent: CONSTANTS.INDENT_LEVEL_3 },
            { path: '/src/components/header/header.css', indent: CONSTANTS.INDENT_LEVEL_3 },
            { path: '/src/components/header/header.js', indent: CONSTANTS.INDENT_LEVEL_3 }
          ] }
        ] },
        { path: '/src/styles', indent: CONSTANTS.INDENT_LEVEL_1, children: [
          { path: '/src/styles/base', indent: CONSTANTS.INDENT_LEVEL_2, children: [
            { path: '/src/styles/base/variables.css', indent: CONSTANTS.INDENT_LEVEL_3 }
          ] }
        ] },
        { path: '/src/scripts', indent: CONSTANTS.INDENT_LEVEL_1 }
      ] },
      { path: '/tests', indent: CONSTANTS.INDENT_LEVEL_0 },
      { path: '/docs', indent: CONSTANTS.INDENT_LEVEL_0 }
    ];

    this.generateFileTreeHTML(structure).then(html => {
      rootList.innerHTML = html;
    });
  }

  /**
   * Generate HTML for file tree structure
   * @param {Array} items - Array of file/folder items to render
   * @returns {string} HTML string for the file tree
   */
  async generateFileTreeHTML(items) {
    // Import renderer
    const { renderFileItem } = await import('./file-tree-renderer.js');

    const htmlParts = [];

    for (const item of items) {
      const data = this.fileData[item.path];
      if (!data) {
        continue;
      }

      const isExpanded = this.expandedFolders.has(item.path);
      let itemHtml = renderFileItem(item, data, isExpanded);

      // Handle nested children
      if (item.children && item.children.length > 0 && isExpanded) {
        const childrenHtml = await this.generateFileTreeHTML(item.children);
        itemHtml = itemHtml.replace(
          `data-children-path="${item.path}">`,
          `data-children-path="${item.path}">${childrenHtml}`
        );
      }

      htmlParts.push(itemHtml);
    }

    return htmlParts.join('');
  }

  /**
   * Get appropriate icon for file type
   * @param {string} fileType - Type of file
   * @returns {Promise<string>} Emoji icon for the file type
   */
  async getFileIcon(fileType) {
    const { getFileIcon } = await import('./file-tree-renderer.js');
    return getFileIcon(fileType);
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Folder toggle and tooltip interactions
    this.fileTree.addEventListener('click', this.handleItemInteraction);
    this.fileTree.addEventListener('mouseenter', this.handleItemInteraction, true);
    this.fileTree.addEventListener('mouseleave', this.hideTooltip);

    // Keyboard navigation
    this.fileTree.addEventListener('keydown', this.handleKeyboard);

    // Learning panel close
    const closeButton = this.learningPanel.querySelector('.bsb-file-explorer__panel-close');
    closeButton.addEventListener('click', this.closeLearningPanel);

    // Close panel on escape
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        this.closeLearningPanel();
        this.hideTooltip();
      }
    });
  }

  /**
   * Handle item interactions (clicks, hovers)
   * @param {Event} event - DOM event
   */
  handleItemInteraction(event) {
    const item = event.target.closest('.bsb-file-explorer__item');
    if (!item) {
      return;
    }

    const { path } = item.dataset;
    const toggle = event.target.closest('.bsb-file-explorer__toggle');

    if (event.type === 'click') {
      if (toggle && item.dataset.type === 'folder') {
        this.toggleFolder(item, path);
      } else {
        this.showDetails(path);
      }
    } else if (event.type === 'mouseenter') {
      this.showTooltip(event, path);
    }
  }

  /**
   * Handle keyboard navigation
   * @param {KeyboardEvent} event - Keyboard event
   */
  handleKeyboard(event) {
    const item = event.target.closest('.bsb-file-explorer__item');
    if (!item) {
      return;
    }

    const { path } = item.dataset;

    switch (event.key) {
      case 'Enter':
      case ' ':
        this.handleEnterSpaceKey(event, item, path);
        break;
      case 'ArrowRight':
        this.handleArrowRightKey(event, item, path);
        break;
      case 'ArrowLeft':
        this.handleArrowLeftKey(event, item, path);
        break;
      default:
        // No action needed for other keys
        break;
    }
  }

  /**
   * Handle Enter and Space key press
   * @param {KeyboardEvent} event - Keyboard event
   * @param {HTMLElement} item - The item element
   * @param {string} path - Item path
   */
  handleEnterSpaceKey(event, item, path) {
    event.preventDefault();
    if (item.dataset.type === 'folder') {
      this.toggleFolder(item, path);
    } else {
      this.showDetails(path);
    }
  }

  /**
   * Handle Arrow Right key press
   * @param {KeyboardEvent} event - Keyboard event
   * @param {HTMLElement} item - The item element
   * @param {string} path - Item path
   */
  handleArrowRightKey(event, item, path) {
    if (item.dataset.type === 'folder' && !this.expandedFolders.has(path)) {
      event.preventDefault();
      this.toggleFolder(item, path);
    }
  }

  /**
   * Handle Arrow Left key press
   * @param {KeyboardEvent} event - Keyboard event
   * @param {HTMLElement} item - The item element
   * @param {string} path - Item path
   */
  handleArrowLeftKey(event, item, path) {
    if (item.dataset.type === 'folder' && this.expandedFolders.has(path)) {
      event.preventDefault();
      this.toggleFolder(item, path);
    }
  }

  /**
   * Toggle folder expanded/collapsed state
   * @param {HTMLElement} item - The folder item element
   * @param {string} path - Path of the folder
   */
  toggleFolder(item, path) {
    const isExpanded = this.expandedFolders.has(path);
    const toggle = item.querySelector('.bsb-file-explorer__toggle');
    const icon = toggle.querySelector('.bsb-file-explorer__toggle-icon');

    if (isExpanded) {
      this.expandedFolders.delete(path);
      item.classList.add('bsb-file-explorer__item--collapsed');
      item.setAttribute('aria-expanded', 'false');
      icon.textContent = '📁';
      toggle.setAttribute('aria-label', `Expand ${this.fileData[path].name}`);
    } else {
      this.expandedFolders.add(path);
      item.classList.remove('bsb-file-explorer__item--collapsed');
      item.setAttribute('aria-expanded', 'true');
      icon.textContent = '📂';
      toggle.setAttribute('aria-label', `Collapse ${this.fileData[path].name}`);
    }
  }

  /**
   * Show tooltip for file/folder
   * @param {Event} event - Mouse event
   * @param {string} path - Path of the item
   */
  showTooltip(event, path) {
    const data = this.fileData[path];
    if (!data) {
      return;
    }

    clearTimeout(this.tooltipTimeout);

    const rect = event.target.closest('.bsb-file-explorer__item-content').getBoundingClientRect();
    const containerRect = this.container.getBoundingClientRect();

    // Update tooltip content
    this.tooltip.querySelector('.bsb-file-explorer__tooltip-title').textContent = data.title;
    this.tooltip.querySelector('.bsb-file-explorer__tooltip-description').textContent = data.description;

    const meta = this.tooltip.querySelector('.bsb-file-explorer__tooltip-meta');
    meta.textContent = `${data.type === 'folder' ? 'Folder' : 'File'} • ${data.category || data.fileType || 'General'}`;

    // Position tooltip
    const tooltipRect = this.tooltip.getBoundingClientRect();
    const left = rect.left - containerRect.left +
      (rect.width / CONSTANTS.POSITION_DIVISOR) -
      (tooltipRect.width / CONSTANTS.POSITION_DIVISOR);
    const top = rect.top - containerRect.top - tooltipRect.height - CONSTANTS.TOOLTIP_SPACING;

    const maxLeft = containerRect.width - tooltipRect.width - CONSTANTS.TOOLTIP_SPACING;
    this.tooltip.style.left = `${Math.max(CONSTANTS.TOOLTIP_SPACING, Math.min(left, maxLeft))}px`;
    this.tooltip.style.top = `${Math.max(CONSTANTS.TOOLTIP_SPACING, top)}px`;

    // Show tooltip
    this.tooltip.setAttribute('aria-hidden', 'false');
    this.currentTooltip = path;

    // Setup learn more button
    const learnMoreBtn = this.tooltip.querySelector('.bsb-file-explorer__tooltip-learn-more');
    learnMoreBtn.onclick = () => this.showDetails(path);
  }

  /**
   * Hide tooltip
   */
  hideTooltip() {
    this.tooltipTimeout = setTimeout(() => {
      this.tooltip.setAttribute('aria-hidden', 'true');
      this.currentTooltip = null;
    }, CONSTANTS.TOOLTIP_HIDE_DELAY);
  }

  /**
   * Show detailed learning panel
   * @param {string} path - Path of the item to show details for
   */
  showDetails(path) {
    const data = this.fileData[path];
    if (!data || !data.details) {
      return;
    }

    // Update panel content
    this.learningPanel.querySelector('.bsb-file-explorer__panel-title').textContent = data.title;
    this.learningPanel.querySelector('.bsb-file-explorer__panel-description').innerHTML = data.details;

    // Add links if available
    const linksContainer = this.learningPanel.querySelector('.bsb-file-explorer__panel-links');
    if (data.links) {
      linksContainer.innerHTML = `
        <h5>📚 Learn More:</h5>
        <ul>
          ${data.links.map(link => `<li><a href="${link.url}" target="_blank">${link.text}</a></li>`).join('')}
        </ul>
      `;
    } else {
      linksContainer.innerHTML = '';
    }

    // Show panel
    this.learningPanel.setAttribute('aria-hidden', 'false');

    // Hide tooltip
    this.hideTooltip();
  }

  /**
   * Close learning panel
   */
  closeLearningPanel() {
    this.learningPanel.setAttribute('aria-hidden', 'true');
  }

  /**
   * Hide loading state
   */
  hideLoading() {
    this.loadingElement.hidden = true;
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const explorers = document.querySelectorAll('[data-bsb-component="file-explorer"]');
  explorers.forEach(explorer => {
    const fileExplorer = new BSBFileExplorer(explorer);
    // Store reference if needed for later access
    explorer.fileExplorerInstance = fileExplorer;
  });
});

// Export for module usage
window.BSBFileExplorer = BSBFileExplorer;