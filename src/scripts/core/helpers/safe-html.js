/**
 * Safe HTML Utilities
 * ===================
 *
 * Utilities for safely creating and manipulating HTML content
 * to prevent XSS vulnerabilities.
 */

/**
 * Escape HTML special characters
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
export const escapeHtml = str => {
  if (typeof str !== 'string') {
    return String(str);
  }

  const htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;'
  };

  return str.replace(/[&<>"'/]/gu, match => htmlEscapes[match]);
};

/**
 * Create a DOM element safely from HTML string
 * @param {string} html - HTML string
 * @returns {HTMLElement} Created element
 */
export const createElementFromHTML = html => {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstElementChild;
};

/**
 * Safely set text content
 * @param {HTMLElement} element - Target element
 * @param {string} text - Text content
 */
export const setSafeText = (element, text) => {
  if (element && typeof text !== 'undefined') {
    element.textContent = String(text);
  }
};

/**
 * Safely set HTML content with data binding
 * @param {HTMLElement} element - Target element
 * @param {string} template - HTML template
 * @param {Object} data - Data to bind
 */
export const setSafeHTML = (element, template, data = {}) => {
  if (!element || !template) {
    return;
  }

  // Replace placeholders with escaped data
  const safeHTML = template.replace(/\{\{(?<key>\w+)\}\}/gu, (match, key) =>
    escapeHtml(data[key] || ''));

  element.innerHTML = safeHTML;
};

/**
 * Create safe template literal tag
 * @param {Array} strings - Template strings
 * @param {...any} values - Template values
 * @returns {string} Safe HTML string
 */
export const safeHTML = (strings, ...values) => {
  let [result] = strings;

  for (let index = 0; index < values.length; index++) {
    result += escapeHtml(values[index]) + strings[index + 1];
  }

  return result;
};

/**
 * Sanitize HTML string (requires DOMPurify or similar)
 * This is a placeholder - in production, use a library like DOMPurify
 * @param {string} html - HTML to sanitize
 * @returns {string} Sanitized HTML
 */
export const sanitizeHTML = html => {
  // For now, we'll use a basic approach
  // In production, use DOMPurify.sanitize(html)
  const temp = document.createElement('div');
  temp.textContent = html;
  return temp.innerHTML;
};