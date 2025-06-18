/**
 * Inspection Tools
 * ================
 *
 * Handles grid overlay and component inspection functionality
 */

/**
 * Add grid overlay for layout debugging
 * @returns {void}
 */
export const addGridOverlay = () => {
  const overlay = document.createElement('div');
  overlay.className = 'bsb-grid-overlay';
  overlay.innerHTML = '<div class="container"><div class="bsb-grid-overlay__grid"></div></div>';
  document.body.appendChild(overlay);
};

/**
 * Toggle grid visibility
 * @returns {void}
 */
export const toggleGrid = () => {
  document.body.classList.toggle('bsb-show-grid');
};

/**
 * Toggle component helpers
 * @returns {void}
 */
export const toggleHelpers = () => {
  document.body.classList.toggle('bsb-show-helpers');
};

/**
 * Component inspection handler class
 */
export class InspectionHandler {
  constructor(showDocsFn) {
    this.showDocsFn = showDocsFn;
    this.inspectHandler = this.inspectHandler.bind(this);
    this.highlightHandler = this.highlightHandler.bind(this);
  }

  /**
   * Handle inspection clicks
   * @param {Event} event - The click event
   * @returns {void}
   */
  inspectHandler(event) {
    const component = event.target.closest('[data-bsb-component]');
    if (component) {
      event.preventDefault();
      event.stopPropagation();
      const name = component.dataset.bsbComponent;
      this.showDocsFn(name, component);
    }
  }

  /**
   * Handle hover highlighting
   * @param {Event} event - The mouseover event
   * @returns {void}
   */
  highlightHandler(event) {
    // Remove previous highlights
    document.querySelectorAll('.bsb-highlight').forEach(el => {
      el.classList.remove('bsb-highlight');
    });

    const component = event.target.closest('[data-bsb-component]');
    if (component) {
      component.classList.add('bsb-highlight');
    }
  }

  /**
   * Start component inspection
   * @returns {void}
   */
  start() {
    document.addEventListener('click', this.inspectHandler);
    document.addEventListener('mouseover', this.highlightHandler);
  }

  /**
   * Stop component inspection
   * @returns {void}
   */
  stop() {
    document.removeEventListener('click', this.inspectHandler);
    document.removeEventListener('mouseover', this.highlightHandler);

    // Remove any highlights
    document.querySelectorAll('.bsb-highlight').forEach(el => {
      el.classList.remove('bsb-highlight');
    });
  }
}