/**
 * Language Toggle System
 * ======================
 *
 * Provides bilingual support for educational content with:
 * - Dynamic language switching
 * - Persistent language preference
 * - Accessibility-compliant implementation
 * - Educational tooltips in multiple languages
 *
 * Educational Features:
 * - Real-time content translation
 * - Language-specific code examples
 * - Culturally appropriate design patterns
 * - Progressive enhancement approach
 */

// Constants
const CONSTANTS = {
  ANNOUNCEMENT_DURATION: 1000
};

class LanguageToggle {
  constructor() {
    this.currentLanguage = this.getStoredLanguage() || this.detectBrowserLanguage() || 'es';
    this.translations = {};
    this.init();
  }

  /**
   * Initialize the language toggle system
   */
  init() {
    this.loadTranslations();
    this.createToggleElement();
    this.updateContent();
    this.bindEvents();

    // Announce current language to screen readers
    this.announceLanguageChange(this.currentLanguage, false);
  }

  /**
   * Detect user's browser language preference
   */
  detectBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    const supportedLanguages = ['en', 'es'];

    // Check if browser language is supported
    const [langCode] = browserLang.split('-');
    return supportedLanguages.includes(langCode) ? langCode : 'es';
  }

  /**
   * Get stored language preference
   */
  getStoredLanguage() {
    return localStorage.getItem('bsb-language');
  }

  /**
   * Store language preference
   */
  setStoredLanguage(language) {
    localStorage.setItem('bsb-language', language);
  }

  /**
   * Load translation data
   */
  loadTranslations() {
    // In a real application, these would be loaded from external JSON files
    this.translations = {
      en: {
        // Navigation
        'nav.home': 'Home',
        'nav.about': 'About',
        'nav.services': 'Services',
        'nav.playground': 'Playground',
        'nav.contact': 'Contact',
        'nav.project-structure': 'Project Structure',
        'nav.component-library': 'Components',

        // Common UI
        'ui.skip-to-content': 'Skip to main content',
        'ui.toggle-navigation': 'Toggle navigation',
        'ui.current-page': 'Current page',
        'ui.learn-more': 'Learn More',
        'ui.get-started': 'Get Started',
        'ui.view-source': 'View Source',

        // Language toggle
        'lang.current': 'Current language',
        'lang.switch-to': 'Switch to',
        'lang.english': 'English',
        'lang.spanish': 'Spanish',

        // Educational content
        'education.tip': 'Tip',
        'education.example': 'Example',
        'education.try-it': 'Try it yourself',
        'education.best-practice': 'Best Practice',
        'education.common-mistake': 'Common Mistake',

        // Achievements
        'achievement.unlocked': 'Achievement Unlocked!',
        'achievement.first-visit': 'Welcome Explorer',
        'achievement.component-viewer': 'Component Inspector',
        'achievement.code-editor': 'Code Warrior',
        'achievement.tutorial-master': 'Tutorial Master',
      },
      es: {
        // Navigation
        'nav.home': 'Inicio',
        'nav.about': 'Acerca de',
        'nav.services': 'Servicios',
        'nav.playground': 'Laboratorio',
        'nav.contact': 'Contacto',
        'nav.project-structure': 'Estructura del Proyecto',
        'nav.component-library': 'Componentes',

        // Common UI
        'ui.skip-to-content': 'Saltar al contenido principal',
        'ui.toggle-navigation': 'Alternar navegación',
        'ui.current-page': 'Página actual',
        'ui.learn-more': 'Aprender Más',
        'ui.get-started': 'Comenzar',
        'ui.view-source': 'Ver Código',

        // Language toggle
        'lang.current': 'Idioma actual',
        'lang.switch-to': 'Cambiar a',
        'lang.english': 'Inglés',
        'lang.spanish': 'Español',

        // Educational content
        'education.tip': 'Consejo',
        'education.example': 'Ejemplo',
        'education.try-it': 'Pruébalo tú mismo',
        'education.best-practice': 'Mejor Práctica',
        'education.common-mistake': 'Error Común',

        // Achievements
        'achievement.unlocked': '¡Logro Desbloqueado!',
        'achievement.first-visit': 'Explorador de Bienvenida',
        'achievement.component-viewer': 'Inspector de Componentes',
        'achievement.code-editor': 'Guerrero del Código',
        'achievement.tutorial-master': 'Maestro de Tutoriales',
      }
    };
  }

  /**
   * Create the language toggle element
   */
  createToggleElement() {
    // Check if toggle already exists
    if (document.querySelector('.bsb-language-toggle')) {
      return;
    }

    const toggle = document.createElement('div');
    toggle.className = 'bsb-language-toggle';
    toggle.setAttribute('data-bsb-component', 'language-toggle');

    const currentLangName = this.currentLanguage === 'en' ? 'English' : 'Español';
    const otherLang = this.currentLanguage === 'en' ? 'es' : 'en';
    const otherLangName = otherLang === 'en' ? 'English' : 'Español';

    toggle.innerHTML = `
      <button class="bsb-language-toggle__button"
              aria-label="${this.t('lang.current')}: ${currentLangName}. ${this.t('lang.switch-to')} ${otherLangName}"
              data-language="${otherLang}">
        <span class="bsb-language-toggle__current">${this.currentLanguage.toUpperCase()}</span>
        <span class="bsb-language-toggle__arrow">⇄</span>
        <span class="bsb-language-toggle__target">${otherLang.toUpperCase()}</span>
      </button>
    `;

    // Add to header actions
    const headerActions = document.querySelector('.bsb-header__actions');
    if (headerActions) {
      headerActions.insertBefore(toggle, headerActions.firstChild);
    }
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    document.addEventListener('click', event => {
      if (event.target.closest('.bsb-language-toggle__button')) {
        const button = event.target.closest('.bsb-language-toggle__button');
        const newLanguage = button.getAttribute('data-language');
        this.switchLanguage(newLanguage);
      }
    });

    // Keyboard shortcut: Alt + L to toggle language
    document.addEventListener('keydown', event => {
      if (event.altKey && event.key === 'l') {
        event.preventDefault();
        const newLanguage = this.currentLanguage === 'es' ? 'en' : 'es';
        this.switchLanguage(newLanguage);
      }
    });
  }

  /**
   * Switch to a new language
   */
  switchLanguage(newLanguage) {
    if (newLanguage === this.currentLanguage) {
      return;
    }

    const oldLanguage = this.currentLanguage;
    this.currentLanguage = newLanguage;
    this.setStoredLanguage(newLanguage);

    // Update content
    this.updateContent();
    this.updateToggleElement();
    this.announceLanguageChange(newLanguage, true);

    // Trigger custom event for other components
    document.dispatchEvent(new CustomEvent('languageChanged', {
      detail: { oldLanguage, newLanguage }
    }));
  }

  /**
   * Update all translatable content
   */
  updateContent() {
    // Update elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.t(key);

      if (translation !== key) {
        if (element.tagName === 'INPUT' && element.type === 'submit') {
          element.value = translation;
        } else {
          element.textContent = translation;
        }
      }
    });

    // Update ARIA labels and other attributes
    document.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
      const key = element.getAttribute('data-i18n-aria-label');
      const translation = this.t(key);
      if (translation !== key) {
        element.setAttribute('aria-label', translation);
      }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      const translation = this.t(key);
      if (translation !== key) {
        element.setAttribute('placeholder', translation);
      }
    });

    // Update document language attribute
    document.documentElement.setAttribute('lang', this.currentLanguage);
  }

  /**
   * Update the toggle element
   */
  updateToggleElement() {
    const toggle = document.querySelector('.bsb-language-toggle__button');
    if (!toggle) {
      return;
    }

    const currentSpan = toggle.querySelector('.bsb-language-toggle__current');
    const targetSpan = toggle.querySelector('.bsb-language-toggle__target');

    const otherLang = this.currentLanguage === 'en' ? 'es' : 'en';
    const currentLangName = this.currentLanguage === 'en' ? 'English' : 'Español';
    const otherLangName = otherLang === 'en' ? 'English' : 'Español';

    currentSpan.textContent = this.currentLanguage.toUpperCase();
    targetSpan.textContent = otherLang.toUpperCase();

    toggle.setAttribute('data-language', otherLang);
    toggle.setAttribute('aria-label',
      `${this.t('lang.current')}: ${currentLangName}. ${this.t('lang.switch-to')} ${otherLangName}`
    );
  }

  /**
   * Announce language change to screen readers
   */
  announceLanguageChange(language, isChange = false) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';

    const langName = language === 'en' ? 'English' : 'Español';
    let message = '';
    if (isChange) {
      if (language === 'es') {
        message = `Idioma cambiado a ${langName}`;
      } else {
        message = `Language changed to ${langName}`;
      }
    } else if (language === 'es') {
      message = `Idioma actual: ${langName}`;
    } else {
      message = `Current language: ${langName}`;
    }

    announcement.textContent = message;
    document.body.appendChild(announcement);

    // Remove announcement after it's been read
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, CONSTANTS.ANNOUNCEMENT_DURATION);
  }

  /**
   * Get translation for a key
   */
  translate(key, fallback = null) {
    const translation = this.translations[this.currentLanguage]?.[key];
    return translation || fallback || key;
  }

  /**
   * Alias for translate method (used internally)
   */
  t(key, fallback = null) {
    return this.translate(key, fallback);
  }

  /**
   * Get current language
   */
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  /**
   * Check if a language is supported
   */
  isLanguageSupported(language) {
    return Object.keys(this.translations).includes(language);
  }
}

// Initialize language toggle when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.bsbLanguageToggle = new LanguageToggle();
  });
} else {
  window.bsbLanguageToggle = new LanguageToggle();
}

export default LanguageToggle;