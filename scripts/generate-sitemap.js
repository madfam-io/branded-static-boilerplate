#!/usr/bin/env node

/**
 * =============================================================================
 * SITEMAP GENERATOR - Automated XML Sitemap Creation
 * =============================================================================
 * 
 * This script generates an XML sitemap for the BSB project, helping search
 * engines discover and index all pages efficiently.
 * 
 * 🎯 Features:
 * - Automatic page discovery
 * - Priority calculation based on depth
 * - Last modified dates from git
 * - Multi-language support
 * - Educational comments in output
 * 
 * 📚 Educational Value:
 * - Learn sitemap best practices
 * - Understand URL prioritization
 * - See multi-language implementation
 * 
 * Usage: npm run generate:sitemap
 * =============================================================================
 */

import { readdir, readFile, writeFile, stat } from 'fs/promises';
import { join, relative, extname } from 'path';
import { execSync } from 'child_process';

const CONFIG = {
  baseUrl: 'https://madfam-io.github.io/branded-static-boilerplate',
  distDir: './dist',
  outputFile: './dist/sitemap.xml',
  languages: ['en', 'es'],
  defaultLang: 'en',
  priorities: {
    'index.html': 1.0,
    'pages/about.html': 0.8,
    'pages/services.html': 0.8,
    'pages/interactive-playground.html': 0.9,
    'pages/project-structure.html': 0.9,
    'pages/design-system.html': 0.8,
    'pages/contact.html': 0.7,
    'pages/privacy.html': 0.3
  },
  changefreq: {
    'index.html': 'weekly',
    'pages/interactive-playground.html': 'weekly',
    'pages/project-structure.html': 'monthly',
    default: 'monthly'
  }
};

/**
 * Get all HTML files recursively
 * @param {string} dir - Directory to scan
 * @returns {Promise<Array>} List of HTML files
 */
async function getHtmlFiles(dir) {
  const files = [];
  const items = await readdir(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = join(dir, item.name);
    
    if (item.isDirectory()) {
      // Skip assets directories
      if (!['assets', 'js', 'images', 'fonts'].includes(item.name)) {
        files.push(...await getHtmlFiles(fullPath));
      }
    } else if (item.isFile() && extname(item.name) === '.html') {
      files.push(fullPath);
    }
  }
  
  return files;
}

/**
 * Get last modified date from git
 * @param {string} filePath - File path
 * @returns {string} ISO date string
 */
function getLastModified(filePath) {
  try {
    const gitDate = execSync(`git log -1 --format=%cI -- ${filePath}`, {
      encoding: 'utf-8'
    }).trim();
    
    return gitDate || new Date().toISOString();
  } catch (error) {
    // Fallback to file stats if git fails
    return new Date().toISOString();
  }
}

/**
 * Calculate URL priority
 * @param {string} relativePath - Relative file path
 * @returns {number} Priority value (0.0-1.0)
 */
function calculatePriority(relativePath) {
  // Check predefined priorities
  if (CONFIG.priorities[relativePath] !== undefined) {
    return CONFIG.priorities[relativePath];
  }
  
  // Calculate based on depth
  const depth = relativePath.split('/').length - 1;
  return Math.max(0.5, 1.0 - (depth * 0.1));
}

/**
 * Get change frequency
 * @param {string} relativePath - Relative file path
 * @returns {string} Change frequency
 */
function getChangeFrequency(relativePath) {
  return CONFIG.changefreq[relativePath] || CONFIG.changefreq.default;
}

/**
 * Generate alternate language links
 * @param {string} url - Base URL
 * @returns {Array} Alternate links
 */
function generateAlternates(url) {
  return CONFIG.languages.map(lang => ({
    lang,
    url: lang === CONFIG.defaultLang ? url : url.replace(CONFIG.baseUrl, `${CONFIG.baseUrl}/${lang}`)
  }));
}

/**
 * Generate sitemap XML
 * @param {Array} urls - URL entries
 * @returns {string} XML content
 */
