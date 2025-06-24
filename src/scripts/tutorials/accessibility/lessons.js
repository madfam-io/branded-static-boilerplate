/**
 * Accessibility Tutorial Lessons
 * ==============================
 */

export const semanticHtmlLesson = {
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
  <p class="instructions">Try navigating with Tab key and screen reader</p>
</section>`,
  css: `.demo-section {
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin: 2rem 0;
}

.bad-example, .good-example {
  padding: 1.5rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  text-align: center;
}

.fake-button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.real-button {
  padding: 0.75rem 1.5rem;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.real-button:hover {
  background: #218838;
}

.real-button:focus {
  outline: 3px solid #80d88f;
  outline-offset: 2px;
}

.instructions {
  text-align: center;
  color: #666;
  font-style: italic;
}`,
  js: `// Demonstrate keyboard navigation differences
document.querySelector('.fake-button').addEventListener('click', () => {
  alert('Fake button clicked! But not keyboard accessible.');
});

document.querySelector('.real-button').addEventListener('click', () => {
  alert('Real button clicked! Fully accessible.');
});

// Show focus indicator
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-navigation');
  }
});

document.addEventListener('mousedown', () => {
  document.body.classList.remove('keyboard-navigation');
});`
};

export const ariaLabelsLesson = {
  id: 'aria-labels',
  title: 'ARIA Labels and Descriptions',
  description: 'Provide context for assistive technologies',
  html: `<!-- ARIA Labels Example -->
<section aria-labelledby="search-heading">
  <h2 id="search-heading">Search Our Site</h2>

  <!-- Icon-only button needs label -->
  <button aria-label="Search" class="icon-button">
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="2"/>
      <line x1="13" y1="13" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
    </svg>
  </button>

  <!-- Form with proper labeling -->
  <form role="search">
    <label for="search-input" class="visually-hidden">Search query</label>
    <input
      type="search"
      id="search-input"
      placeholder="What are you looking for?"
      aria-describedby="search-help"
    >
    <span id="search-help" class="help-text">
      Press Enter to search or Escape to clear
    </span>
  </form>

  <!-- Progress indicator -->
  <div class="loading-demo">
    <div
      role="progressbar"
      aria-valuenow="60"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label="Loading progress"
      class="progress-bar"
    >
      <div class="progress-fill" style="width: 60%"></div>
    </div>
    <button onclick="updateProgress()">Update Progress</button>
  </div>
</section>`,
  css: `.icon-button {
  padding: 0.75rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.icon-button:hover {
  background: #0056b3;
}

.icon-button:focus {
  outline: 3px solid #80bdff;
  outline-offset: 2px;
}

form[role="search"] {
  margin: 2rem 0;
}

#search-input {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 2px solid #ddd;
  border-radius: 4px;
}

#search-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}

