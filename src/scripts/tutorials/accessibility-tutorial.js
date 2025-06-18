/**
 * Web Accessibility Interactive Tutorial
 * =====================================
 *
 * Learn web accessibility principles with hands-on examples and live testing.
 */

export const accessibilityTutorial = {
  id: 'accessibility',
  title: 'Web Accessibility Essentials',
  description: 'Build inclusive web experiences that work for everyone',
  difficulty: 'intermediate',
  estimatedTime: '25 minutes',

  lessons: [
    {
      id: 'semantic-html',
      title: 'Semantic HTML Foundation',
      description: 'Use proper HTML elements for better accessibility',
      html: `<!-- Bad Example -->
<div class="button" onclick="doSomething()">Click me</div>
<div class="header">Page Title</div>
<div class="list">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

<!-- Good Example -->
<button onclick="doSomething()">Click me</button>
<h1>Page Title</h1>
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>

<!-- Interactive Demo -->
<section class="demo-section">
  <h2>Try Both Versions</h2>
  <div class="comparison">
    <div class="bad-example">
      <h3>❌ Non-Semantic</h3>
      <div class="fake-button">Fake Button</div>
    </div>
    <div class="good-example">
      <h3>✅ Semantic</h3>
      <button class="real-button">Real Button</button>
    </div>
  </div>
</section>`,
      css: `.demo-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
}

.comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;
}

.bad-example, .good-example {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 2px solid #dee2e6;
  text-align: center;
}

.bad-example {
  border-color: #dc3545;
}

.good-example {
  border-color: #28a745;
}

.fake-button {
  background: #007bff;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  display: inline-block;
  user-select: none;
}

.real-button {
  background: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font: inherit;
}

.real-button:hover, .real-button:focus {
  background: #0056b3;
  outline: 2px solid #0056b3;
  outline-offset: 2px;
}

/* Notification styles */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 16px 24px;
  border-radius: 4px;
  background: #333;
  color: white;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  animation: slideIn 0.3s ease;
  z-index: 1000;
}

.notification--success {
  background: #28a745;
}

.notification--warning {
  background: #ffc107;
  color: #333;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}`,
      js: `// Accessible notification function
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = \`notification notification--\${type}\`;
  notification.setAttribute('role', 'alert');
  notification.setAttribute('aria-live', 'polite');
  notification.textContent = message;
  
  // Add to page
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Demonstrate accessibility differences
const fakeButton = document.querySelector('.fake-button');
const realButton = document.querySelector('.real-button');

fakeButton.addEventListener('click', () => {
  showNotification('Fake button clicked! This is not accessible to keyboard users.', 'warning');
});

realButton.addEventListener('click', () => {
  showNotification('Real button clicked! This works with keyboard, mouse, and screen readers.', 'success');
});

// Keyboard accessibility test
document.addEventListener('keydown', keyboardEvent => {
  if (keyboardEvent.key === 'Tab') {
    console.log('Tab pressed - watch which elements get focus!');
  }
});

// Screen reader simulation
function announceElement(element) {
  const announcement = \`\${element.tagName.toLowerCase()}: \${element.textContent}\`;
  console.log(\`Screen reader would announce: "\${announcement}"\`);
}

// Test with both buttons
fakeButton.addEventListener('focus', () => announceElement(fakeButton));
realButton.addEventListener('focus', () => announceElement(realButton));

console.log('Try tabbing through the elements to see the difference!');`,
      explanation: `
        <h3>Semantic HTML is the Foundation</h3>
        <p>Using the right HTML elements provides built-in accessibility features.</p>
        
        <h4>Benefits of Semantic HTML:</h4>
        <ul>
          <li><strong>Keyboard Navigation:</strong> Buttons are focusable by default</li>
          <li><strong>Screen Reader Support:</strong> Proper roles and properties</li>
          <li><strong>Built-in Interactions:</strong> Enter/Space key support</li>
          <li><strong>Better SEO:</strong> Search engines understand structure</li>
        </ul>
        
        <h4>Key Elements:</h4>
        <ul>
          <li><code>&lt;button&gt;</code> for interactive actions</li>
          <li><code>&lt;h1-h6&gt;</code> for headings hierarchy</li>
          <li><code>&lt;nav&gt;</code> for navigation areas</li>
          <li><code>&lt;main&gt;</code> for primary content</li>
          <li><code>&lt;section&gt;</code> for content sections</li>
        </ul>
      `,
      tasks: [
        'Tab through both buttons to see the difference',
        'Try clicking with Enter key',
        'Check the console for screen reader announcements'
      ]
    },

    {
      id: 'aria-labels',
      title: 'ARIA Labels and Descriptions',
      description: 'Enhance accessibility with ARIA attributes',
      html: `<div class="aria-demo">
  <h2>Form Examples</h2>
  
  <!-- Bad: No labels -->
  <div class="form-section bad">
    <h3>❌ Without ARIA</h3>
    <input type="text" placeholder="Enter your name">
    <input type="email" placeholder="Enter your email">
    <button>Submit</button>
  </div>
  
  <!-- Good: Proper labels and ARIA -->
  <div class="form-section good">
    <h3>✅ With ARIA</h3>
    <label for="username">Name:</label>
    <input 
      type="text" 
      id="username"
      aria-describedby="name-help"
      aria-required="true"
      placeholder="Enter your full name">
    <div id="name-help" class="help-text">This will be displayed publicly</div>
    
    <label for="email">Email:</label>
    <input 
      type="email" 
      id="email"
      aria-describedby="email-help"
      aria-required="true"
      placeholder="your@email.com">
    <div id="email-help" class="help-text">We'll never share your email</div>
    
    <button 
      type="submit"
      aria-describedby="submit-help">
      Submit Form
    </button>
    <div id="submit-help" class="help-text">Press Enter or click to submit</div>
  </div>
  
  <!-- Icon buttons demo -->
  <div class="icon-demo">
    <h3>Icon Button Examples</h3>
    <button class="icon-btn bad-icon">🔍</button>
    <button class="icon-btn good-icon" aria-label="Search posts">🔍</button>
    <button class="icon-btn good-icon" aria-label="Close dialog">❌</button>
  </div>
</div>`,
      css: `.aria-demo {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.form-section {
  background: white;
  padding: 20px;
  margin: 20px 0;
  border-radius: 8px;
  border: 2px solid #dee2e6;
}

.form-section.bad {
  border-color: #dc3545;
}

.form-section.good {
  border-color: #28a745;
}

.form-section label {
  display: block;
  margin: 15px 0 5px 0;
  font-weight: bold;
  color: #495057;
}

.form-section input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 16px;
}

.form-section input:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
  border-color: #007bff;
}

.help-text {
  font-size: 14px;
  color: #6c757d;
  margin: 5px 0 0 0;
}

.form-section button {
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 15px;
}

.icon-demo {
  background: white;
  padding: 20px;
  margin: 20px 0;
  border-radius: 8px;
  border: 2px solid #dee2e6;
}

.icon-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px;
  margin: 5px;
  border-radius: 4px;
  font-size: 18px;
  cursor: pointer;
}

.icon-btn:hover, .icon-btn:focus {
  background: #495057;
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

.bad-icon {
  border: 2px solid #dc3545;
}

.good-icon {
  border: 2px solid #28a745;
}`,
      js: `// ARIA attribute demonstrations
function checkAccessibility() {
  const inputs = document.querySelectorAll('input');
  const buttons = document.querySelectorAll('button');
  
  console.log('=== Accessibility Audit ===');
  
  // Check inputs
  inputs.forEach((input, index) => {
    const hasLabel = input.hasAttribute('aria-label') || 
                    input.hasAttribute('aria-labelledby') || 
                    document.querySelector(\`label[for="\${input.id}"]\`);
    
    const hasDescription = input.hasAttribute('aria-describedby');
    
    console.log(\`Input \${index + 1}:\`);
    console.log(\`  - Has label: \${hasLabel ? '✅' : '❌'}\`);
    console.log(\`  - Has description: \${hasDescription ? '✅' : '❌'}\`);
  });
  
  // Check buttons
  buttons.forEach((button, index) => {
    const hasAccessibleName = button.textContent.trim() || 
                             button.hasAttribute('aria-label') ||
                             button.hasAttribute('aria-labelledby');
    
    console.log(\`Button \${index + 1}: \${hasAccessibleName ? '✅' : '❌'} Accessible name\`);
  });
}

// Live ARIA announcements
function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Add screen reader only styles
const style = document.createElement('style');
style.textContent = \`
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }
\`;
document.head.appendChild(style);

// Demo interactions
document.querySelectorAll('.good button').forEach(button => {
  button.addEventListener('click', clickEvent => {
    clickEvent.preventDefault();
    announceToScreenReader('Form interaction detected');
    console.log('Form would be submitted with proper validation');
  });
});

// Run accessibility check
checkAccessibility();

console.log('Try using Tab and Enter keys to navigate the forms!');`,
      explanation: `
        <h3>ARIA: Accessibility Rich Internet Applications</h3>
        <p>ARIA attributes provide additional semantic information to assistive technologies.</p>
        
        <h4>Essential ARIA Attributes:</h4>
        <ul>
          <li><code>aria-label</code> - Provides accessible name</li>
          <li><code>aria-labelledby</code> - References element that labels this one</li>
          <li><code>aria-describedby</code> - References element that describes this one</li>
          <li><code>aria-required</code> - Indicates required fields</li>
          <li><code>aria-live</code> - Announces dynamic content changes</li>
        </ul>
        
        <h4>Best Practices:</h4>
        <ul>
          <li>Use semantic HTML first, ARIA second</li>
          <li>Always test with actual screen readers</li>
          <li>Provide meaningful descriptions for icon buttons</li>
          <li>Use aria-live for status updates</li>
        </ul>
      `,
      tasks: [
        'Compare form navigation between good and bad examples',
        'Check the console for accessibility audit results',
        'Try submitting the forms to see the difference'
      ]
    },

    {
      id: 'keyboard-navigation',
      title: 'Keyboard Navigation',
      description: 'Ensure all functionality is accessible via keyboard',
      html: `<div class="keyboard-demo">
  <h2>Keyboard Navigation Examples</h2>
  
  <!-- Tab order demo -->
  <div class="tab-order-demo">
    <h3>Tab Order</h3>
    <button tabindex="3">Third (tabindex="3")</button>
    <button tabindex="1">First (tabindex="1")</button>
    <button>Fourth (natural order)</button>
    <button tabindex="2">Second (tabindex="2")</button>
    <button tabindex="-1">Skipped (tabindex="-1")</button>
  </div>
  
  <!-- Focus management -->
  <div class="focus-demo">
    <h3>Focus Management</h3>
    <button id="open-modal">Open Modal</button>
    
    <div id="modal" class="modal hidden" role="dialog" aria-labelledby="modal-title" aria-modal="true">
      <div class="modal-content">
        <h3 id="modal-title">Modal Dialog</h3>
        <p>This modal traps focus and manages keyboard navigation properly.</p>
        <div class="modal-actions">
          <button id="modal-ok">OK</button>
          <button id="modal-cancel">Cancel</button>
        </div>
        <button id="close-modal" class="close-btn" aria-label="Close modal">×</button>
      </div>
    </div>
  </div>
  
  <!-- Custom components -->
  <div class="custom-demo">
    <h3>Custom Dropdown</h3>
    <div class="dropdown" role="combobox" aria-expanded="false" aria-haspopup="listbox">
      <button class="dropdown-toggle" aria-label="Select option">
        Choose an option
        <span class="dropdown-arrow">▼</span>
      </button>
      <ul class="dropdown-menu" role="listbox" aria-hidden="true">
        <li role="option" tabindex="-1">Option 1</li>
        <li role="option" tabindex="-1">Option 2</li>
        <li role="option" tabindex="-1">Option 3</li>
      </ul>
    </div>
  </div>
</div>`,
      css: `.keyboard-demo {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.tab-order-demo, .focus-demo, .custom-demo {
  background: white;
  padding: 20px;
  margin: 20px 0;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.tab-order-demo button {
  margin: 5px;
  padding: 10px 15px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.tab-order-demo button:focus {
  outline: 3px solid #ffc107;
  outline-offset: 2px;
}

/* Modal styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal.hidden {
  display: none;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  max-width: 400px;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.modal-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6c757d;
}

.close-btn:hover, .close-btn:focus {
  color: #495057;
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

/* Dropdown styles */
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-toggle {
  background: white;
  border: 1px solid #ced4da;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
}

.dropdown-toggle:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
  border-color: #007bff;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #ced4da;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  list-style: none;
  margin: 0;
  padding: 0;
  min-width: 100%;
  z-index: 1000;
}

.dropdown-menu[aria-hidden="true"] {
  display: none;
}

.dropdown-menu li {
  padding: 10px 15px;
  cursor: pointer;
  border-bottom: 1px solid #f8f9fa;
}

.dropdown-menu li:last-child {
  border-bottom: none;
}

.dropdown-menu li:hover,
.dropdown-menu li:focus {
  background: #f8f9fa;
  outline: none;
}

.dropdown-menu li[aria-selected="true"] {
  background: #007bff;
  color: white;
}`,
      js: `// Keyboard navigation implementation
class AccessibleModal {
  constructor(modalId) {
    this.modal = document.getElementById(modalId);
    this.openButton = document.getElementById('open-modal');
    this.closeButton = document.getElementById('close-modal');
    this.okButton = document.getElementById('modal-ok');
    this.cancelButton = document.getElementById('modal-cancel');
    
    this.focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    this.previousFocus = null;
    
    this.init();
  }
  
  init() {
    this.openButton.addEventListener('click', () => this.open());
    this.closeButton.addEventListener('click', () => this.close());
    this.cancelButton.addEventListener('click', () => this.close());
    this.okButton.addEventListener('click', () => this.close());
    
    // Escape key to close
    document.addEventListener('keydown', keyboardEvent => {
      if (keyboardEvent.key === 'Escape' && !this.modal.classList.contains('hidden')) {
        this.close();
      }
    });
    
    // Trap focus in modal
    this.modal.addEventListener('keydown', keyEvent => this.trapFocus(keyEvent));
  }
  
  open() {
    this.previousFocus = document.activeElement;
    this.modal.classList.remove('hidden');
    this.modal.setAttribute('aria-hidden', 'false');
    
    // Focus first focusable element
    const focusableElements = this.modal.querySelectorAll(this.focusableElements);
    if (focusableElements.length) {
      focusableElements[0].focus();
    }
  }
  
  close() {
    this.modal.classList.add('hidden');
    this.modal.setAttribute('aria-hidden', 'true');
    
    // Return focus to trigger element
    if (this.previousFocus) {
      this.previousFocus.focus();
    }
  }
  
  trapFocus(e) {
    if (e.key !== 'Tab') {
      return;
    }
    
    const focusableElements = Array.from(
      this.modal.querySelectorAll(this.focusableElements)
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }
}

// Accessible dropdown implementation
class AccessibleDropdown {
  constructor(dropdownElement) {
    this.dropdown = dropdownElement;
    this.toggle = this.dropdown.querySelector('.dropdown-toggle');
    this.menu = this.dropdown.querySelector('.dropdown-menu');
    this.options = Array.from(this.menu.querySelectorAll('[role="option"]'));
    
    this.isOpen = false;
    this.selectedIndex = -1;
    
    this.init();
  }
  
  init() {
    // Toggle dropdown
    this.toggle.addEventListener('click', () => this.toggleDropdown());
    this.toggle.addEventListener('keydown', keyEvent => this.handleToggleKeydown(keyEvent));
    
    // Option selection
    this.options.forEach((option, index) => {
      option.addEventListener('click', () => this.selectOption(index));
    });
    
    // Close on outside click
    document.addEventListener('click', clickEvent => {
      if (!this.dropdown.contains(clickEvent.target)) {
        this.closeDropdown();
      }
    });
  }
  
  toggleDropdown() {
    this.isOpen ? this.closeDropdown() : this.openDropdown();
  }
  
  openDropdown() {
    this.isOpen = true;
    this.dropdown.setAttribute('aria-expanded', 'true');
    this.menu.setAttribute('aria-hidden', 'false');
    this.selectedIndex = 0;
    this.updateSelection();
  }
  
  closeDropdown() {
    this.isOpen = false;
    this.dropdown.setAttribute('aria-expanded', 'false');
    this.menu.setAttribute('aria-hidden', 'true');
    this.toggle.focus();
  }
  
  handleToggleKeydown(e) {
    switch (e.key) {
      case 'Enter':
      case ' ':
      case 'ArrowDown':
        e.preventDefault();
        this.openDropdown();
        break;
      case 'Escape':
        this.closeDropdown();
        break;
      default:
        // No action needed for other keys
        break;
    }
  }
  
  selectOption(index) {
    this.selectedIndex = index;
    const selectedText = this.options[index].textContent;
    this.toggle.firstChild.textContent = selectedText;
    this.closeDropdown();
    
    // Announce selection
    console.log(\`Selected: \${selectedText}\`);
  }
  
  updateSelection() {
    this.options.forEach((option, index) => {
      option.setAttribute('aria-selected', index === this.selectedIndex);
      if (index === this.selectedIndex) {
        option.setAttribute('tabindex', '0');
        option.focus();
      } else {
        option.setAttribute('tabindex', '-1');
      }
    });
  }
}

// Initialize components
const accessibleModal = new AccessibleModal('modal');
const accessibleDropdown = new AccessibleDropdown(document.querySelector('.dropdown'));

// Store references if needed for later access
window.accessibilityTutorialInstances = {
  modal: accessibleModal,
  dropdown: accessibleDropdown
};

// Visual focus indicators
document.addEventListener('keydown', keyboardEvent => {
  if (keyboardEvent.key === 'Tab') {
    document.body.classList.add('keyboard-navigation');
  }
});

document.addEventListener('mousedown', () => {
  document.body.classList.remove('keyboard-navigation');
});

// Add keyboard navigation styles
const style = document.createElement('style');
style.textContent = \`
  .keyboard-navigation *:focus {
    outline: 3px solid #ffc107 !important;
    outline-offset: 2px !important;
  }
\`;
document.head.appendChild(style);

console.log('Try navigating with Tab, Enter, Escape, and Arrow keys!');`,
      explanation: `
        <h3>Keyboard Navigation Essentials</h3>
        <p>All functionality must be accessible via keyboard for users who cannot use a mouse.</p>
        
        <h4>Key Navigation Patterns:</h4>
        <ul>
          <li><strong>Tab:</strong> Move to next focusable element</li>
          <li><strong>Shift+Tab:</strong> Move to previous focusable element</li>
          <li><strong>Enter/Space:</strong> Activate buttons and links</li>
          <li><strong>Escape:</strong> Close modal dialogs and menus</li>
          <li><strong>Arrow Keys:</strong> Navigate within components</li>
        </ul>
        
        <h4>Focus Management:</h4>
        <ul>
          <li>Logical tab order (use tabindex carefully)</li>
          <li>Focus trapping in modal dialogs</li>
          <li>Return focus after closing modals</li>
          <li>Skip links for main content</li>
        </ul>
        
        <h4>Testing Tips:</h4>
        <ul>
          <li>Navigate using only the keyboard</li>
          <li>Ensure all interactive elements are reachable</li>
          <li>Test with actual screen readers</li>
          <li>Check focus indicators are visible</li>
        </ul>
      `,
      tasks: [
        'Navigate through the tab order demo',
        'Open and navigate the modal with keyboard only',
        'Use the dropdown with arrow keys and Enter'
      ]
    }
  ],

  challenges: [
    {
      id: 'accessible-form',
      title: 'Accessible Contact Form',
      description: 'Create a fully accessible contact form with validation',
      starterCode: {
        html: `<form class="contact-form">
  <h2>Contact Us</h2>
  
  <!-- Add proper labels and ARIA attributes -->
  <input type="text" placeholder="Your name">
  <input type="email" placeholder="Your email">
  <textarea placeholder="Your message"></textarea>
  
  <button type="submit">Send Message</button>
</form>`,
        css: `/* Make the form accessible and user-friendly */
.contact-form {
  max-width: 500px;
  padding: 20px;
}

/* Add your accessible styles here */`,
        js: '// Add form validation with accessible error messages'
      },
      solution: `<!-- Solution -->
<form class="contact-form" novalidate>
  <h2>Contact Us</h2>
  
  <label for="name">Name (required):</label>
  <input 
    type="text" 
    id="name" 
    aria-required="true"
    aria-describedby="name-error">
  <div id="name-error" role="alert" aria-live="polite"></div>
  
  <!-- Similar pattern for other fields -->
</form>`,
      hints: [
        'Use proper label elements with for attributes',
        'Add aria-required for required fields',
        'Implement role="alert" for error messages',
        'Use aria-live for dynamic content updates'
      ]
    }
  ]
};