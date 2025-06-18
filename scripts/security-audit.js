#!/usr/bin/env node

/**
 * Security Audit Script
 * ======================
 *
 * Comprehensive security analysis for BSB.
 * Checks for vulnerabilities, security headers, and best practices.
 *
 * Features:
 * - Dependency vulnerability scanning
 * - Security header analysis
 * - Content Security Policy validation
 * - SSL/TLS configuration check
 * - Common security misconfiguration detection
 *
 * Usage:
 * - npm run security
 * - node scripts/security-audit.js [url]
 */

import { execSync } from 'child_process';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { URL } from 'url';

/**
 * Security headers that should be present
 */
const REQUIRED_HEADERS = {
  'content-security-policy': {
    required: true,
    description: 'Prevents XSS and other injection attacks'
  },
  'strict-transport-security': {
    required: true,
    description: 'Enforces HTTPS connections'
  },
  'x-frame-options': {
    required: true,
    description: 'Prevents clickjacking attacks'
  },
  'x-content-type-options': {
    required: true,
    description: 'Prevents MIME-type sniffing'
  },
  'referrer-policy': {
    required: true,
    description: 'Controls referrer information'
  },
  'permissions-policy': {
    required: false,
    description: 'Controls browser features and APIs'
  }
};

/**
 * Run npm audit for dependency vulnerabilities
 * @returns {Promise<Object>} Audit results
 */
const runDependencyAudit = async function runDependencyAudit() {
  try {
    console.log('🔍 Scanning dependencies for vulnerabilities...');

    const auditOutput = execSync('npm audit --json', {
      encoding: 'utf8',
      cwd: process.cwd()
    });

    return JSON.parse(auditOutput);
  } catch (error) {
    // Npm audit returns non-zero exit code when vulnerabilities found
    if (error.stdout) {
      try {
        return JSON.parse(error.stdout);
      } catch {
        return { error: 'Failed to parse npm audit output' };
      }
    }
    return { error: error.message };
  }
};

/**
 * Check security headers for a given URL
 * @param {string} url - URL to check
 * @returns {Promise<Object>} Header analysis
 */
const checkSecurityHeaders = async function checkSecurityHeaders(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'HEAD',
      timeout: 10000
    };

    const req = client.request(options, res => {
      const { headers } = res;
      const analysis = {
        present: {},
        missing: {},
        recommendations: []
      };

      // Check each required header
      Object.entries(REQUIRED_HEADERS).forEach(([headerName, config]) => {
        const headerValue = headers[headerName] || headers[headerName.toLowerCase()];

        if (headerValue) {
          analysis.present[headerName] = {
            value: headerValue,
            description: config.description
          };
        } else if (config.required) {
          analysis.missing[headerName] = {
            description: config.description,
            severity: 'high'
          };
        }
      });

      // Analyze specific headers
      if (headers['content-security-policy']) {
        const csp = headers['content-security-policy'];
        analysis.csp = analyzeCsp(csp);
      }

      if (!isHttps) {
        analysis.recommendations.push({
          type: 'protocol',
          message: 'Use HTTPS in production',
          severity: 'critical'
        });
      }

      resolve(analysis);
    });

    req.on('error', error => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
};

/**
 * Analyze Content Security Policy
 * @param {string} csp - CSP header value
 * @returns {Object} CSP analysis
 */
const analyzeCsp = function analyzeCsp(csp) {
  const directives = {};
  const issues = [];
  const recommendations = [];

  // Parse CSP directives
  csp.split(';').forEach(directive => {
    const parts = directive.trim().split(/\\s+/u);
    if (parts.length > 0) {
      const name = parts[0];
      const values = parts.slice(1);
      directives[name] = values;
    }
  });

  // Check for common issues
  if (directives['script-src']?.includes("'unsafe-inline'")) {
    issues.push({
      type: 'unsafe-inline',
      message: 'script-src allows unsafe-inline, which defeats XSS protection',
      severity: 'high'
    });
  }

  if (directives['script-src']?.includes("'unsafe-eval'")) {
    issues.push({
      type: 'unsafe-eval',
      message: 'script-src allows unsafe-eval, which can be dangerous',
      severity: 'medium'
    });
  }

  if (!directives['default-src']) {
    recommendations.push({
      type: 'default-src',
      message: 'Consider adding default-src directive as fallback',
      severity: 'low'
    });
  }

  if (!directives['img-src']) {
    recommendations.push({
      type: 'img-src',
      message: 'Consider restricting image sources',
      severity: 'low'
    });
  }

  return {
    directives,
    issues,
    recommendations
  };
};

