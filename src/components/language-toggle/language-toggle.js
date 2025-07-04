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
import debug from '../../scripts/core/debug.js';

// Constants
const CONSTANTS = {
  LANGUAGE_CODE_LENGTH: 2
};

/**
 * Language toggle component class
 */
class BSBLanguageToggle {
  /**
   * Initialize language toggle component
   * @param {HTMLElement} container - Container element for the component
   */
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
    const browserLang = navigator.language.substring(0, CONSTANTS.LANGUAGE_CODE_LENGTH);

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
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && this.isOpen) {
        this.closeMenu();
      }
    });
  }

  /**
   * Handle button click
   * @param {Event} event - Click event
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
   * @param {Event} event - Click event
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
   * @param {KeyboardEvent} event - Keyboard event
   */
  handleKeyboard(event) {
    if (this.isOpen) {
      // Menu is open - handle navigation
      const focusableElements = Array.from(this.options);
      this.handleOpenMenuKeyboard(event, focusableElements);
    } else if ((event.key === ' ' || event.key === 'Enter') && event.target === this.button) {
      // If menu is closed, only handle space/enter on button
      event.preventDefault();
      this.openMenu();
    }
  }

  /**
   * Handle keyboard navigation when menu is open
   * @param {KeyboardEvent} event - Keyboard event
   * @param {HTMLElement[]} focusableElements - Array of focusable elements
   */
  handleOpenMenuKeyboard(event, focusableElements) {
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

      case 'Home': {
        event.preventDefault();
        const [firstElement] = focusableElements;
        firstElement.focus();
        break;
      }

      case 'End': {
        event.preventDefault();
        const lastElement = focusableElements[focusableElements.length - 1];
        lastElement.focus();
        break;
      }

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

      default:
        // No action needed for other keys
        break;
    }
  }

  /**
   * Handle clicks outside the component
   * @param {Event} event - Click event
   */
  handleClickOutside(event) {
    if (this.isOpen && !this.container.contains(event.target)) {
      this.closeMenu();
    }
  }

  /**
   * Handle storage changes for multi-tab sync
   * @param {StorageEvent} event - Storage event
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
   * @param {string} language - Language code to set
   */
  setLanguage(language) {
    if (this.supportedLanguages.includes(language)) {
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
    } else {
      debug.warn(`Unsupported language: ${language}`);
    }
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
    const currentTranslations = translations[this.currentLanguage];
    this.button.setAttribute('aria-label', currentTranslations.language.switch);
  }

  /**
   * Update page content with new language
   */
  updateContent() {
    const currentTranslations = translations[this.currentLanguage];

    // Update all elements with data-i18n attributes
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.dataset.i18n;
      const translation = this.getNestedTranslation(currentTranslations, key);

      if (translation) {
        if (element.tagName === 'INPUT' && element.type !== 'submit') {
          element.placeholder = translation;
        } else {
          element.textContent = translation;
        }
      }
    });

    // Update navigation
    this.updateNavigation(currentTranslations);

    // Update meta tags
    this.updateMetaTags();
  }

  /**
   * Get nested translation from dot notation key
   * @param {Object} translationsObj - Translations object
   * @param {string} key - Dot notation key
   * @returns {string|undefined} Translation value
   */
  getNestedTranslation(translationsObj, key) {
    return key.split('.').reduce((obj, keyPart) => obj && obj[keyPart], translationsObj);
  }

  /**
   * Update navigation items
   * @param {Object} translationKey - Current language translations
   */
  updateNavigation(translationKey) {
    const navLinks = document.querySelectorAll('.bsb-header__link');
    const navMap = {
      '/': 'nav.home',
      '/pages/about.html': 'nav.about',
      '/pages/services.html': 'nav.services',
      '/pages/interactive-playground.html': 'nav.playground',
      '/pages/project-structure.html': 'nav.projectStructure',
      '/pages/design-system.html': 'nav.designSystem',
      '/pages/contact.html': 'nav.contact'
    };

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      const key = Object.keys(navMap).find(path => href.includes(path));
      if (key) {
        const translation = this.getNestedTranslation(translationKey, navMap[key]);
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
      const currentTranslations = translations[this.currentLanguage];
      const translation = this.getNestedTranslation(currentTranslations, titleElement.dataset.i18n);
      if (translation) {
        titleElement.textContent = translation;
      }
    }

    // Update meta description
    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta && descriptionMeta.dataset.i18n) {
      const currentTranslations = translations[this.currentLanguage];
      const translation = this.getNestedTranslation(
        currentTranslations,
        descriptionMeta.dataset.i18n
      );
      if (translation) {
        descriptionMeta.content = translation;
      }
    }
  }

  /**
   * Update URL parameter
   * @param {string} language - Language code to set in URL
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
   * @param {string} newLanguage - New language code
   * @param {string} previousLanguage - Previous language code
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
   * @returns {string} Current language code
   */
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  /**
   * Get current translations
   * @returns {Object} Current language translations
   */
  getCurrentTranslations() {
    return translations[this.currentLanguage];
  }

  /**
   * Check if language is RTL
   * @param {string} language - Language code to check
   * @returns {boolean} True if language is RTL
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
    const languageToggle = new BSBLanguageToggle(toggle);
    // Store reference if needed for later access
    toggle.languageToggleInstance = languageToggle;
  });
});

// Export for module usage
window.BSBLanguageToggle = BSBLanguageToggle;

export default BSBLanguageToggle;