.help-text {
  display: block;
  margin-top: 0.5rem;
  color: #666;
  font-size: 0.875rem;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.loading-demo {
  margin-top: 2rem;
}

.progress-bar {
  width: 100%;
  height: 24px;
  background: #e9ecef;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.progress-fill {
  height: 100%;
  background: #28a745;
  transition: width 0.3s ease;
}`,
  js: `// Update progress bar
function updateProgress() {
  const progressBar = document.querySelector('[role="progressbar"]');
  const progressFill = progressBar.querySelector('.progress-fill');

  let currentValue = parseInt(progressBar.getAttribute('aria-valuenow'));
  let newValue = currentValue + 10;

  if (newValue > 100) {
    newValue = 0;
  }

  progressBar.setAttribute('aria-valuenow', newValue);
  progressFill.style.width = newValue + '%';

  // Announce to screen readers
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'visually-hidden';
  announcement.textContent = \`Progress: \${newValue}%\`;

  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
}

// Search input enhancements
const searchInput = document.getElementById('search-input');

searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    searchInput.value = '';
    searchInput.blur();
  }
});`
};

export const keyboardNavigationLesson = {
  id: 'keyboard-navigation',
  title: 'Keyboard Navigation',
  description: 'Ensure all functionality is keyboard accessible',
  html: `<!-- Keyboard Navigation Demo -->
<section class="keyboard-demo">
  <h2>Keyboard Navigation Patterns</h2>

  <!-- Tab Navigation -->
  <div class="tab-demo">
    <h3>Tab Panel Example</h3>
    <div role="tablist" aria-label="Sample Tabs">
      <button role="tab" aria-selected="true" aria-controls="panel-1" id="tab-1">
        Tab 1
      </button>
      <button role="tab" aria-selected="false" aria-controls="panel-2" id="tab-2">
        Tab 2
      </button>
      <button role="tab" aria-selected="false" aria-controls="panel-3" id="tab-3">
        Tab 3
      </button>
    </div>

    <div role="tabpanel" id="panel-1" aria-labelledby="tab-1">
      <h4>Panel 1 Content</h4>
      <p>Use arrow keys to navigate between tabs.</p>
    </div>
    <div role="tabpanel" id="panel-2" aria-labelledby="tab-2" hidden>
      <h4>Panel 2 Content</h4>
      <p>Press Tab to move focus inside the panel.</p>
    </div>
    <div role="tabpanel" id="panel-3" aria-labelledby="tab-3" hidden>
      <h4>Panel 3 Content</h4>
      <p>Press Shift+Tab to move backwards.</p>
    </div>
  </div>

  <!-- Skip Links -->
  <div class="skip-link-demo">
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <nav>
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
    <main id="main-content">
      <h3>Main Content Area</h3>
      <p>The skip link helps keyboard users bypass navigation.</p>
    </main>
  </div>

  <!-- Focus Trap Demo -->
  <div class="modal-demo">
    <button onclick="openModal()" class="open-modal-btn">
      Open Modal (Focus Trap Demo)
    </button>

    <div class="modal" id="demo-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" hidden>
      <div class="modal-content">
        <h3 id="modal-title">Modal Dialog</h3>
        <p>Focus is trapped within this modal. Press Tab to cycle through elements.</p>
        <input type="text" placeholder="Example input">
        <div class="modal-actions">
          <button onclick="closeModal()">Cancel</button>
          <button onclick="closeModal()" class="primary">Confirm</button>
        </div>
      </div>
    </div>
  </div>
</section>`,
  css: `/* Keyboard navigation styles */
.keyboard-demo {
  padding: 2rem;
}

/* Tab panel styles */
[role="tablist"] {
  display: flex;
  gap: 0.5rem;
  border-bottom: 2px solid #ddd;
  margin-bottom: 1rem;
}

[role="tab"] {
  padding: 0.75rem 1.5rem;
  background: none;
  border: 2px solid transparent;
  border-bottom: none;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

[role="tab"][aria-selected="true"] {
  background: white;
  border-color: #ddd;
  border-bottom: 2px solid white;
  margin-bottom: -2px;
}

[role="tab"]:hover {
  background: #f8f9fa;
}

[role="tab"]:focus {
  outline: 3px solid #007bff;
  outline-offset: -3px;
}

[role="tabpanel"] {
  padding: 1.5rem;
  border: 2px solid #ddd;
  border-top: none;
  background: white;
}

/* Skip link styles */
.skip-link {
  position: absolute;
  left: -9999px;
  padding: 0.5rem 1rem;
  background: #000;
  color: white;
  text-decoration: none;
  z-index: 9999;
}

.skip-link:focus {
  left: 50%;
  top: 1rem;
  transform: translateX(-50%);
}

/* Modal styles */
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal[hidden] {
  display: none;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.modal-actions button {
  padding: 0.5rem 1rem;
  border: 2px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.modal-actions button.primary {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

/* Focus visible styles */
:focus-visible {
  outline: 3px solid #007bff;
  outline-offset: 2px;
}

/* Remove outline for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}`,
  js: `// Tab panel keyboard navigation
const tablist = document.querySelector('[role="tablist"]');
const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));

let currentTab = 0;

// Handle arrow key navigation
tablist.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') {
    currentTab = (currentTab + 1) % tabs.length;
    activateTab(currentTab);
  } else if (e.key === 'ArrowLeft') {
    currentTab = (currentTab - 1 + tabs.length) % tabs.length;
    activateTab(currentTab);
  } else if (e.key === 'Home') {
    currentTab = 0;
    activateTab(currentTab);
  } else if (e.key === 'End') {
    currentTab = tabs.length - 1;
    activateTab(currentTab);
  }
});

// Handle tab clicks
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => {
    currentTab = index;
    activateTab(index);
  });
});

function activateTab(index) {
  // Update tabs
  tabs.forEach((tab, i) => {
    tab.setAttribute('aria-selected', i === index);
    tab.tabIndex = i === index ? 0 : -1;
  });

  // Update panels
  panels.forEach((panel, i) => {
    panel.hidden = i !== index;
  });

  // Focus the active tab
  tabs[index].focus();
}

// Modal focus trap
let previousFocus;

function openModal() {
  const modal = document.getElementById('demo-modal');
  previousFocus = document.activeElement;

  modal.hidden = false;

  // Focus first focusable element
  const focusable = modal.querySelectorAll(
    'button, input, [tabindex]:not([tabindex="-1"])'
  );

  if (focusable.length) {
    focusable[0].focus();
  }

  // Trap focus
  modal.addEventListener('keydown', trapFocus);
}

function closeModal() {
  const modal = document.getElementById('demo-modal');
  modal.hidden = true;
  modal.removeEventListener('keydown', trapFocus);

  // Restore focus
  if (previousFocus) {
    previousFocus.focus();
  }
}

function trapFocus(e) {
  if (e.key !== 'Tab') return;

  const modal = document.getElementById('demo-modal');
  const focusable = Array.from(modal.querySelectorAll(
    'button, input, [tabindex]:not([tabindex="-1"])'
  ));

  const firstFocusable = focusable[0];
  const lastFocusable = focusable[focusable.length - 1];

  if (e.shiftKey && document.activeElement === firstFocusable) {
    e.preventDefault();
    lastFocusable.focus();
  } else if (!e.shiftKey && document.activeElement === lastFocusable) {
    e.preventDefault();
    firstFocusable.focus();
  }
}

// Also close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !document.getElementById('demo-modal').hidden) {
    closeModal();
  }
});`
};

export const allLessons = [
  semanticHtmlLesson,
  ariaLabelsLesson,
  keyboardNavigationLesson
];