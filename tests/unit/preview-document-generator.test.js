/**
 * Preview Document Generator Tests
 * ================================
 * 
 * Tests for the code playground preview document generator
 */

import { generatePreviewDocument } from '../../src/components/code-playground/preview-document-generator.js';

describe('Preview Document Generator', () => {
  describe('generatePreviewDocument', () => {
    test('should generate complete HTML document with all content', () => {
      const html = '<h1>Test Content</h1>';
      const css = 'h1 { color: red; }';
      const js = 'console.log("test");';

      const result = generatePreviewDocument(html, css, js);

      expect(result).toContain('<!DOCTYPE html>');
      expect(result).toContain('<html lang="en">');
      expect(result).toContain('BSB Code Preview');
      expect(result).toContain(html);
      expect(result).toContain(css);
      expect(result).toContain(js);
    });

    test('should include viewport meta tag', () => {
      const result = generatePreviewDocument('', '', '');
      expect(result).toContain('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
    });

    test('should include charset meta tag', () => {
      const result = generatePreviewDocument('', '', '');
      expect(result).toContain('<meta charset="UTF-8">');
    });

    test('should include default body styles', () => {
      const result = generatePreviewDocument('', '', '');
      expect(result).toContain('margin: 16px');
      expect(result).toContain('font-family: system-ui');
      expect(result).toContain('line-height: 1.6');
    });

    test('should inject custom CSS into style tag', () => {
      const css = '.custom { background: blue; }';
      const result = generatePreviewDocument('', css, '');
      
      expect(result).toContain('<style>');
      expect(result).toContain(css);
      expect(result).toContain('</style>');
    });

    test('should inject HTML into body', () => {
      const html = '<div class="test"><p>Hello World</p></div>';
      const result = generatePreviewDocument(html, '', '');
      
      expect(result).toContain('<body>');
      expect(result).toContain(html);
      expect(result).toContain('</body>');
    });

    test('should include console capture script', () => {
      const result = generatePreviewDocument('', '', '');
      
      expect(result).toContain('window.capturedLogs = []');
      expect(result).toContain("['log', 'warn', 'error'].forEach");
      expect(result).toContain('originalConsole');
    });

    test('should include error handling script', () => {
      const result = generatePreviewDocument('', '', '');
      
      expect(result).toContain("window.addEventListener('error'");
      expect(result).toContain('event.preventDefault()');
      expect(result).toContain('window.parent.postMessage');
    });

    test('should wrap user JavaScript in try-catch', () => {
      const js = 'document.body.style.color = "green";';
      const result = generatePreviewDocument('', '', js);
      
      expect(result).toContain('try {');
      expect(result).toContain(js);
      expect(result).toContain('} catch (error) {');
      expect(result).toContain('JavaScript Error');
    });

    test('should handle empty content gracefully', () => {
      const result = generatePreviewDocument('', '', '');
      
      expect(result).toContain('<!DOCTYPE html>');
      expect(result).toContain('<html lang="en">');
      expect(result).toContain('</html>');
      expect(result).not.toContain('undefined');
      expect(result).not.toContain('null');
    });

    test('should handle special characters in content', () => {
      const html = '<p>Test "quotes" & <script>alert("test")</script></p>';
      const css = 'p::before { content: "\\\""; }';
      const js = 'console.log("test \\"quotes\\" & symbols");';
      
      const result = generatePreviewDocument(html, css, js);
      
      expect(result).toContain(html);
      expect(result).toContain(css);
      expect(result).toContain(js);
    });

    test('should maintain script execution order', () => {
      const js = 'console.log("user code");';
      const result = generatePreviewDocument('', '', js);
      
      // Console capture should come before user code
      const consoleCaptureIndex = result.indexOf('window.capturedLogs = []');
      const userCodeIndex = result.indexOf('console.log("user code")');
      
      expect(consoleCaptureIndex).toBeLessThan(userCodeIndex);
    });

    test('should include postMessage communication setup', () => {
      const result = generatePreviewDocument('', '', '');
      
      expect(result).toContain('window.parent.postMessage');
      expect(result).toContain("type: 'console'");
      expect(result).toContain("method: method");
    });

    test('should preserve user code formatting', () => {
      const js = `
        function test() {
          console.log("formatted code");
        }
        test();
      `;
      const result = generatePreviewDocument('', '', js);
      
      expect(result).toContain('function test()');
      expect(result).toContain('console.log("formatted code")');
      expect(result).toContain('test();');
    });

    test('should include timestamp in captured logs', () => {
      const result = generatePreviewDocument('', '', '');
      
      expect(result).toContain('timestamp: Date.now()');
    });

    test('should trim whitespace from final document', () => {
      const result = generatePreviewDocument('', '', '');
      
      expect(result).not.toMatch(/^\s/);
      expect(result).not.toMatch(/\s$/);
    });

    test('should generate valid HTML structure', () => {
      const result = generatePreviewDocument('<p>Test</p>', 'p { color: blue; }', 'console.log("test");');
      
      // Check for proper HTML5 structure
      expect(result).toMatch(/<!DOCTYPE html>\s*<html lang="en">/);
      expect(result).toMatch(/<head>[\s\S]*<\/head>/);
      expect(result).toMatch(/<body>[\s\S]*<\/body>/);
      expect(result).toMatch(/<\/body>\s*<\/html>$/);
    });

    test('should handle JavaScript with multiple statements', () => {
      const js = `
        const x = 5;
        const y = 10;
        console.log(x + y);
        document.body.innerHTML += '<p>Result: ' + (x + y) + '</p>';
      `;
      const result = generatePreviewDocument('', '', js);
      
      expect(result).toContain('const x = 5');
      expect(result).toContain('const y = 10');
      expect(result).toContain('console.log(x + y)');
      expect(result).toContain("document.body.innerHTML += '<p>Result:");
    });
  });

  describe('Error Handling', () => {
    test('should capture and forward runtime errors', () => {
      const js = 'undefinedFunction();';
      const result = generatePreviewDocument('', '', js);
      
      expect(result).toContain('} catch (error) {');
      expect(result).toContain('JavaScript Error');
      expect(result).toContain('error.message');
    });

    test('should include window error listener', () => {
      const result = generatePreviewDocument('', '', '');
      
      expect(result).toContain("window.addEventListener('error', event => {");
      expect(result).toContain('event.filename');
      expect(result).toContain('event.lineno');
      expect(result).toContain('event.message');
    });

    test('should prevent default error behavior', () => {
      const result = generatePreviewDocument('', '', '');
      
      expect(result).toContain('event.preventDefault()');
      expect(result).toContain('return true');
    });
  });

  describe('Console Integration', () => {
    test('should override console methods', () => {
      const result = generatePreviewDocument('', '', '');
      
      expect(result).toContain('const originalConsole = {');
      expect(result).toContain('log: console.log');
      expect(result).toContain('warn: console.warn');
      expect(result).toContain('error: console.error');
    });

    test('should maintain original console functionality', () => {
      const result = generatePreviewDocument('', '', '');
      
      expect(result).toContain('originalConsole[method].apply(console, args)');
    });

    test('should capture console output with metadata', () => {
      const result = generatePreviewDocument('', '', '');
      
      expect(result).toContain('type: method');
      expect(result).toContain('message: args.join');
      expect(result).toContain('timestamp: Date.now()');
    });
  });
});