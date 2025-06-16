/**
 * BSB Language Toggle Component
 * =============================
 *
 * Manages language switching functionality with persistence and accessibility.
 * Integrates with the i18n system to provide seamless bilingual experience.
 *
 * Features:
 * - Language detection (browser preference, localStorage)
 * - Accessible dropdown interface
 * - Smooth transitions and animations
 * - Keyboard navigation support
 * - Real-time content translation
 *
 * @author BSB Team
 * @version 1.0.0
 */

import { translations } from '../../scripts/i18n/translations.js';

class BSBLanguageToggle {
  constructor(container) {
    this.container = container;
    this.button = container.querySelector('[data-bsb-language-button]');
    this.menu = container.querySelector('[data-bsb-language-menu]');
    this.label = container.querySelector('[data-bsb-language-label]');
    this.options = container.querySelectorAll('[data-language]');

    // State management
    this.isOpen = false;
    this.currentLanguage = 'en';
    this.supportedLanguages = ['en', 'es'];

    // Bind methods
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleOptionClick = this.handleOptionClick.bind(this);
    this.handleKeyboard = this.handleKeyboard.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleStorageChange = this.handleStorageChange.bind(this);

    this.init();
  }

  /**
   * Initialize the language toggle
   */
  init() {
    this.detectLanguage();
    this.updateUI();
    this.setupEventListeners();
    this.updateDocumentLanguage();
  }

