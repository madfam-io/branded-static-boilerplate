# Styles Directory

BSB uses a modern, maintainable CSS architecture based on utility classes and design tokens.

## Directory Structure

```
styles/
├── base/               # Foundation styles
│   ├── variables.css   # CSS custom properties (design tokens)
│   ├── reset.css      # CSS reset for consistency
│   └── typography.css  # Base typography styles
├── utilities/          # Utility classes
│   ├── spacing.css    # Margin and padding utilities
│   ├── colors.css     # Color utilities
│   └── layout.css     # Layout utilities
└── themes/            # Theme variations
    └── default.css    # Default theme
```

## CSS Architecture Principles

1. **Design Tokens First**: All values defined as CSS custom properties
2. **Utility Classes**: Small, single-purpose classes for rapid development
3. **Component Styles**: Specific styles live with their components
4. **Progressive Enhancement**: Base styles work everywhere

## Usage

```html
<!-- Include base styles in your HTML -->
<link rel="stylesheet" href="/src/styles/base/variables.css">
<link rel="stylesheet" href="/src/styles/base/reset.css">
<link rel="stylesheet" href="/src/styles/base/typography.css">

<!-- Add utilities as needed -->
<link rel="stylesheet" href="/src/styles/utilities/spacing.css">

<!-- Apply theme -->
<link rel="stylesheet" href="/src/styles/themes/default.css">
```

## Customization

Modify CSS custom properties in `variables.css` to instantly update your entire site's appearance.