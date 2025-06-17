/**
 * Lighthouse CI Configuration
 * 
 * This configuration file controls how Lighthouse CI runs audits
 * on the BSB project. It defines which URLs to test, what assertions
 * to make, and how to handle the results.
 * 
 * Learn more: https://github.com/GoogleChrome/lighthouse-ci
 */

module.exports = {
  ci: {
    collect: {
      // Static site server settings
      staticDistDir: './dist',
      
      // URLs to audit (relative to staticDistDir)
      url: [
        'http://localhost/index.html',
        'http://localhost/pages/interactive-playground.html',
        'http://localhost/pages/project-structure.html',
        'http://localhost/pages/design-system.html',
        'http://localhost/pages/about.html'
      ],
      
      // Number of runs per URL
      numberOfRuns: 3,
      
      // Chrome settings
      settings: {
        preset: 'desktop',
        throttling: {
          cpuSlowdownMultiplier: 1
        },
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false
        }
      },
      
      // Chrome launch options
      chromeFlags: [
        '--disable-dev-shm-usage',
        '--no-sandbox',
        '--headless',
        '--disable-gpu'
      ]
    },
    
    assert: {
      // Assertions for all URLs
      assertions: {
        // Performance
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 4000 }],
        'interactive': ['warn', { maxNumericValue: 5000 }],
        'speed-index': ['warn', { maxNumericValue: 4000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        
        // Accessibility
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'color-contrast': 'error',
        'heading-order': 'error',
        'image-alt': 'error',
        'link-name': 'error',
        'list': 'error',
        'meta-viewport': 'error',
        
        // Best Practices
        'errors-in-console': 'warn',
        'no-document-write': 'error',
        'geolocation-on-start': 'error',
        'notification-on-start': 'error',
        // 'no-vulnerable-libraries' was removed in Lighthouse v10.0.0
        'uses-http2': 'warn',
        'uses-passive-event-listeners': 'warn',
        
        // SEO
        'document-title': 'error',
        'meta-description': 'error',
        'crawlable-anchors': 'error',
        'is-crawlable': 'error',
        'robots-txt': 'warn',
        'hreflang': 'warn',
        'canonical': 'warn',
        // 'structured-data' is a manual audit that doesn't generate automatic scores
        
        // PWA (Progressive Web App)
        'viewport': 'error',
        'installable-manifest': 'off', // Not a PWA yet
        'service-worker': 'off', // Not a PWA yet
        'offline-start-url': 'off', // Not a PWA yet
        
        // Security
        'is-on-https': 'off', // Local development
        'redirects-http': 'off', // Local development
        
        // Resource optimization
        'uses-webp-images': 'warn',
        'uses-optimized-images': 'warn',
        'uses-text-compression': 'warn',
        'uses-responsive-images': 'warn',
        'efficient-animated-content': 'warn',
        
        // JavaScript
        'no-unload-listeners': 'error',
        'duplicated-javascript': 'warn',
        'legacy-javascript': 'warn',
        
        // CSS
        'unused-css-rules': 'warn',
        
        // Fonts
        'font-display': 'warn',
        
        // Budgets
        'resource-summary:script:size': ['warn', { maxNumericValue: 200000 }],
        'resource-summary:stylesheet:size': ['warn', { maxNumericValue: 100000 }],
        'resource-summary:image:size': ['warn', { maxNumericValue: 500000 }],
        'resource-summary:font:size': ['warn', { maxNumericValue: 200000 }],
        'resource-summary:total:size': ['error', { maxNumericValue: 2000000 }],
        
        // Category-level assertions (as a backup/overview)
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
        'categories:pwa': ['off'] // Not a PWA yet
      }
    },
    
    upload: {
      // Upload results to temporary public storage
      target: 'temporary-public-storage',
      
      // GitHub status checks
      githubAppToken: process.env.LHCI_GITHUB_APP_TOKEN,
      githubStatusContextSuffix: '/lighthouse-ci',
      
      // Output settings
      outputDir: '.lighthouseci',
      reportFilenamePattern: '%%PATHNAME%%-%%DATETIME%%-report.%%EXTENSION%%'
    },
    
    server: {
      // Server settings for viewing reports
      port: 9001,
      storage: {
        storageMethod: 'sql',
        sqlDatabasePath: '.lighthouseci/db.sql'
      }
    }
  },
  
  // Custom Lighthouse configuration
  lighthouse: {
    config: {
      extends: 'lighthouse:default',
      settings: {
        skipAudits: [
          'uses-http2', // Not relevant for static sites
          'offline-start-url', // Not a PWA
          'installable-manifest' // Not a PWA
        ]
      },
      categories: {
        // Custom scoring weights
        performance: {
          auditRefs: [
            { id: 'first-contentful-paint', weight: 3 },
            { id: 'largest-contentful-paint', weight: 3 },
            { id: 'cumulative-layout-shift', weight: 2 },
            { id: 'total-blocking-time', weight: 2 }
          ]
        }
      }
    }
  }
};