#!/usr/bin/env node

/**
 * =============================================================================
 * BSB SETUP SCRIPT - Initialize Development Environment
 * =============================================================================
 *
 * This script sets up the development environment including:
 * - Git hooks via Husky
 * - Initial build generation
 * - Environment verification
 *
 * Run this after cloning the repository:
 * npm run setup
 * =============================================================================
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

console.log('🚀 Setting up Branded Static Boilerplate...\n');

// Check Node version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));

if (majorVersion < 18) {
  console.error('❌ Node.js 18 or higher is required');
  console.error(`   Current version: ${nodeVersion}`);
  process.exit(1);
}

console.log('✅ Node.js version check passed');

// Initialize git if needed
if (!existsSync('.git')) {
  console.log('📁 Initializing git repository...');
  execSync('git init', { stdio: 'inherit' });
}

// Install dependencies
console.log('\n📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed');
} catch (error) {
  console.error('❌ Failed to install dependencies');
  process.exit(1);
}

// Set up Husky
console.log('\n🐶 Setting up git hooks...');
try {
  execSync('npx husky install', { stdio: 'inherit' });
  console.log('✅ Git hooks configured');
} catch (error) {
  console.error('❌ Failed to set up git hooks');
  console.error('   You can set them up manually with: npx husky install');
}

// Create initial build
console.log('\n🔨 Creating initial build...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Initial build created');
} catch (error) {
  console.error('⚠️  Warning: Initial build failed');
  console.error('   Run "npm run build" to build manually');
}

// Create .env.local if it doesn't exist
const envPath = join(process.cwd(), '.env.local');
if (!existsSync(envPath)) {
  console.log('\n📝 Creating .env.local file...');
  execSync('echo "# Local environment variables" > .env.local');
}

console.log('\n🎉 Setup complete!');
console.log('\n📚 Next steps:');
console.log('   1. Run "npm run dev" to start development server');
console.log('   2. Open https://localhost:3000 in your browser');
console.log('   3. Edit src/index.html to see changes');
console.log('   4. Check out the docs/ folder for tutorials');
console.log('\n💡 Tip: Enable dev mode for helpful tools:');
console.log('   localStorage.setItem("bsb-dev-mode", "true")');
console.log('\nHappy coding! 🚀');