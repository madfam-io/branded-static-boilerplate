/**
 * Debug Utility
 * =============
 * 
 * Provides debug logging that is automatically disabled in production builds.
 * This helps maintain clean console output while allowing development debugging.
 */

const isDevelopment = process.env.NODE_ENV === 'development' || 
                     window.location.hostname === 'localhost' ||
                     window.location.hostname === '127.0.0.1';

export const debug = {
  log: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  
  info: (...args) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
  
  warn: (...args) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  
  error: (...args) => {
    // Always log errors, even in production
    console.error(...args);
  },
  
  table: (...args) => {
    if (isDevelopment) {
      console.table(...args);
    }
  },
  
  time: (label) => {
    if (isDevelopment) {
      console.time(label);
    }
  },
  
  timeEnd: (label) => {
    if (isDevelopment) {
      console.timeEnd(label);
    }
  }
};

export default debug;