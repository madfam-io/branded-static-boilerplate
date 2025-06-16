# Card Component

> Versatile content containers for organizing information in visually appealing layouts

## Overview

The Card component is one of BSB's most flexible UI elements. It provides a consistent way to display content in contained, scannable chunks that work beautifully across all device sizes.

## 📁 Component Files

```
src/components/card/
├── 📄 card.html          # Component markup and variations
├── 📄 card.css           # Component styles and modifiers
└── 📄 README.md          # This documentation
```

## 🎨 Visual Examples

### Basic Card
```html
<article class="bsb-card" data-bsb-component="card">
  <div class="bsb-card__body">
    <h3 class="bsb-card__title">Card Title</h3>
    <p class="bsb-card__text">Card description goes here.</p>
  </div>
</article>
```

### Card with Icon
```html
<article class="bsb-card" data-bsb-component="card">
  <div class="bsb-card__body">
    <div class="bsb-card__icon">
      <svg width="48" height="48" viewBox="0 0 24 24">
        <!-- Icon SVG content -->
      </svg>
    </div>
    <h3 class="bsb-card__title">Service Name</h3>
    <p class="bsb-card__text">Service description</p>
  </div>
</article>
```

### Card with Media
```html
<article class="bsb-card" data-bsb-component="card">
  <div class="bsb-card__media">
    <img src="/assets/images/card-image.jpg" alt="Descriptive alt text">
  </div>
  <div class="bsb-card__body">
    <h3 class="bsb-card__title">Article Title</h3>
    <p class="bsb-card__text">Article summary...</p>
  </div>
  <div class="bsb-card__footer">
    <a href="/article" class="bsb-card__link">Read More →</a>
  </div>
</article>
```

### Feature Card (Enhanced)
```html
<article class="bsb-card bsb-card--feature" data-bsb-component="card">
  <div class="bsb-card__body">
    <div class="bsb-card__icon bsb-card__icon--large">🚀</div>
    <h3 class="bsb-card__title">Featured Service</h3>
    <p class="bsb-card__text">Enhanced styling for important content</p>
    <ul class="bsb-card__features">
      <li>Feature one</li>
      <li>Feature two</li>
      <li>Feature three</li>
    </ul>
  </div>
  <div class="bsb-card__footer">
    <a href="/service" class="btn btn--primary">Learn More</a>
  </div>
</article>
```

## 🏗️ Component Structure

### HTML Architecture
```html
<!-- 
  Card Container
  ==============
  - Use semantic <article> for standalone content
  - Use <div> when part of a larger content piece
  - Always include data-bsb-component for dev tools
-->
<article class="bsb-card [modifiers]" data-bsb-component="card">
  
  <!-- Optional: Media Section -->
  <div class="bsb-card__media">
    <img src="..." alt="...">
  </div>
  
  <!-- Required: Body Section -->
  <div class="bsb-card__body">
    <!-- Optional: Icon -->
    <div class="bsb-card__icon [size-modifier]">
      <!-- SVG or emoji -->
    </div>
    
    <!-- Required: Title -->
    <h3 class="bsb-card__title">Card Title</h3>
    
    <!-- Optional: Description -->
    <p class="bsb-card__text">Card description</p>
    
    <!-- Optional: Feature List -->
    <ul class="bsb-card__features">
      <li>Feature item</li>
    </ul>
  </div>
  
  <!-- Optional: Footer Section -->
  <div class="bsb-card__footer">
    <a href="..." class="bsb-card__link">Action →</a>
  </div>
</article>
```

## 🎛️ Modifiers and Variations

### Size Modifiers
```css
.bsb-card--small     /* Compact card for tight spaces */
.bsb-card--large     /* Expanded card for featured content */
```

### Style Modifiers
```css
.bsb-card--feature   /* Enhanced styling with shadow and border */
.bsb-card--outline   /* Border-only style */
.bsb-card--flat      /* No shadow, minimal styling */
```

### Icon Size Modifiers
```css
.bsb-card__icon--small    /* 24px icon */
.bsb-card__icon--large    /* 64px icon */
```

## 🎨 CSS Classes Reference

| Class | Purpose | Usage |
|-------|---------|-------|
| `.bsb-card` | Base card container | Required on container |
| `.bsb-card__media` | Image/media wrapper | Optional, for cards with images |
| `.bsb-card__body` | Main content area | Required, contains primary content |
| `.bsb-card__icon` | Icon container | Optional, displays SVG or emoji |
| `.bsb-card__title` | Card heading | Required, should be h2-h4 |
| `.bsb-card__text` | Card description | Optional, main text content |
| `.bsb-card__features` | Feature list | Optional, for service/product cards |
| `.bsb-card__footer` | Action area | Optional, for CTAs and links |
| `.bsb-card__link` | Footer link styling | Use in footer for actions |

## 🔧 CSS Custom Properties

Customize cards using CSS variables in `src/styles/base/variables.css`:

```css
:root {
  /* Card Styling */
  --bsb-card-bg: var(--bsb-bg-primary);
  --bsb-card-border: 1px solid var(--bsb-border-color);
  --bsb-card-border-radius: var(--bsb-radius-md);
  --bsb-card-shadow: var(--bsb-shadow-sm);
  --bsb-card-padding: var(--bsb-space-6);
  
  /* Card Typography */
  --bsb-card-title-size: var(--bsb-text-xl);
  --bsb-card-title-weight: var(--bsb-font-semibold);
  --bsb-card-text-size: var(--bsb-text-base);
  --bsb-card-text-color: var(--bsb-text-muted);
}
```

## 📱 Responsive Behavior

Cards automatically adapt to screen size:

```css
/* Mobile: Full width stack */
.bsb-card {
  margin-bottom: var(--bsb-space-6);
}

/* Tablet: 2-column grid when in grid container */
@media (min-width: 768px) {
  .grid--2-cols .bsb-card {
    /* Handled by parent grid */
  }
}

/* Desktop: 3+ column layouts */
@media (min-width: 1024px) {
  .grid--3-cols .bsb-card,
  .grid--4-cols .bsb-card {
    /* Handled by parent grid */
  }
}
```

## ♿ Accessibility Features

### Semantic HTML
- Uses `<article>` for standalone content
- Proper heading hierarchy with `h2`-`h4` elements
- Meaningful alt text for images

### Focus Management
```css
.bsb-card__link:focus {
  outline: 2px solid var(--bsb-primary);
  outline-offset: 2px;
}
```

### Screen Reader Support
```html
<!-- For cards with complex content -->
<article class="bsb-card" aria-labelledby="card-title-1">
  <div class="bsb-card__body">
    <h3 id="card-title-1" class="bsb-card__title">Card Title</h3>
    <p class="bsb-card__text">Description</p>
  </div>
</article>
```

## 🎯 Common Use Cases

### Service Cards
Perfect for showcasing services or features:
```html
<div class="grid grid--3-cols">
  <article class="bsb-card" data-bsb-component="card">
    <div class="bsb-card__body">
      <div class="bsb-card__icon">🎨</div>
      <h3 class="bsb-card__title">Web Design</h3>
      <p class="bsb-card__text">Beautiful, responsive designs</p>
    </div>
  </article>
  <!-- More service cards -->
</div>
```

### Blog Post Cards
For article previews and blog listings:
```html
<article class="bsb-card" data-bsb-component="card">
  <div class="bsb-card__media">
    <img src="/blog/post-image.jpg" alt="Blog post preview">
  </div>
  <div class="bsb-card__body">
    <h3 class="bsb-card__title">
      <a href="/blog/post-slug">Blog Post Title</a>
    </h3>
    <p class="bsb-card__text">Post excerpt...</p>
    <time class="bsb-card__meta">March 15, 2024</time>
  </div>
</article>
```

### Product Cards
For e-commerce or portfolio items:
```html
<article class="bsb-card bsb-card--feature" data-bsb-component="card">
  <div class="bsb-card__media">
    <img src="/products/item.jpg" alt="Product name">
  </div>
  <div class="bsb-card__body">
    <h3 class="bsb-card__title">Product Name</h3>
    <p class="bsb-card__text">Product description</p>
    <div class="bsb-card__price">$99.99</div>
  </div>
  <div class="bsb-card__footer">
    <button class="btn btn--primary btn--full">Add to Cart</button>
  </div>
</article>
```

## 🎨 Design Tokens

Cards follow BSB's design system:

```css
/* Spacing follows 8px grid */
--bsb-card-padding: 24px;        /* 3 grid units */
--bsb-card-gap: 16px;            /* 2 grid units */

/* Colors use semantic tokens */
--bsb-card-bg: var(--bsb-surface);
--bsb-card-border: var(--bsb-border);

/* Typography follows scale */
--bsb-card-title: var(--bsb-h3);
--bsb-card-text: var(--bsb-body);
```

## 🛠️ Development Tips

### Creating Custom Card Variations
1. Add new modifier class to `card.css`
2. Follow BEM naming: `.bsb-card--variation`
3. Use existing design tokens when possible
4. Document new variations in this README

### Performance Considerations
- Use `loading="lazy"` for card images
- Optimize images before adding to cards
- Consider using CSS `aspect-ratio` for consistent image sizes

### Testing Cards
- Test with varying content lengths
- Verify responsive behavior
- Check keyboard navigation
- Validate with screen readers

## 🔗 Related Components

- **[Grid System](../../styles/README.md#grid-system)** - Layout cards in responsive grids
- **[Button Component](../button/README.md)** - Add actions to card footers
- **[Hero Component](../hero/README.md)** - For larger, featured content

## 📚 Learn More

- **[CSS Architecture](../../styles/README.md)** - Understanding BSB's styling approach
- **[Component Development](../../../docs/tutorials/component-development.md)** - Creating new components
- **[Accessibility Guide](../../../docs/tutorials/accessibility.md)** - Making components inclusive

---

**🔗 Quick Navigation**
- [← Component Library](../README.md)
- [Next: Header Component →](../header/README.md)
- [CSS Architecture →](../../styles/README.md)