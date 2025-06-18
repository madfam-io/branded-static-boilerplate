/**
 * Project Organization Files Data
 * ===============================
 */

export const projectFilesData = {
  '/tests': {
    type: 'folder',
    name: 'tests',
    title: 'Test Suite',
    description: 'Automated tests to ensure your code works correctly and prevent bugs.',
    importance: 'high',
    category: 'quality',
    details: `
      <p><strong>Testing</strong> is your safety net - it catches bugs before users do!</p>
      <h5>🧪 Testing Strategy:</h5>
      <ul>
        <li><strong>Unit Tests:</strong> Test individual functions and components</li>
        <li><strong>Integration Tests:</strong> Test how parts work together</li>
        <li><strong>Accessibility Tests:</strong> Ensure inclusive design</li>
      </ul>
      <h5>🛡️ Benefits:</h5>
      <ul>
        <li><strong>Confidence:</strong> Deploy without fear</li>
        <li><strong>Documentation:</strong> Tests show how code should work</li>
        <li><strong>Refactoring:</strong> Change code safely</li>
      </ul>
    `,
    links: [
      { text: 'Testing Guide', url: '/docs/tutorials/testing.md' },
      { text: 'Jest Documentation', url: 'https://jestjs.io/docs/getting-started' }
    ]
  },
  '/docs': {
    type: 'folder',
    name: 'docs',
    title: 'Documentation',
    description: 'Project documentation, tutorials, and guides for developers.',
    importance: 'medium',
    category: 'docs',
    details: `
      <p><strong>Documentation</strong> is your project's instruction manual - essential for collaboration and maintenance.</p>
      <h5>📚 Documentation Types:</h5>
      <ul>
        <li><strong>README:</strong> Project overview and getting started</li>
        <li><strong>Tutorials:</strong> Step-by-step learning guides</li>
        <li><strong>API Docs:</strong> Function and component references</li>
        <li><strong>Examples:</strong> Real-world usage patterns</li>
      </ul>
      <h5>✍️ Writing Tips:</h5>
      <ul>
        <li>Write for your future self who forgot everything</li>
        <li>Include code examples for every concept</li>
        <li>Keep it up-to-date with code changes</li>
      </ul>
    `
  }
};