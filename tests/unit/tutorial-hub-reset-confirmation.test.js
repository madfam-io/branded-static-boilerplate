/**
 * Tutorial Hub Reset Confirmation Tests
 * ====================================
 * 
 * Tests for the tutorial hub reset confirmation dialog functionality
 */

import { showResetConfirmation } from '../../src/scripts/components/tutorial-hub/reset-confirmation.js';

describe('Tutorial Hub Reset Confirmation', () => {
  beforeEach(() => {
    // Clear document
    document.body.innerHTML = '';
    document.head.innerHTML = '';
    
    // Clear any existing event listeners
    document.removeEventListener('keydown', jest.fn());
  });

  afterEach(() => {
    // Clean up any dialogs that might be left
    const dialogs = document.querySelectorAll('.bsb-tutorial-hub__confirm-dialog');
    dialogs.forEach(dialog => {
      if (dialog.parentNode) {
        dialog.parentNode.removeChild(dialog);
      }
    });
    
    // Clean up styles
    const styles = document.querySelectorAll('#bsb-tutorial-confirm-dialog-styles');
    styles.forEach(style => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    });
  });

  describe('showResetConfirmation', () => {
    test('should create and display dialog', () => {
      const onConfirm = jest.fn();
      showResetConfirmation(onConfirm);

      const dialog = document.querySelector('.bsb-tutorial-hub__confirm-dialog');
      expect(dialog).toBeTruthy();
      expect(dialog.parentNode).toBe(document.body);
    });

    test('should inject styles into document head', () => {
      const onConfirm = jest.fn();
      showResetConfirmation(onConfirm);

      const styles = document.querySelector('#bsb-tutorial-confirm-dialog-styles');
      expect(styles).toBeTruthy();
      expect(styles.tagName).toBe('STYLE');
    });

    test('should not inject styles twice', () => {
      const onConfirm = jest.fn();
      showResetConfirmation(onConfirm);
      showResetConfirmation(onConfirm);

      const styles = document.querySelectorAll('#bsb-tutorial-confirm-dialog-styles');
      expect(styles.length).toBe(1);
    });

    test('should contain correct dialog elements', () => {
      const onConfirm = jest.fn();
      showResetConfirmation(onConfirm);

      const dialog = document.querySelector('.bsb-tutorial-hub__confirm-dialog');
      const backdrop = dialog.querySelector('.bsb-tutorial-hub__confirm-backdrop');
      const content = dialog.querySelector('.bsb-tutorial-hub__confirm-content');
      const title = dialog.querySelector('h3');
      const message = dialog.querySelector('p');
      const cancelBtn = dialog.querySelector('.bsb-tutorial-hub__confirm-cancel');
      const resetBtn = dialog.querySelector('.bsb-tutorial-hub__confirm-reset');

      expect(backdrop).toBeTruthy();
      expect(content).toBeTruthy();
      expect(title).toBeTruthy();
      expect(message).toBeTruthy();
      expect(cancelBtn).toBeTruthy();
      expect(resetBtn).toBeTruthy();

      expect(title.textContent).toBe('Reset Tutorial Progress');
      expect(message.textContent).toBe('Are you sure you want to reset all tutorial progress? This action cannot be undone.');
      expect(cancelBtn.textContent).toBe('Cancel');
      expect(resetBtn.textContent).toBe('Reset Progress');
    });

    test('should call onConfirm when reset button is clicked', () => {
      const onConfirm = jest.fn();
      showResetConfirmation(onConfirm);

      const resetBtn = document.querySelector('.bsb-tutorial-hub__confirm-reset');
      resetBtn.click();

      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    test('should close dialog when reset button is clicked', () => {
      const onConfirm = jest.fn();
      showResetConfirmation(onConfirm);

      const resetBtn = document.querySelector('.bsb-tutorial-hub__confirm-reset');
      resetBtn.click();

      const dialog = document.querySelector('.bsb-tutorial-hub__confirm-dialog');
      expect(dialog).toBeFalsy();
    });

    test('should close dialog when cancel button is clicked', () => {
      const onConfirm = jest.fn();
      showResetConfirmation(onConfirm);

      const cancelBtn = document.querySelector('.bsb-tutorial-hub__confirm-cancel');
      cancelBtn.click();

      const dialog = document.querySelector('.bsb-tutorial-hub__confirm-dialog');
      expect(dialog).toBeFalsy();
      expect(onConfirm).not.toHaveBeenCalled();
    });

    test('should close dialog when backdrop is clicked', () => {
      const onConfirm = jest.fn();
      showResetConfirmation(onConfirm);

      const backdrop = document.querySelector('.bsb-tutorial-hub__confirm-backdrop');
      backdrop.click();

      const dialog = document.querySelector('.bsb-tutorial-hub__confirm-dialog');
      expect(dialog).toBeFalsy();
      expect(onConfirm).not.toHaveBeenCalled();
    });

    test('should close dialog when Escape key is pressed', () => {
      const onConfirm = jest.fn();
      showResetConfirmation(onConfirm);

      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(escapeEvent);

      const dialog = document.querySelector('.bsb-tutorial-hub__confirm-dialog');
      expect(dialog).toBeFalsy();
      expect(onConfirm).not.toHaveBeenCalled();
    });

    test('should not close dialog for other key presses', () => {
      const onConfirm = jest.fn();
      showResetConfirmation(onConfirm);

      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(enterEvent);

      const dialog = document.querySelector('.bsb-tutorial-hub__confirm-dialog');
      expect(dialog).toBeTruthy();
    });

    test('should remove event listener when dialog is closed', () => {
      const onConfirm = jest.fn();
      showResetConfirmation(onConfirm);

      // Close dialog
      const cancelBtn = document.querySelector('.bsb-tutorial-hub__confirm-cancel');
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

      const dialogs = document.querySelectorAll('.bsb-tutorial-hub__confirm-dialog');
      expect(dialogs.length).toBe(2);

      // Click reset on first dialog
      const firstResetBtn = dialogs[0].querySelector('.bsb-tutorial-hub__confirm-reset');
      firstResetBtn.click();

      expect(onConfirm1).toHaveBeenCalledTimes(1);
      expect(onConfirm2).not.toHaveBeenCalled();

      // Second dialog should still exist
      const remainingDialogs = document.querySelectorAll('.bsb-tutorial-hub__confirm-dialog');
      expect(remainingDialogs.length).toBe(1);
    });

    test('should handle null/undefined onConfirm gracefully', () => {
      expect(() => {
        showResetConfirmation(null);
      }).not.toThrow();

      expect(() => {
        showResetConfirmation(undefined);
      }).not.toThrow();

      const dialog = document.querySelector('.bsb-tutorial-hub__confirm-dialog');
      expect(dialog).toBeTruthy();
    });

    test('should work with non-function onConfirm', () => {
      expect(() => {
        showResetConfirmation('not a function');
      }).not.toThrow();

      const dialog = document.querySelector('.bsb-tutorial-hub__confirm-dialog');
      expect(dialog).toBeTruthy();
    });

    test('should handle clicking on content without closing', () => {
      const onConfirm = jest.fn();
      showResetConfirmation(onConfirm);

      const content = document.querySelector('.bsb-tutorial-hub__confirm-content');
      content.click();

      const dialog = document.querySelector('.bsb-tutorial-hub__confirm-dialog');
      expect(dialog).toBeTruthy();
      expect(onConfirm).not.toHaveBeenCalled();
    });
  });

  describe('Dialog Styles', () => {
    test('should inject comprehensive CSS styles', () => {
      const onConfirm = jest.fn();
      showResetConfirmation(onConfirm);

      const styles = document.querySelector('#bsb-tutorial-confirm-dialog-styles');
      const cssText = styles.textContent;

      // Check for key style classes
      expect(cssText).toContain('.bsb-tutorial-hub__confirm-dialog');
      expect(cssText).toContain('.bsb-tutorial-hub__confirm-backdrop');
      expect(cssText).toContain('.bsb-tutorial-hub__confirm-content');
      expect(cssText).toContain('.bsb-tutorial-hub__confirm-cancel');
      expect(cssText).toContain('.bsb-tutorial-hub__confirm-reset');

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

      const styles = document.querySelector('#bsb-tutorial-confirm-dialog-styles');
      const cssText = styles.textContent;

      expect(cssText).toContain(':hover');
      expect(cssText).toContain('background:');
    });

    test('should include proper layout styles', () => {
      const onConfirm = jest.fn();
      showResetConfirmation(onConfirm);

      const styles = document.querySelector('#bsb-tutorial-confirm-dialog-styles');
      const cssText = styles.textContent;

      expect(cssText).toContain('display: flex');
      expect(cssText).toContain('align-items: center');
      expect(cssText).toContain('justify-content:');
    });

    test('should include animation styles', () => {
      const onConfirm = jest.fn();
      showResetConfirmation(onConfirm);

      const styles = document.querySelector('#bsb-tutorial-confirm-dialog-styles');
      const cssText = styles.textContent;

      expect(cssText).toContain('opacity:');
      expect(cssText).toContain('transform:');
    });
  });

  describe('HTML Structure', () => {
    test('should generate proper HTML structure', () => {
      const onConfirm = jest.fn();
      showResetConfirmation(onConfirm);

      const dialog = document.querySelector('.bsb-tutorial-hub__confirm-dialog');
      const backdrop = dialog.querySelector('.bsb-tutorial-hub__confirm-backdrop');
      const content = dialog.querySelector('.bsb-tutorial-hub__confirm-content');
      const actions = content.querySelector('.bsb-tutorial-hub__confirm-actions');

      expect(dialog.parentNode).toBe(document.body);
      expect(backdrop.parentNode).toBe(dialog);
      expect(content.parentNode).toBe(dialog);
      expect(actions.parentNode).toBe(content);
    });

    test('should have proper button structure', () => {
      const onConfirm = jest.fn();
      showResetConfirmation(onConfirm);

      const cancelBtn = document.querySelector('.bsb-tutorial-hub__confirm-cancel');
      const resetBtn = document.querySelector('.bsb-tutorial-hub__confirm-reset');

      expect(cancelBtn.tagName).toBe('BUTTON');
      expect(resetBtn.tagName).toBe('BUTTON');
      expect(cancelBtn.type).toBe('button');
      expect(resetBtn.type).toBe('button');
    });

    test('should have semantic HTML elements', () => {
      const onConfirm = jest.fn();
      showResetConfirmation(onConfirm);

      const title = document.querySelector('.bsb-tutorial-hub__confirm-content h3');
      const message = document.querySelector('.bsb-tutorial-hub__confirm-content p');

      expect(title.tagName).toBe('H3');
      expect(message.tagName).toBe('P');
    });

    test('should have proper accessibility attributes', () => {
      const onConfirm = jest.fn();
      showResetConfirmation(onConfirm);

      const dialog = document.querySelector('.bsb-tutorial-hub__confirm-dialog');
      const content = document.querySelector('.bsb-tutorial-hub__confirm-content');

      // Check for potential ARIA attributes
      expect(dialog.getAttribute('role') || content.getAttribute('role')).toBeTruthy();
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
      const cancelBtn = document.querySelector('.bsb-tutorial-hub__confirm-cancel');
      cancelBtn.click();

      // Should remove keydown listener
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });

    test('should handle button click events correctly', () => {
      const onConfirm = jest.fn();
      showResetConfirmation(onConfirm);

      const cancelBtn = document.querySelector('.bsb-tutorial-hub__confirm-cancel');
      const resetBtn = document.querySelector('.bsb-tutorial-hub__confirm-reset');

      // Mock click events
      const cancelClickEvent = new MouseEvent('click', { bubbles: true });
      const resetClickEvent = new MouseEvent('click', { bubbles: true });

      cancelBtn.dispatchEvent(cancelClickEvent);
      expect(onConfirm).not.toHaveBeenCalled();

      // Create new dialog since first one was closed
      showResetConfirmation(onConfirm);
      const newResetBtn = document.querySelector('.bsb-tutorial-hub__confirm-reset');
      newResetBtn.dispatchEvent(resetClickEvent);
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    test('should prevent event bubbling appropriately', () => {
      const onConfirm = jest.fn();
      showResetConfirmation(onConfirm);

      const content = document.querySelector('.bsb-tutorial-hub__confirm-content');
      const backdrop = document.querySelector('.bsb-tutorial-hub__confirm-backdrop');

      // Clicking content should not close dialog
      content.click();
      let dialog = document.querySelector('.bsb-tutorial-hub__confirm-dialog');
      expect(dialog).toBeTruthy();

      // Clicking backdrop should close dialog
      backdrop.click();
      dialog = document.querySelector('.bsb-tutorial-hub__confirm-dialog');
      expect(dialog).toBeFalsy();
    });

    test('should handle rapid successive calls', () => {
      const onConfirm1 = jest.fn();
      const onConfirm2 = jest.fn();
      const onConfirm3 = jest.fn();

      showResetConfirmation(onConfirm1);
      showResetConfirmation(onConfirm2);
      showResetConfirmation(onConfirm3);

      const dialogs = document.querySelectorAll('.bsb-tutorial-hub__confirm-dialog');
      expect(dialogs.length).toBe(3);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle DOM manipulation errors gracefully', () => {
      // Mock appendChild to throw an error
      const originalAppendChild = document.body.appendChild;
      document.body.appendChild = jest.fn(() => {
        throw new Error('DOM error');
      });

      expect(() => {
        showResetConfirmation(jest.fn());
      }).not.toThrow();

      // Restore original method
      document.body.appendChild = originalAppendChild;
    });

    test('should handle missing document head', () => {
      // Temporarily remove head
      const originalHead = document.head;
      Object.defineProperty(document, 'head', {
        value: null,
        configurable: true
      });

      expect(() => {
        showResetConfirmation(jest.fn());
      }).not.toThrow();

      // Restore head
      Object.defineProperty(document, 'head', {
        value: originalHead,
        configurable: true
      });
    });

    test('should handle callback execution errors', () => {
      const errorCallback = jest.fn(() => {
        throw new Error('Callback error');
      });

      showResetConfirmation(errorCallback);
      const resetBtn = document.querySelector('.bsb-tutorial-hub__confirm-reset');

      expect(() => {
        resetBtn.click();
      }).not.toThrow();

      expect(errorCallback).toHaveBeenCalled();
    });

    test('should handle keyboard event errors', () => {
      const onConfirm = jest.fn();
      showResetConfirmation(onConfirm);

      // Create malformed keyboard event
      const badEvent = {
        key: 'Escape',
        preventDefault: jest.fn(() => {
          throw new Error('Event error');
        })
      };

      expect(() => {
        document.dispatchEvent(badEvent);
      }).not.toThrow();
    });
  });

  describe('Memory Management', () => {
    test('should not leave memory leaks after dialog closes', () => {
      const onConfirm = jest.fn();
      showResetConfirmation(onConfirm);

      // Close dialog
      const cancelBtn = document.querySelector('.bsb-tutorial-hub__confirm-cancel');
      cancelBtn.click();

      // Verify no dialog elements remain
      expect(document.querySelector('.bsb-tutorial-hub__confirm-dialog')).toBeFalsy();
      expect(document.querySelectorAll('.bsb-tutorial-hub__confirm-dialog').length).toBe(0);
    });

    test('should handle multiple cleanup calls safely', () => {
      const onConfirm = jest.fn();
      showResetConfirmation(onConfirm);

      const cancelBtn = document.querySelector('.bsb-tutorial-hub__confirm-cancel');
      
      // Multiple clicks should not cause errors
      expect(() => {
        cancelBtn.click();
        cancelBtn.click();
        cancelBtn.click();
      }).not.toThrow();
    });
  });
});