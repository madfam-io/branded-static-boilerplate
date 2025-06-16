# Footer Component

> Site-wide footer with navigation, branding, and essential information

## Overview

The Footer component provides consistent site-wide navigation and essential information. It's designed to be helpful without overwhelming, offering secondary navigation and legal information that users expect to find at the bottom of pages.

## 📁 Component Files

```
src/components/footer/
├── 📄 footer.html          # Component markup and structure
├── 📄 footer.css           # Component styles and layout
└── 📄 README.md            # This documentation
```

## 🎨 Visual Examples

### Standard Footer
```html
<footer class="bsb-footer" data-bsb-component="footer" role="contentinfo">
  <div class="container">
    <div class="bsb-footer__main">
      <div class="bsb-footer__grid">
        
        <!-- Brand Section -->
        <div class="bsb-footer__column bsb-footer__column--wide">
          <div class="bsb-footer__brand">
            <a href="/" class="bsb-footer__logo">Your Brand</a>
            <p class="bsb-footer__tagline">Building better websites together</p>
          </div>
        </div>
        
        <!-- Navigation Columns -->
        <div class="bsb-footer__column">
          <h4 class="bsb-footer__heading">Company</h4>
          <ul class="bsb-footer__links">
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/careers">Careers</a></li>
          </ul>
        </div>
        
        <div class="bsb-footer__column">
          <h4 class="bsb-footer__heading">Resources</h4>
          <ul class="bsb-footer__links">
            <li><a href="/docs">Documentation</a></li>
            <li><a href="/tutorials">Tutorials</a></li>
            <li><a href="/support">Support</a></li>
          </ul>
        </div>
        
      </div>
    </div>
    
    <!-- Copyright Section -->
    <div class="bsb-footer__bottom">
      <p class="bsb-footer__copyright">
        © <time datetime="2024">2024</time> Your Brand. All rights reserved.
      </p>
    </div>
  </div>
</footer>
```

### Minimal Footer
```html
<footer class="bsb-footer bsb-footer--minimal" data-bsb-component="footer">
  <div class="container">
    <div class="bsb-footer__bottom">
      <div class="bsb-footer__bottom-content">
        <p class="bsb-footer__copyright">© 2024 Your Brand</p>
        <nav class="bsb-footer__legal">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </nav>
      </div>
    </div>
  </div>
</footer>
```

## 🏗️ Component Structure

### HTML Architecture
```html
<!--
  Footer Element
  ==============
  - Always use <footer> semantic element
  - Include role="contentinfo" for accessibility
  - One footer per page for SEO
-->
<footer class="bsb-footer [modifiers]" data-bsb-component="footer" role="contentinfo">
  
  <!-- Container for responsive width -->
  <div class="container">
    
    <!-- Main footer content (optional) -->
    <div class="bsb-footer__main">
      
      <!-- Grid layout for columns -->
      <div class="bsb-footer__grid">
        
        <!-- Brand column (wider) -->
        <div class="bsb-footer__column bsb-footer__column--wide">
          <div class="bsb-footer__brand">
            <a href="/" class="bsb-footer__logo">Brand Name</a>
            <p class="bsb-footer__tagline">Brand description</p>
          </div>
        </div>
        
        <!-- Navigation columns -->
        <div class="bsb-footer__column">
          <h4 class="bsb-footer__heading">Section Title</h4>
          <ul class="bsb-footer__links">
            <li><a href="/link">Link Text</a></li>
          </ul>
        </div>
        
        <!-- Repeat for more columns -->
        
      </div>
    </div>
    
    <!-- Copyright and legal (required) -->
    <div class="bsb-footer__bottom">
      <div class="bsb-footer__bottom-content">
        <p class="bsb-footer__copyright">
          © <time datetime="2024">2024</time> Company Name
        </p>
        <nav class="bsb-footer__legal">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
        </nav>
      </div>
    </div>
    
  </div>
</footer>
```

## 🎛️ Footer Variations

### Layout Modifiers
```css
.bsb-footer--minimal     /* Simple copyright-only footer */
.bsb-footer--compact     /* Reduced padding for content pages */
.bsb-footer--sticky      /* Sticky footer for short pages */
```

### Style Modifiers
```css
.bsb-footer--dark        /* Dark background theme */
.bsb-footer--bordered    /* Top border separator */
```

## 🎨 CSS Classes Reference