/**
 * Check for common static site security issues
 * @returns {Array} Security recommendations
 */
const checkStaticSiteSecurityBestPractices = function checkStaticSiteSecurityBestPractices() {
  const issues = [];
  const recommendations = [];

  // Check for sensitive files in public directory
  const sensitiveFiles = [
    '.env',
    '.env.local',
    '.env.production',
    'config.json',
    'package.json',
    'package-lock.json',
    '.git',
    'node_modules'
  ];

  sensitiveFiles.forEach(file => {
    const filePath = path.join(process.cwd(), 'dist', file);
    if (fs.existsSync(filePath)) {
      issues.push({
        type: 'sensitive-file',
        message: `Sensitive file exposed: ${file}`,
        severity: 'high',
        file
      });
    }
  });

  // Check .gitignore
  const gitignorePath = path.join(process.cwd(), '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');

    const requiredIgnores = ['.env', 'node_modules/', '*.log'];
    requiredIgnores.forEach(pattern => {
      if (!gitignoreContent.includes(pattern)) {
        recommendations.push({
          type: 'gitignore',
          message: `Add ${pattern} to .gitignore`,
          severity: 'medium'
        });
      }
    });
  }

  // Check for proper file permissions (if on Unix-like system)
  if (process.platform !== 'win32') {
    try {
      const stats = fs.statSync(path.join(process.cwd(), 'dist'));
      const mode = (stats.mode & 0o777).toString(8);

      if (mode === '777') {
        issues.push({
          type: 'file-permissions',
          message: 'Overly permissive directory permissions detected',
          severity: 'medium'
        });
      }
    } catch (error) {
      // Ignore permission check errors
    }
  }

  return { issues, recommendations };
};

/**
 * Get status class based on total issues
 * @param {number} totalIssues - Number of total issues
 * @returns {string} CSS class name
 */
const getStatusClass = function getStatusClass(totalIssues) {
  if (totalIssues === 0) {
    return 'status-good';
  }
  if (totalIssues < 5) {
    return 'status-warning';
  }
  return 'status-danger';

};

/**
 * Get status message based on total issues
 * @param {number} totalIssues - Number of total issues
 * @returns {string} Status message
 */
const getStatusMessage = function getStatusMessage(totalIssues) {
  if (totalIssues === 0) {
    return '✅ No security issues detected!';
  }
  if (totalIssues < 5) {
    return `⚠️ ${totalIssues} security issues found`;
  }
  return `❌ ${totalIssues} security issues found`;

};

/**
 * Get dependency status class
 * @param {number} vulnCount - Number of vulnerabilities
 * @returns {string} CSS class name
 */
const getDependencyStatus = function getDependencyStatus(vulnCount) {
  return vulnCount === 0 ? 'status-good' : 'status-danger';
};

/**
 * Get header status class
 * @param {number} missingCount - Number of missing headers
 * @returns {string} CSS class name
 */
const getHeaderStatus = function getHeaderStatus(missingCount) {
  return missingCount === 0 ? 'status-good' : 'status-danger';
};

/**
 * Get static site status class
 * @param {number} issueCount - Number of static site issues
 * @returns {string} CSS class name
 */
const getStaticSiteStatus = function getStaticSiteStatus(issueCount) {
  return issueCount === 0 ? 'status-good' : 'status-warning';
};

/**
 * Generate security report
 * @param {Object} auditData - All collected security data
 * @returns {string} HTML report
 */
