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
        <button class="bsb-code-playground__confirm-cancel">Cancel</button>
        <button class="bsb-code-playground__confirm-reset">Reset Code</button>
      </div>
    </div>
  `;

/**
 * Get dialog styles
 * @returns {string} CSS styles for dialog
 */
const getDialogStyles = () => `
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
 * Inject dialog styles if not already present
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
 * Show reset confirmation dialog
 * @param {Function} onConfirm - Callback when reset is confirmed
 * @returns {void}
 */
export const showResetConfirmation = onConfirm => {
  // Create dialog element
  const confirmDialog = document.createElement('div');
  confirmDialog.className = 'bsb-code-playground__confirm-dialog';
  confirmDialog.innerHTML = getDialogHTML();

  // Add to document
  document.body.appendChild(confirmDialog);

  // Add styles
  injectStyles();

  // Get elements
  const cancelBtn = confirmDialog.querySelector('.bsb-code-playground__confirm-cancel');
  const resetBtn = confirmDialog.querySelector('.bsb-code-playground__confirm-reset');
  const backdrop = confirmDialog.querySelector('.bsb-code-playground__confirm-backdrop');

  // Declare handler variable first to avoid circular dependency
  let escapeHandler;

  // Close dialog function
  const closeDialog = () => {
    document.body.removeChild(confirmDialog);
    if (escapeHandler) document.removeEventListener('keydown', escapeHandler);
  };

  // Escape key handler
  escapeHandler = (event) => {
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
};