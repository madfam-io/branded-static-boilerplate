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
    <h3>Reset Tutorial Progress</h3>
    <p>Are you sure you want to reset all tutorial progress? This action cannot be undone.</p>
    <div class="tutorial-hub__confirm-actions">
      <button type="button" class="tutorial-hub__confirm-cancel">Cancel</button>
      <button type="button" class="tutorial-hub__confirm-reset">Reset Progress</button>
    </div>
  </div>
`;

/**
 * Get dialog container styles
 * @returns {string} CSS styles for dialog container
 */
const getDialogStyles = () => `
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
`;

/**
 * Get dialog content styles
 * @returns {string} CSS styles for dialog content
 */
const getContentStyles = () => `
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
`;

/**
 * Get button styles
 * @returns {string} CSS styles for buttons
 */
const getButtonStyles = () => `
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
 * Get confirmation dialog styles
 * @returns {string} CSS styles for the dialog
 */
const getConfirmationStyles = () => [
  getDialogStyles(),
  getContentStyles(),
  getButtonStyles()
].join('\n');

/**
 * Inject confirmation styles if not already present
 */
const injectConfirmationStyles = () => {
  if (!document.querySelector('#tutorial-hub-confirm-styles')) {
    const styles = document.createElement('style');
    styles.id = 'tutorial-hub-confirm-styles';
    styles.textContent = getConfirmationStyles();

    // Handle missing document.head
    if (!document.head) {
      console.error('document.head is not available');
      return;
    }

    try {
      document.head.appendChild(styles);
    } catch (error) {
      console.error('Failed to inject confirmation styles:', error);
    }
  }
};

/**
 * Create and setup dialog element
 * @returns {HTMLElement} Dialog element
 */
const createDialogElement = () => {
  const confirmDialog = document.createElement('div');
  confirmDialog.className = 'tutorial-hub__confirm-dialog';
  confirmDialog.innerHTML = getConfirmationHTML();
  return confirmDialog;
};

/**
 * Setup dialog event handlers
 * @param {Object} elements - Dialog elements
 * @param {Function} closeDialog - Close dialog function
 * @param {Function} onConfirm - Confirm callback
 * @param {Function} onCancel - Cancel callback
 */
const setupEventHandlers = (elements, closeDialog, onConfirm, onCancel) => {
  const { cancelBtn, resetBtn, backdrop } = elements;

  // Escape key handler
  const escapeHandler = event => {
    try {
      if (event.key === 'Escape') {
        closeDialog();
        if (onCancel) {
          try {
            onCancel();
          } catch (error) {
            console.error('Error in onCancel callback:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error in escape key handler:', error);
    }
  };

  // Event handlers
  const handleCancel = () => {
    closeDialog();
    if (onCancel) {
      onCancel();
    }
  };

  const handleConfirm = () => {
    closeDialog();
    try {
      onConfirm();
    } catch (error) {
      console.error('Error in onConfirm callback:', error);
    }
  };

  // Add event listeners
  cancelBtn.addEventListener('click', handleCancel);
  resetBtn.addEventListener('click', handleConfirm);
  backdrop.addEventListener('click', handleCancel);
  document.addEventListener('keydown', escapeHandler);

  return escapeHandler;
};

/**
 * Show reset confirmation dialog
 * @param {Function} onConfirm - Callback when reset is confirmed
 * @param {Function} onCancel - Optional callback when cancelled
 * @returns {void}
 */
export const showResetConfirmation = (onConfirm, onCancel = null) => {
  try {
    // Inject styles
    injectConfirmationStyles();

    // Create dialog
    const confirmDialog = createDialogElement();

    // Try to append dialog with error handling
    try {
      document.body.appendChild(confirmDialog);
    } catch (domError) {
      console.error('Failed to append dialog to DOM:', domError);
      return;
    }

    // Get elements
    const elements = {
      cancelBtn: confirmDialog.querySelector('.tutorial-hub__confirm-cancel'),
      resetBtn: confirmDialog.querySelector('.tutorial-hub__confirm-reset'),
      backdrop: confirmDialog.querySelector('.tutorial-hub__confirm-backdrop')
    };

    // Initialize handler variable
    let escapeHandler = null;

    // Close dialog function
    const closeDialog = () => {
      try {
        if (confirmDialog.parentNode) {
          document.body.removeChild(confirmDialog);
        }
        if (escapeHandler) {
          document.removeEventListener('keydown', escapeHandler);
        }
      } catch (error) {
        console.error('Error closing dialog:', error);
      }
    };

    // Setup event handlers
    escapeHandler = setupEventHandlers(elements, closeDialog, onConfirm, onCancel);
  } catch (error) {
    console.error('Error in showResetConfirmation:', error);
  }
};