| Class | Purpose | Usage |
|-------|---------|-------|
| `.bsb-footer` | Base footer container | Required on footer element |
| `.bsb-footer__main` | Main content area | Optional, for navigation columns |
| `.bsb-footer__grid` | Column layout container | Required inside main |
| `.bsb-footer__column` | Individual column | Required for each navigation group |
| `.bsb-footer__column--wide` | Wider column | Use for brand/description |
| `.bsb-footer__brand` | Brand information | Contains logo and tagline |
| `.bsb-footer__logo` | Brand logo/name | Link to homepage |
| `.bsb-footer__tagline` | Brand description | Brief company description |
| `.bsb-footer__heading` | Column heading | Section title for links |
| `.bsb-footer__links` | Navigation link list | Unordered list of links |
| `.bsb-footer__bottom` | Copyright section | Required bottom area |
| `.bsb-footer__copyright` | Copyright text | Include year and company |
| `.bsb-footer__legal` | Legal links | Privacy, terms, etc. |

## 🔧 CSS Custom Properties

Customize footers using CSS variables in `src/styles/base/variables.css`:

```css
:root {
  /* Footer Colors */
  --bsb-footer-bg: var(--bsb-gray-50);
  --bsb-footer-text: var(--bsb-text-muted);
  --bsb-footer-border: var(--bsb-border-color);
  
  /* Footer Spacing */
  --bsb-footer-padding-y: var(--bsb-space-12);
  --bsb-footer-gap: var(--bsb-space-8);
  --bsb-footer-bottom-padding: var(--bsb-space-6);
  
  /* Footer Typography */
  --bsb-footer-heading-size: var(--bsb-text-sm);
  --bsb-footer-heading-weight: var(--bsb-font-semibold);
  --bsb-footer-link-size: var(--bsb-text-sm);
}
```

## 📱 Responsive Behavior

Footers automatically adapt to screen size:

```css
/* Mobile: Single column stack */
.bsb-footer__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--bsb-footer-gap);
}

/* Tablet: 2-column layout */
@media (min-width: 768px) {
  .bsb-footer__grid {
    grid-template-columns: 2fr 1fr 1fr;
  }
}

/* Desktop: Multi-column layout */
@media (min-width: 1024px) {
  .bsb-footer__grid {
    grid-template-columns: 2fr 1fr 1fr 1fr;
  }
}

/* Footer bottom: Stack on mobile, inline on desktop */
.bsb-footer__bottom-content {
  display: flex;
  flex-direction: column;
  gap: var(--bsb-space-4);
}

@media (min-width: 768px) {
  .bsb-footer__bottom-content {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}
```

## ♿ Accessibility Features

### Semantic Structure
- Uses `<footer>` landmark element
- Includes `role="contentinfo"` for screen readers
- Proper heading hierarchy with `<h4>` elements

### Navigation Support
```html
<!-- Clear navigation landmarks -->
<footer role="contentinfo">
  <nav aria-label="Footer navigation">
    <h4>Section Title</h4>
    <ul>
      <li><a href="/link">Link Text</a></li>
    </ul>
  </nav>
</footer>
```

### Focus Management
```css
.bsb-footer a:focus {
  outline: 2px solid var(--bsb-primary);
  outline-offset: 2px;
}
```

## 🎯 Content Guidelines

### Essential Footer Content

#### Must Include:
- **Copyright notice** with current year
- **Privacy policy** link (legal requirement)
- **Terms of service** link
- **Contact information** or link

#### Should Include:
- **Main navigation** links
- **Important pages** (About, Services)
- **Support resources** (Help, Docs)
- **Social media** links (if applicable)

#### Could Include:
- **Company address** (for local businesses)
- **Newsletter signup** (if appropriate)
- **Awards/certifications** (if relevant)

### Writing Footer Copy

#### Brand Tagline:
- Keep under 100 characters
- Reflect company values
- Be memorable and unique

#### Link Text:
- Use descriptive names
- Avoid "Click here" or generic terms
- Match page titles

## 🎨 Design Patterns

### Color Schemes
```css
/* Light footer (default) */
.bsb-footer {
  background: var(--bsb-gray-50);
  border-top: 1px solid var(--bsb-border-color);
}

/* Dark footer */
.bsb-footer--dark {
  background: var(--bsb-gray-900);
  color: var(--bsb-gray-300);
}

/* Branded footer */
.bsb-footer--branded {
  background: var(--bsb-primary);
  color: white;
}
```

### Link Organization
Group related links logically:

```html
<!-- Group by user intent -->
<div class="bsb-footer__column">
  <h4>Learn</h4>
  <ul>
    <li><a href="/tutorials">Tutorials</a></li>
    <li><a href="/docs">Documentation</a></li>
    <li><a href="/examples">Examples</a></li>
  </ul>
</div>

<div class="bsb-footer__column">
  <h4>Support</h4>
  <ul>
    <li><a href="/help">Help Center</a></li>
    <li><a href="/contact">Contact Us</a></li>
    <li><a href="/community">Community</a></li>
  </ul>
</div>
```

