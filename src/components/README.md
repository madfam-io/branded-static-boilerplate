# Components Directory

This directory contains reusable HTML components that can be included across multiple pages.

## Component Philosophy

Each component in BSB follows these principles:

1. **Self-contained**: All HTML, CSS, and JS for a component lives together
2. **Well-documented**: Every component includes a README explaining its usage
3. **Accessible**: Components follow WCAG guidelines
4. **Flexible**: Components accept customization through CSS variables

## Available Components

- `header/` - Site header with navigation
- `footer/` - Site footer with links and copyright
- `card/` - Content card for displaying information
- `hero/` - Hero section for landing pages

## Creating New Components

1. Create a new directory: `mkdir component-name`
2. Add component files:
   - `component-name.html` - HTML structure
   - `component-name.css` - Component styles
   - `component-name.js` - Enhancement scripts (optional)
   - `README.md` - Usage documentation

## Usage Example

Components are designed to be copied and pasted into your pages:

```html
<!-- Copy the component HTML into your page -->
<div class="bsb-card" data-bsb-component="card">
  <!-- Component content -->
</div>

<!-- Include component CSS in your page -->
<link rel="stylesheet" href="/src/components/card/card.css">
```