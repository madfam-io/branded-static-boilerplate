# Theming Guide

> 🎨 **Learning Objective**: Master CSS custom properties and create beautiful, accessible themes for your BSB projects.

## Table of Contents

1. [Introduction to Theming](#introduction-to-theming)
2. [Understanding CSS Custom Properties](#understanding-css-custom-properties)
3. [BSB Theme Architecture](#bsb-theme-architecture)
4. [Creating Your First Theme](#creating-your-first-theme)
5. [Dark Mode Implementation](#dark-mode-implementation)
6. [Advanced Theming Techniques](#advanced-theming-techniques)
7. [Theme Accessibility](#theme-accessibility)
8. [Performance Considerations](#performance-considerations)
9. [Real-World Examples](#real-world-examples)
10. [Troubleshooting](#troubleshooting)

## Introduction to Theming

Theming is the art of making your website adaptable to different visual styles while maintaining consistency and accessibility. In BSB, we use modern CSS techniques to create themes that are:

- 🎯 **Consistent** - Colors, spacing, and typography work harmoniously
- 🔄 **Switchable** - Users can choose their preferred theme
- ♿ **Accessible** - All themes meet WCAG contrast requirements
- ⚡ **Performant** - No JavaScript required for basic theming
- 🌙 **Adaptive** - Responds to system preferences

### Prerequisites

Before starting this tutorial, you should understand:
- Basic CSS concepts
- CSS specificity and cascade
- How to use CSS variables

### What You'll Learn

- How CSS custom properties enable dynamic theming
- BSB's theme architecture and naming conventions
- Creating light and dark themes
- Implementing theme switching
- Advanced techniques like color schemes and theme variants

## Understanding CSS Custom Properties

CSS custom properties (also called CSS variables) are the foundation of modern theming.

### Basic Syntax

```css
/* Define a custom property */
:root {
  --primary-color: #0066cc;
}

/* Use the custom property */
.button {
  background-color: var(--primary-color);
}
```

### Why Custom Properties for Theming?

1. **Runtime Changes** - Update values without recompiling CSS
2. **Cascade & Inheritance** - Properties inherit like other CSS
3. **JavaScript Access** - Read and modify via JS when needed
4. **Fallback Values** - Provide defaults for older browsers

```css
/* Fallback example */
.element {
  /* Fallback for browsers without custom property support */
  color: #333;
  /* Modern browsers will use this */
  color: var(--text-color, #333);
}
```

### Scope and Inheritance

```css
/* Global scope */
:root {
  --spacing: 1rem;
}

/* Component scope */
.card {
  --spacing: 1.5rem; /* Overrides global */
}

/* Usage inherits from nearest scope */
.card .content {
  padding: var(--spacing); /* Uses 1.5rem */
}
```

## BSB Theme Architecture

BSB uses a systematic approach to theming with three levels:

### 1. Design Tokens (Base Level)

Located in `/src/styles/tokens.css`:

```css
:root {
  /* ==========================================================================
     COLOR PRIMITIVES
     Raw color values - the foundation of our color system
     ========================================================================== */
  
  /* Brand colors */
  --bsb-brand-50: #e6f2ff;
  --bsb-brand-100: #bae0ff;
  --bsb-brand-200: #7cc0ff;
  --bsb-brand-300: #36a0ff;
  --bsb-brand-400: #0080ff;
  --bsb-brand-500: #0066cc;  /* Primary brand color */
  --bsb-brand-600: #0052a3;
  --bsb-brand-700: #003d7a;
  --bsb-brand-800: #002952;
  --bsb-brand-900: #001429;
  
  /* Neutral colors */
  --bsb-gray-50: #f9fafb;
  --bsb-gray-100: #f3f4f6;
  --bsb-gray-200: #e5e7eb;
  --bsb-gray-300: #d1d5db;
  --bsb-gray-400: #9ca3af;
  --bsb-gray-500: #6b7280;
  --bsb-gray-600: #4b5563;
  --bsb-gray-700: #374151;
  --bsb-gray-800: #1f2937;
  --bsb-gray-900: #111827;
  
  /* ==========================================================================
     SPACING SCALE
     Consistent spacing system based on 4px grid
     ========================================================================== */
  
  --bsb-spacing-1: 0.25rem;  /* 4px */
  --bsb-spacing-2: 0.5rem;   /* 8px */
  --bsb-spacing-3: 0.75rem;  /* 12px */
  --bsb-spacing-4: 1rem;     /* 16px */
  --bsb-spacing-5: 1.25rem;  /* 20px */
  --bsb-spacing-6: 1.5rem;   /* 24px */
  --bsb-spacing-8: 2rem;     /* 32px */
  --bsb-spacing-10: 2.5rem;  /* 40px */
  --bsb-spacing-12: 3rem;    /* 48px */
  --bsb-spacing-16: 4rem;    /* 64px */
  
  /* ==========================================================================
     TYPOGRAPHY SCALE
     Modular scale for consistent typography
     ========================================================================== */
  
  /* Font families */
  --bsb-font-sans: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --bsb-font-mono: 'SF Mono', Monaco, 'Cascadia Code', monospace;
  
  /* Font sizes - 1.25 scale */
  --bsb-font-size-xs: 0.75rem;    /* 12px */
  --bsb-font-size-sm: 0.875rem;   /* 14px */
  --bsb-font-size-base: 1rem;     /* 16px */
  --bsb-font-size-lg: 1.125rem;   /* 18px */
  --bsb-font-size-xl: 1.25rem;    /* 20px */
  --bsb-font-size-2xl: 1.5rem;    /* 24px */
  --bsb-font-size-3xl: 1.875rem;  /* 30px */
  --bsb-font-size-4xl: 2.25rem;   /* 36px */
  --bsb-font-size-5xl: 3rem;      /* 48px */
  
  /* Font weights */
  --bsb-font-weight-normal: 400;
  --bsb-font-weight-medium: 500;
  --bsb-font-weight-semibold: 600;
  --bsb-font-weight-bold: 700;
  
  /* Line heights */
  --bsb-line-height-tight: 1.25;
  --bsb-line-height-normal: 1.5;
  --bsb-line-height-relaxed: 1.75;
  
  /* ==========================================================================
     EFFECTS
     Shadows, radii, and transitions
     ========================================================================== */
  
  /* Border radii */
  --bsb-radius-sm: 0.25rem;
  --bsb-radius-md: 0.375rem;
  --bsb-radius-lg: 0.5rem;
  --bsb-radius-xl: 0.75rem;
  --bsb-radius-2xl: 1rem;
  --bsb-radius-full: 9999px;
  
  /* Shadows */
  --bsb-shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --bsb-shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --bsb-shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --bsb-shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
  
  /* Transitions */
  --bsb-transition-fast: 150ms ease;
  --bsb-transition-base: 250ms ease;
  --bsb-transition-slow: 350ms ease;
}
```

### 2. Semantic Tokens (Theme Level)

Map design tokens to meaningful names:

```css
:root {
  /* ==========================================================================
     SEMANTIC COLOR TOKENS
     Map raw colors to meaningful use cases
     ========================================================================== */
  
  /* Background colors */
  --bsb-color-bg-primary: var(--bsb-gray-50);
  --bsb-color-bg-secondary: white;
  --bsb-color-surface: white;
  --bsb-color-surface-raised: var(--bsb-gray-50);
  
  /* Text colors */
  --bsb-color-text-primary: var(--bsb-gray-900);
  --bsb-color-text-secondary: var(--bsb-gray-600);
  --bsb-color-text-muted: var(--bsb-gray-500);
  --bsb-color-text-inverse: white;
  
  /* Brand colors */
  --bsb-color-primary: var(--bsb-brand-500);
  --bsb-color-primary-hover: var(--bsb-brand-600);
  --bsb-color-primary-active: var(--bsb-brand-700);
  
  /* UI colors */
  --bsb-color-border: var(--bsb-gray-200);
  --bsb-color-border-hover: var(--bsb-gray-300);
  --bsb-color-focus: var(--bsb-brand-500);
  
  /* Status colors */
  --bsb-color-success: #10b981;
  --bsb-color-warning: #f59e0b;
  --bsb-color-error: #ef4444;
  --bsb-color-info: #3b82f6;
}
```

### 3. Component Tokens (Component Level)

Components define their own tokens:

```css
.bsb-button {
  /* Component-specific tokens that use semantic tokens */
  --button-bg: var(--bsb-color-primary);
  --button-color: var(--bsb-color-text-inverse);
  --button-border: transparent;
  --button-shadow: var(--bsb-shadow-sm);
  
  /* Apply the tokens */
  background-color: var(--button-bg);
  color: var(--button-color);
  border: 1px solid var(--button-border);
  box-shadow: var(--button-shadow);
}
```

## Creating Your First Theme

Let's create a custom theme step by step.

### Step 1: Define Your Color Palette

Create `/src/styles/themes/ocean-theme.css`:

```css
/**
 * Ocean Theme
 * A calming blue-green theme inspired by the sea
 */

[data-theme="ocean"] {
  /* Override brand colors with ocean palette */
  --bsb-brand-50: #e6f7f7;
  --bsb-brand-100: #b3e5e5;
  --bsb-brand-200: #80d3d3;
  --bsb-brand-300: #4dc1c1;
  --bsb-brand-400: #26b3b3;
  --bsb-brand-500: #00a5a5;  /* Primary ocean color */
  --bsb-brand-600: #008484;
  --bsb-brand-700: #006363;
  --bsb-brand-800: #004242;
  --bsb-brand-900: #002121;
  
  /* Adjust semantic colors */
  --bsb-color-primary: var(--bsb-brand-500);
  --bsb-color-primary-hover: var(--bsb-brand-600);
  --bsb-color-primary-active: var(--bsb-brand-700);
  
  /* Ocean-specific additions */
  --bsb-color-accent: #00d9d9;
  --bsb-color-foam: #f0fffe;
  --bsb-color-deep: #003d3d;
}
```

### Step 2: Apply Theme to HTML

```html
<!-- Apply theme to root element -->
<html lang="en" data-theme="ocean">
  <!-- Your content -->
</html>

<!-- Or apply to specific sections -->
<section data-theme="ocean">
  <!-- This section uses ocean theme -->
</section>
```

### Step 3: Create Theme Switcher

Add theme switching functionality:

```javascript
/**
 * Theme Switcher
 * Allows users to select and persist theme preference
 */
class ThemeSwitcher {
  constructor() {
    this.themes = ['default', 'ocean', 'sunset', 'forest'];
    this.currentTheme = this.getStoredTheme() || 'default';
    this.init();
  }
  
  init() {
    // Apply stored theme
    this.applyTheme(this.currentTheme);
    
    // Create theme switcher UI
    this.createThemeSwitcher();
  }
  
  applyTheme(theme) {
    // Remove all theme classes
    this.themes.forEach(t => {
      document.documentElement.removeAttribute('data-theme');
    });
    
    // Apply new theme
    if (theme !== 'default') {
      document.documentElement.setAttribute('data-theme', theme);
    }
    
    // Store preference
    localStorage.setItem('bsb-theme-preference', theme);
    
    // Dispatch event
    window.dispatchEvent(new CustomEvent('bsb:theme:changed', {
      detail: { theme }
    }));
  }
  
  getStoredTheme() {
    return localStorage.getItem('bsb-theme-preference');
  }
  
  createThemeSwitcher() {
    const switcher = document.createElement('div');
    switcher.className = 'theme-switcher';
    switcher.innerHTML = `
      <label for="theme-select">Theme:</label>
      <select id="theme-select" class="theme-switcher__select">
        ${this.themes.map(theme => `
          <option value="${theme}" ${theme === this.currentTheme ? 'selected' : ''}>
            ${theme.charAt(0).toUpperCase() + theme.slice(1)}
          </option>
        `).join('')}
      </select>
    `;
    
    // Add event listener
    switcher.querySelector('select').addEventListener('change', (e) => {
      this.applyTheme(e.target.value);
    });
    
    // Insert into page
    document.querySelector('.theme-toggle-container').appendChild(switcher);
  }
}

// Initialize
new ThemeSwitcher();
```

## Dark Mode Implementation

Dark mode is essential for modern websites. BSB makes it easy to implement.

### Method 1: Automatic System Detection

```css
/* Light mode (default) */
:root {
  --bsb-color-bg-primary: white;
  --bsb-color-text-primary: var(--bsb-gray-900);
}

/* Dark mode based on system preference */
@media (prefers-color-scheme: dark) {
  :root {
    --bsb-color-bg-primary: var(--bsb-gray-900);
    --bsb-color-text-primary: var(--bsb-gray-100);
  }
}
```

### Method 2: Manual Toggle with Data Attribute

```css
/* Light mode (default) */
:root {
  --bsb-color-bg-primary: white;
  --bsb-color-text-primary: var(--bsb-gray-900);
}

/* Dark mode via data attribute */
[data-bsb-theme="dark"] {
  --bsb-color-bg-primary: var(--bsb-gray-900);
  --bsb-color-text-primary: var(--bsb-gray-100);
}
```

### Method 3: Hybrid Approach (BSB Recommended)

```css
/* Default to light theme */
:root {
  /* Light theme colors */
}

/* Auto dark mode if no manual preference */
@media (prefers-color-scheme: dark) {
  :root:not([data-bsb-theme="light"]) {
    /* Dark theme colors */
  }
}

/* Explicit dark theme */
[data-bsb-theme="dark"] {
  /* Dark theme colors */
}

/* Explicit light theme (overrides system) */
[data-bsb-theme="light"] {
  /* Light theme colors */
}
```

### Dark Mode Color Guidelines

1. **Don't use pure black** - Use dark grays (#111827)
2. **Reduce contrast** - 15:1 instead of 21:1
3. **Desaturate colors** - Less vibrant in dark mode
4. **Adjust shadows** - Use light shadows on dark backgrounds

```css
/* Dark mode adjustments */
[data-bsb-theme="dark"] {
  /* Backgrounds */
  --bsb-color-bg-primary: #0f172a;      /* Not pure black */
  --bsb-color-surface: #1e293b;
  --bsb-color-surface-raised: #334155;
  
  /* Text - reduced contrast */
  --bsb-color-text-primary: #f1f5f9;    /* Not pure white */
  --bsb-color-text-secondary: #cbd5e1;
  --bsb-color-text-muted: #94a3b8;
  
  /* Borders - subtle */
  --bsb-color-border: #334155;
  --bsb-color-border-hover: #475569;
  
  /* Shadows - light colored */
  --bsb-shadow-sm: 0 1px 2px 0 rgb(255 255 255 / 0.05);
  --bsb-shadow-md: 0 4px 6px -1px rgb(255 255 255 / 0.07);
  
  /* Brand colors - desaturated */
  --bsb-color-primary: #60a5fa;         /* Lighter, less saturated */
  --bsb-color-primary-hover: #3b82f6;
}
```

## Advanced Theming Techniques

### 1. Color Schemes

Create cohesive color schemes using CSS color functions:

```css
:root {
  /* Define base hue */
  --theme-hue: 210;
  
  /* Generate color scheme from hue */
  --bsb-color-primary: hsl(var(--theme-hue), 70%, 50%);
  --bsb-color-primary-light: hsl(var(--theme-hue), 70%, 70%);
  --bsb-color-primary-dark: hsl(var(--theme-hue), 70%, 30%);
  
  /* Complementary color */
  --bsb-color-accent: hsl(calc(var(--theme-hue) + 180), 60%, 50%);
  
  /* Analogous colors */
  --bsb-color-secondary: hsl(calc(var(--theme-hue) + 30), 50%, 50%);
  --bsb-color-tertiary: hsl(calc(var(--theme-hue) - 30), 50%, 50%);
}

/* User can change entire scheme by changing one value */
[data-color-scheme="warm"] {
  --theme-hue: 20; /* Orange base */
}

[data-color-scheme="cool"] {
  --theme-hue: 200; /* Blue base */
}
```

### 2. Contrast Modes

Support high contrast for accessibility:

```css
/* Normal contrast */
:root {
  --contrast-ratio: 1;
}

/* High contrast mode */
@media (prefers-contrast: high),
       [data-contrast="high"] {
  :root {
    --contrast-ratio: 1.5;
    
    /* Increase color differences */
    --bsb-color-text-primary: black;
    --bsb-color-bg-primary: white;
    --bsb-color-border: black;
    
    /* Thicker borders */
    --bsb-border-width: calc(1px * var(--contrast-ratio));
    
    /* Remove shadows */
    --bsb-shadow-sm: none;
    --bsb-shadow-md: none;
  }
}
```

### 3. Theme Variants

Create variations of themes:

```css
/* Base ocean theme */
[data-theme="ocean"] {
  --bsb-color-primary: #00a5a5;
}

/* Ocean theme variants */
[data-theme="ocean"][data-variant="soft"] {
  /* Muted version */
  --bsb-color-primary: #4dc1c1;
  --bsb-color-bg-primary: #f0fffe;
}

[data-theme="ocean"][data-variant="bold"] {
  /* High contrast version */
  --bsb-color-primary: #006363;
  --bsb-color-text-primary: #002121;
}
```

### 4. Contextual Theming

Different themes for different sections:

```css
/* Marketing sections */
.hero[data-theme-context="marketing"] {
  --bsb-color-primary: var(--bsb-color-accent);
  --bsb-gradient-hero: linear-gradient(135deg, 
    var(--bsb-color-primary) 0%, 
    var(--bsb-color-secondary) 100%
  );
}

/* Documentation sections */
.docs[data-theme-context="documentation"] {
  --bsb-color-bg-primary: var(--bsb-color-surface);
  --bsb-font-family-body: var(--bsb-font-mono);
}

/* Dashboard sections */
.dashboard[data-theme-context="app"] {
  --bsb-color-surface: var(--bsb-gray-100);
  --bsb-radius-default: var(--bsb-radius-sm);
}
```

### 5. Dynamic Theme Generation

Generate themes programmatically:

```javascript
class DynamicTheme {
  /**
   * Generate theme from brand color
   * @param {string} brandColor - Hex color value
   * @returns {object} Theme object
   */
  static generateFromColor(brandColor) {
    const hsl = this.hexToHSL(brandColor);
    
    return {
      // Generate color scale
      '--bsb-brand-50': this.adjustColor(hsl, { l: 95 }),
      '--bsb-brand-100': this.adjustColor(hsl, { l: 90 }),
      '--bsb-brand-200': this.adjustColor(hsl, { l: 80 }),
      '--bsb-brand-300': this.adjustColor(hsl, { l: 70 }),
      '--bsb-brand-400': this.adjustColor(hsl, { l: 60 }),
      '--bsb-brand-500': brandColor,
      '--bsb-brand-600': this.adjustColor(hsl, { l: 45 }),
      '--bsb-brand-700': this.adjustColor(hsl, { l: 35 }),
      '--bsb-brand-800': this.adjustColor(hsl, { l: 25 }),
      '--bsb-brand-900': this.adjustColor(hsl, { l: 15 }),
      
      // Generate complementary colors
      '--bsb-color-accent': this.adjustColor(hsl, { h: 180 }),
      '--bsb-color-success': this.adjustColor(hsl, { h: -120, s: 60 }),
      '--bsb-color-warning': this.adjustColor(hsl, { h: -160, s: 70 }),
      '--bsb-color-error': this.adjustColor(hsl, { h: -140, s: 65 })
    };
  }
  
  /**
   * Apply generated theme
   * @param {object} theme - Theme object
   */
  static applyTheme(theme) {
    const root = document.documentElement;
    
    Object.entries(theme).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }
  
  // Utility functions for color manipulation...
}

// Usage
const customTheme = DynamicTheme.generateFromColor('#ff6b6b');
DynamicTheme.applyTheme(customTheme);
```

## Theme Accessibility

Ensure your themes are accessible to all users.

### 1. Color Contrast

Always check WCAG contrast ratios:

```css
/* Minimum contrast ratios:
   - Normal text: 4.5:1
   - Large text: 3:1
   - UI components: 3:1
*/

.theme-validator {
  /* Use CSS custom properties for validation */
  --contrast-check: calc(
    contrast(var(--bsb-color-text-primary), var(--bsb-color-bg-primary))
  );
}
```

JavaScript contrast checker:

```javascript
/**
 * Check contrast ratio between two colors
 * @param {string} color1 - Foreground color
 * @param {string} color2 - Background color
 * @returns {number} Contrast ratio
 */
function getContrastRatio(color1, color2) {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Validate theme accessibility
 * @param {object} theme - Theme object
 * @returns {object} Validation results
 */
function validateThemeAccessibility(theme) {
  const results = {
    passed: true,
    issues: []
  };
  
  // Check text contrast
  const textContrast = getContrastRatio(
    theme['--bsb-color-text-primary'],
    theme['--bsb-color-bg-primary']
  );
  
  if (textContrast < 4.5) {
    results.passed = false;
    results.issues.push({
      type: 'contrast',
      message: `Text contrast ${textContrast.toFixed(2)} is below 4.5:1`,
      severity: 'error'
    });
  }
  
  // Check focus indicators
  if (!theme['--bsb-color-focus']) {
    results.passed = false;
    results.issues.push({
      type: 'focus',
      message: 'No focus color defined',
      severity: 'error'
    });
  }
  
  return results;
}
```

### 2. Focus Indicators

Ensure visible focus for all themes:

```css
/* Base focus styles */
:focus-visible {
  outline: 2px solid var(--bsb-color-focus);
  outline-offset: 2px;
}

/* Enhanced focus for dark themes */
[data-bsb-theme="dark"] :focus-visible {
  outline-width: 3px;
  outline-color: var(--bsb-color-focus-light);
}

/* High contrast focus */
@media (prefers-contrast: high) {
  :focus-visible {
    outline-width: 4px;
    outline-style: double;
  }
}
```

### 3. Color Blind Friendly

Design themes that work for color blindness:

```css
/* Don't rely on color alone */
.status-indicator {
  /* Use icons + color */
  &[data-status="success"] {
    color: var(--bsb-color-success);
    &::before { content: "✓ "; }
  }
  
  &[data-status="error"] {
    color: var(--bsb-color-error);
    &::before { content: "✗ "; }
  }
}

/* Provide patterns for charts */
.chart-series-1 {
  fill: var(--bsb-color-primary);
  fill-pattern: url(#pattern-diagonal);
}

.chart-series-2 {
  fill: var(--bsb-color-secondary);
  fill-pattern: url(#pattern-dots);
}
```

## Performance Considerations

### 1. CSS Variable Performance

```css
/* ✅ Good: Use variables for values that change */
.theme-aware {
  color: var(--bsb-color-text);
  background: var(--bsb-color-bg);
}

/* ❌ Avoid: Don't use for static values */
.static-element {
  /* This never changes with theme */
  position: var(--position-relative); /* Unnecessary */
}
```

### 2. Reduce Paint Operations

```css
/* Group theme changes to minimize repaints */
[data-theme="dark"] {
  /* Change multiple properties at once */
  --bsb-color-bg: #1a1a1a;
  --bsb-color-text: #ffffff;
  --bsb-color-border: #333333;
}

/* Avoid frequent inline style changes */
/* ❌ Bad */
element.style.setProperty('--color', value1);
element.style.setProperty('--bg', value2);

/* ✅ Good */
element.style.cssText = `
  --color: ${value1};
  --bg: ${value2};
`;
```

### 3. Lazy Load Theme CSS

```html
<!-- Load default theme immediately -->
<link rel="stylesheet" href="/styles/themes/default.css">

<!-- Lazy load other themes -->
<link 
  rel="preload" 
  href="/styles/themes/dark.css" 
  as="style"
  onload="this.onload=null;this.rel='stylesheet'"
>
```

JavaScript theme loader:

```javascript
class ThemeLoader {
  static loadTheme(themeName) {
    // Check if already loaded
    if (document.querySelector(`link[data-theme="${themeName}"]`)) {
      return Promise.resolve();
    }
    
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `/styles/themes/${themeName}.css`;
      link.dataset.theme = themeName;
      
      link.onload = resolve;
      link.onerror = reject;
      
      document.head.appendChild(link);
    });
  }
}
```

## Real-World Examples

### Example 1: E-commerce Theme

```css
/* E-commerce specific theme */
[data-theme="shop"] {
  /* Warm, trustworthy colors */
  --bsb-color-primary: #2563eb;      /* Trust blue */
  --bsb-color-accent: #10b981;       /* Success green */
  --bsb-color-sale: #ef4444;         /* Sale red */
  
  /* Increase touch targets for mobile */
  --bsb-spacing-touch: max(44px, var(--bsb-spacing-8));
  
  /* Product-specific variables */
  --product-card-shadow: var(--bsb-shadow-md);
  --product-badge-bg: var(--bsb-color-sale);
  --cart-highlight: var(--bsb-color-accent);
}

/* Product card using theme */
.product-card {
  box-shadow: var(--product-card-shadow);
  
  .badge-sale {
    background: var(--product-badge-bg);
  }
  
  .add-to-cart:hover {
    background: var(--cart-highlight);
  }
}
```

### Example 2: Documentation Theme

```css
/* Documentation theme with excellent readability */
[data-theme="docs"] {
  /* Optimized for reading */
  --bsb-font-size-base: 1.125rem;    /* Larger text */
  --bsb-line-height-normal: 1.7;     /* More spacing */
  --bsb-color-text-primary: #1a202c; /* High contrast */
  
  /* Code-specific */
  --code-bg: #f7fafc;
  --code-border: #e2e8f0;
  --code-text: #2d3748;
  
  /* Sidebar */
  --sidebar-bg: #f9fafb;
  --sidebar-border: #e5e7eb;
  --sidebar-active: var(--bsb-color-primary);
}

/* Dark mode adjustments */
[data-theme="docs"][data-bsb-theme="dark"] {
  --code-bg: #1e293b;
  --code-border: #334155;
  --code-text: #f1f5f9;
  
  --sidebar-bg: #0f172a;
  --sidebar-border: #1e293b;
}
```

### Example 3: Gaming Theme

```css
/* Gaming theme with bold colors and effects */
[data-theme="gaming"] {
  /* Neon color palette */
  --bsb-color-primary: #00ffff;      /* Cyan */
  --bsb-color-accent: #ff00ff;       /* Magenta */
  --bsb-color-highlight: #ffff00;   /* Yellow */
  
  /* Dark backgrounds */
  --bsb-color-bg-primary: #0a0a0a;
  --bsb-color-surface: #1a1a1a;
  
  /* Glowing effects */
  --glow-sm: 0 0 10px currentColor;
  --glow-md: 0 0 20px currentColor;
  --glow-lg: 0 0 30px currentColor;
  
  /* Gaming fonts */
  --bsb-font-display: 'Orbitron', var(--bsb-font-sans);
}

/* Neon button effect */
.gaming-button {
  color: var(--bsb-color-primary);
  border: 2px solid currentColor;
  text-shadow: var(--glow-sm);
  box-shadow: var(--glow-md), inset var(--glow-sm);
  
  &:hover {
    animation: pulse-glow 1s ease-in-out infinite;
  }
}

@keyframes pulse-glow {
  50% {
    box-shadow: var(--glow-lg), inset var(--glow-md);
  }
}
```

## Troubleshooting

### Common Issues and Solutions

#### 1. Theme Not Applying

**Problem**: Theme changes don't appear
```css
/* Check specificity */
[data-theme="custom"] {
  --color: red; /* Too low specificity? */
}
```

**Solution**: Increase specificity or check cascade
```css
:root[data-theme="custom"] {
  --color: red !important; /* Last resort */
}
```

#### 2. Flash of Unstyled Content (FOUC)

**Problem**: Theme flashes on load

**Solution**: Apply theme before render
```html
<script>
  // Run immediately in <head>
  (function() {
    const theme = localStorage.getItem('theme') || 'default';
    document.documentElement.setAttribute('data-theme', theme);
  })();
</script>
```

#### 3. CSS Variables Not Working

**Problem**: Variables show as invalid

**Solution**: Check browser support and fallbacks
```css
.element {
  /* Fallback for older browsers */
  color: #333;
  color: var(--text-color, #333);
}
```

#### 4. Performance Issues

**Problem**: Theme switching is slow

**Solution**: Optimize variable usage
```css
/* Don't animate everything */
* {
  transition: none !important;
}

/* Animate only what changes */
.theme-transition {
  transition: 
    color 0.3s ease,
    background-color 0.3s ease,
    border-color 0.3s ease;
}
```

### Debug Mode

Enable theme debugging:

```javascript
class ThemeDebugger {
  static enable() {
    // Show all CSS variables
    const computed = getComputedStyle(document.documentElement);
    const variables = Array.from(document.styleSheets)
      .flatMap(sheet => Array.from(sheet.cssRules))
      .filter(rule => rule.selectorText === ':root')
      .flatMap(rule => Array.from(rule.style))
      .filter(prop => prop.startsWith('--'));
    
    console.table(
      variables.map(prop => ({
        property: prop,
        value: computed.getPropertyValue(prop),
        source: this.findSource(prop)
      }))
    );
  }
  
  static validateContrast() {
    // Check all text/background combinations
    const elements = document.querySelectorAll('*');
    const issues = [];
    
    elements.forEach(el => {
      const style = getComputedStyle(el);
      const bg = style.backgroundColor;
      const fg = style.color;
      
      if (bg !== 'transparent' && fg) {
        const ratio = getContrastRatio(fg, bg);
        if (ratio < 4.5) {
          issues.push({
            element: el,
            contrast: ratio,
            foreground: fg,
            background: bg
          });
        }
      }
    });
    
    if (issues.length) {
      console.warn('Contrast issues found:', issues);
    }
  }
}
```

## Summary

You've mastered BSB theming! Key takeaways:

### 🎯 Best Practices

1. **Use semantic naming** - `--color-primary` not `--blue-500`
2. **Layer your tokens** - Design → Semantic → Component
3. **Test accessibility** - Every theme must pass WCAG
4. **Optimize performance** - Only use variables for dynamic values
5. **Document themes** - Include usage examples

### 🚀 Next Steps

1. Create a custom theme for your project
2. Implement a theme builder tool
3. Explore CSS color functions
4. Study [Advanced Theming Patterns](./advanced-theming.md)

### 📚 Resources

- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [WCAG Color Contrast](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [Prefers Color Scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [HSL Color Model](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hsl)

---

*Remember: A great theme is invisible - it enhances the content without drawing attention to itself. Happy theming!* 🎨