#!/usr/bin/env node
/**
 * Lighthouse Quality Check for Pre-Push Hook
 * ===========================================
 * 
 * This script runs a quick Lighthouse audit to ensure quality standards
 * are maintained before pushing to the repository.
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// ANSI color codes
const colors = {
  blue: '\x1b[34m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  reset: '\x1b[0m'
};

console.log(`${colors.blue}🚀 Running quick Lighthouse audit...${colors.reset}`);

try {
  // Run lighthouse audit
  const { stdout, stderr } = await execAsync('npm run lighthouse:local -- --url index.html --no-open');
  
  // Extract scores from output
  const performanceMatch = stdout.match(/Performance: (\d+)/);
  const accessibilityMatch = stdout.match(/Accessibility: (\d+)/);
  
  let hasErrors = false;
  
  if (performanceMatch && parseInt(performanceMatch[1]) < 70) {
    console.error(`${colors.red}❌ Performance score is too low (${performanceMatch[1]}). Please optimize before pushing.${colors.reset}`);
    hasErrors = true;
  }
  
  if (accessibilityMatch && parseInt(accessibilityMatch[1]) < 90) {
    console.error(`${colors.red}❌ Accessibility score is too low (${accessibilityMatch[1]}). Please fix a11y issues before pushing.${colors.reset}`);
    hasErrors = true;
  }
  
  if (hasErrors) {
    process.exit(1);
  }
  
  console.log(`${colors.green}✅ Lighthouse checks passed!${colors.reset}`);
  
} catch (error) {
  console.error(`${colors.red}❌ Lighthouse audit failed. Check performance before pushing.${colors.reset}`);
  console.error(error.message);
  process.exit(1);
}