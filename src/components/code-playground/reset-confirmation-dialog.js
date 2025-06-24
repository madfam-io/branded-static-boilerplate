/**
 * Reset Confirmation Dialog
 * =========================
 *
 * Handles the reset confirmation dialog for code playground
 */

/**
 * Get dialog HTML structure
 * @returns {string} Dialog HTML
 */
const getDialogHTML = () => `
    <div class="bsb-code-playground__confirm-backdrop"></div>
    <div class="bsb-code-playground__confirm-content">
      <h3>Reset Code</h3>
      <p>Are you sure you want to reset all code? This cannot be undone.</p>
      <div class="bsb-code-playground__confirm-actions">
        <button type="button" class="bsb-code-playground__confirm-cancel">Cancel</button>
        <button type="button" class="bsb-code-playground__confirm-reset">Reset Code</button>
      </div>
    </div>
  `;

/**
 * Get dialog container styles
 * @returns {string} CSS styles for dialog container
 */
const getDialogContainerStyles = () => `
    .bsb-code-playground__confirm-dialog {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .bsb-code-playground__confirm-backdrop {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
    }
  `;

/**
 * Get dialog content styles
 * @returns {string} CSS styles for dialog content
 */
const getDialogContentStyles = () => `
    .bsb-code-playground__confirm-content {
      position: relative;
      background: var(--bsb-bg-primary, white);
      border-radius: 8px;
      padding: 24px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      max-width: 400px;
      width: 90%;
    }

    .bsb-code-playground__confirm-content h3 {
      margin: 0 0 12px 0;
      font-size: 1.25rem;
      color: var(--bsb-text-primary, #333);
    }

    .bsb-code-playground__confirm-content p {
      margin: 0 0 20px 0;
      color: var(--bsb-text-secondary, #666);
      line-height: 1.5;
    }
`;

/**
 * Get dialog button styles
 * @returns {string} CSS styles for dialog buttons
 */
const getDialogButtonStyles = () => `
    .bsb-code-playground__confirm-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .bsb-code-playground__confirm-cancel,
    .bsb-code-playground__confirm-reset {
      padding: 8px 16px;
      border: 1px solid;
      border-radius: 4px;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .bsb-code-playground__confirm-cancel {
      background: transparent;
      border-color: var(--bsb-border-color, #ccc);
      color: var(--bsb-text-secondary, #666);
    }

    .bsb-code-playground__confirm-cancel:hover {
      background: var(--bsb-bg-secondary, #f5f5f5);
    }

    .bsb-code-playground__confirm-reset {
      background: var(--bsb-error, #dc3545);
      border-color: var(--bsb-error, #dc3545);
      color: white;
    }

    .bsb-code-playground__confirm-reset:hover {
      background: #c82333;
      border-color: #c82333;
    }
`;

/**
 * Get all dialog styles
 * @returns {string} Combined CSS styles for dialog
 */
const getDialogStyles = () =>
  getDialogContainerStyles() +
  getDialogContentStyles() +
  getDialogButtonStyles();

/**
 * Inject dialog styles if not already present
 * @returns {void}
 */
const injectStyles = () => {
  if (!document.querySelector('#bsb-confirm-dialog-styles')) {
    const styles = document.createElement('style');
    styles.id = 'bsb-confirm-dialog-styles';
    styles.textContent = getDialogStyles();
    document.head.appendChild(styles);
  }
};

/**
 * Create and setup dialog element
 * @returns {HTMLElement} Dialog element
 */
const createDialogElement = () => {
  const confirmDialog = document.createElement('div');
  confirmDialog.className = 'bsb-code-playground__confirm-dialog';
  confirmDialog.innerHTML = getDialogHTML();
  return confirmDialog;
};

/**
 * Setup dialog event handlers
 * @param {Object} elements - Dialog elements
 * @param {Function} closeDialog - Close dialog function
 * @param {Function} onConfirm - Confirm callback
 * @returns {Function} Escape handler function
 */
const setupEventHandlers = (elements, closeDialog, onConfirm) => {
  const { cancelBtn, resetBtn, backdrop } = elements;

  // Escape key handler
  const escapeHandler = event => {
    if (event.key === 'Escape') {
      closeDialog();
    }
  };

  // Add event listeners
  cancelBtn.addEventListener('click', closeDialog);
  backdrop.addEventListener('click', closeDialog);
  document.addEventListener('keydown', escapeHandler);

  resetBtn.addEventListener('click', () => {
    closeDialog();
    onConfirm();
  });

  return escapeHandler;
};

/**
 * Show reset confirmation dialog
 * @param {Function} onConfirm - Callback when reset is confirmed
 * @returns {void}
 */
export const showResetConfirmation = onConfirm => {
  // Create dialog
  const confirmDialog = createDialogElement();
  document.body.appendChild(confirmDialog);

  // Add styles
  injectStyles();

  // Get elements
  const elements = {
    cancelBtn: confirmDialog.querySelector('.bsb-code-playground__confirm-cancel'),
    resetBtn: confirmDialog.querySelector('.bsb-code-playground__confirm-reset'),
    backdrop: confirmDialog.querySelector('.bsb-code-playground__confirm-backdrop')
  };

  // Initialize handler variable
  let escapeHandler = null;

  // Close dialog function
  const closeDialog = () => {
    if (confirmDialog.parentNode) {
      document.body.removeChild(confirmDialog);
    }
    if (escapeHandler) {
      document.removeEventListener('keydown', escapeHandler);
    }
  };

  // Setup event handlers
  escapeHandler = setupEventHandlers(elements, closeDialog, onConfirm);
};