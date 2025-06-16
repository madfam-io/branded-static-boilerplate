# Header Component

A responsive, accessible header component with mobile menu support.

## Features

- 🎨 Responsive design with mobile menu
- ♿ Fully accessible with ARIA attributes
- ⌨️ Keyboard navigation support
- 🎯 Semantic HTML structure
- 🚀 Progressive enhancement (works without JS)
- 📱 Touch-friendly mobile menu

## Usage

### Basic Implementation

```html
<!-- Include CSS -->
<link rel="stylesheet" href="/components/header/header.css">

<!-- Include the header HTML -->
<!-- Copy from header.html -->

<!-- Include JavaScript for mobile menu (optional) -->
<script src="/components/header/header.js" defer></script>
```

### Customization

#### 1. Change Brand/Logo

```html
<!-- Text logo -->
<div class="bsb-header__brand">
  <a href="/" class="bsb-header__logo">
    <strong>Your Brand Name</strong>
  </a>
</div>

<!-- Image logo -->
<div class="bsb-header__brand">
  <a href="/" class="bsb-header__logo">
    <img src="/assets/images/logo.svg" alt="Your Brand" width="120" height="40">
  </a>
</div>
```

#### 2. Modify Navigation Items

```html
<nav class="bsb-header__nav" aria-label="Main navigation">
  <ul class="bsb-header__menu">
    <li><a href="/" class="bsb-header__link">Home</a></li>
    <li><a href="/about" class="bsb-header__link">About</a></li>
    <!-- Add more items as needed -->
  </ul>
</nav>
```

#### 3. CSS Variables

Customize appearance by overriding CSS variables:

```css
.bsb-header {
  --bsb-header-height: 5rem; /* Taller header */
  --bsb-header-bg: #f8f9fa; /* Light background */
  --bsb-header-shadow: none; /* Remove shadow */
}
```

### Variants

#### Sticky Header

```html
<header class="bsb-header bsb-header--sticky">
  <!-- Header content -->
</header>
```

#### Transparent Header (for hero sections)

```css
.bsb-header--transparent {
  --bsb-header-bg: transparent;
  --bsb-header-border: transparent;
  --bsb-header-shadow: none;
}

.bsb-header--transparent .bsb-header__link {
  color: white;
}
```

## Accessibility

- Uses semantic `<header>` and `<nav>` elements
- ARIA labels for screen readers
- `aria-current="page"` for active page
- `aria-expanded` for mobile menu state
- Keyboard navigation (Tab, Escape)
- Focus management for mobile menu
- Skip navigation link support

## JavaScript API

The header component exposes a global `BSBHeader` object:

```javascript
// Re-initialize headers (useful after dynamic content)
BSBHeader.initialize();

// Update current page marker
BSBHeader.markCurrentPage();
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Android)
- Progressive enhancement ensures basic functionality without JS

## Examples

### Header with Dropdown Menu

```html
<li class="bsb-header__dropdown">
  <a href="/services" class="bsb-header__link">
    Services
    <svg><!-- Dropdown arrow icon --></svg>
  </a>
  <ul class="bsb-header__dropdown-menu">
    <li><a href="/services/web-design">Web Design</a></li>
    <li><a href="/services/development">Development</a></li>
  </ul>
</li>
```

### Header with CTA Button

```html
<nav class="bsb-header__nav">
  <ul class="bsb-header__menu">
    <!-- Regular nav items -->
    <li><a href="/contact" class="btn btn--primary btn--small">Get Started</a></li>
  </ul>
</nav>
```

## Troubleshooting

**Mobile menu not working?**
- Ensure header.js is loaded
- Check console for errors
- Verify aria-controls matches nav ID

**Current page not highlighted?**
- Check that URLs match exactly
- Ensure markCurrentPage() is called
- Use aria-current="page" manually if needed

**Header overlapping content?**
- Add padding-top to body or main element
- Use CSS variable: `padding-top: var(--bsb-header-height);`