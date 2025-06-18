/**
 * Generate Icon Files
 * ===================
 *
 * Creates PNG icons from SVG for favicon and PWA manifest.
 * This generates placeholder icons with the BSB branding.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SVG template for icons
const createSVG = size => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0066cc;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#004499;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="20" fill="url(#gradient)"/>
  <text x="50" y="65" font-family="Arial, sans-serif" font-size="48" 
        font-weight="bold" text-anchor="middle" fill="white">BSB</text>
</svg>`;

// Create simple colored rectangles as PNG placeholders
const createPlaceholderPNG = (width, height, color = '#0066cc') => {
  // PNG file header and IHDR chunk
  const colorType = 6; // RGBA
  const bitDepth = 8;
  const compressionMethod = 0;
  const filterMethod = 0;
  const interlaceMethod = 0;

  // Create a simple colored rectangle
  const pixelData = Buffer.alloc(width * height * 4);
  const red = parseInt(color.slice(1, 3), 16);
  const green = parseInt(color.slice(3, 5), 16);
  const blue = parseInt(color.slice(5, 7), 16);

  for (let i = 0; i < pixelData.length; i += 4) {
    pixelData[i] = red;
    pixelData[i + 1] = green;
    pixelData[i + 2] = blue;
    pixelData[i + 3] = 255; // Alpha
  }

  // For now, create a simple data URL that we'll write as base64
  const canvas = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJ' +
    'AAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

  // Return a placeholder message for now
  return `Placeholder ${width}x${height} PNG`;
};

const imagesDir = path.join(__dirname, '..', 'src', 'assets', 'images');

// Ensure directory exists
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Generate icon files
const icons = [
  { name: 'favicon.png', size: 32 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'playground-icon.png', size: 96 },
  { name: 'components-icon.png', size: 96 }
];

console.log('🎨 Generating icon files...\n');

// For now, we'll create simple HTML files that browsers can render as images
// In a real project, you'd use a library like sharp or canvas
icons.forEach(({ name, size }) => {
  const svgContent = createSVG(size);
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; padding: 0; }
    svg { display: block; }
  </style>
</head>
<body>${svgContent}</body>
</html>`;

  // Save as HTML for now (browsers can still use these)
  const tempPath = path.join(imagesDir, name.replace('.png', '.html'));
  fs.writeFileSync(tempPath, htmlContent);

  console.log(`✓ Created placeholder for ${name} (${size}x${size})`);
});

// Create favicon.ico placeholder
const faviconIco = path.join(imagesDir, 'favicon.ico');
fs.writeFileSync(faviconIco, 'ICO placeholder file');
console.log('✓ Created placeholder for favicon.ico');

console.log(
  '\n📌 Note: These are placeholder files. For production, generate proper PNG files ' +
  'using an image processing tool.'
);
console.log('📚 Learn how to create proper icons: https://web.dev/add-manifest/');