const generateSecurityReport = function generateSecurityReport(auditData) {
  const timestamp = new Date().toISOString();
  const {
    dependencies,
    headers,
    staticSite,
    url
  } = auditData;

  const totalIssues =
    (dependencies.vulnerabilities?.length || 0) +
    Object.keys(headers.missing || {}).length +
    (headers.csp?.issues?.length || 0) +
    staticSite.issues.length;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BSB Security Audit Report</title>
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
    .status-good { color: #28a745; }
    .status-warning { color: #ffc107; }
    .status-danger { color: #dc3545; }
    .section {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .issue {
      padding: 1rem;
      margin: 1rem 0;
      border-radius: 4px;
      border-left: 4px solid;
    }
    .issue-critical {
      background: #f8d7da;
      border-color: #dc3545;
      color: #721c24;
    }
    .issue-high {
      background: #fff3cd;
      border-color: #ffc107;
      color: #856404;
    }
    .issue-medium {
      background: #d4edda;
      border-color: #28a745;
      color: #155724;
    }
    .issue-low {
      background: #cce7ff;
      border-color: #007bff;
      color: #004085;
    }
    .header-present { color: #28a745; }
    .header-missing { color: #dc3545; }
    .vulnerability {
      background: #f8f9fa;
      padding: 1rem;
      margin: 0.5rem 0;
      border-radius: 4px;
      border-left: 3px solid #dc3545;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin: 2rem 0;
    }
    .summary-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .summary-value {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }
    code {
      background: #f1f3f4;
      padding: 0.25rem 0.5rem;
      border-radius: 3px;
      font-family: monospace;
    }
    .timestamp {
      color: #6c757d;
      font-size: 0.875rem;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🛡️ BSB Security Audit Report</h1>
    ${url ? `<p><strong>URL:</strong> <code>${url}</code></p>` : ''}
    <p class="${getStatusClass(totalIssues)}">
      ${getStatusMessage(totalIssues)}
    </p>
    <p class="timestamp">Generated: ${timestamp}</p>
  </div>

  <div class="summary-grid">
    <div class="summary-card">
      <div class="summary-value ${getDependencyStatus(dependencies.vulnerabilities?.length || 0)}">
        ${dependencies.vulnerabilities?.length || 0}
      </div>
      <div>Dependency Vulnerabilities</div>
    </div>
    <div class="summary-card">
      <div class="summary-value ${getHeaderStatus(Object.keys(headers.missing || {}).length)}">
        ${Object.keys(headers.missing || {}).length}
      </div>
      <div>Missing Security Headers</div>
    </div>
    <div class="summary-card">
      <div class="summary-value ${getStaticSiteStatus(staticSite.issues.length)}">
        ${staticSite.issues.length}
      </div>
      <div>Static Site Issues</div>
    </div>
  </div>

  <div class="section">
    <h2>📦 Dependency Security</h2>
    ${dependencies.error ? `
      <div class="issue issue-high">
        <h4>Audit Error</h4>
        <p>${dependencies.error}</p>
      </div>
    ` : dependencies.vulnerabilities && dependencies.vulnerabilities.length > 0 ? `
      <p class="status-danger">❌ ${dependencies.vulnerabilities.length} vulnerabilities found</p>
      ${dependencies.vulnerabilities.slice(0, 10).map(vuln => `
        <div class="vulnerability">
          <h4>${vuln.title}</h4>
          <p><strong>Severity:</strong> ${vuln.severity}</p>
          <p><strong>Package:</strong> ${vuln.module_name}@${vuln.version}</p>
          <p>${vuln.overview}</p>
          ${vuln.recommendation ? `<p><strong>Fix:</strong> ${vuln.recommendation}</p>` : ''}
        </div>
      `).join('')}
    ` : `
      <p class="status-good">✅ No known vulnerabilities in dependencies</p>
    `}
  </div>

  ${url ? `
  <div class="section">
    <h2>🔒 Security Headers</h2>
    <h3>Present Headers</h3>
    ${Object.keys(headers.present || {}).length > 0 ?
    Object.entries(headers.present).map(([name, info]) => `
        <div class="header-present">✅ <code>${name}</code>: ${info.value}</div>
        <p style="margin-left: 2rem; color: #6c757d;">${info.description}</p>
      `).join('') :
    '<p>No security headers detected</p>'
}

    <h3>Missing Headers</h3>
    ${Object.keys(headers.missing || {}).length > 0 ?
    Object.entries(headers.missing).map(([name, info]) => `
        <div class="header-missing">❌ <code>${name}</code></div>
        <p style="margin-left: 2rem; color: #6c757d;">${info.description}</p>
      `).join('') :
    '<p class="status-good">✅ All required headers present</p>'
}

    ${headers.csp ? `
    <h3>Content Security Policy Analysis</h3>
    <h4>Directives</h4>
    <ul>
      ${Object.entries(headers.csp.directives).map(([name, values]) =>
    `<li><code>${name}</code>: ${values.join(' ')}</li>`
  ).join('')}
    </ul>

    ${headers.csp.issues.length > 0 ? `
    <h4>CSP Issues</h4>
    ${headers.csp.issues.map(issue => `
      <div class="issue issue-${issue.severity}">
        <h5>${issue.type}</h5>
        <p>${issue.message}</p>
      </div>
    `).join('')}
    ` : '<p class="status-good">✅ No CSP issues detected</p>'}
    ` : ''}
  </div>
  ` : ''}

  <div class="section">
    <h2>📁 Static Site Security</h2>
    ${staticSite.issues.length > 0 ? `
    <h3>Issues Found</h3>
    ${staticSite.issues.map(issue => `
      <div class="issue issue-${issue.severity}">
        <h4>${issue.type}</h4>
        <p>${issue.message}</p>
        ${issue.file ? `<code>File: ${issue.file}</code>` : ''}
      </div>
    `).join('')}
    ` : '<p class="status-good">✅ No static site security issues found</p>'}

    ${staticSite.recommendations.length > 0 ? `
    <h3>Recommendations</h3>
    ${staticSite.recommendations.map(rec => `
      <div class="issue issue-${rec.severity}">
        <h4>${rec.type}</h4>
        <p>${rec.message}</p>
      </div>
    `).join('')}
    ` : ''}
  </div>

  <div class="section">
    <h2>🔧 Remediation Guide</h2>
    <h3>Quick Fixes</h3>
    <ul>
      <li><strong>Update dependencies:</strong> <code>npm audit fix</code></li>
      <li><strong>Configure security headers</strong> in your web server or CDN</li>
      <li><strong>Implement CSP</strong> to prevent XSS attacks</li>
      <li><strong>Use HTTPS</strong> for all production deployments</li>
      <li><strong>Review file permissions</strong> and remove sensitive files " +
        "from public directory</li>
    </ul>

    <h3>Resources</h3>
    <ul>
      <li><a href="https://owasp.org/www-project-secure-headers/">" +
        "OWASP Secure Headers Project</a></li>
      <li><a href="https://content-security-policy.com/">CSP Reference</a></li>
      <li><a href="https://securityheaders.com/">Security Headers Checker</a></li>
    </ul>
  </div>
</body>
</html>
  `.trim();
};

/**
 * Main execution function
 */
const main = async function main() {
  const url = process.argv[2];

  console.log('🛡️ Starting security audit...');
  if (url) {
    console.log(`🌐 URL: ${url}`);
  }

  const auditData = {
    url,
    timestamp: new Date().toISOString()
  };

  try {
    // Run dependency audit
    auditData.dependencies = await runDependencyAudit();

    // Check security headers if URL provided
    if (url) {
      console.log('🔒 Checking security headers...');
      auditData.headers = await checkSecurityHeaders(url);
    } else {
      auditData.headers = { present: {}, missing: {} };
    }

    // Check static site security
    console.log('📁 Checking static site security...');
    auditData.staticSite = checkStaticSiteSecurityBestPractices();

    // Generate report
    const reportDir = path.join(process.cwd(), 'coverage', 'security');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    // Save raw data
    const dataPath = path.join(reportDir, 'security-audit.json');
    fs.writeFileSync(dataPath, JSON.stringify(auditData, null, 2));

    // Generate HTML report
    const htmlReport = generateSecurityReport(auditData);
    const htmlReportPath = path.join(reportDir, 'security-report.html');
    fs.writeFileSync(htmlReportPath, htmlReport);

    // Console summary
    const dependencyVulns = auditData.dependencies.vulnerabilities?.length || 0;
    const missingHeaders = Object.keys(auditData.headers.missing).length;
    const staticIssues = auditData.staticSite.issues.length;
    const totalIssues = dependencyVulns + missingHeaders + staticIssues;

    console.log('\\n🛡️ Security Audit Summary:');
    console.log('='.repeat(50));
    console.log(`📦 Dependency vulnerabilities: ${dependencyVulns}`);
    console.log(`🔒 Missing security headers: ${missingHeaders}`);
    console.log(`📁 Static site issues: ${staticIssues}`);
    console.log(`🎯 Total issues: ${totalIssues}`);

    if (totalIssues === 0) {
      console.log('\\n✅ No security issues detected!');
    } else {
      console.log(`\\n⚠️  ${totalIssues} security issues require attention`);
    }

    console.log(`\\n📄 Detailed report: ${htmlReportPath}`);

    // Exit with error code if critical issues found
    if (dependencyVulns > 0 || missingHeaders > 2) {
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Security audit failed:', error.message);
    process.exit(1);
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}