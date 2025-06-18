/**
 * Development Panel UI
 * ====================
 *
 * Creates and manages the floating development panel
 */

/**
 * Create floating development panel
 * @param {Map} components - Components map for stats
 * @param {Object} actions - Action handlers
 * @returns {HTMLElement} Created panel element
 */
export const createDevPanel = (components, actions) => {
  const panel = document.createElement('div');
  panel.className = 'bsb-dev-panel';
  panel.innerHTML = `
    <div class="bsb-dev-panel__header">
      <h5>BSB Dev Mode</h5>
      <button class="bsb-dev-panel__close" aria-label="Close dev panel">×</button>
    </div>
    <div class="bsb-dev-panel__content">
      <div class="bsb-dev-panel__section">
        <h6>Page Info</h6>
        <p>Components: <span class="bsb-dev-panel__component-count">${components.size}</span></p>
        <p>Load Time: <span class="bsb-dev-panel__load-time">-</span>ms</p>
      </div>
      <div class="bsb-dev-panel__section">
        <h6>Quick Actions</h6>
        <button class="bsb-dev-panel__action" data-action="toggle-grid">
          Toggle Grid (G)
        </button>
        <button class="bsb-dev-panel__action" data-action="toggle-helpers">
          Toggle Helpers (H)
        </button>
        <button class="bsb-dev-panel__action" data-action="inspect">
          Inspect Mode (I)
        </button>
      </div>
      <div class="bsb-dev-panel__section">
        <h6>Documentation</h6>
        <a href="/src/README.md" target="_blank">Source Docs</a>
        <a href="/docs/tutorials/" target="_blank">Tutorials</a>
        <a href="/docs/api/" target="_blank">API Reference</a>
      </div>
    </div>
  `;

  document.body.appendChild(panel);

  // Setup panel interactions
  setupPanelInteractions(panel, actions);

  // Update load time
  window.addEventListener('load', () => {
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    panel.querySelector('.bsb-dev-panel__load-time').textContent = Math.round(loadTime);
  });

  return panel;
};

/**
 * Setup panel interactions
 * @param {HTMLElement} panel - The development panel element
 * @param {Object} actions - Action handlers
 * @returns {void}
 */
const setupPanelInteractions = (panel, actions) => {
  // Close button
  panel.querySelector('.bsb-dev-panel__close').addEventListener('click', () => {
    actions.toggleDevPanel();
  });

  // Action buttons
  panel.querySelectorAll('.bsb-dev-panel__action').forEach(btn => {
    btn.addEventListener('click', () => {
      const { action } = btn.dataset;
      switch (action) {
        case 'toggle-grid':
          actions.toggleGrid();
          break;
        case 'toggle-helpers':
          actions.toggleHelpers();
          break;
        case 'inspect':
          actions.toggleInspectMode();
          break;
        default:
          break;
      }
    });
  });
};

/**
 * Toggle dev panel visibility
 * @returns {void}
 */
export const toggleDevPanel = () => {
  const panel = document.querySelector('.bsb-dev-panel');
  if (panel) {
    panel.classList.toggle('bsb-dev-panel--hidden');
  }
};