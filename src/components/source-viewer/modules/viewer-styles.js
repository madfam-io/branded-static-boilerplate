/**
 * Source Viewer Styles
 * ====================
 *
 * CSS styles for the source viewer component
 */

/**
 * Get button styles for source viewer
 * @returns {string} Button CSS styles
 */
const getButtonStyles = () => `
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
`;

/**
 * Get modal styles for source viewer
 * @returns {string} Modal CSS styles
 */
const getModalStyles = () => `
    /* Source Viewer Modal */
    .bsb-source-viewer {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      backdrop-filter: blur(8px);
    }

    .bsb-source-viewer__header {
      background: linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%);
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #404040;
    }

    .bsb-source-viewer__title {
      color: #ffffff;
      font-size: 18px;
      font-weight: 600;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .bsb-source-viewer__close {
      background: transparent;
      border: 1px solid #606060;
      color: #ffffff;
      width: 36px;
      height: 36px;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .bsb-source-viewer__close:hover {
      background: #f44336;
      border-color: #f44336;
    }
`;

/**
 * Get content styles for source viewer
 * @returns {string} Content CSS styles
 */
const getContentStyles = () => `
    .bsb-source-viewer__content {
      flex: 1;
      display: flex;
      overflow: hidden;
    }

    .bsb-source-viewer__tabs {
      background: #2d2d2d;
      border-right: 1px solid #404040;
      width: 250px;
      overflow-y: auto;
    }

    .bsb-source-viewer__tab {
      display: block;
      width: 100%;
      padding: 12px 20px;
      background: transparent;
      border: none;
      color: #cccccc;
      text-align: left;
      cursor: pointer;
      border-bottom: 1px solid #404040;
      transition: all 0.2s ease;
      font-size: 14px;
    }

    .bsb-source-viewer__tab:hover {
      background: #404040;
      color: #ffffff;
    }

    .bsb-source-viewer__tab.active {
      background: #0066cc;
      color: #ffffff;
    }

    .bsb-source-viewer__code-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
`;

/**
 * Get code area styles for source viewer
 * @returns {string} Code area CSS styles
 */
const getCodeAreaStyles = () => `
    .bsb-source-viewer__code-header {
      background: #1e1e1e;
      padding: 12px 20px;
      border-bottom: 1px solid #404040;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .bsb-source-viewer__filename {
      color: #ffffff;
      font-size: 14px;
      font-family: 'Courier New', monospace;
    }

    .bsb-source-viewer__copy-btn {
      background: #0066cc;
      border: none;
      color: white;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      transition: background 0.2s ease;
    }

    .bsb-source-viewer__copy-btn:hover {
      background: #0052a3;
    }

    .bsb-source-viewer__code {
      flex: 1;
      background: #1e1e1e;
      color: #ffffff;
      font-family: 'Courier New', Monaco, monospace;
      font-size: 14px;
      line-height: 1.5;
      padding: 20px;
      overflow: auto;
      white-space: pre;
      tab-size: 2;
    }
`;

/**
 * Get syntax highlighting styles
 * @returns {string} Syntax highlighting CSS styles
 */
const getSyntaxStyles = () => `
    /* Syntax Highlighting */
    .bsb-source-viewer .hljs {
      background: transparent !important;
      color: #ffffff;
    }

    .bsb-source-viewer .hljs-comment {
      color: #6a9955;
    }

    .bsb-source-viewer .hljs-keyword {
      color: #569cd6;
    }

    .bsb-source-viewer .hljs-string {
      color: #ce9178;
    }

    .bsb-source-viewer .hljs-number {
      color: #b5cea8;
    }

    .bsb-source-viewer .hljs-function {
      color: #dcdcaa;
    }

    .bsb-source-viewer .hljs-variable {
      color: #9cdcfe;
    }

    .bsb-source-viewer .hljs-tag {
      color: #569cd6;
    }

    .bsb-source-viewer .hljs-attr {
      color: #92c5f7;
    }

    .bsb-source-viewer .hljs-title {
      color: #4ec9b0;
    }
`;

/**
 * Get responsive styles for source viewer
 * @returns {string} Responsive CSS styles
 */
const getResponsiveStyles = () => `
    /* Responsive Design */
    @media (max-width: 768px) {
      .bsb-source-viewer__content {
        flex-direction: column;
      }

      .bsb-source-viewer__tabs {
        width: 100%;
        max-height: 150px;
        border-right: none;
        border-bottom: 1px solid #404040;
        display: flex;
        overflow-x: auto;
        overflow-y: hidden;
      }

      .bsb-source-viewer__tab {
        white-space: nowrap;
        border-bottom: none;
        border-right: 1px solid #404040;
        min-width: 120px;
      }

      .bsb-source-viewer__header {
        padding: 12px 16px;
      }

      .bsb-source-viewer__title {
        font-size: 16px;
      }

      .bsb-source-viewer__code {
        font-size: 12px;
        padding: 15px;
      }
    }

    @media (max-width: 480px) {
      .bsb-view-source-btn {
        width: 28px;
        height: 28px;
        font-size: 12px;
      }

      .bsb-source-viewer__code {
        font-size: 11px;
        padding: 10px;
      }
    }
`;

/**
 * Get complete CSS styles for the source viewer
 * @returns {string} CSS styles
 */
const getViewerStyles = () => [
  getButtonStyles(),
  getModalStyles(),
  getContentStyles(),
  getCodeAreaStyles(),
  getSyntaxStyles(),
  getResponsiveStyles()
].join('\n');

export { getViewerStyles };