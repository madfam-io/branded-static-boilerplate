# BSB API Documentation

> Complete technical reference for BSB's JavaScript and CSS APIs

## Overview

This section provides comprehensive API documentation for all programmable aspects of BSB, from JavaScript functions to CSS custom properties. Use these references when building on top of BSB or contributing to the project.

## 📋 Table of Contents

- [JavaScript APIs](#-javascript-apis)
- [CSS APIs](#-css-apis)  
- [Component APIs](#-component-apis)
- [Build APIs](#-build-apis)
- [Development APIs](#-development-apis)

## 🟨 JavaScript APIs

### Core JavaScript
| API | Purpose | Status |
|-----|---------|--------|
| **[BSB Helper](bsb-helper.md)** | Development tools and learning aids | ✅ Complete |
| **[Main JavaScript](main-js.md)** | Core site functionality | 📝 In Progress |
| **[Utility Functions](utilities.md)** | Helper functions and tools | 📋 Planned |

### Component JavaScript
| API | Purpose | Status |
|-----|---------|--------|
| **[Header Component JS](../src/components/header/README.md#javascript-api)** | Navigation functionality | ✅ Complete |
| **[Component Events](component-events.md)** | Interaction patterns | 📝 In Progress |
| **[Form Enhancement](form-enhancement.md)** | Progressive form features | 📋 Planned |

### Global Functions
| Function | Purpose | Location |
|----------|---------|----------|
| `enableLearningMode()` | Activate development mode | `window.enableLearningMode` |
| `BSBHelper` | Development tools class | `window.BSBHelper` |
| `BSBHeader.initialize()` | Header component setup | `window.BSBHeader` |
| `BSBUtils.debounce()` | Performance utility | `window.BSBUtils` |

## 🎨 CSS APIs

### Design System
| API | Purpose | Status |
|-----|---------|--------|
| **[Design Tokens](design-tokens.md)** | CSS custom properties | 📝 In Progress |
| **[Color Palette](colors.md)** | Color system reference | 📋 Planned |
| **[Typography Scale](typography.md)** | Text styling system | 📋 Planned |
| **[Spacing System](spacing.md)** | Layout spacing tokens | 📋 Planned |

### Layout Systems
| API | Purpose | Status |
|-----|---------|--------|
| **[Grid System](grid-system.md)** | Layout utilities | 📝 In Progress |
| **[Container System](containers.md)** | Content width management | 📋 Planned |
| **[Flexbox Utilities](flexbox.md)** | Flex layout helpers | 📋 Planned |

### Component Styling
| API | Purpose | Documentation |
|-----|---------|---------------|
| Card Component CSS | Content container styling | [Card README](../../src/components/card/README.md#css-classes-reference) |
| Hero Component CSS | Page header styling | [Hero README](../../src/components/hero/README.md#css-classes-reference) |
| Header Component CSS | Navigation styling | [Header README](../../src/components/header/README.md#css-classes-reference) |
| Footer Component CSS | Site footer styling | [Footer README](../../src/components/footer/README.md#css-classes-reference) |

## 🧩 Component APIs

### UI Components
Each component includes comprehensive API documentation:

| Component | HTML API | CSS API | JS API | Documentation |
|-----------|----------|---------|--------|---------------|
| **Card** | Data attributes, semantic structure | CSS classes, modifiers | None | [Card README](../../src/components/card/README.md) |
| **Hero** | Content structure, accessibility | Layout modifiers, themes | None | [Hero README](../../src/components/hero/README.md) |
| **Header** | Navigation markup, ARIA | Responsive styles | Menu interactions | [Header README](../../src/components/header/README.md) |
| **Footer** | Site information structure | Grid layout | None | [Footer README](../../src/components/footer/README.md) |

### Component Development API
| Feature | Purpose | Documentation |
|---------|---------|---------------|
| `data-bsb-component` | Component identification | [Component Development](../tutorials/component-development.md) |
| BEM naming convention | CSS class methodology | [CSS Architecture](../../src/styles/README.md) |
| Component generators | Automated component creation | [Development Tools](../tutorials/development-tools.md) |

## 🔧 Build APIs

### Build System
| API | Purpose | Status |
|-----|---------|--------|
| **[Vite Configuration](vite-config.md)** | Build tool setup | 📋 Planned |
| **[PostCSS Plugins](postcss-config.md)** | CSS processing | 📋 Planned |
| **[ESLint Configuration](eslint-config.md)** | Code quality rules | 📋 Planned |

### Deployment APIs
| API | Purpose | Status |
|-----|---------|--------|
| **[GitHub Actions](github-actions.md)** | CI/CD workflows | 📋 Planned |
| **[Build Scripts](build-scripts.md)** | npm script reference | 📋 Planned |

## 🛠️ Development APIs

### Development Tools
| Tool | API Documentation | Purpose |
|------|-------------------|---------|
| **BSB Helper** | [Complete API](bsb-helper.md) | Interactive learning tools |
| **Component Inspector** | Part of BSB Helper | Visual component exploration |
| **Grid Overlay** | Part of BSB Helper | Layout debugging |
| **Performance Monitor** | Part of BSB Helper | Load time tracking |

### Development Utilities
| Utility | Purpose | API Reference |
|---------|---------|---------------|
| Hot Reloading | Live development updates | Built into Vite |
| Error Overlay | Development error display | Built into Vite |
| Source Maps | Debug support | Configured in build |

## 📖 Quick Reference

### Most Used APIs

#### CSS Custom Properties
```css
/* Colors */
--bsb-primary: #007bff;
--bsb-secondary: #6c757d;

/* Spacing */
--bsb-space-4: 1rem;
--bsb-space-8: 2rem;

/* Typography */
--bsb-text-base: 1rem;
--bsb-font-base: system-ui;
```

#### JavaScript Functions
```javascript
// Enable development mode
enableLearningMode();

// Initialize BSB Helper
const helper = new BSBHelper();

// Header functionality
BSBHeader.initialize();

// Utility functions
BSBUtils.debounce(callback, delay);
BSBUtils.throttle(callback, limit);
```

#### Component Data Attributes
```html
<!-- Component identification -->
<div data-bsb-component="card">

<!-- Component documentation -->
<div data-bsb-docs="/components/card/README.md">

<!-- Component examples -->
<div data-bsb-examples="/components/card/examples/">
```

### Common Patterns

#### Creating Custom Components
```html
<!-- 1. HTML Structure -->
<article class="bsb-my-component" data-bsb-component="my-component">
  <div class="bsb-my-component__content">
    <h3 class="bsb-my-component__title">Title</h3>
  </div>
</article>
```

```css
/* 2. CSS Styling */
.bsb-my-component {
  /* Use design tokens */
  padding: var(--bsb-space-4);
  background: var(--bsb-bg-primary);
  border-radius: var(--bsb-radius-md);
}
```

```javascript
// 3. JavaScript Enhancement (optional)
class MyComponent {
  constructor(element) {
    this.element = element;
    this.init();
  }
  
  init() {
    // Progressive enhancement
  }
}
```

#### Using Design Tokens
```css
/* ✅ Good: Use design tokens */
.my-element {
  margin: var(--bsb-space-4);
  color: var(--bsb-text-primary);
  font-size: var(--bsb-text-lg);
}

/* ❌ Avoid: Magic numbers */
.my-element {
  margin: 16px;
  color: #333333;
  font-size: 18px;
}
```

## 🔄 API Versioning

BSB follows semantic versioning for API stability:

### Current Version: 1.0.0

#### Stable APIs (won't break)
- Core CSS custom properties
- Component HTML structure
- Essential JavaScript functions

#### Experimental APIs (may change)
- Advanced BSB Helper features
- Development-only tools
- New component patterns

#### Deprecated APIs (avoid using)
- None currently

### Breaking Change Policy
- **Major version** (2.0.0): Breaking changes allowed
- **Minor version** (1.1.0): New features, backward compatible
- **Patch version** (1.0.1): Bug fixes only

## 📚 Learning Resources

### For API Users
- **[Getting Started](../tutorials/getting-started.md)** - Basic API usage
- **[Component Development](../tutorials/component-development.md)** - Building with APIs
- **[Examples](../examples/)** - Real-world API usage

### For API Contributors
- **[Contributing Guide](../../CONTRIBUTING.md)** - How to contribute to APIs
- **[Code Standards](../tutorials/code-standards.md)** - API design principles
- **[Testing Guide](../tutorials/testing.md)** - API testing requirements

## 🆘 Support

### Getting Help with APIs
1. **Check examples** in component documentation
2. **Search discussions** for common questions
3. **Review source code** for implementation details
4. **Ask in discussions** for clarification

### Reporting API Issues
- **Bug reports**: Use GitHub Issues with "api" label
- **Feature requests**: Discuss in GitHub Discussions
- **Documentation errors**: Submit pull requests

### API Requests
We welcome suggestions for new APIs! Consider:
- **Use case**: What problem does it solve?
- **Audience**: Who would use this API?
- **Alternatives**: Why not use existing solutions?
- **Maintenance**: Who will maintain it?

---

**🔗 Quick Navigation**
- [← Documentation Hub](README.md)
- [BSB Helper API →](bsb-helper.md)
- [Component Development →](../tutorials/component-development.md)
- [CSS Architecture →](../../src/styles/README.md)