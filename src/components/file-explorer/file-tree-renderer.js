/**
 * File Tree HTML Renderer
 * =======================
 * Extracted rendering logic to reduce complexity
 */

/**
 * Get appropriate icon for file type
 * @param {string} fileType - Type of file
 * @returns {string} Emoji icon for the file type
 */
export const getFileIcon = fileType => {
  const icons = {
    config: '⚙️',
    docs: '📝',
    style: '🎨',
    script: '⚡',
    markup: '📄',
    test: '🧪',
    file: '📄'
  };
  return icons[fileType] || icons.file;
};

/**
 * Get CSS classes for item
 * @param {string} type - Item type
 * @param {boolean} isExpanded - Whether expanded
 * @returns {string} CSS classes
 */
const getItemClasses = (type, isExpanded) => {
  const baseClass = 'bsb-file-explorer__item';
  const typeClass = `${baseClass}--${type}`;
  const collapsedClass = isExpanded ? '' : ` ${baseClass}--collapsed`;
  return `${baseClass} ${typeClass}${collapsedClass}`;
};

/**
 * Get HTML attributes for item
 * @param {Object} item - Item data
 * @param {Object} data - File data
 * @param {boolean} isFolder - Whether item is folder
 * @param {boolean} isExpanded - Whether expanded
 * @returns {string} HTML attributes
 */
const getItemAttributes = (item, data, isFolder, isExpanded) => {
  const attributes = [
    'role="treeitem"',
    isFolder ? `aria-expanded="${isExpanded}"` : '',
    `data-type="${data.type}"`,
    `data-path="${item.path}"`,
    `data-tooltip="${item.path}"`,
    data.fileType ? `data-file-type="${data.fileType}"` : '',
    data.importance ? `data-importance="${data.importance}"` : ''
  ];

  return attributes.filter(Boolean).join(' ');
};

/**
 * Render icon for item
 * @param {Object} data - File data
 * @param {boolean} isFolder - Whether item is folder
 * @param {boolean} isExpanded - Whether expanded
 * @returns {string} HTML for icon
 */
const renderIcon = (data, isFolder, isExpanded) => {
  if (isFolder) {
    const icon = isExpanded ? '📂' : '📁';
    return `
      <button class="bsb-file-explorer__toggle" 
              aria-label="${isExpanded ? 'Collapse' : 'Expand'} ${data.name}">
        <span class="bsb-file-explorer__toggle-icon">${icon}</span>
      </button>
    `;
  }

  const icon = getFileIcon(data.fileType || 'file');
  return `<span class="bsb-file-explorer__toggle-icon">${icon}</span>`;
};

/**
 * Render importance badge
 * @param {string} importance - Importance level
 * @returns {string} HTML for badge
 */
const renderBadge = importance => {
  if (importance === 'high') {
    return '<span class="bsb-file-explorer__badge">Essential</span>';
  }
  if (importance === 'medium') {
    return '<span class="bsb-file-explorer__badge">Important</span>';
  }
  return '';
};

/**
 * Render nested items placeholder
 * @param {Object} item - Item data
 * @returns {string} Placeholder for nested items
 */
const renderNestedItems = item => {
  const hasChildren = item.children && item.children.length > 0;
  if (!hasChildren) {
    return '';
  }

  return `
    <ul class="bsb-file-explorer__list bsb-file-explorer__list--nested" 
        role="group"
        data-children-path="${item.path}">
    </ul>
  `;
};

/**
 * Render item content (icon, name, badge)
 * @param {Object} data - File data
 * @param {boolean} isFolder - Whether item is folder
 * @param {boolean} isExpanded - Whether expanded
 * @returns {string} HTML for content
 */
const renderItemContent = (data, isFolder, isExpanded) => {
  const icon = renderIcon(data, isFolder, isExpanded);
  const name = `<span class="bsb-file-explorer__name">${data.name}</span>`;
  const badge = renderBadge(data.importance);

  return `
    <div class="bsb-file-explorer__item-content">
      ${icon}
      ${name}
      ${badge}
    </div>
  `;
};

/**
 * Generate HTML for a single file/folder item
 * @param {Object} item - File/folder item
 * @param {Object} data - File data
 * @param {boolean} isExpanded - Whether folder is expanded
 * @returns {string} HTML string for the item
 */
export const renderFileItem = (item, data, isExpanded) => {
  const isFolder = data.type === 'folder';
  const itemClasses = getItemClasses(data.type, isExpanded);
  const itemAttributes = getItemAttributes(item, data, isFolder, isExpanded);

  return `
    <li class="${itemClasses}"
        ${itemAttributes}>
      ${renderItemContent(data, isFolder, isExpanded)}
      ${renderNestedItems(item)}
    </li>
  `;
};