/**
 * File Tree Renderer Tests
 * ========================
 * 
 * Tests for the file tree HTML rendering functionality
 */

import { getFileIcon, renderFileItem } from '../../src/components/file-explorer/file-tree-renderer.js';

describe('File Tree Renderer', () => {
  describe('getFileIcon', () => {
    test('should return config icon for config file type', () => {
      expect(getFileIcon('config')).toBe('⚙️');
    });

    test('should return docs icon for docs file type', () => {
      expect(getFileIcon('docs')).toBe('📝');
    });

    test('should return style icon for style file type', () => {
      expect(getFileIcon('style')).toBe('🎨');
    });

    test('should return script icon for script file type', () => {
      expect(getFileIcon('script')).toBe('⚡');
    });

    test('should return markup icon for markup file type', () => {
      expect(getFileIcon('markup')).toBe('📄');
    });

    test('should return test icon for test file type', () => {
      expect(getFileIcon('test')).toBe('🧪');
    });

    test('should return default file icon for unknown file type', () => {
      expect(getFileIcon('unknown')).toBe('📄');
    });

    test('should return default file icon for undefined file type', () => {
      expect(getFileIcon()).toBe('📄');
    });

    test('should return default file icon for null file type', () => {
      expect(getFileIcon(null)).toBe('📄');
    });

    test('should return default file icon for empty string', () => {
      expect(getFileIcon('')).toBe('📄');
    });
  });

  describe('renderFileItem', () => {
    test('should render a file item with basic properties', () => {
      const item = {
        path: 'src/main.js'
      };
      const data = {
        name: 'main.js',
        type: 'file',
        fileType: 'script'
      };

      const result = renderFileItem(item, data, false);

      expect(result).toContain('bsb-file-explorer__item');
      expect(result).toContain('bsb-file-explorer__item--file');
      expect(result).toContain('role="treeitem"');
      expect(result).toContain('data-type="file"');
      expect(result).toContain('data-path="src/main.js"');
      expect(result).toContain('main.js');
      expect(result).toContain('⚡'); // script icon
    });

    test('should render a folder item when expanded', () => {
      const item = {
        path: 'src',
        children: []
      };
      const data = {
        name: 'src',
        type: 'folder'
      };

      const result = renderFileItem(item, data, true);

      expect(result).toContain('bsb-file-explorer__item--folder');
      expect(result).toContain('aria-expanded="true"');
      expect(result).toContain('📂'); // open folder icon
      expect(result).toContain('bsb-file-explorer__toggle');
      expect(result).toContain('Collapse src');
    });

    test('should render a folder item when collapsed', () => {
      const item = {
        path: 'src',
        children: []
      };
      const data = {
        name: 'src',
        type: 'folder'
      };

      const result = renderFileItem(item, data, false);

      expect(result).toContain('bsb-file-explorer__item--collapsed');
      expect(result).toContain('aria-expanded="false"');
      expect(result).toContain('📁'); // closed folder icon
      expect(result).toContain('Expand src');
    });

    test('should render importance badges', () => {
      const item = { path: 'important.js' };
      const dataHigh = {
        name: 'important.js',
        type: 'file',
        importance: 'high'
      };
      const dataMedium = {
        name: 'medium.js',
        type: 'file',
        importance: 'medium'
      };
      const dataLow = {
        name: 'low.js',
        type: 'file',
        importance: 'low'
      };

      const resultHigh = renderFileItem(item, dataHigh, false);
      const resultMedium = renderFileItem(item, dataMedium, false);
      const resultLow = renderFileItem(item, dataLow, false);

      expect(resultHigh).toContain('Essential');
      expect(resultMedium).toContain('Important');
      expect(resultLow).not.toContain('Essential');
      expect(resultLow).not.toContain('Important');
    });

    test('should include nested items placeholder for folders with children', () => {
      const item = {
        path: 'src',
        children: [
          { path: 'src/main.js' }
        ]
      };
      const data = {
        name: 'src',
        type: 'folder'
      };

      const result = renderFileItem(item, data, true);

      expect(result).toContain('bsb-file-explorer__list--nested');
      expect(result).toContain('role="group"');
      expect(result).toContain('data-children-path="src"');
    });

    test('should not include nested items placeholder for files', () => {
      const item = {
        path: 'main.js'
      };
      const data = {
        name: 'main.js',
        type: 'file'
      };

      const result = renderFileItem(item, data, false);

      expect(result).not.toContain('bsb-file-explorer__list--nested');
    });

    test('should not include nested items placeholder for empty folders', () => {
      const item = {
        path: 'empty-folder',
        children: []
      };
      const data = {
        name: 'empty-folder',
        type: 'folder'
      };

      const result = renderFileItem(item, data, true);

      expect(result).not.toContain('bsb-file-explorer__list--nested');
    });

    test('should include tooltip with file path', () => {
      const item = {
        path: 'src/components/header.js'
      };
      const data = {
        name: 'header.js',
        type: 'file',
        fileType: 'script'
      };

      const result = renderFileItem(item, data, false);

      expect(result).toContain('data-tooltip="src/components/header.js"');
    });

    test('should include file type in data attributes', () => {
      const item = {
        path: 'styles.css'
      };
      const data = {
        name: 'styles.css',
        type: 'file',
        fileType: 'style'
      };

      const result = renderFileItem(item, data, false);

      expect(result).toContain('data-file-type="style"');
    });

    test('should include importance in data attributes', () => {
      const item = {
        path: 'config.json'
      };
      const data = {
        name: 'config.json',
        type: 'file',
        importance: 'high'
      };

      const result = renderFileItem(item, data, false);

      expect(result).toContain('data-importance="high"');
    });

    test('should handle missing optional properties gracefully', () => {
      const item = {
        path: 'basic-file.txt'
      };
      const data = {
        name: 'basic-file.txt',
        type: 'file'
        // Missing fileType and importance
      };

      const result = renderFileItem(item, data, false);

      expect(result).toContain('basic-file.txt');
      expect(result).toContain('data-type="file"');
      expect(result).not.toContain('data-file-type');
      expect(result).not.toContain('data-importance');
      expect(result).toContain('📄'); // default file icon
    });

    test('should properly escape HTML in file names', () => {
      const item = {
        path: 'test<script>.js'
      };
      const data = {
        name: 'test<script>.js',
        type: 'file'
      };

      const result = renderFileItem(item, data, false);

      expect(result).toContain('test<script>.js');
      expect(result).toContain('data-path="test<script>.js"');
    });

    test('should generate proper CSS classes for different states', () => {
      const item = { path: 'test-folder' };
      const data = {
        name: 'test-folder',
        type: 'folder'
      };

      const expandedResult = renderFileItem(item, data, true);
      const collapsedResult = renderFileItem(item, data, false);

      expect(expandedResult).toContain('bsb-file-explorer__item bsb-file-explorer__item--folder');
      expect(expandedResult).not.toContain('bsb-file-explorer__item--collapsed');

      expect(collapsedResult).toContain('bsb-file-explorer__item bsb-file-explorer__item--folder bsb-file-explorer__item--collapsed');
    });

    test('should include proper ARIA attributes for accessibility', () => {
      const folderItem = { path: 'folder' };
      const folderData = { name: 'folder', type: 'folder' };
      const fileItem = { path: 'file.js' };
      const fileData = { name: 'file.js', type: 'file' };

      const folderResult = renderFileItem(folderItem, folderData, true);
      const fileResult = renderFileItem(fileItem, fileData, false);

      // Folder should have aria-expanded
      expect(folderResult).toContain('aria-expanded="true"');
      expect(folderResult).toContain('role="treeitem"');

      // File should not have aria-expanded
      expect(fileResult).not.toContain('aria-expanded');
      expect(fileResult).toContain('role="treeitem"');
    });

    test('should render different icons for different file types', () => {
      const testCases = [
        { fileType: 'config', expectedIcon: '⚙️' },
        { fileType: 'docs', expectedIcon: '📝' },
        { fileType: 'style', expectedIcon: '🎨' },
        { fileType: 'script', expectedIcon: '⚡' },
        { fileType: 'markup', expectedIcon: '📄' },
        { fileType: 'test', expectedIcon: '🧪' }
      ];

      testCases.forEach(({ fileType, expectedIcon }) => {
        const item = { path: `test.${fileType}` };
        const data = {
          name: `test.${fileType}`,
          type: 'file',
          fileType
        };

        const result = renderFileItem(item, data, false);
        expect(result).toContain(expectedIcon);
      });
    });
  });

  describe('HTML Structure', () => {
    test('should generate valid HTML structure', () => {
      const item = { path: 'test.js' };
      const data = {
        name: 'test.js',
        type: 'file',
        fileType: 'script'
      };

      const result = renderFileItem(item, data, false);

      // Should start and end with li tags
      expect(result.trim()).toMatch(/^<li/);
      expect(result.trim()).toMatch(/<\/li>$/);

      // Should contain proper nested structure
      expect(result).toContain('bsb-file-explorer__item-content');
      expect(result).toContain('bsb-file-explorer__name');
      expect(result).toContain('bsb-file-explorer__toggle-icon');
    });

    test('should properly format button for folders', () => {
      const item = { path: 'folder' };
      const data = {
        name: 'My Folder',
        type: 'folder'
      };

      const result = renderFileItem(item, data, false);

      expect(result).toMatch(/<button[^>]*class="bsb-file-explorer__toggle"[^>]*>/);
      expect(result).toContain('aria-label="Expand My Folder"');
    });

    test('should not include button for files', () => {
      const item = { path: 'file.js' };
      const data = {
        name: 'file.js',
        type: 'file'
      };

      const result = renderFileItem(item, data, false);

      expect(result).not.toContain('<button');
      expect(result).not.toContain('aria-label');
    });
  });
});