# Accessibility Best Practices

> ♿ **Learning Objective**: Create inclusive web experiences that work for everyone by mastering WCAG guidelines, semantic HTML, ARIA, and assistive technology support.

## Table of Contents

1. [Introduction](#introduction)
2. [Understanding Accessibility](#understanding-accessibility)
3. [WCAG Guidelines](#wcag-guidelines)
4. [Semantic HTML Foundation](#semantic-html-foundation)
5. [Keyboard Navigation](#keyboard-navigation)
6. [Screen Reader Support](#screen-reader-support)
7. [Visual Accessibility](#visual-accessibility)
8. [Motor Accessibility](#motor-accessibility)
9. [Cognitive Accessibility](#cognitive-accessibility)
10. [ARIA (Accessible Rich Internet Applications)](#aria-accessible-rich-internet-applications)
11. [Testing for Accessibility](#testing-for-accessibility)
12. [Common Patterns](#common-patterns)
13. [Real-World Examples](#real-world-examples)
14. [Accessibility Checklist](#accessibility-checklist)

## Introduction

Accessibility isn't just about compliance—it's about creating better experiences for everyone:

- 👥 **1 billion people** worldwide have disabilities
- 🔍 **Search engines** better understand accessible content
- 📱 **Voice assistants** work better with semantic markup
- ⚡ **Performance** often improves with accessible practices
- 💼 **Legal compliance** protects your organization

### Prerequisites

Before this tutorial, you should understand:
- Basic HTML, CSS, and JavaScript
- How screen readers work (conceptually)
- Different types of disabilities
- BSB component architecture

### What You'll Learn

- WCAG 2.1 AA compliance techniques
- Semantic HTML and ARIA best practices
- Keyboard navigation patterns
- Screen reader optimization
- Testing tools and methods
- Common accessibility pitfalls

## Understanding Accessibility

### Types of Disabilities

```
Visual Disabilities:
├── Blindness
├── Low vision
├── Color blindness
└── Light sensitivity

Motor Disabilities:
├── Limited fine motor control
├── Missing limbs
├── Tremors
└── Paralysis

Auditory Disabilities:
├── Deafness
├── Hard of hearing
└── Audio processing disorders

Cognitive Disabilities:
├── Dyslexia
├── ADHD
├── Memory issues
└── Learning disabilities

Temporary/Situational:
├── Broken arm
├── Bright sunlight
├── Noisy environment
└── Limited bandwidth
```

### Assistive Technologies

1. **Screen Readers**
   - NVDA (Windows, free)
   - JAWS (Windows, paid)
   - VoiceOver (macOS/iOS, built-in)
   - TalkBack (Android, built-in)

2. **Alternative Input Devices**
   - Switch controls
   - Eye-tracking systems
   - Voice control
   - Head tracking

3. **Browser Features**
   - Zoom (up to 200%)
   - High contrast mode
   - Reader mode
   - Voice commands

## WCAG Guidelines

Web Content Accessibility Guidelines (WCAG) 2.1 has three levels:

### Level A (Minimum)
Basic accessibility features that don't interfere with normal use.

### Level AA (Standard)
Recommended level for public websites and applications.

### Level AAA (Enhanced)
Highest level, often impractical for entire websites.

### The Four Principles: POUR

#### 1. Perceivable
Information must be presentable in ways users can perceive.

```html
<!-- ❌ Information conveyed by color alone -->
<span style="color: red;">Error:</span> Invalid email

<!-- ✅ Multiple ways to convey information -->
<span class="error" aria-label="Error">
  <svg aria-hidden="true"><!-- error icon --></svg>
  Error:
</span> Invalid email
```

#### 2. Operable
Interface components must be operable by all users.

```html
<!-- ❌ Not keyboard accessible -->
<div onclick="openModal()">Open</div>

<!-- ✅ Keyboard accessible -->
<button type="button" onclick="openModal()">Open</button>
```

#### 3. Understandable
Information and UI operation must be understandable.

```html
<!-- ❌ Unclear form validation -->
<input type="email" required>
<span>!</span>

<!-- ✅ Clear validation messages -->
<label for="email">Email Address (required)</label>
<input type="email" id="email" required 
       aria-describedby="email-error">
<div id="email-error" role="alert">
  Please enter a valid email address
</div>
```

#### 4. Robust
Content must be robust enough for various assistive technologies.

```html
<!-- ❌ Custom elements without proper semantics -->
<div class="my-button" onclick="doSomething()">Click me</div>

<!-- ✅ Proper button semantics -->
<button type="button" onclick="doSomething()">Click me</button>
```

## Semantic HTML Foundation

### Use the Right Element for the Job

```html
<!-- ❌ Generic elements for everything -->
<div class="header">
  <div class="nav">
    <div class="link" onclick="navigate()">Home</div>
  </div>
</div>
<div class="main">
  <div class="article">
    <div class="title">Article Title</div>
    <div class="content">Content here...</div>
  </div>
</div>

<!-- ✅ Semantic HTML -->
<header>
  <nav>
    <a href="/">Home</a>
  </nav>
</header>
<main>
  <article>
    <h1>Article Title</h1>
    <p>Content here...</p>
  </article>
</main>
```

### Proper Heading Hierarchy

```html
<!-- ❌ Poor heading structure -->
<h1>Main Title</h1>
<h3>Subsection</h3> <!-- Skipped h2 -->
<h2>Another section</h2> <!-- Out of order -->

<!-- ✅ Logical heading hierarchy -->
<h1>Main Title</h1>
  <h2>Major Section</h2>
    <h3>Subsection</h3>
    <h3>Another Subsection</h3>
  <h2>Another Major Section</h2>
    <h3>Its Subsection</h3>
```

### Form Labels and Structure

```html
<!-- ❌ Poor form accessibility -->
<form>
  Name: <input type="text">
  <input type="checkbox"> Subscribe
  <input type="submit" value="Submit">
</form>

<!-- ✅ Accessible form -->
<form>
  <fieldset>
    <legend>Contact Information</legend>
    
    <label for="name">Name (required)</label>
    <input type="text" id="name" required 
           aria-describedby="name-help">
    <div id="name-help">Enter your full name</div>
    
    <label>
      <input type="checkbox" name="subscribe">
      Subscribe to newsletter
    </label>
  </fieldset>
  
  <button type="submit">Submit Form</button>
</form>
```

### Link Purpose and Context

```html
<!-- ❌ Ambiguous links -->
<a href="/products">Click here</a>
<a href="/about">Read more</a>
<a href="/contact">Learn more</a>

<!-- ✅ Descriptive links -->
<a href="/products">View our products</a>
<a href="/about">Read more about our company</a>
<a href="/contact" aria-label="Learn more about our services">
  Learn more
</a>
```

## Keyboard Navigation

### Tab Order and Focus Management

```css
/* Ensure visible focus indicators */
:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

/* Skip to main content link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 6px;
}
```

```html
<!-- Skip navigation for keyboard users -->
<body>
  <a href="#main" class="skip-link">Skip to main content</a>
  
  <nav>
    <!-- Navigation links -->
  </nav>
  
  <main id="main" tabindex="-1">
    <!-- Main content -->
  </main>
</body>
```

### Keyboard Event Handling

```javascript
// Handle Enter and Space for custom buttons
function handleKeydown(event) {
  // Only handle Enter and Space
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handleClick(event);
  }
}

// Arrow key navigation for menus
class AccessibleMenu {
  constructor(menuElement) {
    this.menu = menuElement;
    this.items = Array.from(menuElement.querySelectorAll('[role="menuitem"]'));
    this.currentIndex = 0;
    
    this.setupKeyboardNavigation();
  }
  
  setupKeyboardNavigation() {
    this.menu.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          this.moveNext();
          break;
        case 'ArrowUp':
          event.preventDefault();
          this.movePrevious();
          break;
        case 'Home':
          event.preventDefault();
          this.moveToFirst();
          break;
        case 'End':
          event.preventDefault();
          this.moveToLast();
          break;
        case 'Escape':
          this.closeMenu();
          break;
      }
    });
  }
  
  moveNext() {
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
    this.focusCurrentItem();
  }
  
  movePrevious() {
    this.currentIndex = this.currentIndex === 0 
      ? this.items.length - 1 
      : this.currentIndex - 1;
    this.focusCurrentItem();
  }
  
  focusCurrentItem() {
    this.items[this.currentIndex].focus();
  }
}
```

### Focus Trapping in Modals

```javascript
class AccessibleModal {
  constructor(modalElement) {
    this.modal = modalElement;
    this.focusableElements = this.getFocusableElements();
    this.firstFocusable = this.focusableElements[0];
    this.lastFocusable = this.focusableElements[this.focusableElements.length - 1];
    this.previousActiveElement = null;
  }
  
  getFocusableElements() {
    const selectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');
    
    return Array.from(this.modal.querySelectorAll(selectors));
  }
  
  open() {
    // Store current focus
    this.previousActiveElement = document.activeElement;
    
    // Show modal
    this.modal.style.display = 'block';
    this.modal.setAttribute('aria-hidden', 'false');
    
    // Focus first element
    this.firstFocusable?.focus();
    
    // Trap focus
    this.modal.addEventListener('keydown', this.handleKeydown.bind(this));
  }
  
  close() {
    // Hide modal
    this.modal.style.display = 'none';
    this.modal.setAttribute('aria-hidden', 'true');
    
    // Restore focus
    this.previousActiveElement?.focus();
    
    // Remove trap
    this.modal.removeEventListener('keydown', this.handleKeydown.bind(this));
  }
  
  handleKeydown(event) {
    if (event.key === 'Escape') {
      this.close();
      return;
    }
    
    if (event.key === 'Tab') {
      // If last focusable element and Tab, go to first
      if (event.target === this.lastFocusable && !event.shiftKey) {
        event.preventDefault();
        this.firstFocusable.focus();
      }
      // If first focusable element and Shift+Tab, go to last
      else if (event.target === this.firstFocusable && event.shiftKey) {
        event.preventDefault();
        this.lastFocusable.focus();
      }
    }
  }
}
```

## Screen Reader Support

### Proper Use of ARIA Labels

```html
<!-- Button with icon only -->
<button aria-label="Search products">
  <svg aria-hidden="true"><!-- search icon --></svg>
</button>

<!-- Form with additional description -->
<label for="password">Password</label>
<input type="password" id="password" 
       aria-describedby="password-help">
<div id="password-help">
  Must be at least 8 characters with numbers and symbols
</div>

<!-- Status updates -->
<div aria-live="polite" id="status"></div>
<script>
  // Announce status changes
  document.getElementById('status').textContent = 'Form saved successfully';
</script>
```

### Screen Reader Testing

```javascript
// Screen reader announcement helper
class ScreenReaderAnnouncer {
  constructor() {
    this.liveRegion = this.createLiveRegion();
  }
  
  createLiveRegion() {
    const region = document.createElement('div');
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.classList.add('sr-only');
    document.body.appendChild(region);
    return region;
  }
  
  announce(message, priority = 'polite') {
    // Clear previous message
    this.liveRegion.textContent = '';
    
    // Set priority
    this.liveRegion.setAttribute('aria-live', priority);
    
    // Announce new message
    setTimeout(() => {
      this.liveRegion.textContent = message;
    }, 100);
  }
}

// Usage
const announcer = new ScreenReaderAnnouncer();

// Announce form validation
announcer.announce('3 errors found in form', 'assertive');

// Announce successful action
announcer.announce('Product added to cart');
```

### Screen Reader Optimized Content

```html
<!-- ❌ Poor screen reader experience -->
<div class="card">
  <img src="product.jpg">
  <div>Product Name</div>
  <div>$19.99</div>
  <div onclick="addToCart()">Add to Cart</div>
</div>

<!-- ✅ Screen reader friendly -->
<article class="card" role="article">
  <img src="product.jpg" alt="Wireless headphones">
  <h3>Premium Wireless Headphones</h3>
  <p class="price">
    <span class="sr-only">Price:</span>
    $19.99
  </p>
  <button type="button" onclick="addToCart()" 
          aria-label="Add Premium Wireless Headphones to cart">
    Add to Cart
  </button>
</article>
```

## Visual Accessibility

### Color and Contrast

```css
/* WCAG AA requires 4.5:1 contrast for normal text */
.text-primary {
  color: #333333; /* 12.6:1 contrast on white */
}

/* WCAG AA requires 3:1 contrast for large text (18pt+) */
.text-large {
  color: #767676; /* 4.5:1 contrast on white */
  font-size: 1.125rem;
}

/* Don't rely on color alone */
.error {
  color: #d32f2f;
  border-left: 4px solid #d32f2f; /* Visual indicator */
}

.error::before {
  content: "⚠ "; /* Icon indicator */
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .button {
    border: 2px solid;
  }
}

/* Respect reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Focus Indicators

```css
/* Custom focus styles */
.button {
  position: relative;
}

.button:focus {
  outline: none; /* Remove default */
}

.button:focus::after {
  content: '';
  position: absolute;
  top: -4px;
  right: -4px;
  bottom: -4px;
  left: -4px;
  border: 2px solid #0066cc;
  border-radius: 4px;
  pointer-events: none;
}

/* Focus visible (only keyboard focus) */
.button:focus:not(:focus-visible) {
  outline: none;
}

.button:focus-visible {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}
```

### Text Alternatives

```html
<!-- Images -->
<img src="chart.png" alt="Sales increased 45% from Q1 to Q2">

<!-- Decorative images -->
<img src="decoration.png" alt="" role="presentation">

<!-- Complex images -->
<figure>
  <img src="complex-chart.png" alt="Quarterly sales data">
  <figcaption>
    Detailed description: Sales in Q1 were $50K, Q2 $72.5K...
  </figcaption>
</figure>

<!-- Icons with text -->
<button>
  <svg aria-hidden="true"><!-- save icon --></svg>
  Save Document
</button>

<!-- Icons without text -->
<button aria-label="Save document">
  <svg aria-hidden="true"><!-- save icon --></svg>
</button>
```

## Motor Accessibility

### Target Size and Spacing

```css
/* Minimum touch target: 44x44px */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  
  /* For smaller visual elements, use padding */
  padding: 12px;
}

/* Adequate spacing between interactive elements */
.button-group .button {
  margin: 4px;
}

/* Larger click areas for small elements */
.checkbox-wrapper {
  position: relative;
  display: inline-block;
}

.checkbox-wrapper input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
}

.checkbox-wrapper label {
  display: block;
  padding: 12px;
  cursor: pointer;
  min-height: 44px;
  display: flex;
  align-items: center;
}

.checkbox-wrapper label::before {
  content: '';
  width: 16px;
  height: 16px;
  border: 2px solid #333;
  margin-right: 8px;
}
```

### Drag and Drop Alternatives

```javascript
// Provide keyboard alternative to drag and drop
class AccessibleSortableList {
  constructor(listElement) {
    this.list = listElement;
    this.items = Array.from(listElement.children);
    this.draggedElement = null;
    this.setupKeyboardSorting();
    this.setupDragAndDrop();
  }
  
  setupKeyboardSorting() {
    this.items.forEach((item, index) => {
      // Make items focusable
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.setAttribute('aria-label', 
        `Item ${index + 1} of ${this.items.length}. Press Space to grab, arrow keys to move, Space to drop.`
      );
      
      item.addEventListener('keydown', (event) => {
        this.handleKeyboardSort(event, item, index);
      });
    });
  }
  
  handleKeyboardSort(event, item, index) {
    if (event.key === ' ') {
      event.preventDefault();
      if (this.draggedElement === null) {
        // Start move
        this.draggedElement = item;
        item.setAttribute('aria-grabbed', 'true');
        this.announceToScreenReader('Item grabbed. Use arrow keys to move.');
      } else {
        // End move
        this.draggedElement.setAttribute('aria-grabbed', 'false');
        this.draggedElement = null;
        this.announceToScreenReader('Item dropped.');
      }
    } else if (this.draggedElement && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
      event.preventDefault();
      this.moveItem(event.key === 'ArrowUp' ? 'up' : 'down');
    }
  }
  
  moveItem(direction) {
    const currentIndex = this.items.indexOf(this.draggedElement);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex >= 0 && newIndex < this.items.length) {
      // Move item in DOM
      if (direction === 'up') {
        this.list.insertBefore(this.draggedElement, this.items[newIndex]);
      } else {
        this.list.insertBefore(this.draggedElement, this.items[newIndex].nextSibling);
      }
      
      // Update items array
      this.items = Array.from(this.list.children);
      
      this.announceToScreenReader(`Moved to position ${newIndex + 1}`);
    }
  }
  
  announceToScreenReader(message) {
    // Use the announcer from previous example
    announcer.announce(message);
  }
}
```

## Cognitive Accessibility

### Clear Language and Structure

```html
<!-- ❌ Complex language -->
<p>
  To facilitate the utilization of our comprehensive service offerings,
  it is incumbent upon the user to effectuate the requisite authentication
  procedures.
</p>

<!-- ✅ Plain language -->
<p>
  To use our services, you need to sign in first.
</p>

<!-- Clear instructions -->
<form>
  <h2>Create Account</h2>
  <p>All fields marked with * are required.</p>
  
  <label for="username">
    Username *
    <span class="help-text">Use 3-20 characters, letters and numbers only</span>
  </label>
  <input type="text" id="username" required 
         pattern="[a-zA-Z0-9]{3,20}"
         aria-describedby="username-help">
  <div id="username-help" class="help-text">
    This will be your unique identifier
  </div>
</form>
```

### Error Prevention and Recovery

```javascript
// Prevent accidental form submission
class FormProtection {
  constructor(formElement) {
    this.form = formElement;
    this.hasUnsavedChanges = false;
    this.setupChangeTracking();
    this.setupSubmissionProtection();
  }
  
  setupChangeTracking() {
    this.form.addEventListener('input', () => {
      this.hasUnsavedChanges = true;
    });
    
    this.form.addEventListener('submit', () => {
      this.hasUnsavedChanges = false;
    });
  }
  
  setupSubmissionProtection() {
    // Warn before leaving page with unsaved changes
    window.addEventListener('beforeunload', (event) => {
      if (this.hasUnsavedChanges) {
        event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    });
    
    // Double-submit protection
    this.form.addEventListener('submit', (event) => {
      const submitButton = this.form.querySelector('[type="submit"]');
      
      if (submitButton.disabled) {
        event.preventDefault();
        return;
      }
      
      // Disable submit button
      submitButton.disabled = true;
      submitButton.textContent = 'Saving...';
      
      // Re-enable after 5 seconds in case of error
      setTimeout(() => {
        submitButton.disabled = false;
        submitButton.textContent = 'Save';
      }, 5000);
    });
  }
}
```

### Time-based Content

```javascript
// Accessible carousel with controls
class AccessibleCarousel {
  constructor(carouselElement) {
    this.carousel = carouselElement;
    this.slides = Array.from(carouselElement.querySelectorAll('.slide'));
    this.currentSlide = 0;
    this.isPlaying = false;
    this.interval = null;
    
    this.setupControls();
    this.setupIndicators();
    this.setupKeyboardNavigation();
  }
  
  setupControls() {
    const controls = document.createElement('div');
    controls.className = 'carousel-controls';
    controls.innerHTML = `
      <button type="button" class="play-pause" aria-label="Pause slideshow">
        Pause
      </button>
      <button type="button" class="previous" aria-label="Previous slide">
        Previous
      </button>
      <button type="button" class="next" aria-label="Next slide">
        Next
      </button>
    `;
    
    this.carousel.appendChild(controls);
    
    // Add event listeners
    controls.querySelector('.play-pause').addEventListener('click', () => {
      this.togglePlayback();
    });
    
    controls.querySelector('.previous').addEventListener('click', () => {
      this.previousSlide();
    });
    
    controls.querySelector('.next').addEventListener('click', () => {
      this.nextSlide();
    });
    
    // Pause on hover/focus
    this.carousel.addEventListener('mouseenter', () => this.pause());
    this.carousel.addEventListener('mouseleave', () => this.resume());
    this.carousel.addEventListener('focusin', () => this.pause());
    this.carousel.addEventListener('focusout', () => this.resume());
  }
  
  togglePlayback() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.play();
    }
  }
  
  announceSlideChange() {
    const announcement = `Slide ${this.currentSlide + 1} of ${this.slides.length}`;
    announcer.announce(announcement);
  }
}
```

## ARIA (Accessible Rich Internet Applications)

### When to Use ARIA

**The First Rule of ARIA**: Don't use ARIA if you can use semantic HTML instead.

```html
<!-- ❌ Don't do this -->
<div role="button" tabindex="0" onclick="submit()">Submit</div>

<!-- ✅ Do this -->
<button type="submit" onclick="submit()">Submit</button>
```

### ARIA Roles

```html
<!-- Landmark roles -->
<header role="banner">
<nav role="navigation">
<main role="main">
<aside role="complementary">
<footer role="contentinfo">

<!-- Widget roles -->
<div role="button" tabindex="0">Custom Button</div>
<div role="checkbox" aria-checked="false" tabindex="0">Custom Checkbox</div>
<ul role="tablist">
  <li role="tab" aria-selected="true">Tab 1</li>
  <li role="tab" aria-selected="false">Tab 2</li>
</ul>

<!-- Document structure roles -->
<div role="article">
<div role="list">
  <div role="listitem">Item 1</div>
  <div role="listitem">Item 2</div>
</div>
```

### ARIA Properties and States

```html
<!-- Labels and descriptions -->
<input aria-label="Search products">
<input aria-labelledby="search-label">
<input aria-describedby="search-help">

<!-- States -->
<button aria-pressed="false">Toggle</button>
<input aria-invalid="true" aria-describedby="error-msg">
<div aria-expanded="false">Collapsed menu</div>
<div aria-hidden="true">Decorative content</div>

<!-- Relationships -->
<input aria-controls="suggestions-list">
<ul id="suggestions-list">
  <li>Suggestion 1</li>
</ul>

<!-- Live regions -->
<div aria-live="polite">Status updates</div>
<div aria-live="assertive">Error messages</div>
<div aria-atomic="true">Complete messages</div>
```

### Complex ARIA Patterns

#### Accessible Tabs

```html
<div class="tabs">
  <ul role="tablist" aria-label="Settings">
    <li role="presentation">
      <button role="tab" aria-selected="true" aria-controls="general-panel" id="general-tab">
        General
      </button>
    </li>
    <li role="presentation">
      <button role="tab" aria-selected="false" aria-controls="privacy-panel" id="privacy-tab">
        Privacy
      </button>
    </li>
  </ul>
  
  <div role="tabpanel" id="general-panel" aria-labelledby="general-tab">
    <h2>General Settings</h2>
    <!-- General content -->
  </div>
  
  <div role="tabpanel" id="privacy-panel" aria-labelledby="privacy-tab" hidden>
    <h2>Privacy Settings</h2>
    <!-- Privacy content -->
  </div>
</div>
```

```javascript
class AccessibleTabs {
  constructor(tabsContainer) {
    this.tabsContainer = tabsContainer;
    this.tablist = tabsContainer.querySelector('[role="tablist"]');
    this.tabs = Array.from(tabsContainer.querySelectorAll('[role="tab"]'));
    this.panels = Array.from(tabsContainer.querySelectorAll('[role="tabpanel"]'));
    
    this.setupEventListeners();
    this.selectTab(0);
  }
  
  setupEventListeners() {
    this.tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => this.selectTab(index));
      tab.addEventListener('keydown', (event) => {
        this.handleKeydown(event, index);
      });
    });
  }
  
  handleKeydown(event, currentIndex) {
    let newIndex = currentIndex;
    
    switch (event.key) {
      case 'ArrowRight':
        newIndex = (currentIndex + 1) % this.tabs.length;
        break;
      case 'ArrowLeft':
        newIndex = currentIndex === 0 ? this.tabs.length - 1 : currentIndex - 1;
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = this.tabs.length - 1;
        break;
      default:
        return; // Don't prevent default for other keys
    }
    
    event.preventDefault();
    this.selectTab(newIndex);
    this.tabs[newIndex].focus();
  }
  
  selectTab(index) {
    // Update tab states
    this.tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', i === index);
      tab.setAttribute('tabindex', i === index ? '0' : '-1');
    });
    
    // Update panel visibility
    this.panels.forEach((panel, i) => {
      panel.hidden = i !== index;
    });
  }
}
```

## Testing for Accessibility

### Automated Testing

```javascript
// Install axe-core for automated testing
// npm install --save-dev @axe-core/playwright

// Playwright test with axe
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('should not have accessibility violations', async ({ page }) => {
  await page.goto('/');
  
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  
  expect(accessibilityScanResults.violations).toEqual([]);
});

// Jest test with jsdom
import { toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

test('Button should be accessible', async () => {
  document.body.innerHTML = `
    <button aria-label="Close dialog">×</button>
  `;
  
  const results = await axe(document.body);
  expect(results).toHaveNoViolations();
});
```

### Manual Testing Checklist

#### Keyboard Testing
- [ ] Tab through all interactive elements
- [ ] No keyboard traps
- [ ] Visible focus indicators
- [ ] Logical tab order
- [ ] Skip links work
- [ ] All functionality available via keyboard

#### Screen Reader Testing
- [ ] Page structure makes sense
- [ ] All content is announced
- [ ] Images have appropriate alt text
- [ ] Form labels are clear
- [ ] Error messages are announced
- [ ] Status changes are announced

#### Visual Testing
- [ ] Text meets contrast requirements
- [ ] Page works at 200% zoom
- [ ] Information not conveyed by color alone
- [ ] Focus indicators are visible
- [ ] Animation respects reduced motion
- [ ] Layout doesn't break with larger text

### Testing Tools

```bash
# Command line accessibility testing
npm install -g @axe-core/cli
axe https://example.com

# Lighthouse accessibility audit
lighthouse https://example.com --only-categories=accessibility

# pa11y testing
npm install -g pa11y
pa11y https://example.com

# WAVE API
curl "https://wave.webaim.org/api/request?key=YOUR_KEY&url=https://example.com&reporttype=1"
```

## Common Patterns

### Accessible Modal Dialog

```html
<div class="modal" role="dialog" aria-labelledby="modal-title" aria-hidden="true">
  <div class="modal-backdrop" aria-hidden="true"></div>
  <div class="modal-content">
    <header class="modal-header">
      <h2 id="modal-title">Confirm Action</h2>
      <button type="button" class="modal-close" aria-label="Close dialog">
        <span aria-hidden="true">&times;</span>
      </button>
    </header>
    <div class="modal-body">
      <p>Are you sure you want to delete this item?</p>
    </div>
    <footer class="modal-footer">
      <button type="button" class="btn btn-danger">Delete</button>
      <button type="button" class="btn btn-secondary">Cancel</button>
    </footer>
  </div>
</div>
```

### Accessible Form Validation

```html
<form novalidate>
  <div class="form-group">
    <label for="email">Email Address *</label>
    <input type="email" id="email" required 
           aria-describedby="email-error email-help">
    <div id="email-help" class="help-text">
      We'll never share your email
    </div>
    <div id="email-error" class="error-message" role="alert" aria-live="polite">
      <!-- Error message inserted here -->
    </div>
  </div>
  
  <button type="submit">Submit</button>
</form>
```

```javascript
class AccessibleFormValidator {
  constructor(form) {
    this.form = form;
    this.setupValidation();
  }
  
  setupValidation() {
    this.form.addEventListener('submit', (event) => {
      if (!this.validateForm()) {
        event.preventDefault();
        this.focusFirstError();
      }
    });
    
    // Real-time validation
    this.form.addEventListener('blur', (event) => {
      if (event.target.matches('input, select, textarea')) {
        this.validateField(event.target);
      }
    }, true);
  }
  
  validateField(field) {
    const errorElement = document.getElementById(field.id + '-error');
    let errorMessage = '';
    
    if (field.validity.valueMissing) {
      errorMessage = `${field.labels[0].textContent} is required`;
    } else if (field.validity.typeMismatch) {
      errorMessage = `Please enter a valid ${field.type}`;
    } else if (field.validity.tooShort) {
      errorMessage = `Must be at least ${field.minLength} characters`;
    }
    
    if (errorMessage) {
      field.setAttribute('aria-invalid', 'true');
      errorElement.textContent = errorMessage;
    } else {
      field.setAttribute('aria-invalid', 'false');
      errorElement.textContent = '';
    }
    
    return !errorMessage;
  }
  
  validateForm() {
    const fields = this.form.querySelectorAll('input, select, textarea');
    let isValid = true;
    
    fields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });
    
    return isValid;
  }
  
  focusFirstError() {
    const firstError = this.form.querySelector('[aria-invalid="true"]');
    if (firstError) {
      firstError.focus();
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}
```

### Accessible Data Table

```html
<table>
  <caption>
    Sales Data for Q1 2024
    <details>
      <summary>Table Description</summary>
      <p>This table shows monthly sales figures for three product categories...</p>
    </details>
  </caption>
  
  <thead>
    <tr>
      <th scope="col">Month</th>
      <th scope="col">Electronics</th>
      <th scope="col">Clothing</th>
      <th scope="col">Total</th>
    </tr>
  </thead>
  
  <tbody>
    <tr>
      <th scope="row">January</th>
      <td>$15,000</td>
      <td>$8,000</td>
      <td>$23,000</td>
    </tr>
    <tr>
      <th scope="row">February</th>
      <td>$18,000</td>
      <td>$9,500</td>
      <td>$27,500</td>
    </tr>
  </tbody>
</table>
```

## Real-World Examples

### E-commerce Product Card

```html
<article class="product-card">
  <a href="/products/wireless-headphones" class="product-link">
    <img src="headphones.jpg" alt="Sony WH-1000XM4 Wireless Headphones in black">
    
    <div class="product-info">
      <h3 class="product-name">Sony WH-1000XM4 Wireless Headphones</h3>
      
      <div class="product-rating" aria-label="4.5 out of 5 stars">
        <span class="stars" aria-hidden="true">★★★★☆</span>
        <span class="rating-text sr-only">4.5 out of 5 stars</span>
        <span class="review-count">(1,234 reviews)</span>
      </div>
      
      <div class="product-price">
        <span class="current-price">$299.99</span>
        <span class="original-price">
          <span class="sr-only">Original price:</span>
          <del>$349.99</del>
        </span>
        <span class="discount">15% off</span>
      </div>
    </div>
  </a>
  
  <div class="product-actions">
    <button type="button" class="btn btn-primary" 
            aria-label="Add Sony WH-1000XM4 Wireless Headphones to cart">
      Add to Cart
    </button>
    
    <button type="button" class="btn btn-secondary wishlist-btn"
            aria-label="Add to wishlist" 
            aria-pressed="false">
      <svg aria-hidden="true"><!-- heart icon --></svg>
      <span class="sr-only">Add to wishlist</span>
    </button>
  </div>
</article>
```

### Navigation Menu

```html
<nav class="main-nav" aria-label="Main navigation">
  <button type="button" class="nav-toggle" 
          aria-controls="nav-menu" 
          aria-expanded="false"
          aria-label="Toggle navigation menu">
    <span class="hamburger-icon" aria-hidden="true"></span>
  </button>
  
  <ul id="nav-menu" class="nav-menu">
    <li><a href="/" aria-current="page">Home</a></li>
    <li>
      <button type="button" class="nav-dropdown-toggle"
              aria-expanded="false" 
              aria-controls="products-menu">
        Products
        <svg aria-hidden="true"><!-- chevron icon --></svg>
      </button>
      <ul id="products-menu" class="nav-dropdown">
        <li><a href="/laptops">Laptops</a></li>
        <li><a href="/phones">Phones</a></li>
        <li><a href="/tablets">Tablets</a></li>
      </ul>
    </li>
    <li><a href="/about">About</a></li>
    <li><a href="/contact">Contact</a></li>
  </ul>
</nav>
```

## Accessibility Checklist

### Development Phase

#### HTML Structure
- [ ] Use semantic HTML elements
- [ ] Proper heading hierarchy (h1-h6)
- [ ] Form labels associated with inputs
- [ ] Alt text for informative images
- [ ] Empty alt for decorative images
- [ ] Link text describes destination
- [ ] Tables have headers and captions

#### Keyboard Navigation
- [ ] All interactive elements focusable
- [ ] Logical tab order
- [ ] Visible focus indicators
- [ ] No keyboard traps
- [ ] Skip navigation links
- [ ] Arrow key navigation for menus

#### ARIA Implementation
- [ ] ARIA only when semantic HTML insufficient
- [ ] Proper roles for custom elements
- [ ] States and properties updated dynamically
- [ ] Labels and descriptions provided
- [ ] Live regions for dynamic content

#### Visual Design
- [ ] Text contrast meets WCAG AA (4.5:1)
- [ ] Large text contrast meets WCAG AA (3:1)
- [ ] Information not conveyed by color alone
- [ ] Content readable at 200% zoom
- [ ] Animation respects reduced motion

### Testing Phase

#### Automated Testing
- [ ] Run axe-core accessibility tests
- [ ] Lighthouse accessibility audit
- [ ] HTML validation
- [ ] Color contrast checking
- [ ] Keyboard navigation testing

#### Manual Testing
- [ ] Screen reader testing (NVDA/VoiceOver)
- [ ] Keyboard-only navigation
- [ ] High contrast mode testing
- [ ] Zoom testing (up to 200%)
- [ ] Mobile accessibility testing

#### User Testing
- [ ] Test with users with disabilities
- [ ] Gather feedback on pain points
- [ ] Iterate based on real usage
- [ ] Document accessibility features
- [ ] Train content creators

### Production Phase

#### Monitoring
- [ ] Regular accessibility audits
- [ ] User feedback collection
- [ ] Performance impact assessment
- [ ] Compliance documentation
- [ ] Staff accessibility training

## Summary

Accessibility is not a feature—it's a fundamental requirement. Key takeaways:

### 🎯 Core Principles

1. **Start with semantic HTML** - It provides accessibility for free
2. **Design for keyboard users** - If it works with keyboard, it works for everyone
3. **Test early and often** - Don't leave accessibility as an afterthought
4. **Learn from users** - Real feedback beats assumptions
5. **Make it part of your process** - Accessibility should be automatic

### 🚀 Quick Wins

- Add alt text to images
- Use proper heading hierarchy
- Ensure keyboard navigation works
- Add focus indicators
- Check color contrast

### 📚 Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM](https://webaim.org/)
- [The A11y Project](https://www.a11yproject.com/)

---

*Remember: When we design for accessibility, we create better experiences for everyone. It's not about compliance—it's about inclusion.* ♿