/**
 * Event Handlers Module
 * ======================
 *
 * Handles user interactions for the SEO analyzer
 */

/**
 * Toggle analyzer collapse state
 * @param {HTMLElement} element - Analyzer element
 * @param {boolean} isCollapsed - Current collapsed state
 * @returns {boolean} New collapsed state
 */
export const toggleCollapse = (element, isCollapsed) => {
  const newState = !isCollapsed;
  element.classList.toggle('seo-analyzer--collapsed', newState);

  const toggleBtn = element.querySelector('.seo-analyzer__toggle');
  if (toggleBtn) {
    toggleBtn.setAttribute('aria-expanded', (!newState).toString());
    toggleBtn.textContent = newState ? 'Show Analysis' : 'Hide Analysis';
  }

  return newState;
};

/**
 * Switch between analyzer tabs
 * @param {HTMLElement} element - Analyzer element
 * @param {string} tabName - Name of tab to switch to
 * @returns {void}
 */
export const switchTab = (element, tabName) => {
  // Update tab buttons
  const tabButtons = element.querySelectorAll('.seo-analyzer__tab');
  tabButtons.forEach(btn => {
    const isActive = btn.dataset.tab === tabName;
    btn.classList.toggle('seo-analyzer__tab--active', isActive);
    btn.setAttribute('aria-selected', isActive.toString());
  });

  // Update tab panels
  const tabPanels = element.querySelectorAll('.seo-analyzer__panel');
  tabPanels.forEach(panel => {
    const isActive = panel.dataset.panel === tabName;
    panel.classList.toggle('seo-analyzer__panel--active', isActive);
    panel.setAttribute('aria-hidden', (!isActive).toString());
  });
};

/**
 * Bind all event listeners for the analyzer
 * @param {HTMLElement} element - Analyzer element
 * @param {Object} handlers - Object with handler functions
 * @returns {void}
 */
export const bindEvents = (element, handlers) => {
  // Toggle button
  const toggleBtn = element.querySelector('.seo-analyzer__toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', handlers.onToggle);
  }

  // Tab buttons
  const tabButtons = element.querySelectorAll('.seo-analyzer__tab');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', event => {
      const tabName = event.target.dataset.tab;
      if (tabName) {
        handlers.onTabSwitch(tabName);
      }
    });
  });

  // Refresh button
  const refreshBtn = element.querySelector('.seo-analyzer__refresh');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', handlers.onRefresh);
  }

  // Auto-refresh on content changes (debounced)
  let refreshTimeout;
  const observer = new MutationObserver(() => {
    clearTimeout(refreshTimeout);
    refreshTimeout = setTimeout(handlers.onAutoRefresh, 1000);
  });

  observer.observe(document.head, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['content']
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['alt', 'title']
  });

  // Store observer for cleanup
  element._seoObserver = observer;
};

/**
 * Cleanup event listeners and observers
 * @param {HTMLElement} element - Analyzer element
 * @returns {void}
 */
export const cleanup = element => {
  if (element._seoObserver) {
    element._seoObserver.disconnect();
    delete element._seoObserver;
  }
};