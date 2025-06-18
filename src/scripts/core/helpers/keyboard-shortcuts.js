/**
 * Keyboard Shortcuts Handler
 * ===========================
 *
 * Manages keyboard shortcuts for development tools
 */

/**
 * Setup keyboard shortcuts
 * @param {boolean} devMode - Whether dev mode is enabled
 * @param {Object} actions - Action handlers
 * @returns {void}
 */
export const setupKeyboardShortcuts = (devMode, actions) => {
  const keydownHandler = event => {
    // Only in dev mode
    if (!devMode) {
      return;
    }

    // Ctrl/Cmd + key combinations
    if (event.ctrlKey || event.metaKey) {
      switch (event.key.toLowerCase()) {
        case 'g':
          event.preventDefault();
          actions.toggleGrid();
          break;
        case 'h':
          event.preventDefault();
          actions.toggleHelpers();
          break;
        case 'i':
          event.preventDefault();
          actions.toggleInspectMode();
          break;
        case 'd':
          event.preventDefault();
          actions.toggleDevPanel();
          break;
        default:
          break;
      }
    }
  };

  document.addEventListener('keydown', keydownHandler);
  return keydownHandler;
};