  /**
   * Detect user's preferred language
   */
  detectLanguage() {
    // Priority: localStorage > URL parameter > browser language > default (en)
    const saved = localStorage.getItem('bsb-language');
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    const browserLang = navigator.language.substring(0, 2);

    let detectedLang = 'en';

    if (saved && this.supportedLanguages.includes(saved)) {
      detectedLang = saved;
    } else if (urlLang && this.supportedLanguages.includes(urlLang)) {
      detectedLang = urlLang;
    } else if (this.supportedLanguages.includes(browserLang)) {
      detectedLang = browserLang;
    }

    this.currentLanguage = detectedLang;
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Button click to toggle menu
    this.button.addEventListener('click', this.handleButtonClick);

    // Option clicks
    this.options.forEach(option => {
      option.addEventListener('click', this.handleOptionClick);
    });

    // Keyboard navigation
    this.container.addEventListener('keydown', this.handleKeyboard);

    // Click outside to close
    document.addEventListener('click', this.handleClickOutside);

    // Storage changes (for multi-tab sync)
    window.addEventListener('storage', this.handleStorageChange);

    // Escape key to close menu
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeMenu();
      }
    });
  }

  /**
   * Handle button click
   */
  handleButtonClick(event) {
    event.preventDefault();
    event.stopPropagation();

    if (this.isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  /**
   * Handle option selection
   */
  handleOptionClick(event) {
    event.preventDefault();
    const selectedLang = event.currentTarget.dataset.language;

    if (selectedLang && selectedLang !== this.currentLanguage) {
      this.setLanguage(selectedLang);
    }

    this.closeMenu();
  }

  /**
   * Handle keyboard navigation
   */
  handleKeyboard(event) {
    if (!this.isOpen) {
      // If menu is closed, only handle space/enter on button
      if ((event.key === ' ' || event.key === 'Enter') && event.target === this.button) {
        event.preventDefault();
        this.openMenu();
      }
      return;
    }

    // Menu is open - handle navigation
    const focusableElements = Array.from(this.options);
    const currentIndex = focusableElements.indexOf(document.activeElement);

    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % focusableElements.length;
        focusableElements[nextIndex].focus();
        break;
      }

      case 'ArrowUp': {
        event.preventDefault();
        const prevIndex = currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1;
        focusableElements[prevIndex].focus();
        break;
      }

      case 'Home':
        event.preventDefault();
        focusableElements[0].focus();
        break;

      case 'End':
        event.preventDefault();
        focusableElements[focusableElements.length - 1].focus();
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        if (document.activeElement.dataset.language) {
          this.handleOptionClick(event);
        }
        break;

      case 'Tab':
        // Allow tab to close menu and continue normal tab flow
        this.closeMenu();
        break;
    }
  }

  /**
   * Handle clicks outside the component
   */
  handleClickOutside(event) {
    if (this.isOpen && !this.container.contains(event.target)) {
      this.closeMenu();
    }
  }

  /**
   * Handle storage changes for multi-tab sync
   */
  handleStorageChange(event) {
    if (event.key === 'bsb-language' && event.newValue) {
      this.currentLanguage = event.newValue;
      this.updateUI();
      this.updateContent();
      this.updateDocumentLanguage();
    }
  }

  /**
   * Open the language menu
   */
  openMenu() {
    this.isOpen = true;
    this.button.setAttribute('aria-expanded', 'true');
    this.menu.setAttribute('aria-hidden', 'false');

    // Focus first option
    const [firstOption] = this.options;
    if (firstOption) {
      firstOption.focus();
    }

    // Add body class to prevent scroll
    document.body.classList.add('bsb-menu-open');
  }

  /**
   * Close the language menu
   */
  closeMenu() {
    this.isOpen = false;
    this.button.setAttribute('aria-expanded', 'false');
    this.menu.setAttribute('aria-hidden', 'true');
    this.button.focus();

    // Remove body class
    document.body.classList.remove('bsb-menu-open');
  }

  /**
   * Set the current language
   */
  setLanguage(language) {
    if (!this.supportedLanguages.includes(language)) {
      console.warn(`Unsupported language: ${language}`);
      return;
    }

    const previousLanguage = this.currentLanguage;
    this.currentLanguage = language;

    // Save to localStorage
    localStorage.setItem('bsb-language', language);

    // Update UI
    this.updateUI();
    this.updateContent();
    this.updateDocumentLanguage();

    // Dispatch custom event for other components
    this.dispatchLanguageChange(language, previousLanguage);

    // Update URL parameter without page reload
    this.updateURL(language);
  }

  /**
   * Update the toggle UI
   */
  updateUI() {
    // Update button state
    this.container.setAttribute('data-current-language', this.currentLanguage);

    // Update label
    const languageNames = {
      en: 'English',
      es: 'Español'
    };
    this.label.textContent = languageNames[this.currentLanguage];

    // Update options
    this.options.forEach(option => {
      const isSelected = option.dataset.language === this.currentLanguage;
      option.setAttribute('aria-current', isSelected);
    });

    // Update button aria-label
    const t = translations[this.currentLanguage];
    this.button.setAttribute('aria-label', t.language.switch);
  }

  /**
   * Update page content with new language
   */
  updateContent() {
    const t = translations[this.currentLanguage];

    // Update all elements with data-i18n attributes
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.dataset.i18n;
      const translation = this.getNestedTranslation(t, key);

      if (translation) {
        if (element.tagName === 'INPUT' && element.type !== 'submit') {
          element.placeholder = translation;
        } else {
          element.textContent = translation;
        }
      }
    });

    // Update navigation
    this.updateNavigation(t);

    // Update meta tags
    this.updateMetaTags();
  }

  /**
   * Get nested translation from dot notation key
   */
  getNestedTranslation(translations, key) {
    return key.split('.').reduce((obj, k) => obj && obj[k], translations);
  }

  /**
   * Update navigation items
   */
  updateNavigation(t) {
    const navLinks = document.querySelectorAll('.bsb-header__link');
    const navMap = {
      '/': 'nav.home',
      '/pages/about.html': 'nav.about',
      '/pages/services.html': 'nav.services',
      '/pages/interactive-playground.html': 'nav.playground',
      '/pages/project-structure.html': 'nav.projectStructure',
      '/pages/contact.html': 'nav.contact'
    };

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      const key = Object.keys(navMap).find(path => href.includes(path));
      if (key) {
        const translation = this.getNestedTranslation(t, navMap[key]);
        if (translation) {
          link.textContent = translation;
        }
      }
    });
  }

  /**
   * Update document language and meta tags
   */
  updateDocumentLanguage() {
    document.documentElement.lang = this.currentLanguage;
  }

  /**
   * Update meta tags for SEO
   */
  updateMetaTags() {
    // Update page title if it has translation data
    const titleElement = document.querySelector('title');
    if (titleElement && titleElement.dataset.i18n) {
      const t = translations[this.currentLanguage];
      const translation = this.getNestedTranslation(t, titleElement.dataset.i18n);
      if (translation) {
        titleElement.textContent = translation;
      }
    }

    // Update meta description
    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta && descriptionMeta.dataset.i18n) {
      const t = translations[this.currentLanguage];
      const translation = this.getNestedTranslation(t, descriptionMeta.dataset.i18n);
      if (translation) {
        descriptionMeta.content = translation;
      }
    }
  }

  /**
   * Update URL parameter
   */
  updateURL(language) {
    const url = new URL(window.location);
    if (language === 'en') {
      url.searchParams.delete('lang');
    } else {
      url.searchParams.set('lang', language);
    }
    window.history.replaceState({}, '', url);
  }

  /**
   * Dispatch language change event
   */
  dispatchLanguageChange(newLanguage, previousLanguage) {
    const event = new CustomEvent('bsb:languageChange', {
      detail: {
        language: newLanguage,
        previousLanguage,
        translations: translations[newLanguage]
      },
      bubbles: true
    });

    this.container.dispatchEvent(event);
  }

  /**
   * Get current language
   */
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  /**
   * Get current translations
   */
  getCurrentTranslations() {
    return translations[this.currentLanguage];
  }

  /**
   * Check if language is RTL
   */
  isRTL(language = this.currentLanguage) {
    const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    return rtlLanguages.includes(language);
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const toggles = document.querySelectorAll('[data-bsb-component="language-toggle"]');
  toggles.forEach(toggle => {
    new BSBLanguageToggle(toggle);
  });
});

// Export for module usage
window.BSBLanguageToggle = BSBLanguageToggle;

export default BSBLanguageToggle;