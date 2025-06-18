/**
 * Tutorial Hub Reset Confirmation Dialog
 * =====================================
 *
 * Handles the reset confirmation dialog for tutorial progress
 */

/**
 * Get confirmation dialog HTML
 * @returns {string} Dialog HTML structure
 */
const getConfirmationHTML = () => `
  <div class="tutorial-hub__confirm-backdrop"></div>
  <div class="tutorial-hub__confirm-content">
    <h3>Reset Learning Progress</h3>
    <p>Are you sure you want to reset all learning progress? This cannot be undone.</p>
    <div class="tutorial-hub__confirm-actions">
      <button class="tutorial-hub__confirm-cancel">Cancel</button>
      <button class="tutorial-hub__confirm-reset">Reset Progress</button>
    </div>
  </div>
`;

/**
 * Get confirmation dialog styles
 * @returns {string} CSS styles for the dialog
 */
const getConfirmationStyles = () => `
  .tutorial-hub__confirm-dialog {
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

  .tutorial-hub__confirm-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }

  .tutorial-hub__confirm-content {
    position: relative;
    background: var(--bsb-bg-primary, white);
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    max-width: 400px;
    width: 90%;
  }

  .tutorial-hub__confirm-content h3 {
    margin: 0 0 12px 0;
    font-size: 1.25rem;
    color: var(--bsb-text-primary, #333);
  }

  .tutorial-hub__confirm-content p {
    margin: 0 0 20px 0;
    color: var(--bsb-text-secondary, #666);
    line-height: 1.5;
  }

  .tutorial-hub__confirm-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
  }

  .tutorial-hub__confirm-cancel,
  .tutorial-hub__confirm-reset {
    padding: 8px 16px;
    border: 1px solid;
    border-radius: 4px;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .tutorial-hub__confirm-cancel {
    background: transparent;
    border-color: var(--bsb-border-color, #ccc);
    color: var(--bsb-text-secondary, #666);
  }

  .tutorial-hub__confirm-cancel:hover {
    background: var(--bsb-bg-secondary, #f5f5f5);
  }

  .tutorial-hub__confirm-reset {
    background: var(--bsb-error, #dc3545);
    border-color: var(--bsb-error, #dc3545);
    color: white;
  }

  .tutorial-hub__confirm-reset:hover {
    background: #c82333;
    border-color: #c82333;
  }
`;

/**
 * Inject confirmation styles if not already present
 */
const injectConfirmationStyles = () => {
  if (!document.querySelector('#tutorial-hub-confirm-styles')) {
    const styles = document.createElement('style');
    styles.id = 'tutorial-hub-confirm-styles';
    styles.textContent = getConfirmationStyles();
    document.head.appendChild(styles);
  }
};

/**
 * Show reset confirmation dialog
 * @param {Function} onConfirm - Callback when reset is confirmed
 * @param {Function} onCancel - Optional callback when cancelled
 * @returns {void}
 */
export const showResetConfirmation = (onConfirm, onCancel = null) => {
  // Inject styles
  injectConfirmationStyles();

  // Create dialog
  const confirmDialog = document.createElement('div');
  confirmDialog.className = 'tutorial-hub__confirm-dialog';
  confirmDialog.innerHTML = getConfirmationHTML();

  // Add to document
  document.body.appendChild(confirmDialog);

  // Get elements
  const cancelBtn = confirmDialog.querySelector('.tutorial-hub__confirm-cancel');
  const resetBtn = confirmDialog.querySelector('.tutorial-hub__confirm-reset');
  const backdrop = confirmDialog.querySelector('.tutorial-hub__confirm-backdrop');

  // Close dialog function
  const closeDialog = () => {
    if (confirmDialog.parentNode) {
      document.body.removeChild(confirmDialog);
    }
    document.removeEventListener('keydown', escapeHandler);
  };

  // Escape key handler
  function escapeHandler(event) {
    if (event.key === 'Escape') {
      closeDialog();
      if (onCancel) {onCancel();}
    }
  }

  // Event handlers
  const handleCancel = () => {
    closeDialog();
    if (onCancel) {onCancel();}
  };

  const handleConfirm = () => {
    closeDialog();
    onConfirm();
  };

  // Add event listeners
  cancelBtn.addEventListener('click', handleCancel);
  resetBtn.addEventListener('click', handleConfirm);
  backdrop.addEventListener('click', handleCancel);
  document.addEventListener('keydown', escapeHandler);
};