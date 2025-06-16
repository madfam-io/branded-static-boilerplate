# Page Creation Guide

> Learn how to create new pages in BSB with proper structure and navigation

## Overview

BSB makes page creation straightforward while maintaining educational value. Every page includes extensive comments and follows consistent patterns that teach best practices.

## 📋 Page Creation Process

### 1. Copy the Template

Start with the main index page as your template:

```bash
cp src/index.html src/pages/my-new-page.html
```

**Why copy index.html?**
- It includes all the necessary meta tags
- Has proper accessibility attributes
- Contains educational comments
- Follows BSB structure conventions

### 2. Update Page Metadata

Edit the `<head>` section with page-specific information:

```html
<!-- Page-specific title and description -->
<title>My New Page | Your Site Name</title>
<meta name="description" content="Description for SEO and social sharing">

<!-- Social Media Tags -->
<meta property="og:title" content="My New Page - Your Site">
<meta property="og:description" content="What this page is about">
<meta property="og:url" content="https://yourdomain.com/pages/my-new-page.html">
```

**📖 Learn more**: [SEO Best Practices](seo-optimization.md)

### 3. Structure Your Content

BSB uses semantic HTML sections with educational comments:

```html
<!-- Main Content Area -->
<main id="main" role="main">
  <!-- 
    Hero Section
    ============
    Sets the page context and draws attention.
    Each page should have one primary hero.
    Learn more: /src/components/hero/README.md
  -->
  <section class="bsb-hero" data-bsb-component="hero">
    <div class="container">
      <div class="bsb-hero__content">
        <h1 class="bsb-hero__title">Page Title</h1>
        <p class="bsb-hero__lead">Page description</p>
      </div>
    </div>
  </section>

  <!-- 
    Content Sections
    ================
    Use semantic section elements to organize content.
    Each section should have a clear purpose.
  -->
  <section class="section" aria-labelledby="section-heading">
    <div class="container">
      <h2 id="section-heading" class="section__title">Section Title</h2>
      <p class="section__lead">Section introduction</p>
      
      <!-- Your content here -->
    </div>
  </section>
</main>
```

### 4. Add Navigation Links

Update the header navigation to include your new page:

```html
<!-- In src/index.html and other pages -->
<nav class="bsb-header__nav" aria-label="Main navigation">
  <ul class="bsb-header__menu">
    <li><a href="/" class="bsb-header__link">Home</a></li>
    <li><a href="/pages/about.html" class="bsb-header__link">About</a></li>
    <li><a href="/pages/my-new-page.html" class="bsb-header__link">My Page</a></li>
    <li><a href="/pages/contact.html" class="bsb-header__link">Contact</a></li>
  </ul>
</nav>
```

## 🎨 Page Types and Templates

### Landing Pages
Focus on conversion and clear calls-to-action:

```html
<section class="bsb-hero bsb-hero--centered">
  <div class="container">
    <div class="bsb-hero__content">
      <h1 class="bsb-hero__title">
        Compelling Headline
        <span class="bsb-hero__subtitle">Supporting message</span>
      </h1>
      <p class="bsb-hero__lead">Clear value proposition</p>
      <div class="bsb-hero__actions">
        <a href="#cta" class="btn btn--primary btn--large">Primary Action</a>
        <a href="#learn-more" class="btn btn--secondary btn--large">Learn More</a>
      </div>
    </div>
  </div>
</section>
```

### Content Pages
Structured for readability and SEO:

```html
<section class="section">
  <div class="container container--md">
    <div class="prose">
      <h2>Content Heading</h2>
      <p>Well-structured paragraphs with proper spacing.</p>
      
      <h3>Subsection</h3>
      <ul>
        <li>Organized lists for easy scanning</li>
        <li>Proper semantic markup</li>
      </ul>
    </div>
  </div>
</section>
```

### Gallery Pages
Showcase visual content:

```html
<section class="section">
  <div class="container">
    <div class="grid grid--3-cols">
      <article class="bsb-card" data-bsb-component="card">
        <div class="bsb-card__media">
          <img src="/assets/images/item.jpg" alt="Descriptive alt text">
        </div>
        <div class="bsb-card__body">
          <h3 class="bsb-card__title">Item Title</h3>
          <p class="bsb-card__text">Item description</p>
        </div>
      </article>
      <!-- Repeat for more items -->
    </div>
  </div>
</section>
```

## 🔗 Internal Linking Strategy

### Relative Links for Internal Pages
```html
<!-- ✅ Correct - relative paths -->
<a href="/pages/about.html">About Us</a>
<a href="/pages/services.html">Our Services</a>

<!-- ❌ Avoid - absolute URLs for internal links -->
<a href="https://yourdomain.com/pages/about.html">About Us</a>
```

### Anchor Links for Page Sections
```html
<!-- Table of contents -->
<nav class="page-toc">
  <h2>On This Page</h2>
  <ul>
    <li><a href="#overview">Overview</a></li>
    <li><a href="#features">Features</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
  </ul>
</nav>

<!-- Section with matching ID -->
<section id="overview" class="section">
  <h2>Overview</h2>
  <!-- Content -->
</section>
```

## 📱 Responsive Considerations

All BSB pages are mobile-first by default:

```html
<!-- 
  Mobile-First Content Strategy
  ============================
  Content stacks vertically on mobile,
  arranges in columns on larger screens.
-->
<div class="grid grid--md-2-cols grid--lg-3-cols">
  <div class="grid__item">Mobile: full width, Tablet: 1/2, Desktop: 1/3</div>
  <div class="grid__item">Responsive without media queries</div>
  <div class="grid__item">CSS Grid handles the complexity</div>
</div>
```

**📖 Learn more**: [Responsive Design Patterns](responsive-design.md)

## ♿ Accessibility Best Practices

Every page should follow these accessibility guidelines:

### Semantic HTML Structure
```html
<!-- ✅ Proper heading hierarchy -->
<h1>Page Title</h1>
  <h2>Main Section</h2>
    <h3>Subsection</h3>
    <h3>Another Subsection</h3>
  <h2>Another Main Section</h2>

<!-- ✅ Landmark roles -->
<main role="main">
  <section aria-labelledby="section-title">
    <h2 id="section-title">Section Title</h2>
  </section>
</main>
```

### Focus Management
```html
<!-- Skip link for keyboard users -->
<a href="#main" class="skip-link">Skip to main content</a>

<!-- Focus-visible main content -->
<main id="main" tabindex="-1">
  <!-- Page content -->
</main>
```

### Screen Reader Support
```html
<!-- Descriptive alt text -->
<img src="chart.png" alt="Sales increased 40% from Q1 to Q2 2024">

<!-- Form labels -->
<label for="email">Email Address</label>
<input type="email" id="email" required>

<!-- Button context -->
<button type="button" aria-label="Close modal dialog">×</button>
```

**📖 Learn more**: [Accessibility Guide](accessibility.md)

## 🔍 SEO Optimization

### Meta Tags Template
```html
<head>
  <!-- Essential meta tags -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- SEO meta tags -->
  <title>Specific Page Title | Site Name</title>
  <meta name="description" content="155-character description for search results">
  <meta name="keywords" content="relevant, keywords, separated, by, commas">
  
  <!-- Open Graph for social sharing -->
  <meta property="og:title" content="Page Title">
  <meta property="og:description" content="Social media description">
  <meta property="og:image" content="/assets/images/social-preview.jpg">
  <meta property="og:url" content="https://yourdomain.com/pages/page.html">
  
  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Page Title">
  <meta name="twitter:description" content="Twitter description">
  <meta name="twitter:image" content="/assets/images/twitter-preview.jpg">
</head>
```

### Content Structure for SEO
```html
<!-- Use structured markup -->
<article itemscope itemtype="http://schema.org/Article">
  <header>
    <h1 itemprop="headline">Article Title</h1>
    <time itemprop="datePublished" datetime="2024-01-15">January 15, 2024</time>
  </header>
  
  <div itemprop="articleBody">
    <!-- Article content -->
  </div>
</article>
```

## 🎯 Call-to-Action Patterns

### Primary CTA
```html
<section class="section section--cta">
  <div class="container text-center">
    <h2>Ready to Get Started?</h2>
    <p class="lead">Join thousands of developers building better websites.</p>
    <div class="cta-actions">
      <a href="/signup" class="btn btn--primary btn--large">Start Free Trial</a>
      <a href="/demo" class="btn btn--secondary btn--large">View Demo</a>
    </div>
  </div>
</section>
```

### Inline CTAs
```html
<div class="inline-cta">
  <p><strong>Want to learn more?</strong> 
     <a href="/tutorials" class="btn btn--small">Browse Tutorials</a>
  </p>
</div>
```

## 🛠️ Development Workflow

### 1. Create and Test
```bash
# Create new page
cp src/index.html src/pages/new-page.html

# Start development server
npm run dev

# Test in browser at http://localhost:5173/pages/new-page.html
```

### 2. Validate Content
- Check HTML validation with browser dev tools
- Test responsive design at different screen sizes
- Verify navigation works correctly
- Test with keyboard navigation

### 3. Optimize for Production
```bash
# Build optimized version
npm run build

# Preview production build
npm run preview
```

## 📊 Analytics and Tracking

Add page-specific tracking (optional):

```html
<!-- Google Analytics page view -->
<script>
  gtag('config', 'GA_TRACKING_ID', {
    page_title: 'Page Name',
    page_location: window.location.href
  });
</script>

<!-- Custom event tracking -->
<button onclick="gtag('event', 'click', { event_category: 'CTA', event_label: 'Header CTA' })">
  Sign Up
</button>
```

## 🎉 Page Creation Checklist

Before considering your page complete:

- [ ] **Metadata updated** (title, description, og tags)
- [ ] **Navigation links added** to header and relevant pages
- [ ] **Content structured** with semantic HTML
- [ ] **Accessibility tested** (keyboard navigation, screen reader)
- [ ] **Mobile responsive** checked at multiple screen sizes
- [ ] **Internal links** working and relevant
- [ ] **Images optimized** with proper alt text
- [ ] **Performance tested** (Lighthouse score > 90)
- [ ] **HTML validated** (no errors in dev tools)

## 🔗 Related Resources

- [Component Library](../../src/components/README.md) - Available UI components
- [CSS Architecture](../../src/styles/README.md) - Styling system overview
- [SEO Guide](seo-optimization.md) - Search engine optimization
- [Accessibility Guide](accessibility.md) - Making sites inclusive
- [Performance Guide](performance.md) - Speed optimization

---

**🔗 Quick Navigation**
- [← Getting Started](getting-started.md)
- [Next: Component Development →](component-development.md)
- [CSS Architecture →](../../src/styles/README.md)