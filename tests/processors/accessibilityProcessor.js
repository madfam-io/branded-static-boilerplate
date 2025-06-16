/**
 * Accessibility Test Results Processor
 * ====================================
 * 
 * Processes Jest test results to extract accessibility violations
 * and generate comprehensive accessibility reports.
 */

import fs from 'fs';
import path from 'path';

/**
 * Process test results and generate accessibility report
 * @param {Object} testResults - Jest test results object
 * @returns {Object} Modified test results
 */
export default function accessibilityProcessor(testResults) {
  const accessibilityViolations = [];
  const accessibilityPasses = [];
  
  // Extract accessibility test results
  testResults.testResults.forEach(testFile => {
    testFile.assertionResults.forEach(assertion => {
      // Look for accessibility-related tests
      if (assertion.title.includes('accessibility') || 
          assertion.title.includes('a11y') ||
          assertion.title.includes('axe')) {
        
        if (assertion.status === 'failed') {
          accessibilityViolations.push({
            file: testFile.testFilePath,
            test: assertion.title,
            message: assertion.failureMessages?.[0] || 'Unknown accessibility violation',
            location: assertion.location
          });
        } else if (assertion.status === 'passed') {
          accessibilityPasses.push({
            file: testFile.testFilePath,
            test: assertion.title,
            duration: assertion.duration
          });
        }
      }
    });
  });
  
  // Generate accessibility report
  const report = {
    summary: {
      totalTests: accessibilityViolations.length + accessibilityPasses.length,
      passed: accessibilityPasses.length,
      failed: accessibilityViolations.length,
      timestamp: new Date().toISOString()
    },
    violations: accessibilityViolations,
    passes: accessibilityPasses
  };
  
  // Write accessibility report to file
  const reportDir = path.join(process.cwd(), 'coverage', 'accessibility');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  const reportPath = path.join(reportDir, 'accessibility-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  // Generate human-readable HTML report
  const htmlReport = generateHtmlReport(report);
  const htmlReportPath = path.join(reportDir, 'accessibility-report.html');
  fs.writeFileSync(htmlReportPath, htmlReport);
  
  // Log summary to console
  console.log('\\n🔍 Accessibility Test Summary:');
  console.log(`   ✅ Passed: ${report.summary.passed}`);
  console.log(`   ❌ Failed: ${report.summary.failed}`);
  console.log(`   📊 Report: ${htmlReportPath}`);
  
  // Add accessibility summary to test results
  testResults.accessibilitySummary = report.summary;
  
  return testResults;
}

/**
 * Generate HTML accessibility report
 * @param {Object} report - Accessibility report data
 * @returns {string} HTML report content
 */
function generateHtmlReport(report) {
  const { summary, violations, passes } = report;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BSB Accessibility Report</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      line-height: 1.6;
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      background: #f8f9fa;
    }
    .header {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin: 2rem 0;
    }
    .metric {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .metric-value {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }
    .metric-passed { color: #28a745; }
    .metric-failed { color: #dc3545; }
    .metric-total { color: #007bff; }
    .section {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .violation {
      border-left: 4px solid #dc3545;
      padding: 1rem;
      margin: 1rem 0;
      background: #f8f9fa;
      border-radius: 0 4px 4px 0;
    }
    .pass {
      border-left: 4px solid #28a745;
      padding: 1rem;
      margin: 1rem 0;
      background: #f8f9fa;
      border-radius: 0 4px 4px 0;
    }
    .file-path {
      font-family: monospace;
      background: #e9ecef;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
    }
    .test-title {
      font-weight: bold;
      color: #495057;
      margin-bottom: 0.5rem;
    }
    .violation-message {
      color: #721c24;
      font-size: 0.875rem;
      white-space: pre-wrap;
    }
    .timestamp {
      color: #6c757d;
      font-size: 0.875rem;
    }
    pre {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 4px;
      overflow-x: auto;
      border: 1px solid #dee2e6;
    }
    .no-issues {
      text-align: center;
      color: #28a745;
      font-size: 1.25rem;
      margin: 2rem 0;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🛡️ BSB Accessibility Report</h1>
    <p class="timestamp">Generated: ${summary.timestamp}</p>
  </div>
  
  <div class="summary">
    <div class="metric">
      <div class="metric-value metric-total">${summary.totalTests}</div>
      <div>Total Tests</div>
    </div>
    <div class="metric">
      <div class="metric-value metric-passed">${summary.passed}</div>
      <div>Passed</div>
    </div>
    <div class="metric">
      <div class="metric-value metric-failed">${summary.failed}</div>
      <div>Failed</div>
    </div>
  </div>
  
  ${violations.length > 0 ? `
  <div class="section">
    <h2>❌ Accessibility Violations (${violations.length})</h2>
    ${violations.map(violation => `
      <div class="violation">
        <div class="test-title">${violation.test}</div>
        <div class="file-path">${violation.file}</div>
        <div class="violation-message">${violation.message}</div>
      </div>
    `).join('')}
  </div>
  ` : ''}
  
  ${passes.length > 0 ? `
  <div class="section">
    <h2>✅ Passed Tests (${passes.length})</h2>
    ${passes.map(pass => `
      <div class="pass">
        <div class="test-title">${pass.test}</div>
        <div class="file-path">${pass.file}</div>
        ${pass.duration ? `<div>Duration: ${pass.duration}ms</div>` : ''}
      </div>
    `).join('')}
  </div>
  ` : ''}
  
  ${violations.length === 0 && passes.length > 0 ? `
    <div class="no-issues">
      🎉 All accessibility tests passed!
    </div>
  ` : ''}
  
  <div class="section">
    <h3>About This Report</h3>
    <p>This report shows the results of automated accessibility testing using axe-core. 
    It checks for common accessibility issues including:</p>
    <ul>
      <li>Color contrast ratios</li>
      <li>Keyboard navigation</li>
      <li>Screen reader compatibility</li>
      <li>ARIA labels and roles</li>
      <li>Semantic HTML structure</li>
      <li>WCAG 2.1 AA compliance</li>
    </ul>
    <p><strong>Note:</strong> Automated testing catches ~30% of accessibility issues. 
    Manual testing with assistive technologies is still required for full compliance.</p>
  </div>
</body>
</html>
  `.trim();
}