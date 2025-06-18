/**
 * Component Management for BSB Helper
 * ====================================
 *
 * Handles component discovery, documentation, and interaction
 */

import { debug } from '../debug.js';

/**
 * Find all BSB components on the page
 * @param {Map} components - Components map to populate
 * @returns {void}
 */
export const findComponents = components => {
  const componentElements = document.querySelectorAll('[data-bsb-component]');

  componentElements.forEach(component => {
    const name = component.dataset.bsbComponent;
    if (!components.has(name)) {
      components.set(name, []);
    }
    components.get(name).push(component);
  });

  debug.log(`BSB Dev Mode: Found ${componentElements.length} components`);
};

/**
 * Add helper buttons to components
 * @param {Map} components - Components map
 * @param {Function} showDocsFn - Function to show component docs
 * @returns {void}
 */
export const addComponentHelpers = (components, showDocsFn) => {
  components.forEach((elements, name) => {
    elements.forEach(element => {
      const helper = document.createElement('button');
      helper.className = 'bsb-dev-helper';
      helper.setAttribute('aria-label', `View ${name} component docs`);
      helper.innerHTML = '?';
      helper.addEventListener('click', event => {
        event.stopPropagation();
        showDocsFn(name, element);
      });

      element.style.position = 'relative';
      element.appendChild(helper);
    });
  });
};

/**
 * Show component documentation modal
 * @param {string} componentName - The name of the component
 * @param {HTMLElement} element - The component DOM element
 * @returns {void}
 */
export const showComponentDocs = (componentName, element) => {
  const modal = document.createElement('div');
  modal.className = 'bsb-dev-modal';
  modal.innerHTML = `
    <div class="bsb-dev-modal__content">
      <h3>${componentName} Component</h3>
      <div class="bsb-dev-modal__info">
        <h4>Location</h4>
        <p><code>/src/components/${componentName}/</code></p>

        <h4>Files</h4>
        <ul>
          <li><code>${componentName}.html</code> - HTML structure</li>
          <li><code>${componentName}.css</code> - Styles</li>
          <li><code>${componentName}.js</code> - JavaScript (if applicable)</li>
          <li><code>README.md</code> - Documentation</li>
        </ul>

        <h4>CSS Classes</h4>
        <p>${Array.from(element.classList).map(className => `<code>.${className}</code>`).join(', ')}</p>

        <h4>Attributes</h4>
        <ul>
          ${Array.from(element.attributes).map(attr =>
    `<li><code>${attr.name}="${attr.value}"</code></li>`
  ).join('')}
        </ul>
      </div>
      <div class="bsb-dev-modal__actions">
        <a href="/src/components/${componentName}/README.md" target="_blank" class="btn btn--primary">
          View Docs
        </a>
        <button class="btn btn--secondary" onclick="this.closest('.bsb-dev-modal').remove()">
          Close
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
};