# Contributing to BSB

> Help make BSB the best educational static site boilerplate in the world

Thank you for your interest in contributing to Branded Static Boilerplate! This project thrives on community contributions, and we welcome developers of all skill levels to help improve the platform.

## 🎯 Our Mission

BSB aims to be the most educational and accessible static site boilerplate available. Every contribution should advance these core principles:

1. **Educational Value** - Code should teach, not just function
2. **Accessibility First** - Build for everyone, everywhere
3. **Performance Minded** - Fast is a feature
4. **Community Driven** - Growth through collaboration

## 📋 Table of Contents

- [Ways to Contribute](#-ways-to-contribute)
- [Getting Started](#-getting-started)
- [Development Workflow](#-development-workflow)
- [Code Guidelines](#-code-guidelines)
- [Documentation Standards](#-documentation-standards)
- [Testing Requirements](#-testing-requirements)
- [Submitting Changes](#-submitting-changes)

## 🤝 Ways to Contribute

### 📝 Documentation
- **Improve existing docs** - Fix typos, add examples, clarify explanations
- **Create new tutorials** - Help others learn web development
- **Component documentation** - Document new components and patterns
- **Translation** - Help make BSB accessible in other languages

### 🐛 Bug Reports
- **Report issues** - Help us identify problems
- **Provide reproductions** - Clear steps to reproduce bugs
- **Test edge cases** - Find issues before users do

### ✨ Feature Contributions
- **New components** - Build reusable UI elements
- **Educational tools** - Improve the learning experience
- **Performance improvements** - Make BSB faster
- **Accessibility enhancements** - Remove barriers for users

### 🎨 Design Contributions
- **UI/UX improvements** - Make BSB more intuitive
- **Theme variations** - Provide more design options
- **Icon and asset creation** - Visual elements for components

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** and npm
- **Git** for version control
- **Code editor** (VS Code recommended)
- **GitHub account** for pull requests

### Development Setup

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/branded-static-boilerplate.git
   cd branded-static-boilerplate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Enable learning mode**
   - Open browser to `http://localhost:5173`
   - Click "Enable Learning Mode" button
   - Refresh to see interactive tooltips

5. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🔄 Development Workflow

### Branch Naming
Use descriptive branch names that include the type of change:

```bash
feature/new-component-name    # New features
fix/bug-description          # Bug fixes
docs/section-improvement     # Documentation updates
perf/optimization-area       # Performance improvements
refactor/code-area          # Code refactoring
```

### Commit Message Format
We follow [Conventional Commits](https://conventionalcommits.org/) format:

```
type(scope): description

[optional body]

[optional footer]
```

#### Types:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Adding or updating tests

#### Examples:
```bash
feat(components): add button component with accessibility features

fix(hero): resolve responsive layout issue on mobile devices

docs(readme): update installation instructions with Node.js version

style(css): apply consistent formatting to all stylesheets
```

## 📏 Code Guidelines

### HTML Standards

#### Semantic Structure
```html
<!-- ✅ Good: Semantic, accessible -->
<article class="bsb-card" data-bsb-component="card">
  <header>
    <h3 class="bsb-card__title">Card Title</h3>
  </header>
  <div class="bsb-card__content">
    <p>Card content</p>
  </div>
</article>

<!-- ❌ Avoid: Non-semantic divs -->
<div class="card">
  <div class="title">Card Title</div>
  <div class="content">Card content</div>
</div>
```

#### Educational Comments
Every HTML file should include educational comments:

```html
<!--
  Component Name - Purpose
  ========================
  
  This component demonstrates:
  - Semantic HTML structure
  - Accessibility best practices
  - BEM naming methodology
  
  Usage:
  - When to use this component
  - How to customize it
  - Related components
  
  Learn more: /docs/components/component-name.md
-->
```

### CSS Guidelines

#### BEM Methodology
Use Block-Element-Modifier naming:

```css
/* Block */
.bsb-card { }

/* Elements */
.bsb-card__title { }
.bsb-card__content { }

/* Modifiers */
.bsb-card--featured { }
.bsb-card__title--large { }
```

#### CSS Custom Properties
Use design tokens for consistency:

```css
/* ✅ Good: Use design tokens */
.bsb-component {
  padding: var(--bsb-space-4);
  color: var(--bsb-text-primary);
  border-radius: var(--bsb-radius-md);
}

/* ❌ Avoid: Magic numbers */
.component {
  padding: 16px;
  color: #333333;
  border-radius: 8px;
}
```

#### Mobile-First Responsive Design
```css
/* ✅ Good: Mobile-first approach */
.bsb-component {
  font-size: var(--bsb-text-base);
}

@media (min-width: 768px) {
  .bsb-component {
    font-size: var(--bsb-text-lg);
  }
}

/* ❌ Avoid: Desktop-first approach */
.component {
  font-size: 18px;
}

@media (max-width: 767px) {
  .component {
    font-size: 16px;
  }
}
```

### JavaScript Guidelines

#### Modern ES6+ Syntax
```javascript
// ✅ Good: Modern, readable JavaScript
const updateContent = (elements) => {
  elements.forEach(element => {
    const { dataset } = element;
    if (dataset.bsbComponent) {
      element.classList.add('enhanced');
    }
  });
};

// ❌ Avoid: Older syntax
function updateContent(elements) {
  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    if (element.getAttribute('data-bsb-component')) {
      element.className += ' enhanced';
    }
  }
}
```

#### Progressive Enhancement
```javascript
// ✅ Good: Progressive enhancement
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(callback, options);
  elements.forEach(el => observer.observe(el));
} else {
  // Fallback for older browsers
  elements.forEach(el => el.classList.add('visible'));
}
```

#### Educational Comments
```javascript
/**
 * BSB Helper - Development Tools
 * ==============================
 * 
 * Provides interactive learning tools in development mode:
 * - Component inspection overlays
 * - Documentation tooltips
 * - Grid visualization
 * 
 * This enhances the educational value without affecting production.
 * 
 * @see /docs/api/bsb-helper.md
 */
class BSBHelper {
  // Implementation with educational comments
}
```

## 📚 Documentation Standards

### README Structure
Every component and directory should have a README.md with:

1. **Overview** - What it is and why it exists
2. **Usage Examples** - Code samples with explanations
3. **API Documentation** - All options and configurations
4. **Accessibility Notes** - How it supports all users
5. **Related Resources** - Links to tutorials and components

### Writing Style
- **Be clear and concise** - Assume beginner audience
- **Use examples** - Show, don't just tell
- **Link liberally** - Connect related concepts
- **Update regularly** - Keep docs in sync with code

### Code Examples
Include complete, working examples:

```html
<!-- ✅ Good: Complete example with context -->
<section class="bsb-hero" data-bsb-component="hero">
  <div class="container">
    <div class="bsb-hero__content">
      <h1 class="bsb-hero__title">Complete Example</h1>
      <p class="bsb-hero__lead">This shows the full structure</p>
    </div>
  </div>
</section>

<!-- ❌ Avoid: Incomplete snippets -->
<h1 class="title">Example</h1>
```

## 🧪 Testing Requirements

### Before Submitting
Run these checks before creating a pull request:

```bash
# Lint code for style issues
npm run lint

# Build project to check for errors
npm run build

# Test in different browsers
npm run preview
```

### Manual Testing Checklist
- [ ] **Responsive design** - Test on mobile, tablet, desktop
- [ ] **Accessibility** - Navigate with keyboard only
- [ ] **Performance** - Check Lighthouse scores
- [ ] **Cross-browser** - Test in Chrome, Firefox, Safari, Edge
- [ ] **Learning mode** - Verify educational features work

### Component Testing
New components should include:

```javascript
// Basic functionality test
describe('Component Name', () => {
  it('should render correctly', () => {
    // Test implementation
  });
  
  it('should handle interactions', () => {
    // Test interactive elements
  });
  
  it('should be accessible', () => {
    // Test accessibility features
  });
});
```

## 📤 Submitting Changes

### Pull Request Process

1. **Create descriptive PR title**
   ```
   feat(components): add notification component with ARIA support
   ```

2. **Fill out PR template**
   - Describe what changed and why
   - Include screenshots for visual changes
   - List any breaking changes
   - Reference related issues

3. **Ensure all checks pass**
   - Code quality (ESLint/Stylelint)
   - Build process
   - Automated tests

4. **Request review**
   - Tag relevant maintainers
   - Be responsive to feedback
   - Make requested changes promptly

### PR Template
```markdown
## Description
Brief description of changes and motivation.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Refactoring

## Screenshots (if applicable)
Before/after images for visual changes.

## Testing
- [ ] Tested on mobile devices
- [ ] Verified accessibility
- [ ] Checked browser compatibility
- [ ] Validated HTML/CSS

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

## 🎨 Component Development Guide

### Creating New Components

1. **Create component directory**
   ```
   src/components/my-component/
   ├── my-component.html
   ├── my-component.css
   └── README.md
   ```

2. **Follow naming conventions**
   - Use kebab-case for directories
   - Prefix CSS classes with `bsb-`
   - Use BEM methodology

3. **Include educational value**
   - Add comprehensive comments
   - Explain design decisions
   - Link to related documentation

4. **Test thoroughly**
   - Multiple screen sizes
   - Keyboard navigation
   - Screen reader compatibility

### Component Checklist
- [ ] **Semantic HTML** structure
- [ ] **BEM CSS** naming
- [ ] **Responsive** design
- [ ] **Accessible** by default
- [ ] **Educational** comments
- [ ] **Complete** documentation
- [ ] **Performance** optimized

## 🌟 Recognition

Contributors are recognized in several ways:

- **Contributors list** in README
- **Changelog entries** for significant contributions
- **Social media** highlights for major features
- **Commit attribution** preserved in Git history

## 🆘 Getting Help

### Before Asking
1. **Search existing issues** - Your question may be answered
2. **Check documentation** - Look through guides and tutorials
3. **Browse discussions** - See community conversations

### Where to Ask
- **💬 GitHub Discussions** - General questions and ideas
- **🐛 GitHub Issues** - Bug reports and feature requests
- **📧 Direct contact** - For sensitive topics

### How to Ask Good Questions
1. **Be specific** - Include exact error messages
2. **Provide context** - What were you trying to do?
3. **Share code** - Minimal reproduction case
4. **Describe environment** - OS, browser, Node.js version

## 📄 License

By contributing to BSB, you agree that your contributions will be licensed under the same MIT License that covers the project.

## 🙏 Thank You

Every contribution, no matter how small, helps make BSB better for developers worldwide. Thank you for taking the time to contribute to this educational project!

---

**🔗 Quick Links**
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Issue Templates](.github/ISSUE_TEMPLATE/)
- [Pull Request Template](.github/pull_request_template.md)
- [Development Setup](docs/tutorials/development.md)
- [Component Guide](docs/tutorials/component-development.md)