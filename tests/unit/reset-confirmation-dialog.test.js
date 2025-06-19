/**
 * Reset Confirmation Dialog Tests
 * ===============================
 * 
 * Tests for the code playground reset confirmation dialog
 */

import { showResetConfirmation } from '../../src/components/code-playground/reset-confirmation-dialog.js';

describe('Reset Confirmation Dialog', () => {
  beforeEach(() => {
    // Clear document
    document.body.innerHTML = '';
    document.head.innerHTML = '';
    
    // Clear any existing event listeners
    document.removeEventListener('keydown', jest.fn());
  });

  afterEach(() => {
    // Clean up any dialogs that might be left
    const dialogs = document.querySelectorAll('.bsb-code-playground__confirm-dialog');
    dialogs.forEach(dialog => {
      if (dialog.parentNode) {
        dialog.parentNode.removeChild(dialog);
      }
    });
  });

  describe('showResetConfirmation', () => {
    test('should create and display dialog', () => {
      const onConfirm = jest.fn();
      showResetConfirmation(onConfirm);

      const dialog = document.querySelector('.bsb-code-playground__confirm-dialog');
      expect(dialog).toBeTruthy();
      expect(dialog.parentNode).toBe(document.body);
    });

    test('should inject styles into document head', () => {
      const onConfirm = jest.fn();
      showResetConfirmation(onConfirm);

      const styles = document.querySelector('#bsb-confirm-dialog-styles');
      expect(styles).toBeTruthy();
      expect(styles.tagName).toBe('STYLE');
    });

    test('should not inject styles twice', () => {
      const onConfirm = jest.fn();
      showResetConfirmation(onConfirm);
      showResetConfirmation(onConfirm);

      const styles = document.querySelectorAll('#bsb-confirm-dialog-styles');
      expect(styles.length).toBe(1);
    });

    test('should contain correct dialog elements', () => {
      const onConfirm = jest.fn();
      showResetConfirmation(onConfirm);

      const dialog = document.querySelector('.bsb-code-playground__confirm-dialog');
      const backdrop = dialog.querySelector('.bsb-code-playground__confirm-backdrop');
      const content = dialog.querySelector('.bsb-code-playground__confirm-content');
      const title = dialog.querySelector('h3');
      const message = dialog.querySelector('p');
      const cancelBtn = dialog.querySelector('.bsb-code-playground__confirm-cancel');
      const resetBtn = dialog.querySelector('.bsb-code-playground__confirm-reset');

      expect(backdrop).toBeTruthy();
      expect(content).toBeTruthy();
      expect(title).toBeTruthy();
      expect(message).toBeTruthy();
      expect(cancelBtn).toBeTruthy();
      expect(resetBtn).toBeTruthy();

      expect(title.textContent).toBe('Reset Code');
      expect(message.textContent).toBe('Are you sure you want to reset all code? This cannot be undone.');
      expect(cancelBtn.textContent).toBe('Cancel');
      expect(resetBtn.textContent).toBe('Reset Code');
    });

    test('should call onConfirm when reset button is clicked', () => {
      const onConfirm = jest.fn();
      showResetConfirmation(onConfirm);

      const resetBtn = document.querySelector('.bsb-code-playground__confirm-reset');
      resetBtn.click();

      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    test('should close dialog when reset button is clicked', () => {
      const onConfirm = jest.fn();
      showResetConfirmation(onConfirm);

      const resetBtn = document.querySelector('.bsb-code-playground__confirm-reset');
      resetBtn.click();

      const dialog = document.querySelector('.bsb-code-playground__confirm-dialog');
      expect(dialog).toBeFalsy();
    });

    test('should close dialog when cancel button is clicked', () => {
      const onConfirm = jest.fn();
      showResetConfirmation(onConfirm);

      const cancelBtn = document.querySelector('.bsb-code-playground__confirm-cancel');
      cancelBtn.click();

      const dialog = document.querySelector('.bsb-code-playground__confirm-dialog');
      expect(dialog).toBeFalsy();
      expect(onConfirm).not.toHaveBeenCalled();
    });

    test('should close dialog when backdrop is clicked', () => {
      const onConfirm = jest.fn();
      showResetConfirmation(onConfirm);

      const backdrop = document.querySelector('.bsb-code-playground__confirm-backdrop');
      backdrop.click();

      const dialog = document.querySelector('.bsb-code-playground__confirm-dialog');
      expect(dialog).toBeFalsy();
      expect(onConfirm).not.toHaveBeenCalled();
    });

    test('should close dialog when Escape key is pressed', () => {
      const onConfirm = jest.fn();
      showResetConfirmation(onConfirm);

      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(escapeEvent);

      const dialog = document.querySelector('.bsb-code-playground__confirm-dialog');
      expect(dialog).toBeFalsy();
      expect(onConfirm).not.toHaveBeenCalled();
    });

    test('should not close dialog for other key presses', () => {
      const onConfirm = jest.fn();
      showResetConfirmation(onConfirm);

      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(enterEvent);

      const dialog = document.querySelector('.bsb-code-playground__confirm-dialog');
      expect(dialog).toBeTruthy();
    });

    test('should remove event listener when dialog is closed', () => {
      const onConfirm = jest.fn();
      showResetConfirmation(onConfirm);

      // Close dialog
      const cancelBtn = document.querySelector('.bsb-code-playground__confirm-cancel');
      cancelBtn.click();

      // Try to trigger escape - should not cause errors
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      expect(() => {
        document.dispatchEvent(escapeEvent);
      }).not.toThrow();
    });

    test('should handle multiple dialogs independently', () => {
      const onConfirm1 = jest.fn();
      const onConfirm2 = jest.fn();

      showResetConfirmation(onConfirm1);
      showResetConfirmation(onConfirm2);

      const dialogs = document.querySelectorAll('.bsb-code-playground__confirm-dialog');
      expect(dialogs.length).toBe(2);

      // Click reset on first dialog
      const firstResetBtn = dialogs[0].querySelector('.bsb-code-playground__confirm-reset');
      firstResetBtn.click();

      expect(onConfirm1).toHaveBeenCalledTimes(1);
      expect(onConfirm2).not.toHaveBeenCalled();

      // Second dialog should still exist
      const remainingDialogs = document.querySelectorAll('.bsb-code-playground__confirm-dialog');
      expect(remainingDialogs.length).toBe(1);
    });

    test('should handle null/undefined onConfirm gracefully', () => {
      expect(() => {
        showResetConfirmation(null);
      }).not.toThrow();

      expect(() => {
        showResetConfirmation(undefined);
      }).not.toThrow();

      const dialog = document.querySelector('.bsb-code-playground__confirm-dialog');
      expect(dialog).toBeTruthy();
    });

    test('should work with non-function onConfirm', () => {
      expect(() => {
        showResetConfirmation('not a function');
      }).not.toThrow();

      const dialog = document.querySelector('.bsb-code-playground__confirm-dialog');
      expect(dialog).toBeTruthy();
    });
  });

  describe('Dialog Styles', () => {
    test('should inject comprehensive CSS styles', () => {
      const onConfirm = jest.fn();
      showResetConfirmation(onConfirm);

      const styles = document.querySelector('#bsb-confirm-dialog-styles');
      const cssText = styles.textContent;

      // Check for key style classes
      expect(cssText).toContain('.bsb-code-playground__confirm-dialog');
      expect(cssText).toContain('.bsb-code-playground__confirm-backdrop');
      expect(cssText).toContain('.bsb-code-playground__confirm-content');
      expect(cssText).toContain('.bsb-code-playground__confirm-cancel');
      expect(cssText).toContain('.bsb-code-playground__confirm-reset');

      // Check for positioning styles
      expect(cssText).toContain('position: fixed');
      expect(cssText).toContain('z-index: 9999');

      // Check for interaction styles
      expect(cssText).toContain('cursor: pointer');
      expect(cssText).toContain('transition:');
    });

    test('should include hover states for buttons', () => {
      const onConfirm = jest.fn();
      showResetConfirmation(onConfirm);

      const styles = document.querySelector('#bsb-confirm-dialog-styles');
      const cssText = styles.textContent;

      expect(cssText).toContain(':hover');
      expect(cssText).toContain('background:');
    });

    test('should include proper layout styles', () => {
      const onConfirm = jest.fn();
      showResetConfirmation(onConfirm);

      const styles = document.querySelector('#bsb-confirm-dialog-styles');
      const cssText = styles.textContent;

      expect(cssText).toContain('display: flex');
      expect(cssText).toContain('align-items: center');
      expect(cssText).toContain('justify-content:');
    });
  });

  describe('HTML Structure', () => {
    test('should generate proper HTML structure', () => {
      const onConfirm = jest.fn();
      showResetConfirmation(onConfirm);

      const dialog = document.querySelector('.bsb-code-playground__confirm-dialog');
      const backdrop = dialog.querySelector('.bsb-code-playground__confirm-backdrop');
      const content = dialog.querySelector('.bsb-code-playground__confirm-content');
      const actions = content.querySelector('.bsb-code-playground__confirm-actions');

      expect(dialog.parentNode).toBe(document.body);
      expect(backdrop.parentNode).toBe(dialog);
      expect(content.parentNode).toBe(dialog);
      expect(actions.parentNode).toBe(content);
    });

    test('should have proper button structure', () => {
      const onConfirm = jest.fn();
      showResetConfirmation(onConfirm);

      const cancelBtn = document.querySelector('.bsb-code-playground__confirm-cancel');
      const resetBtn = document.querySelector('.bsb-code-playground__confirm-reset');

      expect(cancelBtn.tagName).toBe('BUTTON');
      expect(resetBtn.tagName).toBe('BUTTON');
      expect(cancelBtn.type).toBe('button');
      expect(resetBtn.type).toBe('button');
    });

    test('should have semantic HTML elements', () => {
      const onConfirm = jest.fn();
      showResetConfirmation(onConfirm);

      const title = document.querySelector('.bsb-code-playground__confirm-content h3');
      const message = document.querySelector('.bsb-code-playground__confirm-content p');

      expect(title.tagName).toBe('H3');
      expect(message.tagName).toBe('P');
    });
  });

  describe('Event Handling', () => {
    test('should properly setup and cleanup event listeners', () => {
      const onConfirm = jest.fn();
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

      showResetConfirmation(onConfirm);

      // Should add keydown listener
      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

      // Close dialog
      const cancelBtn = document.querySelector('.bsb-code-playground__confirm-cancel');
      cancelBtn.click();

      // Should remove keydown listener
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });

    test('should handle button click events correctly', () => {
      const onConfirm = jest.fn();
      showResetConfirmation(onConfirm);

      const cancelBtn = document.querySelector('.bsb-code-playground__confirm-cancel');
      const resetBtn = document.querySelector('.bsb-code-playground__confirm-reset');

      // Mock click events
      const cancelClickEvent = new MouseEvent('click', { bubbles: true });
      const resetClickEvent = new MouseEvent('click', { bubbles: true });

      cancelBtn.dispatchEvent(cancelClickEvent);
      expect(onConfirm).not.toHaveBeenCalled();

      // Create new dialog since first one was closed
      showResetConfirmation(onConfirm);
      const newResetBtn = document.querySelector('.bsb-code-playground__confirm-reset');
      newResetBtn.dispatchEvent(resetClickEvent);
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    test('should prevent event bubbling appropriately', () => {
      const onConfirm = jest.fn();
      showResetConfirmation(onConfirm);

      const content = document.querySelector('.bsb-code-playground__confirm-content');
      const backdrop = document.querySelector('.bsb-code-playground__confirm-backdrop');

      // Clicking content should not close dialog
      content.click();
      let dialog = document.querySelector('.bsb-code-playground__confirm-dialog');
      expect(dialog).toBeTruthy();

      // Clicking backdrop should close dialog
      backdrop.click();
      dialog = document.querySelector('.bsb-code-playground__confirm-dialog');
      expect(dialog).toBeFalsy();
    });
  });
});