## 🛠️ Development Tips

### Dynamic Copyright Year
BSB automatically updates the copyright year:

```html
<!-- Use time element with datetime attribute -->
<p class="bsb-footer__copyright">
  © <time datetime="2024">2024</time> Your Brand
</p>
```

The JavaScript in `src/scripts/core/main.js` automatically updates this to the current year.

### Performance Considerations
- Use relative links for internal pages
- Optimize footer for Core Web Vitals
- Consider lazy loading social media embeds

### Testing Footers
- Verify all links work correctly
- Test responsive layout on mobile
- Check keyboard navigation
- Validate with screen readers

## 🎯 Common Use Cases

### Business Website Footer
```html
<footer class="bsb-footer" data-bsb-component="footer" role="contentinfo">
  <div class="container">
    <div class="bsb-footer__main">
      <div class="bsb-footer__grid">
        <div class="bsb-footer__column bsb-footer__column--wide">
          <div class="bsb-footer__brand">
            <a href="/" class="bsb-footer__logo">Acme Corp</a>
            <p class="bsb-footer__tagline">Building solutions that matter</p>
          </div>
        </div>
        <div class="bsb-footer__column">
          <h4 class="bsb-footer__heading">Services</h4>
          <ul class="bsb-footer__links">
            <li><a href="/web-design">Web Design</a></li>
            <li><a href="/development">Development</a></li>
            <li><a href="/consulting">Consulting</a></li>
          </ul>
        </div>
        <div class="bsb-footer__column">
          <h4 class="bsb-footer__heading">Company</h4>
          <ul class="bsb-footer__links">
            <li><a href="/about">About Us</a></li>
            <li><a href="/team">Our Team</a></li>
            <li><a href="/careers">Careers</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="bsb-footer__bottom">
      <p class="bsb-footer__copyright">© 2024 Acme Corp. All rights reserved.</p>
    </div>
  </div>
</footer>
```

### Portfolio Footer
```html
<footer class="bsb-footer bsb-footer--minimal" data-bsb-component="footer">
  <div class="container">
    <div class="bsb-footer__bottom">
      <div class="bsb-footer__bottom-content">
        <p class="bsb-footer__copyright">© 2024 Jane Designer</p>
        <nav class="bsb-footer__legal">
          <a href="mailto:hello@janedesigner.com">Contact</a>
          <a href="/privacy">Privacy</a>
        </nav>
      </div>
    </div>
  </div>
</footer>
```

### Educational Site Footer
```html
<footer class="bsb-footer" data-bsb-component="footer" role="contentinfo">
  <div class="container">
    <div class="bsb-footer__main">
      <div class="bsb-footer__grid">
        <div class="bsb-footer__column bsb-footer__column--wide">
          <div class="bsb-footer__brand">
            <a href="/" class="bsb-footer__logo">Learning Hub</a>
            <p class="bsb-footer__tagline">Making web development accessible to everyone</p>
          </div>
        </div>
        <div class="bsb-footer__column">
          <h4 class="bsb-footer__heading">Learn</h4>
          <ul class="bsb-footer__links">
            <li><a href="/tutorials">Tutorials</a></li>
            <li><a href="/courses">Courses</a></li>
            <li><a href="/workshops">Workshops</a></li>
          </ul>
        </div>
        <div class="bsb-footer__column">
          <h4 class="bsb-footer__heading">Community</h4>
          <ul class="bsb-footer__links">
            <li><a href="/forum">Forum</a></li>
            <li><a href="/discord">Discord</a></li>
            <li><a href="/newsletter">Newsletter</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="bsb-footer__bottom">
      <div class="bsb-footer__bottom-content">
        <p class="bsb-footer__copyright">© 2024 Learning Hub</p>
        <nav class="bsb-footer__legal">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/code-of-conduct">Code of Conduct</a>
        </nav>
      </div>
    </div>
  </div>
</footer>
```

## 🔗 Related Components

- **[Header Component](../header/README.md)** - Site navigation and branding
- **[Container System](../../styles/README.md#containers)** - Layout containers
- **[Grid System](../../styles/README.md#grid-system)** - Footer column layouts

## 📚 Learn More

- **[Page Structure](../../../docs/tutorials/page-structure.md)** - Complete page layout
- **[Navigation Design](../../../docs/tutorials/navigation.md)** - Footer navigation best practices
- **[Legal Pages](../../../docs/tutorials/legal-pages.md)** - Privacy policy and terms

---

**🔗 Quick Navigation**
- [← Component Library](../README.md)
- [Next: JavaScript Patterns →](../../scripts/README.md)
- [Page Creation Guide →](../../../docs/tutorials/page-creation.md)