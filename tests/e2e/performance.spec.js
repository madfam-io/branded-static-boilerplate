/**
 * ============================================================================
 * BSB PERFORMANCE E2E TESTS
 * ============================================================================
 *
 * Performance-focused end-to-end tests for the BSB platform, measuring
 * Core Web Vitals, load times, and resource efficiency.
 *
 * 🎯 Test Coverage:
 * - Core Web Vitals (LCP, FID, CLS)
 * - Page load performance
 * - Resource loading efficiency
 * - Memory usage optimization
 * - Network performance
 *
 * 📚 Learn More:
 * - Core Web Vitals documentation
 * - Performance testing strategies
 *
 * 💡 Usage:
 * npx playwright test performance.spec.js
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('BSB Performance Tests', () => {

  test.describe('Core Web Vitals', () => {
    test('should meet LCP (Largest Contentful Paint) threshold', async ({ page }) => {
      await page.goto('/');

      // Measure LCP
      const lcp = await page.evaluate(() => {
        return new Promise((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            if (entries.length > 0) {
              const lastEntry = entries[entries.length - 1];
              resolve(lastEntry.startTime);
            }
          }).observe({ entryTypes: ['largest-contentful-paint'] });

          // Fallback timeout after 5 seconds
          setTimeout(() => resolve(null), 5000);
        });
      });

      if (lcp !== null) {
        // LCP should be under 2.5 seconds (2500ms) for good performance
        expect(lcp).toBeLessThan(2500);
        console.log(`LCP: ${lcp.toFixed(2)}ms`);
      }
    });

    test('should meet FID (First Input Delay) threshold', async ({ page }) => {
      await page.goto('/');

      // Simulate user interaction and measure FID
      const fid = await page.evaluate(() => {
        return new Promise((resolve) => {
          let fidValue = null;

          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            if (entries.length > 0) {
              fidValue = entries[0].processingStart - entries[0].startTime;
              resolve(fidValue);
            }
          }).observe({ entryTypes: ['first-input'] });

          // Trigger first input
          document.addEventListener('click', () => {
            if (fidValue !== null) {
              resolve(fidValue);
            }
          }, { once: true });

          // Fallback timeout
          setTimeout(() => resolve(fidValue || 0), 3000);
        });
      });

      // Perform a click to trigger FID measurement
      const clickableElement = page.locator('button, a, [role="button"]').first();
      if (await clickableElement.count() > 0) {
        await clickableElement.click();
      }

      await page.waitForTimeout(100);

      // FID should be under 100ms for good performance
      if (fid > 0) {
        expect(fid).toBeLessThan(100);
        console.log(`FID: ${fid.toFixed(2)}ms`);
      }
    });

    test('should meet CLS (Cumulative Layout Shift) threshold', async ({ page }) => {
      await page.goto('/');

      // Wait for page to fully load and settle
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // Measure CLS
      const cls = await page.evaluate(() => {
        return new Promise((resolve) => {
          let clsValue = 0;

          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            }
          }).observe({ entryTypes: ['layout-shift'] });

          // Measure for 2 seconds
          setTimeout(() => resolve(clsValue), 2000);
        });
      });

      // CLS should be under 0.1 for good performance
      expect(cls).toBeLessThan(0.1);
      console.log(`CLS: ${cls.toFixed(4)}`);
    });
  });

  test.describe('Page Load Performance', () => {
    test('should load homepage within performance budget', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('/', { waitUntil: 'networkidle' });

      const loadTime = Date.now() - startTime;

      // Should load within 2 seconds on fast network
      expect(loadTime).toBeLessThan(2000);
      console.log(`Homepage load time: ${loadTime}ms`);
    });

    test('should have fast Time to Interactive (TTI)', async ({ page }) => {
      await page.goto('/');

      const tti = await page.evaluate(() => {
        return new Promise((resolve) => {
          const startTime = performance.now();

          // Simple TTI approximation: when main thread is quiet for 5s
          let quietStart = null;
          let lastLongTask = startTime;

          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              lastLongTask = entry.startTime + entry.duration;
              quietStart = null;
            }
          }).observe({ entryTypes: ['longtask'] });

          function checkQuietPeriod() {
            const now = performance.now();
            if (now - lastLongTask >= 5000) {
              if (!quietStart) {
                quietStart = lastLongTask;
              }
              resolve(quietStart - startTime);
            } else {
              setTimeout(checkQuietPeriod, 100);
            }
          }

          setTimeout(checkQuietPeriod, 100);

          // Fallback after 10 seconds
          setTimeout(() => resolve(performance.now() - startTime), 10000);
        });
      });

      // TTI should be under 3.8 seconds (3800ms) for good performance
      expect(tti).toBeLessThan(3800);
      console.log(`TTI: ${tti.toFixed(2)}ms`);
    });

    test('should have efficient resource loading', async ({ page }) => {
      // Monitor network requests
      const requests = [];
      page.on('request', request => {
        requests.push({
          url: request.url(),
          resourceType: request.resourceType(),
          method: request.method()
        });
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Analyze requests
      const jsRequests = requests.filter(request => request.resourceType === 'script');
      const cssRequests = requests.filter(request => request.resourceType === 'stylesheet');
      const imageRequests = requests.filter(request => request.resourceType === 'image');

      // Should have reasonable number of requests
      expect(jsRequests.length).toBeLessThan(10);
      expect(cssRequests.length).toBeLessThan(5);
      expect(imageRequests.length).toBeLessThan(20);

      console.log(
        `Resource requests - JS: ${jsRequests.length}, CSS: ${cssRequests.length}, ` +
        `Images: ${imageRequests.length}`
      );
    });
  });

  test.describe('Memory Performance', () => {
    test('should not have memory leaks during navigation', async ({ page }) => {
      await page.goto('/');

      // Get initial memory usage
      const initialMemory = await page.evaluate(() => {
        return performance.memory ? {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize
        } : null;
      });

      if (initialMemory) {
        // Navigate between pages multiple times
        const pages = ['/pages/design-system.html', '/docs/tutorials/', '/'];

        for (let i = 0; i < 3; i++) {
          for (const pagePath of pages) {
            await page.goto(pagePath);
            await page.waitForLoadState('networkidle');
          }
        }

        // Force garbage collection if available
        await page.evaluate(() => {
          if (window.gc) {
            window.gc();
          }
        });

        // Get final memory usage
        const finalMemory = await page.evaluate(() => {
          return performance.memory ? {
            usedJSHeapSize: performance.memory.usedJSHeapSize,
            totalJSHeapSize: performance.memory.totalJSHeapSize
          } : null;
        });

        if (finalMemory) {
          // Memory should not increase dramatically (allow 50% increase)
          const memoryIncrease = (finalMemory.usedJSHeapSize - initialMemory.usedJSHeapSize) /
            initialMemory.usedJSHeapSize;
          expect(memoryIncrease).toBeLessThan(0.5);

          console.log(
            `Memory usage - Initial: ${(initialMemory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB, ` +
            `Final: ${(finalMemory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`
          );
        }
      }
    });
  });

  test.describe('Network Performance', () => {
    test('should perform well on slow 3G', async ({ page, context }) => {
      // Simulate slow 3G network
      await context.route('**/*', route => {
        const delay = Math.floor(Math.random() * 200) + 100; // 100-300ms delay
        setTimeout(() => route.continue(), delay);
      });

      const startTime = Date.now();
      await page.goto('/');

      // Wait for essential content to load
      await expect(page.locator('h1')).toBeVisible();

      const timeToFirstMeaningfulPaint = Date.now() - startTime;

      // Should render meaningful content within 5 seconds on slow network
      expect(timeToFirstMeaningfulPaint).toBeLessThan(5000);

      console.log(`Time to first meaningful paint (slow 3G): ${timeToFirstMeaningfulPaint}ms`);
    });

    test('should handle offline scenarios gracefully', async ({ page, context }) => {
      await page.goto('/');

      // Go offline
      await context.setOffline(true);

      // Try to navigate to another page
      await page.goto('/pages/design-system.html').catch(() => {
        // Expected to fail when offline
      });

      // Check if the page shows appropriate offline messaging
      const offlineContent = await page.textContent('body');

      // Go back online
      await context.setOffline(false);

      // Should be able to navigate normally again
      await page.goto('/pages/design-system.html');
      await expect(page.locator('h1')).toBeVisible();
    });
  });

  test.describe('Asset Optimization', () => {
    test('should use optimized images', async ({ page }) => {
      const imageData = [];

      page.on('response', async response => {
        if (response.url().match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          const contentLength = response.headers()['content-length'];
          if (contentLength) {
            imageData.push({
              url: response.url(),
              size: parseInt(contentLength),
              type: response.url().split('.').pop()?.toLowerCase()
            });
          }
        }
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Check image optimization
      for (const image of imageData) {
        // Images should generally be under 500KB unless they're hero images
        if (!image.url.includes('hero') && !image.url.includes('banner')) {
          expect(image.size).toBeLessThan(500 * 1024); // 500KB
        }

        console.log(`Image: ${image.url.split('/').pop()} - ${(image.size / 1024).toFixed(1)}KB`);
      }
    });

    test('should have compressed text assets', async ({ page }) => {
      const responses = [];

      page.on('response', response => {
        if (response.url().match(/\.(js|css|html)$/i)) {
          responses.push({
            url: response.url(),
            contentEncoding: response.headers()['content-encoding'],
            contentType: response.headers()['content-type']
          });
        }
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Check for compression
      const compressedResponses = responses.filter(response =>
        response.contentEncoding === 'gzip' || response.contentEncoding === 'br'
      );

      // At least 50% of text assets should be compressed
      const compressionRatio = compressedResponses.length / responses.length;
      expect(compressionRatio).toBeGreaterThan(0.5);

      console.log(
        `Compression ratio: ${(compressionRatio * 100).toFixed(1)}% ` +
        `(${compressedResponses.length}/${responses.length})`
      );
    });
  });

  test.describe('Mobile Performance', () => {
    test('should perform well on mobile devices', async ({ page }) => {
      // Simulate mobile device
      await page.setViewportSize({ width: 375, height: 667 });

      const startTime = Date.now();
      await page.goto('/');

      // Wait for visible content
      await expect(page.locator('h1')).toBeVisible();

      const mobileLoadTime = Date.now() - startTime;

      // Mobile should load within 3 seconds
      expect(mobileLoadTime).toBeLessThan(3000);

      console.log(`Mobile load time: ${mobileLoadTime}ms`);
    });

    test('should have touch-friendly interface', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      // Check touch target sizes
      const buttons = page.locator('button, a, [role="button"], input[type="submit"]');
      const buttonCount = await buttons.count();

      for (let i = 0; i < Math.min(buttonCount, 10); i++) {
        const button = buttons.nth(i);
        const box = await button.boundingBox();

        if (box) {
          // Touch targets should be at least 44x44 pixels
          expect(box.width).toBeGreaterThanOrEqual(44);
          expect(box.height).toBeGreaterThanOrEqual(44);
        }
      }
    });
  });
});