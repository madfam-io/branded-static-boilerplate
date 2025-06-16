# Hero Component

> Eye-catching page headers that set context and drive engagement

## Overview

The Hero component creates compelling page introductions that immediately communicate value and guide user actions. It's designed to be the first thing visitors see and should clearly convey what the page offers.

## 📁 Component Files

```
src/components/hero/
├── 📄 hero.html          # Component markup and variations
├── 📄 hero.css           # Component styles and layouts
└── 📄 README.md          # This documentation
```

## 🎨 Visual Examples

### Basic Hero
```html
<section class="bsb-hero" data-bsb-component="hero">
  <div class="container">
    <div class="bsb-hero__content">
      <h1 class="bsb-hero__title">Page Title</h1>
      <p class="bsb-hero__lead">Compelling description that explains the page value</p>
    </div>
  </div>
</section>
```

### Hero with Subtitle
```html
<section class="bsb-hero bsb-hero--centered" data-bsb-component="hero">
  <div class="container">
    <div class="bsb-hero__content">
      <h1 class="bsb-hero__title">
        Main Title
        <span class="bsb-hero__subtitle">Supporting subtitle</span>
      </h1>
      <p class="bsb-hero__lead">Detailed description of what this page offers</p>
    </div>
  </div>
</section>
```

### Hero with Actions
```html
<section class="bsb-hero bsb-hero--centered" data-bsb-component="hero">
  <div class="container">
    <div class="bsb-hero__content">
      <h1 class="bsb-hero__title">Get Started Today</h1>
      <p class="bsb-hero__lead">Join thousands of developers building better websites</p>
      <div class="bsb-hero__actions">
        <a href="/signup" class="btn btn--primary btn--large">Start Free Trial</a>
        <a href="/demo" class="btn btn--ghost btn--large">Watch Demo</a>
      </div>
    </div>
  </div>
</section>
```

### Simple Hero (for content pages)
```html
<section class="bsb-hero bsb-hero--simple" data-bsb-component="hero">
  <div class="container">
    <div class="bsb-hero__content">
      <h1 class="bsb-hero__title">About Our Company</h1>
      <p class="bsb-hero__lead">Learn about our mission and values</p>
    </div>
  </div>
</section>
```

## 🏗️ Component Structure

### HTML Architecture
```html
<!--
  Hero Section
  ============
  - Always use <section> element for semantic structure
  - Include data-bsb-component for development tools
  - One hero per page maximum for SEO
-->
<section class="bsb-hero [modifiers]" data-bsb-component="hero">
  
  <!-- Container for responsive width -->
  <div class="container [container-modifier]">
    
    <!-- Content wrapper for layout control -->
    <div class="bsb-hero__content">
      
      <!-- Required: Main heading (always h1 on page) -->
      <h1 class="bsb-hero__title">
        Primary Title
        <!-- Optional: Subtitle for additional context -->
        <span class="bsb-hero__subtitle">Supporting text</span>
      </h1>
      
      <!-- Optional but recommended: Lead paragraph -->
      <p class="bsb-hero__lead">
        Compelling description that elaborates on the title
      </p>
      
      <!-- Optional: Call-to-action buttons -->
      <div class="bsb-hero__actions">
        <a href="..." class="btn btn--primary">Primary Action</a>
        <a href="..." class="btn btn--secondary">Secondary Action</a>
      </div>
      
    </div>
  </div>
</section>
```

## 🎛️ Hero Variations

### Layout Modifiers
```css
.bsb-hero--centered    /* Center-aligned content (default: left-aligned) */
.bsb-hero--simple      /* Reduced padding for content pages */
.bsb-hero--large       /* Extra tall hero for landing pages */
```

### Content Modifiers
```css
.bsb-hero--dark        /* Dark background with light text */
.bsb-hero--gradient    /* Gradient background overlay */
```

### Container Modifiers
```css
.container--sm         /* Narrow hero content (max 600px) */
.container--md         /* Medium hero content (max 800px) */
/* Default container  /* Standard width (max 1200px) */
```

## 🎨 CSS Classes Reference

