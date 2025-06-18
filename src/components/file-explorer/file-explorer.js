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

class BSBFileExplorer {
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
  init() {
    this.setupFileData();
    this.renderFileTree();
    this.setupEventListeners();
    this.hideLoading();
  }

  /**
   * Define the file structure and educational content
   */
  setupFileData() {
    this.fileData = {
      '/': {
        type: 'folder',
        name: 'branded-static-boilerplate',
        title: 'Project Root Directory',
        description: 'The main folder containing your entire web project. Everything starts here!',
        importance: 'high',
        category: 'root',
        details: `
          <p>This is your project's <strong>root directory</strong> - think of it as the main folder that contains your entire website.</p>
          <h5>🎯 Key Concepts:</h5>
          <ul>
            <li><strong>Single Source of Truth:</strong> Everything related to your project lives here</li>
            <li><strong>Version Control:</strong> This folder is tracked by Git</li>
            <li><strong>Deployment Unit:</strong> When you deploy, this entire folder goes to the server</li>
          </ul>
          <h5>💡 Best Practices:</h5>
          <ul>
            <li>Keep the root clean - only essential files and folders</li>
            <li>Use descriptive folder names that explain their purpose</li>
            <li>Include a README.md to explain your project</li>
          </ul>
        `,
        links: [
          { text: 'Project Structure Guide', url: '/docs/tutorials/project-structure.md' },
          { text: 'Git Best Practices', url: '/docs/tutorials/git-workflow.md' }
        ]
      },
      '/package.json': {
        type: 'file',
        fileType: 'config',
        name: 'package.json',
        title: 'Project Configuration & Dependencies',
        description: 'The blueprint of your project - lists dependencies, scripts, and metadata.',
        importance: 'high',
        details: `
          <p><strong>package.json</strong> is like your project's ID card and instruction manual combined.</p>
          <h5>📋 What it contains:</h5>
          <ul>
            <li><strong>Dependencies:</strong> External libraries your project needs</li>
            <li><strong>Scripts:</strong> Commands you can run (build, test, deploy)</li>
            <li><strong>Metadata:</strong> Project name, version, description</li>
          </ul>
          <h5>🔧 Example Scripts:</h5>
          <pre><code>{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "jest"
  }
}</code></pre>
        `,
        links: [
          { text: 'NPM Package.json Guide', url: 'https://docs.npmjs.com/cli/v8/configuring-npm/package-json' }
        ]
      },
      '/src': {
        type: 'folder',
        name: 'src',
        title: 'Source Code Directory',
        description: 'Your website\'s source code lives here - HTML, CSS, JavaScript, and assets.',
        importance: 'high',
        category: 'source',
        details: `
          <p>The <strong>src</strong> (source) folder contains all the code that makes your website work.</p>
          <h5>🏗️ Architecture Pattern:</h5>
          <ul>
            <li><strong>Separation of Concerns:</strong> Different types of code in different folders</li>
            <li><strong>Component-Based:</strong> Reusable UI pieces grouped together</li>
            <li><strong>Asset Organization:</strong> Images, fonts, and other files organized logically</li>
          </ul>
          <h5>📁 Typical Structure:</h5>
          <pre><code>src/
├── components/  ← Reusable UI pieces
├── styles/      ← CSS and styling
├── scripts/     ← JavaScript functionality
├── assets/      ← Images, fonts, etc.
└── pages/       ← Individual HTML pages</code></pre>
        `,
        links: [
          { text: 'Component Architecture', url: '/docs/tutorials/components.md' },
          { text: 'Asset Organization', url: '/docs/tutorials/assets.md' }
        ]
      },
      '/src/components': {
        type: 'folder',
        name: 'components',
        title: 'Reusable UI Components',
        description: 'LEGO blocks for your website - reusable pieces of HTML, CSS, and JavaScript.',
        importance: 'high',
        category: 'source',
        details: `
          <p><strong>Components</strong> are like LEGO blocks - reusable pieces you can combine to build your website.</p>
          <h5>🧩 Component Benefits:</h5>
          <ul>
            <li><strong>Reusability:</strong> Write once, use everywhere</li>
            <li><strong>Maintainability:</strong> Fix bugs in one place</li>
            <li><strong>Consistency:</strong> Same look and behavior across pages</li>
            <li><strong>Testability:</strong> Easy to test individual pieces</li>
          </ul>
          <h5>📦 Component Structure:</h5>
          <pre><code>header/
├── header.html  ← Structure
├── header.css   ← Styling
├── header.js    ← Behavior
└── README.md    ← Documentation</code></pre>
        `,
        links: [
          { text: 'Building Components', url: '/docs/tutorials/component-creation.md' },
          { text: 'Component Best Practices', url: '/docs/tutorials/component-patterns.md' }
        ]
      },
      '/src/components/header': {
        type: 'folder',
        name: 'header',
        title: 'Header Component',
        description: 'Site navigation and branding component used across all pages.',
        importance: 'medium',
        category: 'source'
      },
      '/src/components/header/header.html': {
        type: 'file',
        fileType: 'markup',
        name: 'header.html',
        title: 'Header Structure',
        description: 'HTML structure for the site header with navigation and branding.',
        importance: 'medium'
      },
      '/src/components/header/header.css': {
        type: 'file',
        fileType: 'style',
        name: 'header.css',
        title: 'Header Styling',
        description: 'CSS styles for header appearance, layout, and responsive behavior.',
        importance: 'medium'
      },
      '/src/components/header/header.js': {
        type: 'file',
        fileType: 'script',
        name: 'header.js',
        title: 'Header Functionality',
        description: 'JavaScript for mobile menu toggle and interactive features.',
        importance: 'medium'
      },
      '/src/styles': {
        type: 'folder',
        name: 'styles',
        title: 'CSS Styling System',
        description: 'Organized CSS architecture with variables, utilities, and component styles.',
        importance: 'high',
        category: 'source',
        details: `
          <p>A well-organized <strong>CSS architecture</strong> makes your styles maintainable and scalable.</p>
          <h5>🎨 CSS Organization:</h5>
          <ul>
            <li><strong>Variables:</strong> Design tokens (colors, spacing, fonts)</li>
            <li><strong>Base:</strong> Fundamental styles and resets</li>
            <li><strong>Utilities:</strong> Helper classes for rapid development</li>
            <li><strong>Components:</strong> Specific component styling</li>
          </ul>
          <h5>📏 CSS Methodology:</h5>
          <pre><code>/* BEM Naming Convention */
.bsb-header { }           /* Block */
.bsb-header__logo { }     /* Element */
.bsb-header--dark { }     /* Modifier */</code></pre>
        `,
        links: [
          { text: 'CSS Architecture Guide', url: '/docs/tutorials/css-architecture.md' },
          { text: 'Design System', url: '/docs/tutorials/design-system.md' }
        ]
      },
      '/src/styles/base': {
        type: 'folder',
        name: 'base',
        title: 'Base Styles',
        description: 'Fundamental CSS including variables, typography, and browser resets.',
        importance: 'high',
        category: 'source'
      },
      '/src/styles/base/variables.css': {
        type: 'file',
        fileType: 'style',
        name: 'variables.css',
        title: 'CSS Custom Properties',
        description: 'Design tokens for colors, spacing, typography, and theme switching.',
        importance: 'high',
        details: `
          <p><strong>CSS Custom Properties</strong> (variables) are your design system's foundation.</p>
          <h5>🎨 Design Tokens:</h5>
          <pre><code>:root {
  /* Colors */
  --bsb-primary: #3b82f6;
  --bsb-secondary: #8b5cf6;
  
  /* Spacing */
  --bsb-space-1: 0.25rem;
  --bsb-space-2: 0.5rem;
  
  /* Typography */
  --bsb-font-sans: system-ui, sans-serif;
}</code></pre>
          <h5>✨ Benefits:</h5>
          <ul>
            <li><strong>Consistency:</strong> Same values across all components</li>
            <li><strong>Theming:</strong> Easy light/dark mode switching</li>
            <li><strong>Maintainability:</strong> Change once, update everywhere</li>
          </ul>
        `
      },
      '/src/scripts': {
        type: 'folder',
        name: 'scripts',
        title: 'JavaScript Functionality',
        description: 'Interactive behavior and application logic for your website.',
        importance: 'high',
        category: 'source',
        details: `
          <p><strong>JavaScript</strong> brings your website to life with interactivity and dynamic behavior.</p>
          <h5>⚡ Modern JavaScript Features:</h5>
          <ul>
            <li><strong>ES6+ Modules:</strong> Import/export for code organization</li>
            <li><strong>Progressive Enhancement:</strong> Works without JS, better with JS</li>
            <li><strong>Performance:</strong> Lazy loading and code splitting</li>
          </ul>
          <h5>🏗️ Architecture Pattern:</h5>
          <pre><code>scripts/
├── core/      ← Essential functionality
├── modules/   ← Feature-specific code
└── utils/     ← Helper functions</code></pre>
        `
      },
      '/tests': {
        type: 'folder',
        name: 'tests',
        title: 'Test Suite',
        description: 'Automated tests to ensure your code works correctly and prevent bugs.',
        importance: 'high',
        category: 'quality',
        details: `
          <p><strong>Testing</strong> is your safety net - it catches bugs before users do!</p>
          <h5>🧪 Testing Strategy:</h5>
          <ul>
            <li><strong>Unit Tests:</strong> Test individual functions and components</li>
            <li><strong>Integration Tests:</strong> Test how parts work together</li>
            <li><strong>Accessibility Tests:</strong> Ensure inclusive design</li>
          </ul>
          <h5>🛡️ Benefits:</h5>
          <ul>
            <li><strong>Confidence:</strong> Deploy without fear</li>
            <li><strong>Documentation:</strong> Tests show how code should work</li>
            <li><strong>Refactoring:</strong> Change code safely</li>
          </ul>
        `,
        links: [
          { text: 'Testing Guide', url: '/docs/tutorials/testing.md' },
          { text: 'Jest Documentation', url: 'https://jestjs.io/docs/getting-started' }
        ]
      },
      '/docs': {
        type: 'folder',
        name: 'docs',
        title: 'Documentation',
        description: 'Project documentation, tutorials, and guides for developers.',
        importance: 'medium',
        category: 'docs',
        details: `
          <p><strong>Documentation</strong> is your project's instruction manual - essential for collaboration and maintenance.</p>
          <h5>📚 Documentation Types:</h5>
          <ul>
            <li><strong>README:</strong> Project overview and getting started</li>
            <li><strong>Tutorials:</strong> Step-by-step learning guides</li>
            <li><strong>API Docs:</strong> Function and component references</li>
            <li><strong>Examples:</strong> Real-world usage patterns</li>
          </ul>
          <h5>✍️ Writing Tips:</h5>
          <ul>
            <li>Write for your future self who forgot everything</li>
            <li>Include code examples for every concept</li>
            <li>Keep it up-to-date with code changes</li>
          </ul>
        `
      },
      '/vite.config.js': {
        type: 'file',
        fileType: 'config',
        name: 'vite.config.js',
        title: 'Build Tool Configuration',
        description: 'Vite bundler settings for development server and production builds.',
        importance: 'high',
        details: `
          <p><strong>Vite</strong> is your build tool - it transforms your source code into optimized websites.</p>
          <h5>⚡ What Vite Does:</h5>
          <ul>
            <li><strong>Development Server:</strong> Hot reload for instant feedback</li>
            <li><strong>Bundling:</strong> Combines multiple files for performance</li>
            <li><strong>Optimization:</strong> Minifies and compresses for faster loading</li>
          </ul>
          <h5>🔧 Common Configuration:</h5>
          <pre><code>export default {
  root: './src',
  build: {
    outDir: '../dist'
  }
}</code></pre>
        `,
        links: [
          { text: 'Vite Guide', url: 'https://vitejs.dev/guide/' }
        ]
      },
      '/.gitignore': {
        type: 'file',
        fileType: 'config',
        name: '.gitignore',
        title: 'Git Ignore Rules',
        description: 'Tells Git which files to ignore (node_modules, build outputs, etc.).',
        importance: 'medium',
        details: `
          <p><strong>.gitignore</strong> keeps your repository clean by excluding unnecessary files.</p>
          <h5>🚫 Common Ignores:</h5>
          <pre><code>node_modules/    # Dependencies
dist/           # Build output
.env            # Secret keys
.DS_Store       # Mac system files</code></pre>
          <h5>💡 Why Ignore?</h5>
          <ul>
            <li><strong>Size:</strong> node_modules can be huge</li>
            <li><strong>Security:</strong> Never commit secrets</li>
            <li><strong>Cleanliness:</strong> Focus on source code</li>
          </ul>
        `
      },
      '/README.md': {
        type: 'file',
        fileType: 'docs',
        name: 'README.md',
        title: 'Project Documentation',
        description: 'The first thing people see - explains what your project does and how to use it.',
        importance: 'high',
        details: `
          <p><strong>README.md</strong> is your project's front door - make a great first impression!</p>
          <h5>📋 Essential Sections:</h5>
          <ul>
            <li><strong>Project Title & Description:</strong> What does it do?</li>
            <li><strong>Installation:</strong> How to get started</li>
            <li><strong>Usage:</strong> Basic examples</li>
            <li><strong>Contributing:</strong> How others can help</li>
          </ul>
          <h5>✨ Pro Tips:</h5>
          <ul>
            <li>Use screenshots and GIFs to show functionality</li>
            <li>Include live demo links</li>
            <li>Keep it concise but comprehensive</li>
          </ul>
        `
      }
    };
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

    rootList.innerHTML = this.generateFileTreeHTML(structure);
  }

