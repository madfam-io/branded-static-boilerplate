/**
 * Source Viewer Styles
 * ====================
 *
 * CSS styles for the source viewer component
 */

/**
 * Generate and inject source viewer styles
 */
export const injectViewerStyles = () => {
  if (document.querySelector('#bsb-source-viewer-styles')) {
    return; // Styles already injected
  }

  const style = document.createElement('style');
  style.id = 'bsb-source-viewer-styles';
  style.textContent = getViewerStyles();
  document.head.appendChild(style);
};

/**
 * Get complete CSS styles for the source viewer
 * @returns {string} CSS styles
 */
const getViewerStyles = () => {
  return `
    /* Source Viewer Button */
    .bsb-view-source-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      border: none;
      border-radius: 4px;
      width: 32px;
      height: 32px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      z-index: 10;
      opacity: 0;
      transition: all 0.2s ease;
      backdrop-filter: blur(4px);
    }

    .bsb-view-source-btn:hover {
      background: rgba(0, 0, 0, 0.9);
      transform: scale(1.1);
    }

    [data-bsb-component]:hover .bsb-view-source-btn {
      opacity: 1;
    }

    /* Source Viewer Modal */
    .bsb-source-viewer {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }

    .bsb-source-viewer--active {
      opacity: 1;
      visibility: visible;
    }

    .bsb-source-viewer__backdrop {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(2px);
    }

    .bsb-source-viewer__container {
      position: relative;
      background: var(--bsb-bg-primary, white);
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      width: 90%;
      max-width: 1200px;
      height: 80%;
      max-height: 800px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transform: scale(0.9);
      transition: transform 0.3s ease;
    }

    .bsb-source-viewer--active .bsb-source-viewer__container {
      transform: scale(1);
    }

    /* Header */
    .bsb-source-viewer__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid var(--bsb-border-color, #e5e5e5);
      background: var(--bsb-bg-secondary, #f8f9fa);
    }

    .bsb-source-viewer__title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--bsb-text-primary, #333);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .bsb-source-viewer__icon {
      font-size: 1.5rem;
    }

    .bsb-source-viewer__actions {
      display: flex;
      gap: 8px;
    }

    .bsb-source-viewer__action {
      background: var(--bsb-bg-primary, white);
      border: 1px solid var(--bsb-border-color, #ddd);
      border-radius: 6px;
      width: 40px;
      height: 40px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      transition: all 0.2s ease;
    }

    .bsb-source-viewer__action:hover {
      background: var(--bsb-bg-hover, #f0f0f0);
      transform: translateY(-1px);
    }

    .bsb-source-viewer__close {
      background: var(--bsb-error, #dc3545);
      color: white;
      border-color: var(--bsb-error, #dc3545);
    }

    .bsb-source-viewer__close:hover {
      background: #c82333;
    }

    /* Tabs */
    .bsb-source-viewer__tabs {
      display: flex;
      background: var(--bsb-bg-secondary, #f8f9fa);
      border-bottom: 1px solid var(--bsb-border-color, #e5e5e5);
    }

    .bsb-source-viewer__tab {
      background: none;
      border: none;
      padding: 12px 24px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      color: var(--bsb-text-secondary, #666);
      border-bottom: 3px solid transparent;
      transition: all 0.2s ease;
    }

    .bsb-source-viewer__tab:hover {
      background: var(--bsb-bg-hover, #e9ecef);
      color: var(--bsb-text-primary, #333);
    }

    .bsb-source-viewer__tab--active {
      color: var(--bsb-primary, #007bff);
      border-bottom-color: var(--bsb-primary, #007bff);
      background: var(--bsb-bg-primary, white);
    }

    /* Content */
    .bsb-source-viewer__content {
      flex: 1;
      position: relative;
      overflow: hidden;
    }

    .bsb-source-viewer__panel {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      opacity: 0;
      visibility: hidden;
      transition: all 0.2s ease;
    }

    .bsb-source-viewer__panel--active {
      opacity: 1;
      visibility: visible;
    }

    .bsb-source-viewer__code-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 20px;
      background: var(--bsb-bg-tertiary, #f1f3f4);
      border-bottom: 1px solid var(--bsb-border-color, #e5e5e5);
    }

    .bsb-source-viewer__code-label {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--bsb-text-secondary, #666);
    }

    .bsb-source-viewer__copy {
      background: var(--bsb-primary, #007bff);
      color: white;
      border: none;
      border-radius: 4px;
      padding: 6px 12px;
      font-size: 12px;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .bsb-source-viewer__copy:hover {
      background: var(--bsb-primary-dark, #0056b3);
    }

    .bsb-source-viewer__code {
      flex: 1;
      margin: 0;
      padding: 20px;
      background: var(--bsb-code-bg, #f8f9fa);
      overflow: auto;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 13px;
      line-height: 1.5;
      color: var(--bsb-code-text, #333);
    }

    .bsb-source-viewer__code code {
      background: none;
      padding: 0;
      font-family: inherit;
      font-size: inherit;
      line-height: inherit;
      color: inherit;
    }

    /* Footer */
    .bsb-source-viewer__footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 20px;
      background: var(--bsb-bg-secondary, #f8f9fa);
      border-top: 1px solid var(--bsb-border-color, #e5e5e5);
    }

    .bsb-source-viewer__component-name {
      font-size: 14px;
      font-weight: 500;
      color: var(--bsb-text-primary, #333);
    }

    .bsb-source-viewer__stats {
      display: flex;
      gap: 16px;
    }

    .bsb-source-viewer__stat {
      font-size: 12px;
      color: var(--bsb-text-secondary, #666);
    }

    .bsb-source-viewer__stat-label {
      font-weight: 500;
    }

    .bsb-source-viewer__stat-value {
      font-weight: 600;
      color: var(--bsb-primary, #007bff);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .bsb-source-viewer__container {
        width: 95%;
        height: 90%;
        margin: 20px;
      }

      .bsb-source-viewer__header {
        padding: 16px;
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
      }

      .bsb-source-viewer__actions {
        align-self: flex-end;
      }

      .bsb-source-viewer__tabs {
        overflow-x: auto;
      }

      .bsb-source-viewer__tab {
        white-space: nowrap;
        padding: 12px 16px;
      }

      .bsb-source-viewer__code {
        padding: 16px;
        font-size: 12px;
      }

      .bsb-source-viewer__footer {
        flex-direction: column;
        gap: 8px;
        align-items: flex-start;
      }

      .bsb-source-viewer__stats {
        gap: 12px;
      }
    }

    /* Dark Mode Support */
    @media (prefers-color-scheme: dark) {
      .bsb-source-viewer__container {
        background: var(--bsb-bg-primary-dark, #1a1a1a);
      }

      .bsb-source-viewer__header,
      .bsb-source-viewer__footer {
        background: var(--bsb-bg-secondary-dark, #2d2d2d);
        border-color: var(--bsb-border-color-dark, #404040);
      }

      .bsb-source-viewer__code {
        background: var(--bsb-code-bg-dark, #1e1e1e);
        color: var(--bsb-code-text-dark, #e0e0e0);
      }

      .bsb-source-viewer__tab {
        color: var(--bsb-text-secondary-dark, #aaa);
      }

      .bsb-source-viewer__tab:hover,
      .bsb-source-viewer__tab--active {
        color: var(--bsb-text-primary-dark, #fff);
      }
    }

    /* Animations */
    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(100px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes slideOutRight {
      from {
        opacity: 1;
        transform: translateX(0);
      }
      to {
        opacity: 0;
        transform: translateX(100px);
      }
    }
  `;
};