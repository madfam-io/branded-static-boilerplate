/**
 * Fix Paths for GitHub Pages with Repository Subdirectory
 * ========================================================
 * This script updates all paths to work correctly when deployed to GitHub Pages
 * at https://madfam-io.github.io/branded-static-boilerplate/
 * 
 * The issue: Relative paths like ./ and ../ don't account for the repo subdirectory
 * The solution: Use absolute paths with the repo name as base
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// GitHub Pages base path
const BASE_PATH = '/branded-static-boilerplate';

// Files to process
const filesToProcess = [
  'src/index.html',
  'src/pages/about.html',
  'src/pages/services.html',
  'src/pages/contact.html',
  'src/pages/privacy.html',
  'src/components/header/header.html',
  'src/components/footer/footer.html'
];

// Process each file
filesToProcess.forEach(filePath => {
  const fullPath = path.join(projectRoot, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`Skipping ${filePath} - file not found`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  const originalContent = content;
  
  // Fix home/logo links
  content = content.replace(/href="\.\.\/index\.html"/gu, `href="${BASE_PATH}/"`);
  content = content.replace(/href="\.\/index\.html"/gu, `href="${BASE_PATH}/"`);
  
  // Fix navigation links in root pages
  content = content.replace(/href="\.\/pages\//gu, `href="${BASE_PATH}/pages/`);
  
  // Fix navigation links in subpages
  content = content.replace(/href="\.\.\/pages\//gu, `href="${BASE_PATH}/pages/`);
  
  // Fix asset paths
  content = content.replace(/href="\.\.\/assets\//gu, `href="${BASE_PATH}/assets/`);
  content = content.replace(/href="\.\/assets\//gu, `href="${BASE_PATH}/assets/`);
  content = content.replace(/src="\.\.\/assets\//gu, `src="${BASE_PATH}/assets/`);
  content = content.replace(/src="\.\/assets\//gu, `src="${BASE_PATH}/assets/`);
  
  // Fix style paths
  content = content.replace(/href="\.\.\/styles\//gu, `href="${BASE_PATH}/styles/`);
  content = content.replace(/href="\.\/styles\//gu, `href="${BASE_PATH}/styles/`);
  
  // Fix component paths
  content = content.replace(/href="\.\.\/components\//gu, `href="${BASE_PATH}/components/`);
  content = content.replace(/href="\.\/components\//gu, `href="${BASE_PATH}/components/`);
  
  // Fix script paths
  content = content.replace(/src="\.\.\/scripts\//gu, `src="${BASE_PATH}/scripts/`);
  content = content.replace(/src="\.\/scripts\//gu, `src="${BASE_PATH}/scripts/`);
  
  // Fix JS imports in Vite build
  content = content.replace(/src="\.\.\/js\//gu, `src="${BASE_PATH}/js/`);
  content = content.replace(/src="\.\/js\//gu, `src="${BASE_PATH}/js/`);
  
  // Fix CSS imports in Vite build
  content = content.replace(/href="\.\.\/assets\/main/gu, `href="${BASE_PATH}/assets/main`);
  content = content.replace(/href="\.\/assets\/main/gu, `href="${BASE_PATH}/assets/main`);
  
  // Fix any remaining relative paths that were missed
  content = content.replace(/href="\.\.?\/(?!http|#|mailto)/gu, (match, offset, string) => {
    // Check what comes after
    const afterMatch = string.substring(offset + match.length);
    if (afterMatch.startsWith('pages/') || afterMatch.startsWith('assets/') || 
        afterMatch.startsWith('styles/') || afterMatch.startsWith('components/') || 
        afterMatch.startsWith('scripts/')) {
      return `href="${BASE_PATH}/`;
    }
    return match;
  });
  
  // Fix component path in footer (special case with ../../)
  content = content.replace(/href="\.\.\/\.\.\//gu, `href="${BASE_PATH}/`);
  
  // Write back only if changed
  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Updated paths in ${filePath}`);
  } else {
    console.log(`⏭️  No changes needed in ${filePath}`);
  }
});

// Also update vite.config.js to set base path
const viteConfigPath = path.join(projectRoot, 'vite.config.js');
if (fs.existsSync(viteConfigPath)) {
  let viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
  
  // Check if base is already set
  if (!viteConfig.includes('base:')) {
    // Add base after export default {
    viteConfig = viteConfig.replace(
      'export default {',
      `export default {\n  base: '${BASE_PATH}/',`
    );
    fs.writeFileSync(viteConfigPath, viteConfig, 'utf8');
    console.log('✅ Updated vite.config.js with base path');
  }
}

console.log('\n📝 GitHub Pages path fixing complete!');
console.log(`Site will be accessible at: https://madfam-io.github.io${BASE_PATH}/`);
console.log('Remember to run npm run build to see the changes in the dist folder.');