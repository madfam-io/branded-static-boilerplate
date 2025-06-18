/**
 * Preview Document Generator
 * ==========================
 *
 * Generates the HTML document for code preview iframe
 */

/**
 * Generate the console capture script
 * @returns {string} JavaScript code for console capture
 */
const getConsoleCaptureScript = () => `
    // Console capture setup
    const originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error
    };

    window.capturedLogs = [];

    ['log', 'warn', 'error'].forEach(method => {
      console[method] = function(...args) {
        window.capturedLogs.push({
          type: method,
          message: args.join(' '),
          timestamp: Date.now()
        });
        originalConsole[method].apply(console, args);

        // Send to parent
        if (window.parent && window.parent.postMessage) {
          window.parent.postMessage({
            type: 'console',
            method: method,
            message: args.join(' ')
          }, '*');
        }
      };
    });`;

/**
 * Generate the error handling script
 * @returns {string} JavaScript code for error handling
 */
const getErrorHandlingScript = () => `
    // Error handling - capture errors without logging to console
    window.addEventListener('error', event => {
      const message = \`\${event.filename}:\${event.lineno} - \${event.message}\`;
      // Store error for debugging without console.error
      window.capturedLogs.push({
        type: 'error',
        message: message,
        timestamp: Date.now()
      });

      // Send to parent for display
      if (window.parent && window.parent.postMessage) {
        window.parent.postMessage({
          type: 'console',
          method: 'error',
          message: message
        }, '*');
      }

      // Prevent default error logging
      event.preventDefault();
      return true;
    });`;

/**
 * Generate the user code execution wrapper
 * @param {string} js - User's JavaScript code
 * @returns {string} Wrapped JavaScript code
 */
const getUserCodeWrapper = js => `
    try {
      ${js}
    } catch (error) {
      // Capture error without logging to console
      const errorMessage = 'JavaScript Error: ' + error.message;
      window.capturedLogs.push({
        type: 'error',
        message: errorMessage,
        timestamp: Date.now()
      });

      // Send to parent for display
      if (window.parent && window.parent.postMessage) {
        window.parent.postMessage({
          type: 'console',
          method: 'error',
          message: errorMessage
        }, '*');
      }
    }`;

/**
 * Generate complete preview document HTML
 * @param {string} html - HTML content
 * @param {string} css - CSS content
 * @param {string} js - JavaScript content
 * @returns {string} Complete HTML document
 */
export const generatePreviewDocument = (html, css, js) => {
  const consoleCaptureScript = getConsoleCaptureScript();
  const errorHandlingScript = getErrorHandlingScript();
  const userCodeWrapper = getUserCodeWrapper(js);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BSB Code Preview</title>
  <style>
    body {
      margin: 16px;
      font-family: system-ui, -apple-system, sans-serif;
      line-height: 1.6;
    }
    ${css}
  </style>
</head>
<body>
  ${html}
  <script>
${consoleCaptureScript}
${errorHandlingScript}
${userCodeWrapper}
  </script>
</body>
</html>`.trim();
};