function generateXml(urls) {
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<!--',
    '  =============================================================================',
    '  XML SITEMAP - Search Engine Discovery Map',
    '  =============================================================================',
    '  ',
    '  This sitemap helps search engines discover and understand the structure',
    '  of the BSB educational platform. It includes:',
    '  ',
    '  - All HTML pages in the site',
    '  - Last modification dates for freshness signals',
    '  - Priority hints for crawl optimization',
    '  - Change frequency estimates',
    '  - Multi-language alternate links',
    '  ',
    '  🎯 SEO Benefits:',
    '  - Faster page discovery',
    '  - Better crawl efficiency',
    '  - Clearer site structure',
    '  - Language targeting',
    '  ',
    '  📚 Learn More:',
    '  - Sitemaps Protocol: https://www.sitemaps.org/protocol.html',
    '  - Google Sitemap Guidelines: https://developers.google.com/search/docs/advanced/sitemaps/overview',
    '  ',
    '  Generated: ' + new Date().toISOString(),
    '  =============================================================================',
    '-->',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">'
  ];
  
  urls.forEach(url => {
    xml.push('  <url>');
    xml.push(`    <loc>${url.loc}</loc>`);
    xml.push(`    <lastmod>${url.lastmod}</lastmod>`);
    xml.push(`    <changefreq>${url.changefreq}</changefreq>`);
    xml.push(`    <priority>${url.priority}</priority>`);
    
    // Add alternate language links
    if (url.alternates && url.alternates.length > 0) {
      url.alternates.forEach(alt => {
        xml.push(`    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${alt.url}"/>`);
      });
    }
    
    xml.push('  </url>');
  });
  
  xml.push('</urlset>');
  
  return xml.join('\n');
}

/**
 * Main function
 */
async function main() {
  console.log('🗺️  Generating sitemap...\n');
  
  try {
    // Get all HTML files
    const htmlFiles = await getHtmlFiles(CONFIG.distDir);
    console.log(`Found ${htmlFiles.length} HTML files`);
    
    // Generate URL entries
    const urls = [];
    
    for (const file of htmlFiles) {
      const relativePath = relative(CONFIG.distDir, file);
      const url = `${CONFIG.baseUrl}/${relativePath}`.replace(/\\/g, '/').replace(/index\.html$/, '');
      
      const entry = {
        loc: url,
        lastmod: getLastModified(file).split('T')[0], // Date only
        changefreq: getChangeFrequency(relativePath),
        priority: calculatePriority(relativePath).toFixed(1),
        alternates: generateAlternates(url)
      };
      
      urls.push(entry);
      console.log(`  ✓ ${relativePath} (priority: ${entry.priority})`);
    }
    
    // Sort by priority
    urls.sort((a, b) => parseFloat(b.priority) - parseFloat(a.priority));
    
    // Generate XML
    const xml = generateXml(urls);
    
    // Write sitemap
    await writeFile(CONFIG.outputFile, xml, 'utf-8');
    console.log(`\n✅ Sitemap generated: ${CONFIG.outputFile}`);
    console.log(`   Total URLs: ${urls.length}`);
    
    // Also generate a human-readable sitemap
    const humanReadable = [
      '# BSB Sitemap',
      '',
      'This is a human-readable version of our XML sitemap.',
      '',
      '## Pages by Priority',
      ''
    ];
    
    let currentPriority = null;
    urls.forEach(url => {
      if (url.priority !== currentPriority) {
        currentPriority = url.priority;
        humanReadable.push(`\n### Priority ${currentPriority}`);
        humanReadable.push('');
      }
      humanReadable.push(`- [${url.loc}](${url.loc}) - Updated: ${url.lastmod}`);
    });
    
    await writeFile(CONFIG.outputFile.replace('.xml', '.md'), humanReadable.join('\n'), 'utf-8');
    console.log(`   Human-readable version: ${CONFIG.outputFile.replace('.xml', '.md')}`);
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}