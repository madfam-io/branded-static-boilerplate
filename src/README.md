# Source Directory Guide

> Understanding BSB's source code organization and development patterns

This directory contains all the source files for your static website, organized for maximum educational value and maintainability.

## 📁 Directory Structure

```
src/
├── 📄 index.html          # Main landing page (start here!)
├── 📁 components/         # Reusable UI components
│   ├── 📁 header/         # Site navigation and branding
│   ├── 📁 card/           # Content containers
│   ├── 📁 hero/           # Page headers
│   └── 📁 footer/         # Site footer
├── 📁 styles/            # CSS architecture and design system
│   ├── 📁 base/          # Variables, reset, typography
│   ├── 📁 utilities/     # Helper classes
│   └── 📁 themes/        # Color schemes
├── 📁 scripts/           # JavaScript enhancements
│   ├── 📁 core/          # Essential functionality
│   └── 📁 modules/       # Feature-specific code
├── 📁 assets/            # Static resources
│   ├── 📁 images/        # Optimized images
│   ├── 📁 icons/         # SVG icons and favicons
│   └── 📁 fonts/         # Web fonts (if needed)
└── 📁 pages/             # Additional HTML pages
    ├── 📄 about.html     # About page
    ├── 📄 contact.html   # Contact page
    └── 📄 services.html  # Services page
```

## 🎯 File Purpose Guide

### Core Files

#### `index.html` - Main Landing Page
Your site's homepage with extensive educational comments:

```html
<!--
  BRANDED STATIC BOILERPLATE - Main Entry Point
  ============================================
  
  This file demonstrates BSB philosophy:
  1. Every element has purpose
  2. Comments explain the 'why', not just 'what'
  3. Links to deeper documentation inline
  
  📖 Learn more: /docs/tutorials/page-creation.md
-->
```

**Features:**
- Comprehensive meta tags for SEO
- Accessibility-first semantic structure
- Performance-optimized resource loading
- Educational comments throughout

**📖 Learn more**: [Page Creation Guide](../docs/tutorials/page-creation.md)

---

### Component System

BSB uses a **component-based architecture** where each UI element is self-contained:

#### Component Structure
```
components/component-name/
├── component-name.html    # Markup and structure
├── component-name.css     # Component-specific styles
├── component-name.js      # Optional enhancements
└── README.md             # Component documentation
```

#### Available Components

| Component | Purpose | Documentation |
|-----------|---------|---------------|
| **[Header](components/header/README.md)** | Site navigation and branding | Navigation patterns, responsive menus |
| **[Card](components/card/README.md)** | Content containers | Layout variations, accessibility |
| **[Hero](components/hero/README.md)** | Page introductions | Content strategy, call-to-actions |
| **[Footer](components/footer/README.md)** | Site information | Legal links, secondary navigation |

**📖 Learn more**: [Component Architecture](components/README.md)

---

### Styling System

#### CSS Organization
```
styles/
├── base/               # Foundation styles
│   ├── variables.css   # Design tokens (start here!)
│   ├── reset.css      # Browser normalization
│   └── typography.css # Text styling system
├── utilities/          # Helper classes
│   ├── layout.css     # Grid and flexbox utilities
│   └── spacing.css    # Margin and padding helpers
└── themes/            # Visual themes
    └── default.css    # Default color scheme
```

#### Design Token System
BSB uses CSS custom properties for consistent theming:

```css
:root {
  /* Colors */
  --bsb-primary: #007bff;
  --bsb-secondary: #6c757d;
  
  /* Spacing (8px grid) */
  --bsb-space-1: 0.25rem;  /* 4px */
  --bsb-space-4: 1rem;     /* 16px */
  --bsb-space-8: 2rem;     /* 32px */
  
  /* Typography */
  --bsb-font-base: system-ui, -apple-system, sans-serif;
  --bsb-text-base: 1rem;
  --bsb-text-lg: 1.125rem;
}
```

