/**
 * Achievement UI Styles
 * ====================
 *
 * CSS styles for the achievement system UI components
 */

// Style constants
const STYLE_CONSTANTS = {
  TOGGLE_BUTTON_SIZE: 60,
  TOGGLE_BUTTON_SMALL: 50
};

/**
 * Get toggle button styles
 * @returns {string} CSS for toggle button
 */
const getToggleStyles = () => `
    .achievement-toggle {
      position: fixed;
      top: 50%;
      right: 20px;
      background: var(--bsb-primary);
      color: white;
      border: none;
      border-radius: 50%;
      width: ${STYLE_CONSTANTS.TOGGLE_BUTTON_SIZE}px;
      height: ${STYLE_CONSTANTS.TOGGLE_BUTTON_SIZE}px;
      cursor: pointer;
      box-shadow: var(--bsb-shadow-lg);
      z-index: var(--bsb-z-40);
      transition: all var(--bsb-transition-base);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }

    .achievement-toggle:hover {
      transform: scale(1.1);
      box-shadow: var(--bsb-shadow-xl);
    }

    .achievement-count {
      font-size: 0.75rem;
      background: var(--bsb-error);
      border-radius: 10px;
      padding: 2px 6px;
      position: absolute;
      top: -5px;
      right: -5px;
      min-width: 20px;
      text-align: center;
    }`;

/**
 * Get panel container styles
 * @returns {string} CSS for panel container
 */
const getPanelContainerStyles = () => `
    .achievement-panel {
      position: fixed;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
      background: var(--bsb-bg-primary);
      border: 1px solid var(--bsb-border-color);
      border-radius: var(--bsb-radius-lg);
      box-shadow: var(--bsb-shadow-xl);
      width: 400px;
      max-height: 80vh;
      overflow-y: auto;
      z-index: var(--bsb-z-50);
      animation: slideIn 0.3s ease-out;
    }

    .achievement-panel.hidden {
      display: none;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-50%) translateX(100px);
      }
      to {
        opacity: 1;
        transform: translateY(-50%) translateX(0);
      }
    }`;

/**
 * Get panel header styles
 * @returns {string} CSS for panel header
 */
const getPanelHeaderStyles = () => `
    .achievement-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid var(--bsb-border-color);
    }

    .achievement-header h2 {
      margin: 0;
      color: var(--bsb-text-primary);
    }

    #close-achievements {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: var(--bsb-text-secondary);
      border-radius: var(--bsb-radius-sm);
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #close-achievements:hover {
      background: var(--bsb-bg-hover);
      color: var(--bsb-text-primary);
    }`;

/**
 * Get panel styles
 * @returns {string} CSS for panel
 */
const getPanelStyles = () => [
  getPanelContainerStyles(),
  getPanelHeaderStyles()
].join('\n');

/**
 * Get stats and categories styles
 * @returns {string} CSS for stats and categories
 */
const getStatsAndCategoriesStyles = () => `
    .achievement-stats {
      display: flex;
      justify-content: space-around;
      padding: 20px;
      background: var(--bsb-bg-secondary);
    }

    .stat {
      text-align: center;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--bsb-primary);
    }

    .stat-label {
      font-size: 0.875rem;
      color: var(--bsb-text-secondary);
    }

    .achievement-categories {
      display: flex;
      padding: 15px 20px;
      gap: 10px;
      border-bottom: 1px solid var(--bsb-border-color);
    }

    .category-filter {
      background: var(--bsb-bg-secondary);
      border: 1px solid var(--bsb-border-color);
      border-radius: var(--bsb-radius-md);
      padding: 5px 12px;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all var(--bsb-transition-base);
    }

    .category-filter:hover,
    .category-filter.active {
      background: var(--bsb-primary);
      color: white;
      border-color: var(--bsb-primary);
    }`;

/**
 * Get achievement item styles
 * @returns {string} CSS for achievement items
 */
const getAchievementItemStyles = () => `
    .achievement-list {
      padding: 20px;
    }

    .achievement-item {
      display: flex;
      align-items: center;
      padding: 15px;
      margin: 10px 0;
      border-radius: var(--bsb-radius-md);
      border: 1px solid var(--bsb-border-color);
      transition: all var(--bsb-transition-base);
    }

    .achievement-item.unlocked {
      background: var(--bsb-bg-secondary);
      border-color: var(--bsb-success);
    }

    .achievement-item.locked {
      opacity: 0.6;
      background: var(--bsb-bg-tertiary);
    }

    .achievement-item .achievement-icon {
      font-size: 2rem;
      margin-right: 15px;
    }

    .achievement-info {
      flex: 1;
    }

    .achievement-title {
      margin: 0 0 5px 0;
      font-size: 1rem;
      font-weight: bold;
      color: var(--bsb-text-primary);
    }

    .achievement-description {
      margin: 0 0 5px 0;
      font-size: 0.875rem;
      color: var(--bsb-text-secondary);
    }

    .achievement-points {
      font-size: 0.75rem;
      color: var(--bsb-primary);
      font-weight: bold;
    }

    .achievement-badge {
      font-size: 1.25rem;
      margin-left: 10px;
    }`;

/**
 * Get notification styles
 * @returns {string} CSS for notifications
 */
const getNotificationStyles = () => `
    .achievement-notification {
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--bsb-success);
      color: white;
      padding: 15px 20px;
      border-radius: var(--bsb-radius-lg);
      box-shadow: var(--bsb-shadow-lg);
      z-index: var(--bsb-z-modal);
      animation: achievementPop 0.5s ease-out;
      max-width: 300px;
    }

    .achievement-notification.hidden {
      display: none;
    }

    @keyframes achievementPop {
      0% {
        opacity: 0;
        transform: translateX(100px) scale(0.8);
      }
      70% {
        transform: translateX(-10px) scale(1.05);
      }
      100% {
        opacity: 1;
        transform: translateX(0) scale(1);
      }
    }

    .achievement-notification-content {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .achievement-notification-icon {
      font-size: 2rem;
    }

    .achievement-notification-text h4 {
      margin: 0 0 5px 0;
    }

    .achievement-notification-text p {
      margin: 0;
      font-size: 0.875rem;
    }`;

/**
 * Generate achievement system CSS styles
 * @returns {string} Complete CSS for achievement system
 */
export const getAchievementStyles = () => `
  <style>
${getToggleStyles()}
${getPanelStyles()}
${getStatsAndCategoriesStyles()}
${getAchievementItemStyles()}
${getNotificationStyles()}

    @media (max-width: 768px) {
      .achievement-panel {
        width: calc(100vw - 40px);
        right: 20px;
      }

      .achievement-toggle {
        right: 15px;
        width: ${STYLE_CONSTANTS.TOGGLE_BUTTON_SMALL}px;
        height: ${STYLE_CONSTANTS.TOGGLE_BUTTON_SMALL}px;
        font-size: 1.25rem;
      }
    }
  </style>
`;

/**
 * Inject achievement styles into document head
 */
export const injectAchievementStyles = () => {
  if (!document.querySelector('#achievement-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'achievement-styles';
    styleElement.innerHTML = getAchievementStyles();
    document.head.appendChild(styleElement);
  }
};