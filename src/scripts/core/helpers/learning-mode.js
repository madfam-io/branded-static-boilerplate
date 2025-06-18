/**
 * Learning Mode Controls
 * ======================
 *
 * Global functions for enabling/disabling learning mode
 */

// Constants for notifications
const NOTIFICATION_CONSTANTS = {
  AUTO_REMOVE_TIMEOUT: 3000
};

/**
 * Enable learning mode for educational tooltips
 * @function enableLearningMode
 * @global
 * @returns {void}
 */
export const enableLearningMode = () => {
  localStorage.setItem('bsb-dev-mode', 'true');

  // Show a notification
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--bsb-primary);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: var(--bsb-radius-base);
    z-index: 1000;
    font-size: var(--bsb-text-sm);
    box-shadow: var(--bsb-shadow-lg);
  `;
  notification.textContent = '🎓 Learning mode enabled! Refresh to see interactive tooltips.';

  document.body.appendChild(notification);

  // Auto-remove notification
  setTimeout(() => {
    notification.remove();
  }, NOTIFICATION_CONSTANTS.AUTO_REMOVE_TIMEOUT);
};

/**
 * Disable learning mode and clean up features
 * @function disableLearningMode
 * @global
 * @returns {void}
 */
export const disableLearningMode = () => {
  localStorage.setItem('bsb-dev-mode', 'false');

  // Hide development features if BSBHelper is active
  if (window.BSBHelper && window.BSBHelper.disable) {
    window.BSBHelper.disable();
  }

  // Show a notification
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--bsb-gray-600);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: var(--bsb-radius-base);
    z-index: 1000;
    font-size: var(--bsb-text-sm);
    box-shadow: var(--bsb-shadow-lg);
  `;
  notification.textContent = '📖 Learning mode disabled. Refresh to return to normal mode.';

  document.body.appendChild(notification);

  // Auto-remove notification
  setTimeout(() => {
    notification.remove();
  }, NOTIFICATION_CONSTANTS.AUTO_REMOVE_TIMEOUT);
};

/**
 * Disable development features
 * @param {Map} components - Components map
 * @returns {void}
 */
export const disableDevFeatures = (components) => {
  // Hide development panel
  const devPanel = document.querySelector('.bsb-dev-panel');
  if (devPanel) {
    devPanel.style.display = 'none';
  }

  // Hide component helpers
  const helpers = document.querySelectorAll('.bsb-helper-btn');
  helpers.forEach(helper => {
    helper.style.display = 'none';
  });

  // Hide grid overlay
  const gridOverlay = document.querySelector('.bsb-grid-overlay');
  if (gridOverlay) {
    gridOverlay.style.display = 'none';
  }

  // Remove development mode styles
  const devStyles = document.querySelector('#bsb-dev-styles');
  if (devStyles) {
    devStyles.remove();
  }
};