**📖 Learn more**: [CSS Architecture](styles/README.md)

---

### JavaScript Enhancement

#### Progressive Enhancement Philosophy
BSB follows a **progressive enhancement** approach:

1. **HTML works first** - Core functionality without JavaScript
2. **CSS adds polish** - Visual enhancements and responsive design  
3. **JavaScript enhances** - Interactive features and optimizations

#### Script Organization
```
scripts/
├── core/                    # Essential functionality
│   ├── main.js             # Site initialization
│   └── bsb-helper.js       # Development tools
└── modules/                 # Feature-specific code
    ├── navigation.js       # Menu interactions
    └── forms.js            # Form enhancements
```

#### Modern JavaScript Patterns
```javascript
// Example: Progressive enhancement
if ('IntersectionObserver' in window) {
  // Use modern API for better performance
  const observer = new IntersectionObserver(callback, options);
  elements.forEach(el => observer.observe(el));
} else {
  // Fallback for older browsers
  elements.forEach(el => el.classList.add('visible'));
}
```

**📖 Learn more**: [JavaScript Patterns](scripts/README.md)

---

### Asset Management

#### Image Optimization
```
assets/images/
├── hero-bg.jpg           # Hero backgrounds (optimized)
├── thumbnails/           # Small preview images
├── gallery/              # Full-size images
└── favicons/             # Site icons
```

**Best Practices:**
- Use WebP format with JPG fallbacks
- Optimize images before adding
- Include descriptive alt text
- Consider lazy loading for performance

#### Icon System
```
assets/icons/
├── favicon.svg           # Modern SVG favicon
├── favicon.png           # PNG fallback
├── apple-touch-icon.png  # iOS home screen
└── social-preview.jpg    # Social media sharing
```

**📖 Learn more**: [Asset Optimization](../docs/tutorials/asset-optimization.md)

---

### Page Templates

#### Page Structure Pattern
Every page follows a consistent, accessible structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Meta tags for SEO and social sharing -->
</head>
<body>
  <!-- Skip link for accessibility -->
  <a href="#main" class="skip-link">Skip to main content</a>
  
  <!-- Site header with navigation -->
  <header class="bsb-header" role="banner">
    <!-- Navigation content -->
  </header>
  
  <!-- Main content area -->
  <main id="main" role="main">
    <!-- Page-specific content -->
  </main>
  
  <!-- Site footer -->
  <footer class="bsb-footer" role="contentinfo">
    <!-- Footer content -->
  </footer>
</body>
</html>
```

#### Available Page Templates
- **index.html** - Homepage with hero and feature sections
- **about.html** - Company/personal information
- **services.html** - Service listings with cards
- **contact.html** - Contact form and information
- **privacy.html** - Privacy policy template

**📖 Learn more**: [Page Creation](../docs/tutorials/page-creation.md)

## 🚀 Quick Start Guide

### 1. Customize Your Brand
Edit `styles/base/variables.css` to match your brand:

```css
:root {
  /* Update these colors */
  --bsb-primary: #your-brand-color;
  --bsb-secondary: #your-secondary-color;
  
  /* Update font if needed */
  --bsb-font-base: your-font-stack;
}
```

### 2. Update Site Content
Start with `index.html` and update:
- Page title and meta description
- Hero section content
- Feature cards
- Call-to-action buttons

### 3. Add Your Pages
Create new pages by copying existing templates:

```bash
# Copy a template
cp src/index.html src/pages/my-page.html