  /**
   * Generate HTML for file tree structure
   */
  generateFileTreeHTML(items) {
    return items.map(item => {
      const data = this.fileData[item.path];
      if (!data) {
        return '';
      }

      const isFolder = data.type === 'folder';
      const isExpanded = this.expandedFolders.has(item.path);
      const hasChildren = item.children && item.children.length > 0;

      let html = `
        <li class="bsb-file-explorer__item bsb-file-explorer__item--${data.type}${isExpanded ? '' : ' bsb-file-explorer__item--collapsed'}"
            role="treeitem"
            ${isFolder ? `aria-expanded="${isExpanded}"` : ''}
            data-type="${data.type}"
            data-path="${item.path}"
            data-tooltip="${item.path}"
            ${data.fileType ? `data-file-type="${data.fileType}"` : ''}
            ${data.importance ? `data-importance="${data.importance}"` : ''}>
          <div class="bsb-file-explorer__item-content">
      `;

      if (isFolder) {
        const icon = isExpanded ? '📂' : '📁';
        html += `
          <button class="bsb-file-explorer__toggle" aria-label="${isExpanded ? 'Collapse' : 'Expand'} ${data.name}">
            <span class="bsb-file-explorer__toggle-icon">${icon}</span>
          </button>
        `;
      } else {
        const icon = this.getFileIcon(data.fileType || 'file');
        html += `<span class="bsb-file-explorer__toggle-icon">${icon}</span>`;
      }

      html += `
            <span class="bsb-file-explorer__name">${data.name}</span>
      `;

      if (data.importance === 'high') {
        html += '<span class="bsb-file-explorer__badge">Essential</span>';
      } else if (data.importance === 'medium') {
        html += '<span class="bsb-file-explorer__badge">Important</span>';
      }

      html += '</div>';

      if (hasChildren) {
        html += `
          <ul class="bsb-file-explorer__list bsb-file-explorer__list--nested" role="group">
            ${this.generateFileTreeHTML(item.children)}
          </ul>
        `;
      }

      html += '</li>';
      return html;
    }).join('');
  }

