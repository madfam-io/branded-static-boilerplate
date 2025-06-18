/**
 * Development Styles
 * ==================
 *
 * CSS styles for development tools and interfaces
 */

/**
 * Add development styles to the page
 * @returns {void}
 */
export const addDevStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    /* Dev Panel */
    .bsb-dev-panel {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 300px;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      font-size: 14px;
      transition: transform 0.3s ease;
    }

    .bsb-dev-panel--hidden {
      transform: translateX(320px);
    }

    .bsb-dev-panel__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 1px solid #e0e0e0;
      background: #f5f5f5;
      border-radius: 8px 8px 0 0;
    }

    .bsb-dev-panel__header h5 {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
    }

    .bsb-dev-panel__close {
      width: 24px;
      height: 24px;
      border: none;
      background: none;
      font-size: 20px;
      cursor: pointer;
      opacity: 0.5;
      transition: opacity 0.2s;
    }

    .bsb-dev-panel__close:hover {
      opacity: 1;
    }

    .bsb-dev-panel__content {
      padding: 16px;
    }

    .bsb-dev-panel__section {
      margin-bottom: 16px;
    }

    .bsb-dev-panel__section:last-child {
      margin-bottom: 0;
    }

    .bsb-dev-panel__section h6 {
      margin: 0 0 8px 0;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      color: #666;
    }

    .bsb-dev-panel__section p {
      margin: 4px 0;
      font-size: 13px;
    }

    .bsb-dev-panel__section a {
      display: block;
      margin: 4px 0;
      color: #007bff;
      text-decoration: none;
    }

    .bsb-dev-panel__action {
      display: block;
      width: 100%;
      padding: 8px 12px;
      margin: 4px 0;
      border: 1px solid #e0e0e0;
      background: white;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .bsb-dev-panel__action:hover {
      background: #f5f5f5;
    }

    /* Component Helpers */
    .bsb-dev-helper {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 24px;
      height: 24px;
      border: none;
      background: #007bff;
      color: white;
      font-size: 14px;
      font-weight: bold;
      border-radius: 50%;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.2s;
      z-index: 100;
    }

    .bsb-show-helpers .bsb-dev-helper,
    [data-bsb-component]:hover .bsb-dev-helper {
      opacity: 1;
    }

    /* Grid Overlay */
    .bsb-grid-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      z-index: 9999;
      display: none;
    }

    .bsb-show-grid .bsb-grid-overlay {
      display: block;
    }

    .bsb-grid-overlay__grid {
      height: 100vh;
      background-image: repeating-linear-gradient(
        90deg,
        rgba(255, 0, 0, 0.1) 0,
        rgba(255, 0, 0, 0.1) 1px,
        transparent 1px,
        transparent 8px
      );
    }

    /* Inspect Mode */
    .bsb-inspect-mode * {
      cursor: crosshair !important;
    }

    .bsb-highlight {
      outline: 2px solid #007bff !important;
      outline-offset: 2px;
    }

    /* Dev Modal */
    .bsb-dev-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10001;
    }

    .bsb-dev-modal__content {
      background: white;
      padding: 32px;
      border-radius: 8px;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
    }

    .bsb-dev-modal__content h3 {
      margin-top: 0;
    }

    .bsb-dev-modal__info h4 {
      margin-top: 24px;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 600;
    }

    .bsb-dev-modal__actions {
      margin-top: 32px;
      display: flex;
      gap: 12px;
    }

    /* Dark mode support */
    [data-bsb-theme="dark"] .bsb-dev-panel,
    [data-bsb-theme="dark"] .bsb-dev-modal__content {
      background: #1a1a1a;
      color: #e0e0e0;
      border-color: #333;
    }

    [data-bsb-theme="dark"] .bsb-dev-panel__header {
      background: #2a2a2a;
      border-color: #333;
    }

    [data-bsb-theme="dark"] .bsb-dev-panel__action {
      background: #2a2a2a;
      color: #e0e0e0;
      border-color: #333;
    }
  `;

  document.head.appendChild(style);
};