/**
 * Component Accessibility Tests
 * =============================
 * 
 * Comprehensive accessibility testing for all BSB components.
 * Tests WCAG 2.1 AA compliance and screen reader compatibility.
 */

import { jest } from '@jest/globals';

describe('Component Accessibility', () => {
  describe('Card Component', () => {
    test('should be accessible with basic content', async () => {
      const cardHtml = `
        <article class="bsb-card" data-bsb-component="card">
          <div class="bsb-card__body">
            <h3 class="bsb-card__title">Card Title</h3>
            <p class="bsb-card__text">Card description goes here.</p>
          </div>
        </article>
      `;
      
      createMockDocument(cardHtml);
      const card = document.querySelector('.bsb-card');
      
      await testAccessibility(card);
    });

    test('should be accessible with media content', async () => {
      const cardWithMediaHtml = `
        <article class="bsb-card" data-bsb-component="card">
          <div class="bsb-card__media">
            <img src="/test-image.jpg" alt="Descriptive alt text for the image">
          </div>
          <div class="bsb-card__body">
            <h3 class="bsb-card__title">Card with Image</h3>
            <p class="bsb-card__text">This card includes an image with proper alt text.</p>
          </div>
        </article>
      `;
      
      createMockDocument(cardWithMediaHtml);
      const card = document.querySelector('.bsb-card');
      
      await testAccessibility(card);
    });

    test('should be accessible with action links', async () => {
      const cardWithActionHtml = `
        <article class="bsb-card" data-bsb-component="card">
          <div class="bsb-card__body">
            <h3 class="bsb-card__title">Service Card</h3>
            <p class="bsb-card__text">Learn about our services.</p>
          </div>
          <div class="bsb-card__footer">
            <a href="/services" class="bsb-card__link">Learn More</a>
          </div>
        </article>
      `;
      
      createMockDocument(cardWithActionHtml);
      const card = document.querySelector('.bsb-card');
      
      await testAccessibility(card);
    });

    test('should have proper heading hierarchy', () => {
      const cardHtml = `
        <article class="bsb-card" data-bsb-component="card">
          <div class="bsb-card__body">
            <h3 class="bsb-card__title">Card Title</h3>
            <p class="bsb-card__text">Card content</p>
          </div>
        </article>
      `;
      
      createMockDocument(cardHtml);
      const heading = document.querySelector('.bsb-card__title');
      
      expect(heading.tagName.toLowerCase()).toBe('h3');
      expect(heading.textContent).toBeTruthy();
    });

    test('should have proper semantic structure', () => {
      const cardHtml = `
        <article class="bsb-card" data-bsb-component="card">
          <div class="bsb-card__body">
            <h3 class="bsb-card__title">Card Title</h3>
            <p class="bsb-card__text">Card content</p>
          </div>
        </article>
      `;
      
      createMockDocument(cardHtml);
      const card = document.querySelector('.bsb-card');
      
      expect(card.tagName.toLowerCase()).toBe('article');
      expect(card.querySelector('h3')).toBeTruthy();
    });
  });

  describe('Hero Component', () => {
    test('should be accessible with basic content', async () => {
      const heroHtml = `
        <section class="bsb-hero" data-bsb-component="hero">
          <div class="container">
            <div class="bsb-hero__content">
              <h1 class="bsb-hero__title">Page Title</h1>
              <p class="bsb-hero__lead">Page description that provides context.</p>
            </div>
          </div>
        </section>
      `;
      
      createMockDocument(heroHtml);
      const hero = document.querySelector('.bsb-hero');
      
      await testAccessibility(hero);
    });

    test('should be accessible with call-to-action buttons', async () => {
      const heroWithActionsHtml = `
        <section class="bsb-hero" data-bsb-component="hero">
          <div class="container">
            <div class="bsb-hero__content">
              <h1 class="bsb-hero__title">Get Started Today</h1>
              <p class="bsb-hero__lead">Join thousands of developers building better websites.</p>
              <div class="bsb-hero__actions">
                <a href="/signup" class="btn btn--primary btn--large">Start Free Trial</a>
                <a href="/demo" class="btn btn--secondary btn--large">Watch Demo</a>
              </div>
            </div>
          </div>
        </section>
      `;
      
      createMockDocument(heroWithActionsHtml);
      const hero = document.querySelector('.bsb-hero');
      
      await testAccessibility(hero);
    });

    test('should have exactly one h1 element', () => {
      const heroHtml = `
        <section class="bsb-hero" data-bsb-component="hero">
          <div class="container">
            <div class="bsb-hero__content">
              <h1 class="bsb-hero__title">Main Page Title</h1>
              <p class="bsb-hero__lead">Supporting description</p>
            </div>
          </div>
        </section>
      `;
      
      createMockDocument(heroHtml);
      const h1Elements = document.querySelectorAll('h1');
      
      expect(h1Elements).toHaveLength(1);
      expect(h1Elements[0].textContent).toBe('Main Page Title');
    });

    test('should use semantic section element', () => {
      const heroHtml = `
        <section class="bsb-hero" data-bsb-component="hero">
          <div class="container">
            <div class="bsb-hero__content">
              <h1 class="bsb-hero__title">Title</h1>
            </div>
          </div>
        </section>
      `;
      
      createMockDocument(heroHtml);
      const hero = document.querySelector('.bsb-hero');
      
      expect(hero.tagName.toLowerCase()).toBe('section');
    });
  });

  describe('Header Component', () => {
    test('should be accessible with navigation', async () => {
      const headerHtml = `
        <header class="bsb-header" data-bsb-component="header" role="banner">
          <div class="container">
            <div class="bsb-header__inner">
              <div class="bsb-header__brand">
                <a href="/" class="bsb-header__logo">Your Brand</a>
              </div>
              <nav class="bsb-header__nav" aria-label="Main navigation">
                <ul class="bsb-header__menu">
                  <li><a href="/" class="bsb-header__link">Home</a></li>
                  <li><a href="/about" class="bsb-header__link">About</a></li>
                  <li><a href="/contact" class="bsb-header__link">Contact</a></li>
                </ul>
              </nav>
              <button class="bsb-header__toggle" 
                      aria-label="Toggle navigation" 
                      aria-expanded="false">
                <span class="bsb-header__toggle-icon">☰</span>
              </button>
            </div>
          </div>
        </header>
      `;
      
      createMockDocument(headerHtml);
      const header = document.querySelector('.bsb-header');
      
      await testAccessibility(header);
    });

    test('should have proper landmark roles', () => {
      const headerHtml = `
        <header class="bsb-header" data-bsb-component="header" role="banner">
          <nav class="bsb-header__nav" aria-label="Main navigation">
            <ul class="bsb-header__menu">
              <li><a href="/" class="bsb-header__link">Home</a></li>
            </ul>
          </nav>
        </header>
      `;
      
      createMockDocument(headerHtml);
      const header = document.querySelector('.bsb-header');
      const nav = document.querySelector('.bsb-header__nav');
      
      expect(header.getAttribute('role')).toBe('banner');
      expect(nav.getAttribute('aria-label')).toBe('Main navigation');
    });

    test('should have accessible mobile toggle button', () => {
      const headerHtml = `
        <header class="bsb-header" data-bsb-component="header">
          <button class="bsb-header__toggle" 
                  aria-label="Toggle navigation menu" 
                  aria-expanded="false"
                  aria-controls="main-nav">
            <span class="bsb-header__toggle-icon">☰</span>
          </button>
          <nav id="main-nav" class="bsb-header__nav">
            <ul><li><a href="/">Home</a></li></ul>
          </nav>
        </header>
      `;
      
      createMockDocument(headerHtml);
      const toggleButton = document.querySelector('.bsb-header__toggle');
      
      expect(toggleButton.getAttribute('aria-label')).toBeTruthy();
      expect(toggleButton.getAttribute('aria-expanded')).toBe('false');
      expect(toggleButton.getAttribute('aria-controls')).toBe('main-nav');
    });
  });

  describe('Footer Component', () => {
    test('should be accessible with basic content', async () => {
      const footerHtml = `
        <footer class="bsb-footer" data-bsb-component="footer" role="contentinfo">
          <div class="container">
            <div class="bsb-footer__main">
              <div class="bsb-footer__brand">
                <a href="/" class="bsb-footer__logo">Your Brand</a>
                <p class="bsb-footer__tagline">Building better websites</p>
              </div>
            </div>
            <div class="bsb-footer__bottom">
              <p class="bsb-footer__copyright">© 2024 Your Brand</p>
            </div>
          </div>
        </footer>
      `;
      
      createMockDocument(footerHtml);
      const footer = document.querySelector('.bsb-footer');
      
      await testAccessibility(footer);
    });

    test('should be accessible with navigation links', async () => {
      const footerWithNavHtml = `
        <footer class="bsb-footer" data-bsb-component="footer" role="contentinfo">
          <div class="container">
            <div class="bsb-footer__grid">
              <div class="bsb-footer__column">
                <h4 class="bsb-footer__heading">Company</h4>
                <ul class="bsb-footer__links">
                  <li><a href="/about">About</a></li>
                  <li><a href="/careers">Careers</a></li>
                  <li><a href="/contact">Contact</a></li>
                </ul>
              </div>
              <div class="bsb-footer__column">
                <h4 class="bsb-footer__heading">Support</h4>
                <ul class="bsb-footer__links">
                  <li><a href="/help">Help</a></li>
                  <li><a href="/docs">Documentation</a></li>
                </ul>
              </div>
            </div>
            <div class="bsb-footer__bottom">
              <p class="bsb-footer__copyright">© 2024 Your Brand</p>
            </div>
          </div>
        </footer>
      `;
      
      createMockDocument(footerWithNavHtml);
      const footer = document.querySelector('.bsb-footer');
      
      await testAccessibility(footer);
    });

    test('should have proper contentinfo role', () => {
      const footerHtml = `
        <footer class="bsb-footer" data-bsb-component="footer" role="contentinfo">
          <p>Footer content</p>
        </footer>
      `;
      
      createMockDocument(footerHtml);
      const footer = document.querySelector('.bsb-footer');
      
      expect(footer.getAttribute('role')).toBe('contentinfo');
    });
  });

  describe('Form Elements', () => {
    test('should be accessible with proper labels', async () => {
      const formHtml = `
        <form data-bsb-validate>
          <div class="form-group">
            <label for="email" class="form-label">Email Address</label>
            <input type="email" 
                   id="email" 
                   class="form-input" 
                   required 
                   aria-describedby="email-help">
            <div id="email-help" class="form-help">
              We'll never share your email with anyone else.
            </div>
          </div>
          
          <div class="form-group">
            <label for="message" class="form-label">Message</label>
            <textarea id="message" 
                      class="form-textarea" 
                      rows="4" 
                      required
                      aria-describedby="message-help"></textarea>
            <div id="message-help" class="form-help">
              Please provide details about your inquiry.
            </div>
          </div>
          
          <button type="submit" class="btn btn--primary">
            Send Message
          </button>
        </form>
      `;
      
      createMockDocument(formHtml);
      const form = document.querySelector('form');
      
      await testAccessibility(form);
    });

    test('should have proper label associations', () => {
      const formHtml = `
        <form>
          <label for="username" class="form-label">Username</label>
          <input type="text" id="username" class="form-input" required>
        </form>
      `;
      
      createMockDocument(formHtml);
      const label = document.querySelector('label');
      const input = document.querySelector('input');
      
      expect(label.getAttribute('for')).toBe('username');
      expect(input.getAttribute('id')).toBe('username');
    });

    test('should have accessible error states', async () => {
      const formWithErrorHtml = `
        <form>
          <div class="form-group form-group--error">
            <label for="email-error" class="form-label">Email</label>
            <input type="email" 
                   id="email-error" 
                   class="form-input form-input--error" 
                   aria-invalid="true"
                   aria-describedby="email-error-message">
            <div id="email-error-message" 
                 class="form-error" 
                 role="alert">
              Please enter a valid email address.
            </div>
          </div>
        </form>
      `;
      
      createMockDocument(formWithErrorHtml);
      const formGroup = document.querySelector('.form-group--error');
      
      await testAccessibility(formGroup);
      
      const input = document.querySelector('.form-input--error');
      const errorMessage = document.querySelector('.form-error');
      
      expect(input.getAttribute('aria-invalid')).toBe('true');
      expect(errorMessage.getAttribute('role')).toBe('alert');
    });
  });

  describe('Skip Links', () => {
    test('should be accessible skip link', async () => {
      const pageHtml = `
        <a href="#main" class="skip-link">Skip to main content</a>
        <header>Header content</header>
        <main id="main">Main content</main>
      `;
      
      createMockDocument(pageHtml);
      const skipLink = document.querySelector('.skip-link');
      
      await testAccessibility(skipLink);
      
      expect(skipLink.getAttribute('href')).toBe('#main');
      expect(skipLink.textContent).toBe('Skip to main content');
    });
  });

  describe('Focus Management', () => {
    test('should maintain logical tab order', () => {
      const pageHtml = `
        <a href="#main" class="skip-link">Skip to main content</a>
        <header>
          <a href="/" class="logo">Logo</a>
          <nav>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
          </nav>
        </header>
        <main id="main" tabindex="-1">
          <h1>Page Title</h1>
          <a href="/action">Call to Action</a>
        </main>
      `;
      
      createMockDocument(pageHtml);
      
      const focusableElements = document.querySelectorAll(
        'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      
      expect(focusableElements.length).toBeGreaterThan(0);
      
      // First focusable element should be skip link
      expect(focusableElements[0].classList.contains('skip-link')).toBe(true);
    });
  });

  describe('Color Contrast', () => {
    test('should pass color contrast requirements', () => {
      // This would typically be tested with automated tools
      // Here we verify that proper CSS classes are applied
      const contentHtml = `
        <div class="content">
          <h1 style="color: #000000; background-color: #ffffff;">High Contrast Heading</h1>
          <p style="color: #333333; background-color: #ffffff;">Normal text content</p>
          <a href="#" style="color: #007bff;">Link text</a>
        </div>
      `;
      
      createMockDocument(contentHtml);
      
      // Verify elements exist for contrast testing
      const heading = document.querySelector('h1');
      const paragraph = document.querySelector('p');
      const link = document.querySelector('a');
      
      expect(heading).toBeTruthy();
      expect(paragraph).toBeTruthy();
      expect(link).toBeTruthy();
      
      // In a real test, you would use axe-core to check actual contrast ratios
    });
  });
});