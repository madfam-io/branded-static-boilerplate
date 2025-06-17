# Component Development Tutorial

> 🎓 **Learning Objective**: Master the art of creating reusable, accessible, and performant components using the BSB component architecture.

## Table of Contents

1. [Introduction](#introduction)
2. [Component Philosophy](#component-philosophy)
3. [Anatomy of a BSB Component](#anatomy-of-a-bsb-component)
4. [Creating Your First Component](#creating-your-first-component)
5. [Component Best Practices](#component-best-practices)
6. [Advanced Patterns](#advanced-patterns)
7. [Testing Your Component](#testing-your-component)
8. [Component Documentation](#component-documentation)
9. [Real-World Example](#real-world-example)
10. [Troubleshooting](#troubleshooting)

## Introduction

Welcome to the BSB Component Development Tutorial! Components are the building blocks of modern web development. In this tutorial, you'll learn how to create components that are:

- ♿ **Accessible** - Work for everyone, including users with disabilities
- 🎨 **Themeable** - Adapt to different color schemes and styles
- 📱 **Responsive** - Look great on all devices
- ⚡ **Performant** - Load fast and run smooth
- 🧩 **Reusable** - Work in different contexts without modification
- 📚 **Self-documenting** - Include inline documentation and examples

### Prerequisites

Before starting this tutorial, you should:
- ✅ Complete the [Getting Started](./getting-started.md) tutorial
- ✅ Have basic knowledge of HTML, CSS, and JavaScript
- ✅ Understand the BSB project structure

### What You'll Build

By the end of this tutorial, you'll create a fully-functional **Testimonial Card** component that demonstrates all BSB best practices.

## Component Philosophy

### 🎯 The BSB Component Principles

1. **Separation of Concerns**
   - HTML for structure
   - CSS for presentation
   - JavaScript for behavior

2. **Progressive Enhancement**
   - Components work without JavaScript
   - Enhanced functionality when JS is available
   - Graceful degradation for older browsers

3. **Accessibility First**
   - Semantic HTML as the foundation
   - ARIA only when necessary
   - Keyboard navigation support

4. **Educational Value**
   - Comments explain the "why" not just the "what"
   - Include learning resources
   - Show best practices in action

## Anatomy of a BSB Component

Every BSB component follows a consistent structure:

```
components/
└── component-name/
    ├── component-name.html    # HTML structure and usage examples
    ├── component-name.css     # Styles with extensive comments
    ├── component-name.js      # Optional JavaScript behavior
    └── README.md             # Component documentation
```

### Key Conventions

1. **Naming**: Use kebab-case for all files and folders
2. **Prefixing**: All classes start with `bsb-` to avoid conflicts
3. **BEM Methodology**: Block__Element--Modifier for CSS classes
4. **Data Attributes**: Use `data-bsb-*` for JavaScript hooks

## Creating Your First Component

Let's create a **Testimonial Card** component step by step.

### Step 1: Create the Component Structure

First, create the folder structure:

```bash
mkdir -p src/components/testimonial-card
cd src/components/testimonial-card
```

### Step 2: Create the HTML Structure

Create `testimonial-card.html`:

```html
<!--
  ============================================================================
  BSB TESTIMONIAL CARD COMPONENT
  ============================================================================
  
  Purpose: Display user testimonials with avatar, name, role, and quote
  
  🎓 Learning Notes:
  - Uses semantic HTML5 elements (figure, blockquote, figcaption)
  - Implements microdata for better SEO
  - Follows accessibility best practices
  
  Usage:
  <div data-bsb-component="testimonial-card">
    <!-- Component content here -->
  </div>
  ============================================================================
-->

<!-- Example 1: Basic Testimonial -->
<figure class="bsb-testimonial-card" data-bsb-component="testimonial-card">
  <blockquote class="bsb-testimonial-card__quote">
    <p>"BSB has transformed how I learn web development. The interactive examples and comprehensive documentation make everything click!"</p>
  </blockquote>
  <figcaption class="bsb-testimonial-card__attribution">
    <img 
      src="/assets/images/avatar-jane.jpg" 
      alt="Jane Doe" 
      class="bsb-testimonial-card__avatar"
      width="48"
      height="48"
      loading="lazy"
    >
    <div class="bsb-testimonial-card__author">
      <cite class="bsb-testimonial-card__name">Jane Doe</cite>
      <span class="bsb-testimonial-card__role">Frontend Developer</span>
    </div>
  </figcaption>
</figure>

<!-- Example 2: With Rating -->
<figure class="bsb-testimonial-card bsb-testimonial-card--featured" data-bsb-component="testimonial-card">
  <div class="bsb-testimonial-card__rating" aria-label="5 out of 5 stars">
    <span class="bsb-testimonial-card__star" aria-hidden="true">★</span>
    <span class="bsb-testimonial-card__star" aria-hidden="true">★</span>
    <span class="bsb-testimonial-card__star" aria-hidden="true">★</span>
    <span class="bsb-testimonial-card__star" aria-hidden="true">★</span>
    <span class="bsb-testimonial-card__star" aria-hidden="true">★</span>
  </div>
  <blockquote class="bsb-testimonial-card__quote">
    <p>"The best learning resource I've found. It's like having a mentor built into the code!"</p>
  </blockquote>
  <figcaption class="bsb-testimonial-card__attribution">
    <img 
      src="/assets/images/avatar-john.jpg" 
      alt="John Smith" 
      class="bsb-testimonial-card__avatar"
      width="48"
      height="48"
      loading="lazy"
    >
    <div class="bsb-testimonial-card__author">
      <cite class="bsb-testimonial-card__name">John Smith</cite>
      <span class="bsb-testimonial-card__role">Full Stack Engineer</span>
    </div>
  </figcaption>
</figure>

<!-- 
  🎓 Why These HTML Choices?
  
  1. <figure> - Semantic container for self-contained content
  2. <blockquote> - Semantic element for quotations
  3. <figcaption> - Associates the attribution with the quote
  4. <cite> - Marks up the person being cited
  5. loading="lazy" - Improves performance for images
  6. width/height - Prevents layout shift
  7. aria-label - Provides accessible description for ratings
  
  Learn more: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure
-->
```

### Step 3: Style the Component

Create `testimonial-card.css`:

```css
/**
 * =============================================================================
 * BSB TESTIMONIAL CARD STYLES
 * =============================================================================
 * 
 * A reusable testimonial card component with multiple variants
 * 
 * 🎓 CSS Architecture:
 * - Uses CSS custom properties for theming
 * - Follows BEM naming convention
 * - Mobile-first responsive design
 * - Supports dark mode automatically
 * =============================================================================
 */

/* 
 * Component Variables
 * Define at component scope for easy customization
 */
.bsb-testimonial-card {
  /* 🎓 Custom properties make components themeable */
  --testimonial-bg: var(--bsb-color-surface);
  --testimonial-border: var(--bsb-color-border);
  --testimonial-shadow: var(--bsb-shadow-md);
  --testimonial-radius: var(--bsb-radius-lg);
  --testimonial-padding: var(--bsb-spacing-6);
  --testimonial-gap: var(--bsb-spacing-4);
  
  /* Featured variant colors */
  --testimonial-featured-bg: var(--bsb-color-primary-50);
  --testimonial-featured-border: var(--bsb-color-primary-200);
  --testimonial-star-color: var(--bsb-color-warning);
}

/* 
 * Base Component Styles
 * 🎓 Note: Using semantic HTML means less CSS needed
 */
.bsb-testimonial-card {
  /* Layout */
  display: flex;
  flex-direction: column;
  gap: var(--testimonial-gap);
  
  /* Appearance */
  background: var(--testimonial-bg);
  border: 1px solid var(--testimonial-border);
  border-radius: var(--testimonial-radius);
  padding: var(--testimonial-padding);
  box-shadow: var(--testimonial-shadow);
  
  /* 🎓 Smooth transitions for hover states */
  transition: 
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

/* Hover state for better interactivity */
.bsb-testimonial-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--bsb-shadow-lg);
}

/* Quote styles */
.bsb-testimonial-card__quote {
  /* 🎓 Reset default blockquote margins */
  margin: 0;
  
  /* Typography */
  font-size: var(--bsb-font-size-lg);
  line-height: var(--bsb-line-height-relaxed);
  color: var(--bsb-color-text-primary);
}

/* Add quotation marks for visual enhancement */
.bsb-testimonial-card__quote p::before {
  content: '"';
  color: var(--bsb-color-primary);
  font-size: 2em;
  line-height: 0;
  vertical-align: -0.3em;
}

.bsb-testimonial-card__quote p::after {
  content: '"';
  color: var(--bsb-color-primary);
  font-size: 2em;
  line-height: 0;
  vertical-align: -0.3em;
}

/* Attribution layout */
.bsb-testimonial-card__attribution {
  display: flex;
  align-items: center;
  gap: var(--bsb-spacing-3);
  margin-top: auto; /* 🎓 Pushes attribution to bottom */
}

/* Avatar styles */
.bsb-testimonial-card__avatar {
  /* Size constraints */
  width: 48px;
  height: 48px;
  
  /* Make it circular */
  border-radius: 50%;
  object-fit: cover;
  
  /* 🎓 Flexbox prevents shrinking */
  flex-shrink: 0;
}

/* Author info container */
.bsb-testimonial-card__author {
  display: flex;
  flex-direction: column;
  gap: var(--bsb-spacing-1);
}

/* Author name */
.bsb-testimonial-card__name {
  /* 🎓 cite element is inline by default */
  display: block;
  font-style: normal;
  font-weight: 600;
  color: var(--bsb-color-text-primary);
}

/* Author role */
.bsb-testimonial-card__role {
  font-size: var(--bsb-font-size-sm);
  color: var(--bsb-color-text-secondary);
}

/* Rating styles */
.bsb-testimonial-card__rating {
  display: flex;
  gap: var(--bsb-spacing-1);
  color: var(--testimonial-star-color);
  font-size: var(--bsb-font-size-xl);
  
  /* 🎓 Prevent text selection of decorative elements */
  user-select: none;
}

/* 
 * Component Variants
 * 🎓 Modifier classes change appearance, not structure
 */

/* Featured variant */
.bsb-testimonial-card--featured {
  background: var(--testimonial-featured-bg);
  border-color: var(--testimonial-featured-border);
  position: relative;
  
  /* Add subtle gradient */
  background-image: linear-gradient(
    135deg,
    var(--testimonial-featured-bg) 0%,
    transparent 100%
  );
}

/* Featured badge */
.bsb-testimonial-card--featured::before {
  content: 'Featured';
  position: absolute;
  top: var(--bsb-spacing-2);
  right: var(--bsb-spacing-2);
  
  /* Badge styling */
  background: var(--bsb-color-primary);
  color: white;
  padding: var(--bsb-spacing-1) var(--bsb-spacing-3);
  border-radius: var(--bsb-radius-full);
  font-size: var(--bsb-font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* 
 * Dark Mode Support
 * 🎓 Automatic through CSS custom properties
 */
[data-bsb-theme="dark"] .bsb-testimonial-card {
  --testimonial-bg: var(--bsb-color-surface-dark);
  --testimonial-border: var(--bsb-color-border-dark);
  --testimonial-featured-bg: var(--bsb-color-primary-900);
  --testimonial-featured-border: var(--bsb-color-primary-700);
}

/* 
 * Responsive Design
 * 🎓 Mobile-first approach with min-width queries
 */

/* Tablet and up */
@media (min-width: 768px) {
  .bsb-testimonial-card {
    --testimonial-padding: var(--bsb-spacing-8);
  }
  
  .bsb-testimonial-card__quote {
    font-size: var(--bsb-font-size-xl);
  }
}

/* 
 * Print Styles
 * 🎓 Optimize for printing
 */
@media print {
  .bsb-testimonial-card {
    box-shadow: none;
    border: 2px solid currentColor;
  }
  
  .bsb-testimonial-card--featured::before {
    /* Hide decorative elements */
    display: none;
  }
}

/* 
 * Animation Classes
 * 🎓 Optional entrance animations
 */
.bsb-testimonial-card[data-animate="fade-in"] {
  animation: bsb-fade-in 0.6s ease-out;
}

@keyframes bsb-fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 
 * Accessibility Enhancements
 * 🎓 Improve experience for all users
 */

/* Focus styles for keyboard navigation */
.bsb-testimonial-card:focus-within {
  outline: 3px solid var(--bsb-color-primary);
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .bsb-testimonial-card {
    border-width: 2px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .bsb-testimonial-card {
    transition: none;
  }
  
  .bsb-testimonial-card[data-animate] {
    animation: none;
  }
}
```

### Step 4: Add Interactive Behavior

Create `testimonial-card.js`:

```javascript
/**
 * =============================================================================
 * BSB TESTIMONIAL CARD COMPONENT - JavaScript Enhancement
 * =============================================================================
 * 
 * Progressive enhancement for testimonial cards:
 * - Lazy loading for avatars
 * - Animation on scroll
 * - Interactive ratings
 * - Carousel functionality for multiple testimonials
 * 
 * 🎓 Learning Notes:
 * - Component works without JavaScript (progressive enhancement)
 * - Uses Intersection Observer for performance
 * - Follows BSB event naming conventions
 * - Includes accessibility features
 * =============================================================================
 */

import debug from '../../scripts/core/debug.js';

/**
 * BSB Testimonial Card Component
 * @class BSBTestimonialCard
 * @description Enhances testimonial cards with interactive features
 */
class BSBTestimonialCard {
  /**
   * Create a testimonial card instance
   * @constructor
   * @param {HTMLElement} element - The testimonial card element
   */
  constructor(element) {
    this.element = element;
    this.options = {
      animateOnScroll: element.dataset.animate === 'scroll',
      interactive: element.dataset.interactive === 'true',
      carousel: element.closest('[data-bsb-testimonial-carousel]')
    };
    
    // 🎓 Initialize only if features are requested
    if (this.options.animateOnScroll || this.options.interactive) {
      this.init();
    }
  }

  /**
   * Initialize the component
   * @method init
   * @description Sets up observers and event listeners
   * @returns {void}
   */
  init() {
    // Set up scroll animation
    if (this.options.animateOnScroll) {
      this.setupScrollAnimation();
    }
    
    // Set up interactive rating
    if (this.options.interactive) {
      this.setupInteractiveRating();
    }
    
    // Log initialization in development
    debug.log('BSB Testimonial Card: Initialized', {
      animations: this.options.animateOnScroll,
      interactive: this.options.interactive
    });
  }

  /**
   * Set up scroll-triggered animations
   * @method setupScrollAnimation
   * @description Uses Intersection Observer for performance
   * @returns {void}
   * 
   * 🎓 Why Intersection Observer?
   * - Better performance than scroll listeners
   * - Built-in throttling
   * - Works with lazy loading
   */
  setupScrollAnimation() {
    // Create observer with options
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Add animation class when visible
            entry.target.setAttribute('data-animate', 'fade-in');
            
            // Stop observing after animation
            observer.unobserve(entry.target);
          }
        });
      },
      {
        // 🎓 Trigger when 20% visible
        threshold: 0.2,
        rootMargin: '50px'
      }
    );
    
    // Start observing
    observer.observe(this.element);
  }

  /**
   * Set up interactive rating functionality
   * @method setupInteractiveRating
   * @description Allows users to rate testimonials
   * @returns {void}
   */
  setupInteractiveRating() {
    const rating = this.element.querySelector('.bsb-testimonial-card__rating');
    if (!rating) return;
    
    // Make rating interactive
    rating.setAttribute('role', 'group');
    rating.setAttribute('tabindex', '0');
    
    // Get all stars
    const stars = rating.querySelectorAll('.bsb-testimonial-card__star');
    let currentRating = stars.length;
    
    // Add interactivity to each star
    stars.forEach((star, index) => {
      // Make stars focusable
      star.setAttribute('tabindex', '-1');
      star.setAttribute('role', 'button');
      star.setAttribute('aria-label', `Rate ${index + 1} out of ${stars.length} stars`);
      
      // Mouse events
      star.addEventListener('click', () => this.setRating(index + 1));
      star.addEventListener('mouseenter', () => this.previewRating(index + 1));
      
      // Keyboard support
      star.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.setRating(index + 1);
        }
      });
    });
    
    // Reset preview on mouse leave
    rating.addEventListener('mouseleave', () => {
      this.updateStars(currentRating);
    });
    
    // Keyboard navigation for the group
    rating.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' && currentRating < stars.length) {
        this.setRating(currentRating + 1);
      } else if (e.key === 'ArrowLeft' && currentRating > 1) {
        this.setRating(currentRating - 1);
      }
    });
  }

  /**
   * Preview rating on hover
   * @method previewRating
   * @param {number} rating - The rating to preview
   * @returns {void}
   */
  previewRating(rating) {
    this.updateStars(rating);
  }

  /**
   * Set the rating
   * @method setRating
   * @param {number} rating - The rating to set
   * @returns {void}
   */
  setRating(newRating) {
    const ratingElement = this.element.querySelector('.bsb-testimonial-card__rating');
    const stars = ratingElement.querySelectorAll('.bsb-testimonial-card__star');
    
    // Update visual state
    this.updateStars(newRating);
    
    // Update aria-label
    ratingElement.setAttribute('aria-label', `${newRating} out of ${stars.length} stars`);
    
    // Dispatch custom event
    const event = new CustomEvent('bsb:testimonial:rated', {
      detail: { 
        rating: newRating,
        element: this.element,
        testimonialId: this.element.dataset.testimonialId
      },
      bubbles: true
    });
    this.element.dispatchEvent(event);
    
    // Store rating (in real app, this would save to backend)
    this.storeRating(newRating);
    
    debug.log('BSB Testimonial Card: Rating set', { rating: newRating });
  }

  /**
   * Update star visual state
   * @method updateStars
   * @param {number} rating - The rating to display
   * @returns {void}
   */
  updateStars(rating) {
    const stars = this.element.querySelectorAll('.bsb-testimonial-card__star');
    
    stars.forEach((star, index) => {
      // 🎓 Toggle filled/empty state based on rating
      if (index < rating) {
        star.textContent = '★'; // Filled star
        star.classList.add('bsb-testimonial-card__star--filled');
      } else {
        star.textContent = '☆'; // Empty star
        star.classList.remove('bsb-testimonial-card__star--filled');
      }
    });
  }

  /**
   * Store rating (mock implementation)
   * @method storeRating
   * @param {number} rating - The rating to store
   * @returns {void}
   * 
   * 🎓 In a real application, this would:
   * - Send rating to backend API
   * - Update local storage for offline support
   * - Show success feedback to user
   */
  storeRating(rating) {
    const testimonialId = this.element.dataset.testimonialId || 'unknown';
    
    try {
      // Store in localStorage for demo
      const ratings = JSON.parse(localStorage.getItem('bsb-testimonial-ratings') || '{}');
      ratings[testimonialId] = {
        rating,
        timestamp: Date.now()
      };
      localStorage.setItem('bsb-testimonial-ratings', JSON.stringify(ratings));
    } catch (error) {
      debug.warn('BSB Testimonial Card: Failed to store rating', error);
    }
  }
}

/**
 * Testimonial Carousel Controller
 * @class BSBTestimonialCarousel
 * @description Manages multiple testimonials in a carousel
 * 
 * 🎓 Separate class for single responsibility principle
 */
class BSBTestimonialCarousel {
  /**
   * Create a carousel instance
   * @constructor
   * @param {HTMLElement} element - The carousel container
   */
  constructor(element) {
    this.element = element;
    this.cards = Array.from(element.querySelectorAll('.bsb-testimonial-card'));
    this.currentIndex = 0;
    
    if (this.cards.length > 1) {
      this.init();
    }
  }

  /**
   * Initialize carousel
   * @method init
   * @description Sets up controls and auto-play
   * @returns {void}
   */
  init() {
    // Create navigation controls
    this.createControls();
    
    // Set up auto-play if requested
    if (this.element.dataset.autoplay === 'true') {
      this.startAutoplay();
    }
    
    // Set up keyboard navigation
    this.setupKeyboardNav();
    
    // Show first card
    this.showCard(0);
    
    debug.log('BSB Testimonial Carousel: Initialized', {
      cardCount: this.cards.length,
      autoplay: this.element.dataset.autoplay === 'true'
    });
  }

  /**
   * Create carousel controls
   * @method createControls
   * @description Adds previous/next buttons and indicators
   * @returns {void}
   */
  createControls() {
    // Create control container
    const controls = document.createElement('div');
    controls.className = 'bsb-testimonial-carousel__controls';
    controls.innerHTML = `
      <button 
        class="bsb-testimonial-carousel__button bsb-testimonial-carousel__button--prev"
        aria-label="Previous testimonial"
        type="button"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      <div class="bsb-testimonial-carousel__indicators" role="tablist"></div>
      <button 
        class="bsb-testimonial-carousel__button bsb-testimonial-carousel__button--next"
        aria-label="Next testimonial"
        type="button"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    `;
    
    // Add indicators
    const indicatorContainer = controls.querySelector('.bsb-testimonial-carousel__indicators');
    this.cards.forEach((card, index) => {
      const indicator = document.createElement('button');
      indicator.className = 'bsb-testimonial-carousel__indicator';
      indicator.setAttribute('role', 'tab');
      indicator.setAttribute('aria-label', `Show testimonial ${index + 1}`);
      indicator.setAttribute('aria-controls', `testimonial-${index}`);
      indicator.dataset.index = index;
      
      indicatorContainer.appendChild(indicator);
    });
    
    // Add event listeners
    controls.querySelector('.bsb-testimonial-carousel__button--prev')
      .addEventListener('click', () => this.previousCard());
    
    controls.querySelector('.bsb-testimonial-carousel__button--next')
      .addEventListener('click', () => this.nextCard());
    
    indicatorContainer.addEventListener('click', (e) => {
      if (e.target.matches('.bsb-testimonial-carousel__indicator')) {
        this.showCard(parseInt(e.target.dataset.index));
      }
    });
    
    // Insert controls
    this.element.appendChild(controls);
  }

  /**
   * Show specific card
   * @method showCard
   * @param {number} index - The card index to show
   * @returns {void}
   */
  showCard(index) {
    // Hide all cards
    this.cards.forEach((card, i) => {
      card.hidden = i !== index;
      card.setAttribute('aria-hidden', i !== index);
    });
    
    // Update indicators
    const indicators = this.element.querySelectorAll('.bsb-testimonial-carousel__indicator');
    indicators.forEach((indicator, i) => {
      indicator.classList.toggle('bsb-testimonial-carousel__indicator--active', i === index);
      indicator.setAttribute('aria-selected', i === index);
    });
    
    this.currentIndex = index;
    
    // Announce to screen readers
    this.announceCard(index);
  }

  /**
   * Show previous card
   * @method previousCard
   * @returns {void}
   */
  previousCard() {
    const newIndex = this.currentIndex > 0 
      ? this.currentIndex - 1 
      : this.cards.length - 1;
    this.showCard(newIndex);
  }

  /**
   * Show next card
   * @method nextCard
   * @returns {void}
   */
  nextCard() {
    const newIndex = (this.currentIndex + 1) % this.cards.length;
    this.showCard(newIndex);
  }

  /**
   * Set up keyboard navigation
   * @method setupKeyboardNav
   * @description Arrow keys navigate carousel
   * @returns {void}
   */
  setupKeyboardNav() {
    this.element.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.previousCard();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.nextCard();
      }
    });
  }

  /**
   * Start autoplay
   * @method startAutoplay
   * @description Automatically advance cards
   * @returns {void}
   */
  startAutoplay() {
    const interval = parseInt(this.element.dataset.autoplayInterval) || 5000;
    
    this.autoplayTimer = setInterval(() => {
      this.nextCard();
    }, interval);
    
    // Pause on hover/focus
    this.element.addEventListener('mouseenter', () => this.pauseAutoplay());
    this.element.addEventListener('focusin', () => this.pauseAutoplay());
    
    // Resume on leave
    this.element.addEventListener('mouseleave', () => this.resumeAutoplay());
    this.element.addEventListener('focusout', () => this.resumeAutoplay());
  }

  /**
   * Pause autoplay
   * @method pauseAutoplay
   * @returns {void}
   */
  pauseAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  /**
   * Resume autoplay
   * @method resumeAutoplay
   * @returns {void}
   */
  resumeAutoplay() {
    if (this.element.dataset.autoplay === 'true' && !this.autoplayTimer) {
      this.startAutoplay();
    }
  }

  /**
   * Announce card change to screen readers
   * @method announceCard
   * @param {number} index - The card index
   * @returns {void}
   * 
   * 🎓 Important for accessibility
   */
  announceCard(index) {
    const announcement = `Showing testimonial ${index + 1} of ${this.cards.length}`;
    
    // Create or update live region
    let liveRegion = this.element.querySelector('.bsb-testimonial-carousel__live-region');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.className = 'bsb-testimonial-carousel__live-region sr-only';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      this.element.appendChild(liveRegion);
    }
    
    liveRegion.textContent = announcement;
  }
}

/**
 * Initialize all testimonial components
 * @function initializeTestimonials
 * @description Finds and initializes all testimonial cards and carousels
 * @returns {void}
 */
function initializeTestimonials() {
  // Initialize individual cards
  const cards = document.querySelectorAll('[data-bsb-component="testimonial-card"]');
  cards.forEach(card => {
    new BSBTestimonialCard(card);
  });
  
  // Initialize carousels
  const carousels = document.querySelectorAll('[data-bsb-testimonial-carousel]');
  carousels.forEach(carousel => {
    new BSBTestimonialCarousel(carousel);
  });
  
  debug.log(`BSB Testimonial: Initialized ${cards.length} cards and ${carousels.length} carousels`);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeTestimonials);
} else {
  initializeTestimonials();
}

// Export for use in other scripts
window.BSBTestimonialCard = BSBTestimonialCard;
window.BSBTestimonialCarousel = BSBTestimonialCarousel;

/**
 * 🎓 Learning Resources:
 * - Intersection Observer API: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
 * - Custom Events: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
 * - ARIA Live Regions: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions
 * - Carousel Accessibility: https://www.w3.org/WAI/tutorials/carousels/
 */
```

### Step 5: Create Component Documentation

Create `README.md`:

```markdown
# Testimonial Card Component

> A flexible, accessible testimonial card component with optional carousel functionality.

## Features

- 🎨 **Multiple variants** - Basic and featured styles
- ♿ **Fully accessible** - Semantic HTML, ARIA labels, keyboard navigation
- 📱 **Responsive** - Looks great on all devices
- 🌙 **Dark mode support** - Automatic theme adaptation
- ⭐ **Interactive ratings** - Optional user ratings
- 🎠 **Carousel mode** - Display multiple testimonials
- 🎭 **Scroll animations** - Smooth entrance animations
- 🖨️ **Print friendly** - Optimized print styles

## Usage

### Basic Testimonial

```html
<figure class="bsb-testimonial-card" data-bsb-component="testimonial-card">
  <blockquote class="bsb-testimonial-card__quote">
    <p>"Your testimonial text here..."</p>
  </blockquote>
  <figcaption class="bsb-testimonial-card__attribution">
    <img 
      src="/path/to/avatar.jpg" 
      alt="Person Name" 
      class="bsb-testimonial-card__avatar"
      width="48"
      height="48"
      loading="lazy"
    >
    <div class="bsb-testimonial-card__author">
      <cite class="bsb-testimonial-card__name">Person Name</cite>
      <span class="bsb-testimonial-card__role">Their Role</span>
    </div>
  </figcaption>
</figure>
```

### With Rating

```html
<figure class="bsb-testimonial-card" data-bsb-component="testimonial-card" data-interactive="true">
  <div class="bsb-testimonial-card__rating" aria-label="5 out of 5 stars">
    <span class="bsb-testimonial-card__star">★</span>
    <!-- Repeat for desired rating -->
  </div>
  <!-- Rest of component -->
</figure>
```

### Featured Variant

```html
<figure class="bsb-testimonial-card bsb-testimonial-card--featured" data-bsb-component="testimonial-card">
  <!-- Component content -->
</figure>
```

### Carousel Mode

```html
<div data-bsb-testimonial-carousel data-autoplay="true" data-autoplay-interval="5000">
  <figure class="bsb-testimonial-card" data-bsb-component="testimonial-card">
    <!-- First testimonial -->
  </figure>
  <figure class="bsb-testimonial-card" data-bsb-component="testimonial-card">
    <!-- Second testimonial -->
  </figure>
  <!-- More testimonials -->
</div>
```

## Configuration Options

### Data Attributes

| Attribute | Values | Description |
|-----------|--------|-------------|
| `data-animate` | `fade-in`, `scroll` | Animation type |
| `data-interactive` | `true`, `false` | Enable interactive ratings |
| `data-testimonial-id` | String | Unique identifier for tracking |

### Carousel Attributes

| Attribute | Values | Description |
|-----------|--------|-------------|
| `data-autoplay` | `true`, `false` | Enable autoplay |
| `data-autoplay-interval` | Number (ms) | Time between slides |

## Styling

### CSS Custom Properties

```css
.bsb-testimonial-card {
  /* Colors */
  --testimonial-bg: var(--bsb-color-surface);
  --testimonial-border: var(--bsb-color-border);
  --testimonial-shadow: var(--bsb-shadow-md);
  
  /* Dimensions */
  --testimonial-radius: var(--bsb-radius-lg);
  --testimonial-padding: var(--bsb-spacing-6);
  --testimonial-gap: var(--bsb-spacing-4);
  
  /* Featured variant */
  --testimonial-featured-bg: var(--bsb-color-primary-50);
  --testimonial-featured-border: var(--bsb-color-primary-200);
  
  /* Rating */
  --testimonial-star-color: var(--bsb-color-warning);
}
```

## JavaScript API

### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `bsb:testimonial:rated` | `{ rating, element, testimonialId }` | Fired when user rates a testimonial |

### Methods

```javascript
// Get component instance
const card = document.querySelector('[data-bsb-component="testimonial-card"]');
const instance = card.BSBTestimonialCard;

// Set rating programmatically
instance.setRating(4);

// For carousels
const carousel = document.querySelector('[data-bsb-testimonial-carousel]').BSBTestimonialCarousel;
carousel.nextCard();
carousel.previousCard();
carousel.showCard(2);
```

## Accessibility

- ✅ Semantic HTML structure
- ✅ Proper ARIA labels and roles
- ✅ Keyboard navigation support
- ✅ Screen reader announcements
- ✅ Focus management
- ✅ Reduced motion support

## Performance

- Lazy loading for images
- Intersection Observer for animations
- Efficient event delegation
- Minimal reflows/repaints

## Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- Mobile browsers

## Examples

See the [testimonial examples](../../pages/component-library.html#testimonials) in the component library.

## Related Components

- [Card](../card/README.md) - General purpose content cards
- [Quote](../quote/README.md) - Standalone quotes
- [Avatar](../avatar/README.md) - User avatars
```

## Component Best Practices

### 🎯 1. Structure Best Practices

- **One component per folder** - Keep components self-contained
- **Consistent naming** - Use kebab-case everywhere
- **Clear file roles** - HTML for structure, CSS for style, JS for behavior

### 🎯 2. HTML Best Practices

```html
<!-- ✅ DO: Use semantic HTML -->
<figure class="bsb-testimonial-card">
  <blockquote>...</blockquote>
  <figcaption>...</figcaption>
</figure>

<!-- ❌ DON'T: Use generic elements -->
<div class="testimonial">
  <div class="quote">...</div>
  <div class="author">...</div>
</div>
```

### 🎯 3. CSS Best Practices

```css
/* ✅ DO: Use custom properties for theming */
.bsb-component {
  color: var(--bsb-color-text);
  padding: var(--bsb-spacing-4);
}

/* ❌ DON'T: Use hard-coded values */
.bsb-component {
  color: #333;
  padding: 16px;
}
```

### 🎯 4. JavaScript Best Practices

```javascript
// ✅ DO: Progressive enhancement
if (element.dataset.interactive === 'true') {
  addInteractivity();
}

// ❌ DON'T: Require JavaScript
element.style.display = 'none'; // Breaks without JS
```

### 🎯 5. Accessibility Best Practices

- Always use semantic HTML first
- Add ARIA only when necessary
- Test with keyboard navigation
- Test with screen readers
- Provide text alternatives

### 🎯 6. Performance Best Practices

- Lazy load images and heavy resources
- Use Intersection Observer for scroll effects
- Minimize reflows and repaints
- Bundle efficiently
- Optimize for Core Web Vitals

## Advanced Patterns

### 🚀 1. Component Composition

```html
<!-- Compose smaller components into larger ones -->
<article class="bsb-testimonial-card-group">
  <header class="bsb-section-header">
    <h2>What Our Users Say</h2>
  </header>
  <div class="bsb-testimonial-carousel" data-bsb-testimonial-carousel>
    <!-- Multiple testimonial cards -->
  </div>
</article>
```

### 🚀 2. State Management

```javascript
// Use data attributes for state
element.dataset.state = 'loading';

// CSS can respond to state
[data-state="loading"] {
  opacity: 0.5;
}
```

### 🚀 3. Event System

```javascript
// Dispatch custom events for component communication
element.dispatchEvent(new CustomEvent('bsb:component:ready', {
  detail: { component: 'testimonial-card' },
  bubbles: true
}));
```

### 🚀 4. Plugin Architecture

```javascript
// Allow extending components
BSBTestimonialCard.registerPlugin('analytics', {
  onRated: (rating) => {
    // Track rating event
  }
});
```

## Testing Your Component

### 1. Visual Testing

- [ ] Component looks correct in all browsers
- [ ] Responsive behavior works properly
- [ ] Dark mode styling is applied
- [ ] Print styles are optimized
- [ ] Animations are smooth

### 2. Functional Testing

- [ ] Interactive features work
- [ ] Events fire correctly
- [ ] State changes are handled
- [ ] Error cases are covered
- [ ] Performance is acceptable

### 3. Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Screen reader announces properly
- [ ] Color contrast passes WCAG
- [ ] Focus indicators are visible
- [ ] Motion can be reduced

### 4. Code Quality

- [ ] HTML validates
- [ ] CSS follows conventions
- [ ] JavaScript has no errors
- [ ] Documentation is complete
- [ ] Examples are provided

## Component Documentation

Every BSB component must include:

1. **README.md** - Comprehensive documentation
2. **Inline comments** - Explain the "why"
3. **Usage examples** - Show real implementations
4. **API documentation** - List all options
5. **Learning resources** - Links for deeper learning

## Real-World Example

Let's see how to use the testimonial card in a real page:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Customer Reviews - My Site</title>
  <link rel="stylesheet" href="/src/styles/main.css">
  <link rel="stylesheet" href="/src/components/testimonial-card/testimonial-card.css">
</head>
<body>
  <section class="reviews-section">
    <h2>Customer Reviews</h2>
    
    <!-- Testimonial carousel -->
    <div 
      data-bsb-testimonial-carousel 
      data-autoplay="true" 
      data-autoplay-interval="7000"
      class="testimonial-container"
    >
      <!-- Testimonial 1 -->
      <figure 
        class="bsb-testimonial-card bsb-testimonial-card--featured" 
        data-bsb-component="testimonial-card"
        data-animate="scroll"
        data-interactive="true"
        data-testimonial-id="review-001"
      >
        <div class="bsb-testimonial-card__rating" aria-label="5 out of 5 stars">
          <span class="bsb-testimonial-card__star">★</span>
          <span class="bsb-testimonial-card__star">★</span>
          <span class="bsb-testimonial-card__star">★</span>
          <span class="bsb-testimonial-card__star">★</span>
          <span class="bsb-testimonial-card__star">★</span>
        </div>
        <blockquote class="bsb-testimonial-card__quote">
          <p>"BSB transformed how I build websites. The component architecture and built-in best practices save me hours on every project!"</p>
        </blockquote>
        <figcaption class="bsb-testimonial-card__attribution">
          <img 
            src="/assets/images/customers/sarah-chen.jpg" 
            alt="Sarah Chen" 
            class="bsb-testimonial-card__avatar"
            width="48"
            height="48"
            loading="lazy"
          >
          <div class="bsb-testimonial-card__author">
            <cite class="bsb-testimonial-card__name">Sarah Chen</cite>
            <span class="bsb-testimonial-card__role">Senior Frontend Developer</span>
          </div>
        </figcaption>
      </figure>
      
      <!-- More testimonials... -->
    </div>
  </section>
  
  <script type="module" src="/src/components/testimonial-card/testimonial-card.js"></script>
</body>
</html>
```

## Troubleshooting

### Common Issues

**1. Animations not working**
- Check if `data-animate` attribute is set
- Verify Intersection Observer is supported
- Check for CSS animation conflicts

**2. Carousel controls not appearing**
- Ensure multiple testimonials are present
- Check if JavaScript loaded correctly
- Verify no CSS is hiding controls

**3. Ratings not interactive**
- Set `data-interactive="true"`
- Check browser console for errors
- Verify JavaScript is enabled

**4. Dark mode not working**
- Check if theme toggle is implemented
- Verify CSS custom properties are defined
- Test `[data-bsb-theme="dark"]` selector

### Debug Mode

Enable debug mode to see component logs:

```javascript
localStorage.setItem('bsb-debug', 'true');
```

## Summary

Congratulations! 🎉 You've learned how to create a fully-featured BSB component. 

### Key Takeaways

1. **Structure matters** - Organize files consistently
2. **Semantic HTML first** - Use the right elements
3. **Progressive enhancement** - Works without JavaScript
4. **Accessibility always** - Design for everyone
5. **Performance counts** - Optimize from the start
6. **Document everything** - Help future developers

### Next Steps

- Try creating your own component
- Explore other BSB components for inspiration
- Read the [Advanced Component Patterns](./advanced-patterns.md) guide
- Contribute your component back to BSB!

### Resources

- [MDN Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Web Performance](https://web.dev/performance/)

---

*Happy component building! Remember, the best way to learn is by doing. Start with a simple component and gradually add features as you learn.*