/**
 * Color Contrast Lesson
 * =====================
 */

export const colorContrastLesson = {
  id: 'color-contrast',
  title: 'Color Contrast and Visual Design',
  description: 'Meet WCAG color contrast requirements',
  html: `<!-- Color Contrast Demo -->
<section class="contrast-demo">
  <h2>Color Contrast Examples</h2>

  <!-- Bad Contrast Examples -->
  <div class="contrast-examples">
    <div class="example bad-contrast-1">
      <h3>❌ Poor Contrast (2.5:1)</h3>
      <p>This light gray text on white background fails WCAG standards.</p>
      <button class="low-contrast-btn">Hard to Read Button</button>
    </div>

    <div class="example bad-contrast-2">
      <h3>❌ Color Only (No Contrast)</h3>
      <p class="error-color-only">Error: Please fill in all fields</p>
      <p class="success-color-only">Success: Form submitted</p>
    </div>

    <!-- Good Contrast Examples -->
    <div class="example good-contrast-1">
      <h3>✅ AA Compliant (4.5:1)</h3>
      <p>This dark text on light background meets WCAG AA standards.</p>
      <button class="good-contrast-btn">Easy to Read Button</button>
    </div>

    <div class="example good-contrast-2">
      <h3>✅ Color + Icon/Text</h3>
      <p class="error-with-icon">❌ Error: Please fill in all fields</p>
      <p class="success-with-icon">✅ Success: Form submitted</p>
    </div>
  </div>

  <!-- Interactive Contrast Checker -->
  <div class="contrast-checker">
    <h3>Contrast Checker Tool</h3>
    <div class="color-inputs">
      <div>
        <label for="fg-color">Text Color</label>
        <input type="color" id="fg-color" value="#666666">
      </div>
      <div>
        <label for="bg-color">Background Color</label>
        <input type="color" id="bg-color" value="#ffffff">
      </div>
    </div>
    <div class="contrast-preview" id="contrast-preview">
      <p>Sample text to check contrast</p>
      <p class="contrast-ratio">Contrast Ratio: <span id="ratio">4.5:1</span></p>
      <p class="contrast-result" id="result">✅ Passes WCAG AA</p>
    </div>
  </div>
</section>`,
  css: `.contrast-demo {
  padding: 2rem;
}

.contrast-examples {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.example {
  padding: 1.5rem;
  border: 2px solid #ddd;
  border-radius: 8px;
}

/* Bad contrast examples */
.bad-contrast-1 {
  background: #fff;
  color: #ccc; /* 2.5:1 ratio - fails */
}

.low-contrast-btn {
  background: #f0f0f0;
  color: #999;
  border: 1px solid #e0e0e0;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
}

.error-color-only {
  color: #dc3545;
}

.success-color-only {
  color: #28a745;
}

/* Good contrast examples */
.good-contrast-1 {
  background: #f8f9fa;
  color: #212529; /* 16:1 ratio - passes AAA */
}

.good-contrast-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-weight: 500;
}

.error-with-icon {
  color: #721c24;
  background: #f8d7da;
  padding: 0.75rem;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}

.success-with-icon {
  color: #155724;
  background: #d4edda;
  padding: 0.75rem;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
}

/* Contrast checker */
.contrast-checker {
  margin-top: 3rem;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.color-inputs {
  display: flex;
  gap: 2rem;
  margin: 1rem 0;
}

.color-inputs label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.color-inputs input[type="color"] {
  width: 100px;
  height: 40px;
  border: 2px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.contrast-preview {
  margin-top: 2rem;
  padding: 2rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  text-align: center;
}

.contrast-ratio {
  font-size: 1.25rem;
  font-weight: bold;
  margin: 1rem 0;
}

.contrast-result {
  font-size: 1.1rem;
  font-weight: 500;
}`,
  js: `// Contrast ratio calculator
function getContrastRatio(color1, color2) {
  // Convert hex to RGB
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  // Calculate relative luminance
  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);

  // Calculate contrast ratio
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

function hexToRgb(hex) {
  const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function getLuminance(rgb) {
  const rsRGB = rgb.r / 255;
  const gsRGB = rgb.g / 255;
  const bsRGB = rgb.b / 255;

  const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Update contrast checker
const fgColor = document.getElementById('fg-color');
const bgColor = document.getElementById('bg-color');
const preview = document.getElementById('contrast-preview');
const ratioSpan = document.getElementById('ratio');
const resultSpan = document.getElementById('result');

function updateContrast() {
  const ratio = getContrastRatio(fgColor.value, bgColor.value);
  const roundedRatio = Math.round(ratio * 10) / 10;

  preview.style.color = fgColor.value;
  preview.style.backgroundColor = bgColor.value;
  ratioSpan.textContent = roundedRatio + ':1';

  if (ratio >= 7) {
    resultSpan.textContent = '✅ Passes WCAG AAA';
    resultSpan.style.color = '#155724';
  } else if (ratio >= 4.5) {
    resultSpan.textContent = '✅ Passes WCAG AA';
    resultSpan.style.color = '#155724';
  } else if (ratio >= 3) {
    resultSpan.textContent = '⚠️ Passes for large text only';
    resultSpan.style.color = '#856404';
  } else {
    resultSpan.textContent = '❌ Fails WCAG standards';
    resultSpan.style.color = '#721c24';
  }
}

fgColor.addEventListener('input', updateContrast);
bgColor.addEventListener('input', updateContrast);

// Initial update
updateContrast();`
};