# BSB Helper API Documentation

> JavaScript API for BSB's educational development tools

## Overview

The BSB Helper is a development-only JavaScript module that provides interactive learning tools when running in development mode. It enhances the educational value of BSB without affecting production performance.

## 📋 Table of Contents

- [Core Features](#-core-features)
- [API Reference](#-api-reference)
- [Events](#-events)
- [Configuration](#-configuration)
- [Examples](#-examples)

## 🎯 Core Features

### Interactive Component Documentation
- **Help buttons** appear on hover for each component
- **Modal documentation** shows component details and examples
- **Live code inspection** reveals CSS classes and attributes

### Development Tools
- **Grid overlay** for layout debugging
- **Component highlighting** on hover
- **Keyboard shortcuts** for quick access
- **Performance monitoring** with load time display

### Educational Enhancements
- **Contextual tooltips** explain component purposes
- **Progressive disclosure** of advanced features
- **Learning paths** guide through codebase exploration

## 📖 API Reference

### Constructor

#### `new BSBHelper()`

Creates a new BSB Helper instance. Automatically initializes if `bsb-dev-mode` is enabled in localStorage.

```javascript
// Automatic initialization
const helper = new BSBHelper();

// Manual initialization
const helper = new BSBHelper();
if (shouldEnableDevMode) {
  helper.init();
}
```

### Methods

#### `init()`

Initializes the BSB Helper system.

```javascript
helper.init();
```

**Returns**: `void`

**Side effects**:
- Scans DOM for components with `data-bsb-component`
- Creates development panel
- Sets up keyboard shortcuts
- Adds component helpers

---

#### `setup()`

Sets up the complete BSB Helper interface after DOM is ready.

```javascript
helper.setup();
```

**Returns**: `void`

**Called automatically** by `init()` when DOM is ready.

---

#### `findComponents()`

Scans the DOM for components and stores them in the internal registry.

```javascript
helper.findComponents();
```

**Returns**: `void`

**Stores**: Map of component names to DOM elements

---

#### `createDevPanel()`

Creates the floating development panel with tools and information.

```javascript
helper.createDevPanel();
```

**Returns**: `void`

**Creates**: Development panel with:
- Component count
- Page load time
- Quick action buttons
- Documentation links

---

#### `addComponentHelpers()`

Adds help buttons to each component for interactive documentation.

```javascript
helper.addComponentHelpers();
```

**Returns**: `void`

**Adds**: Help button (?) to each `[data-bsb-component]` element

---

#### `showComponentDocs(componentName, element)`

Displays a modal with component documentation and details.

```javascript
helper.showComponentDocs('card', cardElement);
```

**Parameters**:
- `componentName` (string): Name of the component
- `element` (HTMLElement): The component DOM element

**Returns**: `void`

**Shows**: Modal with:
- Component file structure
- CSS classes
- HTML attributes
- Documentation links

---

#### `setupKeyboardShortcuts()`

Registers keyboard shortcuts for development tools.

```javascript
helper.setupKeyboardShortcuts();
```

**Returns**: `void`

**Shortcuts**:
- `Ctrl/Cmd + G`: Toggle grid overlay
- `Ctrl/Cmd + H`: Toggle component helpers
- `Ctrl/Cmd + I`: Toggle inspect mode
- `Ctrl/Cmd + D`: Toggle development panel

---

#### `addGridOverlay()`

Creates a grid overlay for layout debugging.

```javascript
helper.addGridOverlay();
```

**Returns**: `void`

**Creates**: Visual grid overlay matching container widths

---

#### `toggleGrid()`

Toggles the visibility of the grid overlay.

```javascript
helper.toggleGrid();
```

**Returns**: `void`

**Toggles**: `.bsb-show-grid` class on body

---

#### `toggleHelpers()`

Toggles the visibility of component help buttons.

```javascript
helper.toggleHelpers();
```

**Returns**: `void`

**Toggles**: `.bsb-show-helpers` class on body

---

#### `toggleInspectMode()`

Toggles component inspection mode.

```javascript
helper.toggleInspectMode();
```

**Returns**: `void`

**Features**:
- Click components to view documentation
- Hover to highlight components
- Cursor changes to crosshair

---

#### `toggleDevPanel()`

Toggles the visibility of the development panel.

```javascript
helper.toggleDevPanel();
```

**Returns**: `void**

**Toggles**: `.bsb-dev-panel--hidden` class

---

#### `startInspecting()`

Enables component inspection mode.

```javascript
helper.startInspecting();
```

**Returns**: `void`

**Adds**: Click and hover event listeners for inspection

---

#### `stopInspecting()`

Disables component inspection mode.

```javascript
helper.stopInspecting();
```

**Returns**: `void`

**Removes**: Inspection event listeners and highlights

---

#### `setupPanelInteractions(panel)`

Sets up click handlers for development panel buttons.

```javascript
helper.setupPanelInteractions(panelElement);
```

**Parameters**:
- `panel` (HTMLElement): The development panel element

**Returns**: `void**

---

#### `addDevStyles()`

Injects CSS styles for development tools.

```javascript
helper.addDevStyles();
```

**Returns**: `void`

**Injects**: Comprehensive CSS for:
- Development panel styling
- Component helper buttons
- Grid overlay appearance
- Inspection mode visuals

## 🎮 Events

The BSB Helper uses standard DOM events for interactions:

### Custom Events

#### `bsb:dev-mode-enabled`

Fired when development mode is activated.

```javascript
document.addEventListener('bsb:dev-mode-enabled', (event) => {
  console.log('BSB development mode activated');
});
```

#### `bsb:component-inspected`

Fired when a component is inspected.

```javascript
document.addEventListener('bsb:component-inspected', (event) => {
  const { componentName, element } = event.detail;
  console.log(`Inspected ${componentName}`, element);
});
```

### Standard Events

The helper responds to these DOM events:

- **`DOMContentLoaded`**: Initializes when DOM is ready
- **`click`**: Component inspection and panel interactions
- **`mouseover`**: Component highlighting
- **`keydown`**: Keyboard shortcuts
- **`load`**: Performance timing calculation

## ⚙️ Configuration

### Environment Detection

BSB Helper automatically detects the environment:

```javascript
// Development mode detection
const isDev = localStorage.getItem('bsb-dev-mode') === 'true';
const isLocalhost = window.location.hostname === 'localhost';
```

### Enabling Development Mode

```javascript
// Enable via localStorage
localStorage.setItem('bsb-dev-mode', 'true');

// Enable via helper function
window.enableLearningMode();

// Manual initialization
const helper = new BSBHelper();
helper.init();
```

### Customizing Behavior

```javascript
// Disable specific features
const helper = new BSBHelper();
helper.components = new Map(); // Skip component scanning
helper.init();

// Custom keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.key === 'F1') {
    helper.showComponentDocs('help', document.body);
  }
});
```

## 💡 Examples

### Basic Usage

```javascript
// Check if BSB Helper is available
if (window.BSBHelper) {
  const helper = new window.BSBHelper();
  
  // Development mode is automatically detected
  // No manual initialization needed
}
```

### Custom Component Integration

```html
<!-- Add data-bsb-component to your elements -->
<div class="my-component" data-bsb-component="my-component">
  <h2>Custom Component</h2>
  <p>This will get automatic help buttons in dev mode</p>
</div>
```

### Manual Documentation Display

```javascript
// Show documentation for a specific component
const cardElement = document.querySelector('.bsb-card');
if (cardElement && window.BSBHelper) {
  const helper = new window.BSBHelper();
  helper.showComponentDocs('card', cardElement);
}
```

### Performance Monitoring

```javascript
// Access performance data
window.addEventListener('load', () => {
  if (window.BSBHelper) {
    const loadTime = performance.timing.loadEventEnd - 
                     performance.timing.navigationStart;
    console.log(`Page loaded in ${loadTime}ms`);
  }
});
```

### Custom Development Tools

```javascript
// Extend BSB Helper with custom tools
class CustomBSBHelper extends window.BSBHelper {
  constructor() {
    super();
    this.customFeatures = new Set();
  }
  
  addCustomFeature(name, callback) {
    this.customFeatures.add({ name, callback });
  }
  
  // Override to add custom panel content
  createDevPanel() {
    super.createDevPanel();
    this.addCustomPanelSection();
  }
  
  addCustomPanelSection() {
    const panel = document.querySelector('.bsb-dev-panel__content');
    const customSection = document.createElement('div');
    customSection.innerHTML = `
      <div class="bsb-dev-panel__section">
        <h6>Custom Tools</h6>
        ${Array.from(this.customFeatures).map(feature => 
          `<button onclick="${feature.callback}">${feature.name}</button>`
        ).join('')}
      </div>
    `;
    panel.appendChild(customSection);
  }
}

// Usage
const customHelper = new CustomBSBHelper();
customHelper.addCustomFeature('Test Accessibility', 'runA11yTest()');
```

## 🎨 Styling Development Tools

### Custom Panel Themes

```css
/* Dark theme for development panel */
[data-bsb-theme="dark"] .bsb-dev-panel {
  background: #1a1a1a;
  color: #e0e0e0;
  border-color: #333;
}

[data-bsb-theme="dark"] .bsb-dev-panel__header {
  background: #2a2a2a;
  border-color: #333;
}
```

### Custom Helper Button Styles

```css
/* Custom help button appearance */
.bsb-dev-helper {
  background: var(--your-brand-color);
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.bsb-dev-helper:hover {
  transform: scale(1.1);
}
```

## 🔒 Security Considerations

### Production Safety

BSB Helper is designed to be safe in production:

```javascript
// Only loads in development
if (localStorage.getItem('bsb-dev-mode') === 'true') {
  // Helper functionality
}

// No sensitive data exposure
// No modification of production behavior
// Performance impact only in development
```

### Content Security Policy

BSB Helper works with strict CSP:

```html
<!-- Inline styles use nonce -->
<meta http-equiv="Content-Security-Policy" 
      content="script-src 'self' 'nonce-xyz'; style-src 'self' 'nonce-xyz'">
```

## 🔗 Related APIs

- **[Main JavaScript API](main-js.md)** - Core site functionality
- **[Component Events](component-events.md)** - Component interaction patterns
- **[Performance API](performance.md)** - Site optimization tools

## 📚 Learn More

- **[Development Guide](../tutorials/development.md)** - Setting up development environment
- **[Component Development](../tutorials/component-development.md)** - Creating educational components
- **[Debugging Guide](../tutorials/debugging.md)** - Troubleshooting BSB Helper

---

**🔗 Quick Navigation**
- [← API Documentation](README.md)
- [Next: Main JS API →](main-js.md)
- [Component Development →](../tutorials/component-development.md)