| Class | Purpose | Usage |
|-------|---------|-------|
| `.bsb-hero` | Base hero container | Required on section |
| `.bsb-hero__content` | Content wrapper | Required, contains all hero content |
| `.bsb-hero__title` | Main heading | Required, always h1 element |
| `.bsb-hero__subtitle` | Supporting title | Optional, use inside title |
| `.bsb-hero__lead` | Description text | Optional but recommended |
| `.bsb-hero__actions` | Button container | Optional, for CTAs |

## 🔧 CSS Custom Properties

Customize heroes using CSS variables in `src/styles/base/variables.css`:

```css
:root {
  /* Hero Spacing */
  --bsb-hero-padding-y: var(--bsb-space-16);     /* Vertical padding */
  --bsb-hero-padding-y-sm: var(--bsb-space-12);  /* Mobile padding */
  --bsb-hero-gap: var(--bsb-space-6);            /* Content spacing */
  
  /* Hero Typography */
  --bsb-hero-title-size: var(--bsb-text-5xl);    /* Title font size */
  --bsb-hero-title-size-sm: var(--bsb-text-4xl); /* Mobile title */
  --bsb-hero-lead-size: var(--bsb-text-xl);      /* Lead text size */
  --bsb-hero-lead-size-sm: var(--bsb-text-lg);   /* Mobile lead */
  
  /* Hero Colors */
  --bsb-hero-bg: var(--bsb-bg-primary);
  --bsb-hero-text: var(--bsb-text-primary);
  --bsb-hero-lead-text: var(--bsb-text-muted);
}
```

## 📱 Responsive Behavior

Heroes automatically adapt to screen size:

```css
/* Mobile-first approach */
.bsb-hero {
  padding: var(--bsb-hero-padding-y-sm) 0;
}

.bsb-hero__title {
  font-size: var(--bsb-hero-title-size-sm);
  line-height: 1.2;
}

/* Tablet and up */
@media (min-width: 768px) {
  .bsb-hero {
    padding: var(--bsb-hero-padding-y) 0;
  }
  
  .bsb-hero__title {
    font-size: var(--bsb-hero-title-size);
  }
}
```

## ♿ Accessibility Features

### Semantic Structure
- Uses `<section>` landmark for page structure
- Single `<h1>` per page in hero
- Proper heading hierarchy

### Focus Management
```html
<!-- Skip link target -->
<section class="bsb-hero" id="main">
  <!-- Hero content -->
</section>
```

### Screen Reader Support
```html
<!-- For heroes with background images -->
<section class="bsb-hero" role="banner" aria-label="Page introduction">
  <div class="container">
    <div class="bsb-hero__content">
      <h1 class="bsb-hero__title">Accessible Title</h1>
      <!-- Ensure sufficient color contrast -->
    </div>
  </div>
</section>
```

## 🎯 Content Guidelines

### Writing Effective Hero Content

#### Titles Should:
- **Be specific** - "Learn Web Development" vs "Welcome"
- **Include keywords** - Help with SEO
- **Stay under 60 characters** - Prevent line breaks on mobile
- **Match page content** - Set accurate expectations

#### Lead Text Should:
- **Elaborate on title** - Provide additional context
- **Be 1-2 sentences** - Keep it scannable
- **Include value proposition** - Why should users care?
- **Stay under 155 characters** - Good for meta descriptions too

#### Action Buttons Should:
- **Use action verbs** - "Start Building" vs "Click Here"
- **Be specific** - "Download PDF" vs "Download"
- **Limit to 2-3 buttons** - Avoid choice paralysis
- **Prioritize actions** - Primary, secondary, tertiary

### Example Content Patterns

#### For Landing Pages
```html
<h1 class="bsb-hero__title">Build Websites That Teach</h1>
<p class="bsb-hero__lead">Create educational static sites with BSB's self-documenting boilerplate and comprehensive learning materials.</p>
```

#### For Product Pages
```html
<h1 class="bsb-hero__title">
  Component Library
  <span class="bsb-hero__subtitle">Pre-built UI elements</span>
</h1>
<p class="bsb-hero__lead">Speed up development with battle-tested components that follow accessibility and performance best practices.</p>
```

