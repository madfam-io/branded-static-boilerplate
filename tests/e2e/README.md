# E2E Tests Setup

## Running E2E Tests

The E2E tests require a development server to be running. Follow these steps:

### 1. Start the Development Server

In one terminal, start the development server:

```bash
npm run dev
```

The server will start on `http://localhost:3000` (or another port if 3000 is in use).

### 2. Run E2E Tests

In another terminal, run the E2E tests:

```bash
npm run test:e2e
```

### Running E2E Tests in CI/CD

For CI/CD environments, you can use the following approach:

1. Start the dev server in the background:
```bash
npm run dev &
DEV_PID=$!
```

2. Wait for the server to be ready:
```bash
npx wait-on http://localhost:3000
```

3. Run the E2E tests:
```bash
npm run test:e2e
```

4. Stop the dev server:
```bash
kill $DEV_PID
```

### Alternative: Using Playwright's webServer Configuration

You can also configure Playwright to automatically start the dev server. Add this to your `playwright.config.js`:

```javascript
module.exports = {
  // ... other config
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
  // ... rest of config
};
```

## Test Coverage

The E2E tests cover:
- Homepage functionality
- Accessibility compliance
- Performance metrics
- Cross-browser compatibility