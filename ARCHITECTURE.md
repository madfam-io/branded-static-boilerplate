# Branded Static Boilerplate Architecture

## Overview

BSB is designed as a self-documenting static site generator that teaches web development best practices through its implementation. This document explains the architectural decisions and patterns used throughout the project.

## Core Principles

### 1. Self-Documentation
Every file contains comprehensive comments explaining not just what the code does, but why it exists and how it fits into the larger system.

### 2. Progressive Enhancement
- HTML works without CSS
- CSS works without JavaScript
- JavaScript enhances, never replaces

### 3. Component-Based Architecture
Reusable components that are:
- Self-contained
- Well-documented
- Easy to customize
- Framework-agnostic

### 4. Performance First
- Minimal dependencies
- Optimized build process
- Lazy loading by default
- Critical CSS inlined

## Directory Structure

```
branded-static-boilerplate/
├── src/                    # Source files
│   ├── index.html         # Entry point with extensive comments
│   ├── components/        # Reusable component library
│   ├── styles/           # CSS architecture
│   ├── scripts/          # JavaScript modules
│   ├── assets/           # Static assets
│   └── pages/            # Additional HTML pages
├── docs/                  # Documentation
├── config/               # Build configurations
├── tests/                # Test suites
└── .github/              # GitHub-specific files
```

## CSS Architecture

### Design Tokens
Located in `/src/styles/base/variables.css`, our design tokens define:
- Colors (using HSL for flexibility)
- Typography scale
- Spacing rhythm (8px grid)
- Component-specific values

### File Organization
```
styles/
├── base/              # Foundation
│   ├── variables.css  # Design tokens
│   ├── reset.css     # Browser normalization
│   └── typography.css # Type system
├── utilities/         # Utility classes
│   ├── spacing.css   # Margins, padding
│   └── layout.css    # Flexbox, grid
└── themes/           # Theme variations
    └── default.css   # Default theme
```

### Naming Convention
We use BEM (Block Element Modifier) methodology:
- Block: `.bsb-header`
- Element: `.bsb-header__nav`
- Modifier: `.bsb-header--sticky`

## Component Structure

Each component follows this structure:
```
component-name/
├── component-name.html  # HTML template
├── component-name.css   # Scoped styles
├── component-name.js    # Enhancement script (optional)
└── README.md           # Documentation
```

### Component Guidelines
1. **Semantic HTML**: Use appropriate elements
2. **Accessible**: ARIA labels, keyboard navigation
3. **Responsive**: Mobile-first approach
4. **Customizable**: CSS custom properties
5. **Documented**: Inline comments and README

## JavaScript Architecture

### Module System
- ES6 modules for organization
- Progressive enhancement approach
- No framework dependencies
- Utility functions in `BSBUtils`

### Core Modules
```
scripts/
├── core/
│   ├── main.js        # Entry point
│   └── bsb-helper.js  # Dev tools
└── modules/           # Feature modules
```

### Enhancement Pattern
```javascript
// Check if feature is supported
if ('IntersectionObserver' in window) {
  // Enhance with modern features
} else {
  // Fallback for older browsers
}
```

## Build System

### Vite Configuration
- Fast development server
- Optimized production builds
- Automatic code splitting
- Asset optimization

### Build Pipeline
1. **HTML Processing**: Multi-page support
2. **CSS Optimization**: PostCSS, autoprefixer
3. **JS Bundling**: Tree-shaking, minification
4. **Asset Handling**: Image optimization

## Performance Strategy

### Loading Strategy
1. **Critical CSS**: Inlined in `<head>`
2. **Async JS**: Deferred loading
3. **Lazy Images**: Intersection Observer
4. **Font Loading**: FOUT prevention

### Optimization Techniques
- Minification
- Compression
- Caching headers
- CDN-ready structure

## Deployment

### GitHub Pages
- Automated via GitHub Actions
- Branch: `gh-pages`
- Custom domain support
- HTTPS by default

### Static Hosting
Compatible with:
- Netlify
- Vercel
- AWS S3
- Firebase Hosting

## Development Workflow

### Local Development
```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production
```

### Code Quality
- ESLint for JavaScript
- Stylelint for CSS
- Prettier for formatting
- Pre-commit hooks

## Testing Strategy

### Unit Tests
- Jest for JavaScript
- Component isolation
- Utility function testing

### Integration Tests
- Page-level testing
- Cross-browser checks
- Accessibility audits

## Security Considerations

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; style-src 'self' 'unsafe-inline';">
```

### Dependencies
- Minimal external dependencies
- Regular security audits
- Automated updates

## Extensibility

### Adding Components
1. Use component generator
2. Follow naming conventions
3. Include documentation
4. Add to component index

### Creating Themes
1. Copy `default.css`
2. Override CSS variables
3. Test across components
4. Document changes

## Best Practices

### HTML
- Semantic elements
- Accessible forms
- Meta tags for SEO
- Structured data

### CSS
- Mobile-first
- Utility classes
- Custom properties
- Logical properties

### JavaScript
- Progressive enhancement
- Event delegation
- Error boundaries
- Performance monitoring

## Future Considerations

### Planned Features
- [ ] Web Components support
- [ ] PWA capabilities
- [ ] Internationalization
- [ ] Dark mode toggle

### Upgrade Path
- Semantic versioning
- Migration guides
- Backward compatibility
- Deprecation notices

## Resources

### Internal Documentation
- `/docs/tutorials/` - Step-by-step guides
- `/docs/api/` - Component APIs
- Component READMEs

### External Resources
- [MDN Web Docs](https://developer.mozilla.org/)
- [A11y Project](https://www.a11yproject.com/)
- [Web.dev](https://web.dev/)

## Contributing

See [CONTRIBUTING.md](.github/CONTRIBUTING.md) for guidelines on:
- Code style
- Documentation requirements
- Testing expectations
- Pull request process