#### For Content Pages
```html
<h1 class="bsb-hero__title">Documentation</h1>
<p class="bsb-hero__lead">Everything you need to master BSB and build amazing static websites.</p>
```

## 🎨 Design Patterns

### Color Combinations
```css
/* Light hero (default) */
.bsb-hero {
  background: var(--bsb-bg-primary);
  color: var(--bsb-text-primary);
}

/* Dark hero */
.bsb-hero--dark {
  background: var(--bsb-gray-900);
  color: var(--bsb-gray-100);
}

/* Gradient hero */
.bsb-hero--gradient {
  background: linear-gradient(135deg, var(--bsb-primary), var(--bsb-secondary));
  color: white;
}
```

### Typography Hierarchy
```css
/* Visual hierarchy through size and weight */
.bsb-hero__title {
  font-size: var(--bsb-text-5xl);
  font-weight: var(--bsb-font-bold);
  line-height: 1.1;
}

.bsb-hero__subtitle {
  font-size: var(--bsb-text-2xl);
  font-weight: var(--bsb-font-normal);
  color: var(--bsb-text-muted);
}

.bsb-hero__lead {
  font-size: var(--bsb-text-xl);
  font-weight: var(--bsb-font-normal);
  line-height: 1.6;
}
```

## 🛠️ Development Tips

### Performance Optimization
```html
<!-- Preload hero background images -->
<link rel="preload" as="image" href="/hero-bg.jpg">

<!-- Use appropriate image formats -->
<style>
.bsb-hero--image {
  background-image: 
    image-set(
      "/hero-bg.webp" type("image/webp"),
      "/hero-bg.jpg" type("image/jpeg")
    );
}
</style>
```

### SEO Considerations
- Only one `<h1>` per page (in hero)
- Include target keywords in title
- Keep title under 60 characters
- Use lead text for meta description content

### Testing Heroes
- Test with varying content lengths
- Verify mobile responsiveness
- Check color contrast ratios
- Validate with keyboard navigation

## 🎯 Common Use Cases

### Landing Page Hero
```html
<section class="bsb-hero bsb-hero--centered bsb-hero--large">
  <div class="container">
    <div class="bsb-hero__content">
      <h1 class="bsb-hero__title">Launch Your Startup Faster</h1>
      <p class="bsb-hero__lead">Skip the boilerplate setup and focus on building your unique value proposition with our comprehensive startup kit.</p>
      <div class="bsb-hero__actions">
        <a href="/signup" class="btn btn--primary btn--large">Start Free Trial</a>
        <a href="/demo" class="btn btn--ghost btn--large">See Demo</a>
      </div>
    </div>
  </div>
</section>
```

### Blog Post Hero
```html
<section class="bsb-hero bsb-hero--simple">
  <div class="container container--md">
    <div class="bsb-hero__content">
      <h1 class="bsb-hero__title">The Future of Web Development</h1>
      <p class="bsb-hero__lead">Exploring trends that will shape how we build websites in the next decade.</p>
    </div>
  </div>
</section>
```

### Service Page Hero
```html
<section class="bsb-hero">
  <div class="container">
    <div class="bsb-hero__content">
      <h1 class="bsb-hero__title">
        Web Development Services
        <span class="bsb-hero__subtitle">From concept to launch</span>
      </h1>
      <p class="bsb-hero__lead">We build fast, accessible websites that convert visitors into customers using modern web technologies.</p>
    </div>
  </div>
</section>
```

## 🔗 Related Components

- **[Button Component](../button/README.md)** - Add CTAs to hero actions
- **[Container System](../../styles/README.md#containers)** - Control hero width
- **[Typography](../../styles/README.md#typography)** - Hero text styling

## 📚 Learn More

- **[Page Creation](../../../docs/tutorials/page-creation.md)** - Building pages with heroes
- **[Content Writing](../../../docs/tutorials/content-writing.md)** - Writing effective hero copy
- **[SEO Optimization](../../../docs/tutorials/seo-optimization.md)** - Hero SEO best practices

---

**🔗 Quick Navigation**
- [← Component Library](../README.md)
- [Next: Footer Component →](../footer/README.md)
- [Page Creation Guide →](../../../docs/tutorials/page-creation.md)