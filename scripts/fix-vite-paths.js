/**
 * Fix Paths for Vite Build with GitHub Pages
 * ===========================================
 * This script reverts CSS and JS paths back to relative paths since
 * Vite handles these during build time, but keeps navigation paths absolute.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Files to process
const filesToProcess = [
  'src/index.html',
  'src/pages/about.html',
  'src/pages/services.html',
  'src/pages/contact.html',
  'src/pages/privacy.html'
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
  
  // Determine if this is a root file or in pages/
  const isRootFile = filePath === 'src/index.html';
  const prefix = isRootFile ? '.' : '..';
  
  // Fix CSS paths back to relative
  content = content.replace(
    /href="\/branded-static-boilerplate\/styles\//gu,
    `href="${prefix}/styles/`
  );
  content = content.replace(
    /href="\/branded-static-boilerplate\/components\//gu,
    `href="${prefix}/components/`
  );
  
  // Fix JS paths back to relative
  content = content.replace(
    /src="\/branded-static-boilerplate\/scripts\//gu,
    `src="${prefix}/scripts/`
  );
  
  // Fix asset paths back to relative (favicon)
  content = content.replace(
    /href="\/branded-static-boilerplate\/assets\//gu,
    `href="${prefix}/assets/`
  );
  content = content.replace(
    /src="\/branded-static-boilerplate\/assets\//gu,
    `src="${prefix}/assets/`
  );
  
  // Write back only if changed
  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Fixed asset paths in ${filePath}`);
  } else {
    console.log(`⏭️  No changes needed in ${filePath}`);
  }
});

console.log('\n📝 Vite path fixing complete!');
console.log(
  'Navigation links remain absolute for GitHub Pages, but assets use relative paths for Vite.'
);