# Edit content and update meta tags
# Add navigation link in header
```

### 4. Customize Components
Each component can be customized through:
- **CSS variables** - Colors, spacing, typography
- **BEM modifiers** - Style variations
- **Content changes** - Text and images

### 5. Add Interactive Features
Enhance with JavaScript in `scripts/modules/`:

```javascript
// Example: Add smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    target.scrollIntoView({ behavior: 'smooth' });
  });
});
```

## 🎓 Educational Features

### Learning Mode
Enable interactive learning by clicking "Enable Learning Mode" on the homepage:

- **Component tooltips** explain each UI element
- **Help buttons** show component documentation
- **Grid overlay** visualizes layout structure
- **Performance metrics** track loading speed

### Self-Documenting Code
Every file includes educational comments:

```html
<!-- 
  Component Purpose
  =================
  This component demonstrates modern web development patterns:
  - Semantic HTML for accessibility
  - BEM CSS methodology
  - Progressive enhancement with JavaScript
  
  Customization:
  - Edit colors in variables.css
  - Add content in the .component__content area
  - Style variations available with .component--modifier
-->
```

### Cross-References
Documentation includes extensive cross-references:
- **📖 Learn more** - Deep dive into topics
- **🔗 Related** - Connected concepts
- **⚡ Quick tip** - Immediate improvements
- **💡 Pro tip** - Advanced techniques

## 🛠️ Development Workflow

### Recommended Development Process

1. **Start development server**
   ```bash
   npm run dev
   ```

2. **Enable learning mode** for educational features

3. **Make changes** to source files

4. **Test changes** automatically with hot reloading

5. **Build for production** when ready
   ```bash
   npm run build
   ```

### Code Quality Tools

- **ESLint** - JavaScript code quality
- **Stylelint** - CSS code quality  
- **Prettier** - Code formatting
- **Pre-commit hooks** - Automatic quality checks

### Performance Monitoring

BSB includes performance tracking:

```javascript
// Automatic performance monitoring
window.addEventListener('load', () => {
  const loadTime = performance.timing.loadEventEnd - 
                   performance.timing.navigationStart;
  console.log(`Page loaded in ${loadTime}ms`);
});
```

## 📏 Best Practices

### HTML Guidelines
- ✅ **Use semantic elements** (`<article>`, `<section>`, `<nav>`)
- ✅ **Include ARIA labels** for accessibility
- ✅ **Write descriptive alt text** for images
- ✅ **Follow heading hierarchy** (h1 → h2 → h3)

### CSS Guidelines  
- ✅ **Use design tokens** instead of magic numbers
- ✅ **Follow BEM methodology** for class names
- ✅ **Mobile-first responsive design**
- ✅ **Minimize specificity** for maintainability

### JavaScript Guidelines
- ✅ **Progressive enhancement** approach
- ✅ **Feature detection** before using APIs
- ✅ **Event delegation** for performance
- ✅ **Modern ES6+ syntax**

### Performance Guidelines
- ✅ **Optimize images** before adding
- ✅ **Use lazy loading** for below-fold content
- ✅ **Minimize bundle size** with tree shaking
- ✅ **Leverage browser caching**

## 🔗 Related Resources

### Documentation
- **[Component Library](components/README.md)** - UI component reference
- **[CSS Architecture](styles/README.md)** - Styling methodology
- **[JavaScript Patterns](scripts/README.md)** - Enhancement techniques
- **[API Documentation](../docs/api/README.md)** - Technical references

### Tutorials
- **[Getting Started](../docs/tutorials/getting-started.md)** - First steps with BSB
- **[Page Creation](../docs/tutorials/page-creation.md)** - Building new pages
- **[Component Development](../docs/tutorials/component-development.md)** - Custom components
- **[Performance Optimization](../docs/tutorials/performance.md)** - Speed improvements

### Examples
- **[Component Gallery](../docs/examples/components/)** - All components in action
- **[Layout Patterns](../docs/examples/layouts/)** - Common page layouts
- **[Real-world Sites](../docs/examples/)** - Complete implementations

---

**🔗 Quick Navigation**
- [← Main README](../README.md)
- [Component Library →](components/README.md)
- [CSS Architecture →](styles/README.md)
- [JavaScript Patterns →](scripts/README.md)