  /**
   * Get appropriate icon for file type
   */
  getFileIcon(fileType) {
    const icons = {
      config: '⚙️',
      docs: '📝',
      style: '🎨',
      script: '⚡',
      markup: '📄',
      test: '🧪',
      file: '📄'
    };
    return icons[fileType] || icons.file;
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
        event.preventDefault();
        if (item.dataset.type === 'folder') {
          this.toggleFolder(item, path);
        } else {
          this.showDetails(path);
        }
        break;
      case 'ArrowRight':
        if (item.dataset.type === 'folder' && !this.expandedFolders.has(path)) {
          event.preventDefault();
          this.toggleFolder(item, path);
        }
        break;
      case 'ArrowLeft':
        if (item.dataset.type === 'folder' && this.expandedFolders.has(path)) {
          event.preventDefault();
          this.toggleFolder(item, path);
        }
        break;
      default:
        // No action needed for other keys
        break;
    }
  }

  /**
   * Toggle folder expanded/collapsed state
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
    const left = rect.left - containerRect.left + (rect.width / CONSTANTS.POSITION_DIVISOR) - (tooltipRect.width / CONSTANTS.POSITION_DIVISOR);
    const top = rect.top - containerRect.top - tooltipRect.height - CONSTANTS.TOOLTIP_SPACING;

    this.tooltip.style.left = `${Math.max(CONSTANTS.TOOLTIP_SPACING, Math.min(left, containerRect.width - tooltipRect.width - CONSTANTS.TOOLTIP_SPACING))}px`;
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