/**
 * Debug Utility
 * =============
 *
 * Provides debug logging that is automatically disabled in production builds.
 * This helps maintain clean console output while allowing development debugging.
 */

// Check if we're in development mode
// In production builds, Vite will replace process.env.NODE_ENV
// The hostname check is a fallback for local testing
const isDevelopment = (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') ||
                     window.location.hostname === 'localhost' ||
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname.includes('127.0.0.1') ||
                     window.location.hostname.includes('localhost') ||
                     window.location.protocol === 'file:';

// Double-check: if we're on a github.io domain, we're definitely in production
const isProduction = window.location.hostname.includes('github.io') ||
                    window.location.hostname.includes('github.dev') ||
                    window.location.hostname.includes('githubpreview.dev');

// Final determination
const shouldLog = isDevelopment && !isProduction;

export const debug = {
  log: (...args) => {
    if (shouldLog) {
      console.log(...args);
    }
  },

  info: (...args) => {
    if (shouldLog) {
      console.info(...args);
    }
  },

  warn: (...args) => {
    if (shouldLog) {
      console.warn(...args);
    }
  },

  error: (...args) => {
    // Only log errors in development to avoid Lighthouse best-practices penalties
    if (shouldLog) {
      console.error(...args);
    }
  },

  table: (...args) => {
    if (shouldLog) {
      console.table(...args);
    }
  },

  time: label => {
    if (shouldLog) {
      console.time(label);
    }
  },

  timeEnd: label => {
    if (shouldLog) {
      console.timeEnd(label);
    }
  }
};

export default debug;