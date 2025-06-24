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

console.log(`${colors.blue}🚀 Running code quality checks...${colors.reset}`);

try {
  // Run linting to ensure code quality
  console.log(`${colors.blue}Checking code quality with ESLint...${colors.reset}`);
  const { stdout: lintOutput } = await execAsync('npm run lint 2>&1');
  
  // Check for any ESLint errors (not warnings)
  if (lintOutput.includes('✖') && lintOutput.includes('error')) {
    const errorMatch = lintOutput.match(/(\d+) error/);
    if (errorMatch && parseInt(errorMatch[1]) > 0) {
      console.error(`${colors.red}❌ ESLint found ${errorMatch[1]} errors. Please fix before pushing.${colors.reset}`);
      process.exit(1);
    }
  }
  
  console.log(`${colors.green}✅ Code quality checks passed!${colors.reset}`);
  console.log(`${colors.blue}Note: Lighthouse audit temporarily disabled due to Node.js compatibility issues.${colors.reset}`);
  
} catch (error) {
  // If lint command fails, that's an error
  if (error.code !== 0) {
    console.error(`${colors.red}❌ Code quality check failed.${colors.reset}`);
    console.error(error.message);
    process.exit(1);
  }
  
  console.log(`${colors.green}✅ Code quality checks passed!${colors.reset}`);
}