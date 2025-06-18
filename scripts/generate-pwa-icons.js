#!/usr/bin/env node

/**
 * Generate PWA Icons
 *
 * This script generates properly sized PWA icons with actual visual content
 * to satisfy Lighthouse best-practices requirements.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { createCanvas } from 'canvas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Icon sizes required for PWA
const iconSizes = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'playground-icon.png', size: 96 },
  { name: 'components-icon.png', size: 96 },
  { name: 'favicon.png', size: 32 }
];

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '..', 'src', 'assets', 'images');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate each icon
iconSizes.forEach(({ name, size }) => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Add text
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (size >= 192) {
    // Large icons - full text
    ctx.font = `bold ${size * 0.3}px Arial`;
    ctx.fillText('BSB', size / 2, size / 2 - size * 0.1);
    ctx.font = `${size * 0.08}px Arial`;
    ctx.fillText('LEARNING', size / 2, size / 2 + size * 0.15);
  } else if (size >= 96) {
    // Medium icons - abbreviated
    ctx.font = `bold ${size * 0.4}px Arial`;
    ctx.fillText('BSB', size / 2, size / 2);
  } else {
    // Small icons - just initials
    ctx.font = `bold ${size * 0.5}px Arial`;
    ctx.fillText('B', size / 2, size / 2);
  }

  // Add rounded corners effect
  ctx.globalCompositeOperation = 'destination-in';
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, size * 0.1);
  ctx.fill();

  // Save the icon
  const buffer = canvas.toBuffer('image/png');
  const filePath = path.join(iconsDir, name);
  fs.writeFileSync(filePath, buffer);
  console.log(`✓ Generated ${name} (${size}x${size})`);
});

console.log('\n✅ All PWA icons generated successfully!');