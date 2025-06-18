# BSB Test Suite

This directory contains the test suite for the Branded Static Boilerplate project.

## Test Structure

```
tests/
├── unit/                    # Unit tests for individual modules
│   ├── bsb-helper.test.js  # Mock-based tests for BSB Helper
│   ├── bsb-helper-real.test.js  # Real implementation tests
│   ├── language-toggle.test.js  # Language toggle tests
│   ├── theme-toggle.test.js     # Theme toggle tests
│   ├── performance-optimizer.test.js  # Performance tests
│   └── modules-import.test.js   # Module import verification
├── accessibility/           # Accessibility tests
│   └── components.test.js   # Component accessibility tests
├── e2e/                    # End-to-end tests (Playwright)
│   ├── homepage.spec.js    # Homepage functionality
│   ├── accessibility.spec.js # E2E accessibility tests
│   └── performance.spec.js  # Performance tests
├── setup/                  # Test configuration
│   └── jest.setup.js       # Jest global setup
├── processors/             # Test result processors
│   └── accessibilityProcessor.cjs
└── __mocks__/              # Mock files
    └── fileMock.js         # Static asset mock

## Test Frameworks

### Unit Testing (Jest)
- **Framework**: Jest v29.7.0
- **Environment**: jsdom
- **Coverage**: Enabled by default
- **Accessibility**: jest-axe integration

### E2E Testing (Playwright)
- **Framework**: Playwright v1.53.0
- **Browsers**: Chromium, Firefox, Safari
- **Viewports**: Desktop, Mobile, Tablet
- **Features**: Screenshots, Videos, Traces

## Running Tests

### Unit Tests
```bash
# Run all unit tests
npm test

# Run with watch mode
npm run test:watch

# Run with coverage report
npm run test:coverage

# Run specific test file
npm test -- tests/unit/bsb-helper.test.js

# Run accessibility tests only
npm run test:a11y

# Run unit tests only
npm run test:unit
```

### E2E Tests
```bash
# Run all E2E tests
npm run test:e2e

# Run with UI mode
npm run test:e2e:ui

# Run in debug mode
npm run test:e2e:debug

# Run with headed browser
npm run test:e2e:headed

# View test report
npm run test:e2e:report
```

## Test Coverage

Current coverage thresholds are temporarily set to 0% while the test suite is being developed. Once adequate coverage is achieved, thresholds will be enforced:

- **Statements**: Target 80%
- **Branches**: Target 70%
- **Functions**: Target 80%
- **Lines**: Target 80%

### Viewing Coverage Reports

After running tests with coverage, reports are available at:
- **HTML Report**: `coverage/index.html`
- **LCOV Report**: `coverage/lcov.info`
- **Text Summary**: Displayed in console

## Writing Tests

### Unit Test Guidelines

1. **Import the actual module** to generate real coverage
2. **Mock external dependencies** (debug, DOM APIs, etc.)
3. **Test both success and error cases**
4. **Use descriptive test names**
5. **Group related tests with `describe` blocks**

Example:
```javascript
import { jest } from '@jest/globals';

// Mock dependencies
jest.mock('../../src/scripts/core/debug.js', () => ({
  debug: { log: jest.fn() },
  default: { log: jest.fn() }
}));

describe('MyModule', () => {
  test('should perform expected behavior', () => {
    // Test implementation
  });
});
```

### Accessibility Test Guidelines

1. **Use jest-axe** for automated accessibility testing
2. **Test keyboard navigation**
3. **Verify ARIA attributes**
4. **Check focus management**
5. **Validate semantic HTML**

Example:
```javascript
test('should be accessible', async () => {
  const element = document.querySelector('.my-component');
  await testAccessibility(element);
});
```

### E2E Test Guidelines

1. **Test user journeys**, not implementation details
2. **Use data attributes** for test selectors
3. **Test across multiple viewports**
4. **Include performance metrics**
5. **Take screenshots for visual regression**

Example:
```javascript
test('should complete user flow', async ({ page }) => {
  await page.goto('/');
  await page.click('[data-testid="start-button"]');
  await expect(page.locator('.success-message')).toBeVisible();
});
```

## Common Issues

### Module Import Errors
Some modules auto-initialize on import. To test these:
1. Mock `document.readyState` as 'loading'
2. Import the module dynamically
3. Test the exported classes/functions separately

### Coverage Not Collected
Ensure you're importing real modules, not just mocks:
```javascript
// ❌ Wrong - no coverage
const MockModule = { method: jest.fn() };

// ✅ Correct - generates coverage
import Module from '../../src/module.js';
```

### Flaky E2E Tests
1. Use explicit waits: `await page.waitForSelector()`
2. Increase timeouts for slow operations
3. Use `networkidle` for page loads
4. Disable animations in test environment

## CI/CD Integration

Tests are automatically run in CI with:
- Coverage reporting to track trends
- Failure notifications
- Parallel execution for speed
- Artifact storage for debugging

## Contributing

When adding new features:
1. Write tests first (TDD approach)
2. Ensure tests pass locally
3. Check coverage doesn't decrease
4. Update this README if needed