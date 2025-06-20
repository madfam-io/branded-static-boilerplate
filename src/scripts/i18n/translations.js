/**
 * BSB Internationalization (i18n) System
 * =======================================
 *
 * Complete translation system for English/Spanish bilingual support.
 * Provides translation data and utilities for the entire website.
 *
 * @author BSB Team
 * @version 2.0.0
 */

import { en } from './en.js';
import { es } from './es.js';

/**
 * Translation data structure
 * Contains all UI text in both English and Spanish
 */
export const translations = {
  en,
  es
};

/**
 * Default language
 */
export const DEFAULT_LANGUAGE = 'en';

/**
 * Supported languages
 */
export const SUPPORTED_LANGUAGES = Object.keys(translations);

/**
 * Get translation for a specific key
 * @param {string} lang - Language code
 * @param {string} key - Translation key (supports dot notation)
 * @param {string} fallback - Fallback text if translation not found
 * @returns {string} Translated text
 */
export const getTranslation = (lang, key, fallback = '') => {
  const keys = key.split('.');
  let translation = translations[lang];

  for (const keySegment of keys) {
    if (translation && typeof translation === 'object' && keySegment in translation) {
      translation = translation[keySegment];
    } else {
      return fallback || key;
    }
  }

  return translation || fallback || key;
};

/**
 * Check if a language is supported
 * @param {string} lang - Language code to check
 * @returns {boolean} True if language is supported
 */
export const isLanguageSupported = lang => SUPPORTED_LANGUAGES.includes(lang);

/**
 * Get browser's preferred language
 * @returns {string} Language code
 */
export const getBrowserLanguage = () => {
  const browserLang = navigator.language || navigator.userLanguage;
  const primaryLang = browserLang.split('-')[0];

  return isLanguageSupported(primaryLang) ? primaryLang : DEFAULT_LANGUAGE;
};

/**
 * Format string with placeholders
 * @param {string} str - String with placeholders like {name}
 * @param {Object} params - Parameters to replace
 * @returns {string} Formatted string
 */
export const formatString = (str, params = {}) => str.replace(/{(\w+)}/g, (match, key) => params[key] !== undefined ? params[key] : match);

/**
 * Export everything from component-specific translations
 */
export { codePlaygroundTranslations } from './components/code-playground.js';
export { fileExplorerTranslations } from './components/file-explorer.js';
export { seoAnalyzerTranslations } from './components/seo-analyzer.js';

// Export default
export default translations;