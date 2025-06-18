/**
 * Source Directory Files Data
 * ===========================
 */

export const sourceDirectoryData = {
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
  }
};

export const componentsData = {
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
  }
};

export const stylesData = {
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
  }
};