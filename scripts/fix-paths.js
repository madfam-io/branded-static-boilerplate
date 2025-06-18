/**
 * Fix Paths for GitHub Pages
 * ==========================
 * This script updates all absolute paths to relative paths so the site
 * works correctly when deployed to GitHub Pages subdirectory.
 *
 * Conversion rules:
 * - In root files: / -> ./
 * - In pages subdirectory: / -> ../
 * - CSS/JS imports already use relative paths (good!)
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
  'src/components/header/header.html',
  'src/components/footer/footer.html'
];

// Function to determine relative path based on file location
const getRelativePrefix = function getRelativePrefix(filePath) {
  const relativePath = path.relative(projectRoot, filePath);
  const depth = relativePath.split(path.sep).length - 2; // -2 for src/ and filename

  if (depth === 0) {
    // Root level (src/index.html)
    return '.';
  }
  if (depth === 1) {
    // One level deep (src/pages/*.html)
    return '..';
  }
  // Deeper levels
  return '../'.repeat(depth);

};

// Process each file
filesToProcess.forEach(filePath => {
  const fullPath = path.join(projectRoot, filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`Skipping ${filePath} - file not found`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  const originalContent = content;
  const prefix = getRelativePrefix(fullPath);

  // Fix navigation links
  // Root links
  content = content.replace(/href="\/"/gu, `href="${prefix}/index.html"`);

  // Page links
  content = content.replace(/href="\/pages\//gu, `href="${prefix}/pages/`);

  // Asset links (favicon, etc)
  content = content.replace(/href="\/assets\//gu, `href="${prefix}/assets/`);
  content = content.replace(/src="\/assets\//gu, `src="${prefix}/assets/`);

  // Style links
  content = content.replace(/href="\/styles\//gu, `href="${prefix}/styles/`);

  // Component links
  content = content.replace(/href="\/components\//gu, `href="${prefix}/components/`);

  // Script links
  content = content.replace(/src="\/scripts\//gu, `src="${prefix}/scripts/`);

  // Documentation links - these will point to GitHub
  content = content.replace(
    /href="\/docs\//gu,
    'href="https://github.com/madfam-io/branded-static-boilerplate/tree/main/docs/'
  );
  content = content.replace(
    /href="\/CONTRIBUTING\.html"/gu,
    'href="https://github.com/madfam-io/branded-static-boilerplate/blob/main/CONTRIBUTING.md"'
  );
  content = content.replace(
    /href="\/LICENSE\.html"/gu,
    'href="https://github.com/madfam-io/branded-static-boilerplate/blob/main/LICENSE"'
  );

  // Fix any remaining absolute paths we might have missed
  content = content.replace(/href="\/([^"]+)"/gu, (match, path) => {
    if (path.startsWith('http') || path.startsWith('#') || path.startsWith('mailto:')) {
      return match; // Don't change external links or anchors
    }
    console.log(`Found additional absolute path: ${match} in ${filePath}`);
    return `href="${prefix}/${path}"`;
  });

  // Write back only if changed
  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Updated paths in ${filePath}`);
  } else {
    console.log(`⏭️  No changes needed in ${filePath}`);
  }
});

console.log('\n📝 Path fixing complete!');
console.log('Remember to run npm run build to see the changes in the dist folder.');