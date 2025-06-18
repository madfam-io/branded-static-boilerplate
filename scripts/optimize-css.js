/**
 * CSS Optimization Script
 * =======================
 * Optimizes CSS for better performance
 */

import { promises as fs } from 'fs';
import path from 'path';
import postcss from 'postcss';
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function optimizeCSS() {
  const distDir = path.join(__dirname, '..', 'dist');
  const assetsDir = path.join(distDir, 'assets');
  
  try {
    const files = await fs.readdir(assetsDir);
    const cssFiles = files.filter(f => f.endsWith('.css'));
    
    console.log(`🎨 Optimizing ${cssFiles.length} CSS files...`);
    
    for (const file of cssFiles) {
      const filePath = path.join(assetsDir, file);
      const css = await fs.readFile(filePath, 'utf8');
      
      // Skip already minified files
      if (css.length < 1000 && !css.includes('\n')) {
        console.log(`  ⏩ Skipping ${file} (already minified)`);
        continue;
      }
      
      const result = await postcss([
        autoprefixer(),
        cssnano({
          preset: ['default', {
            discardComments: {
              removeAll: true,
            },
            normalizeWhitespace: true,
            colormin: true,
            minifySelectors: true,
            minifyFontValues: true,
            discardUnused: false, // Keep all rules
            reduceIdents: false, // Don't rename identifiers
          }]
        })
      ]).process(css, { from: filePath, to: filePath });
      
      const originalSize = css.length;
      const newSize = result.css.length;
      const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);
      
      await fs.writeFile(filePath, result.css);
      
      console.log(`  ✅ ${file}: ${(originalSize/1024).toFixed(1)}KB → ${(newSize/1024).toFixed(1)}KB (${savings}% reduction)`);
    }
    
    console.log('\n✨ CSS optimization complete!');
  } catch (error) {
    console.error('❌ CSS optimization failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  optimizeCSS();
}

export { optimizeCSS };