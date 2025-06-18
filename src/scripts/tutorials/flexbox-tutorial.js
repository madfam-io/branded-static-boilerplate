/**
 * Flexbox Interactive Tutorial
 * ============================
 *
 * Complete guide to CSS Flexbox with visual demonstrations and hands-on practice.
 */

export const flexboxTutorial = {
  id: 'flexbox',
  title: 'Master CSS Flexbox',
  description: 'Learn Flexbox layout with interactive examples and visual feedback',
  difficulty: 'beginner',
  estimatedTime: '15 minutes',

  lessons: [
    {
      id: 'flex-basics',
      title: 'Flexbox Fundamentals',
      description: 'Understanding the flex container and flex items',
      html: `<div class="flex-container">
  <div class="flex-item">Item 1</div>
  <div class="flex-item">Item 2</div>
  <div class="flex-item">Item 3</div>
</div>`,
      css: `.flex-container {
  display: flex;
  background: #e9ecef;
  padding: 20px;
  border-radius: 8px;
  min-height: 200px;
  
  /* Try changing these properties: */
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
}

.flex-item {
  background: #007bff;
  color: white;
  padding: 20px;
  margin: 5px;
  border-radius: 4px;
  text-align: center;
  font-weight: bold;
  
  /* Flex item properties: */
  flex: 0 1 auto;
}`,
      js: `// Interactive controls
const container = document.querySelector('.flex-container');
const items = document.querySelectorAll('.flex-item');

// Add click handlers for demonstration
items.forEach((item, index) => {
  item.addEventListener('click', () => {
    // Toggle flex-grow
    const currentFlex = item.style.flex || '0 1 auto';
    item.style.flex = currentFlex === '0 1 auto' ? '1' : '0 1 auto';
    item.style.transition = 'all 0.3s ease';
  });
});

console.log('Click any item to toggle its flex-grow property!');`,
      explanation: `
        <h3>Flexbox Fundamentals</h3>
        <p>Flexbox is a one-dimensional layout method for arranging items in rows or columns.</p>
        
        <h4>Main Concepts:</h4>
        <ul>
          <li><strong>Flex Container:</strong> The parent element with <code>display: flex</code></li>
          <li><strong>Flex Items:</strong> Direct children of the flex container</li>
          <li><strong>Main Axis:</strong> Primary axis (horizontal by default)</li>
          <li><strong>Cross Axis:</strong> Perpendicular to main axis</li>
        </ul>
        
        <h4>Try This:</h4>
        <p>Click on the items to see how <code>flex-grow</code> affects their size!</p>
      `,
      tasks: [
        'Change flex-direction to column',
        'Try different justify-content values',
        'Experiment with align-items properties'
      ]
    },

    {
      id: 'flex-alignment',
      title: 'Alignment and Spacing',
      description: 'Master justify-content and align-items for perfect alignment',
      html: `<div class="alignment-demo">
  <h3>Justify Content (Main Axis)</h3>
  <div class="flex-container justify-start">
    <div class="flex-item">A</div>
    <div class="flex-item">B</div>
    <div class="flex-item">C</div>
  </div>
  
  <h3>Align Items (Cross Axis)</h3>
  <div class="flex-container align-demo">
    <div class="flex-item small">Small</div>
    <div class="flex-item medium">Medium</div>
    <div class="flex-item large">Large Item</div>
  </div>
</div>`,
      css: `.alignment-demo {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.alignment-demo h3 {
  margin: 20px 0 10px 0;
  color: #495057;
}

.flex-container {
  display: flex;
  background: #e9ecef;
  margin: 10px 0;
  padding: 20px;
  border-radius: 4px;
  min-height: 100px;
  border: 2px dashed #6c757d;
}

.justify-start {
  justify-content: flex-start;
}

.align-demo {
  align-items: center;
  height: 120px;
}

.flex-item {
  background: #28a745;
  color: white;
  padding: 15px;
  margin: 5px;
  border-radius: 4px;
  text-align: center;
  font-weight: bold;
}

.flex-item.small {
  background: #ffc107;
  color: black;
  padding: 10px;
}

.flex-item.medium {
  background: #dc3545;
  padding: 20px;
}

.flex-item.large {
  background: #6f42c1;
  padding: 30px 20px;
}`,
      js: `// Interactive alignment controls
const justifyValues = ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'];
const alignValues = ['stretch', 'flex-start', 'center', 'flex-end', 'baseline'];

let justifyIndex = 0;
let alignIndex = 0;

const justifyContainer = document.querySelector('.justify-start');
const alignContainer = document.querySelector('.align-demo');

// Cycle through justify-content values
justifyContainer.addEventListener('click', () => {
  justifyIndex = (justifyIndex + 1) % justifyValues.length;
  justifyContainer.style.justifyContent = justifyValues[justifyIndex];
  
  // Show current value
  console.log(\`justify-content: \${justifyValues[justifyIndex]}\`);
});

// Cycle through align-items values
alignContainer.addEventListener('click', () => {
  alignIndex = (alignIndex + 1) % alignValues.length;
  alignContainer.style.alignItems = alignValues[alignIndex];
  
  // Show current value
  console.log(\`align-items: \${alignValues[alignIndex]}\`);
});

console.log('Click containers to cycle through alignment options!');`,
      explanation: `
        <h3>Flexbox Alignment</h3>
        <p>Control how flex items are positioned and spaced within the container.</p>
        
        <h4>Main Axis (justify-content):</h4>
        <ul>
          <li><code>flex-start</code> - Items at start</li>
          <li><code>center</code> - Items centered</li>
          <li><code>space-between</code> - Even spacing, no edge gaps</li>
          <li><code>space-around</code> - Equal space around items</li>
          <li><code>space-evenly</code> - Equal space between and around</li>
        </ul>
        
        <h4>Cross Axis (align-items):</h4>
        <ul>
          <li><code>stretch</code> - Items fill container height</li>
          <li><code>center</code> - Items centered vertically</li>
          <li><code>baseline</code> - Items aligned to text baseline</li>
        </ul>
      `,
      tasks: [
        'Click the containers to see different alignments',
        'Try adding more items to see the effect',
        'Experiment with flex-direction: column'
      ]
    },

    {
      id: 'flex-responsive',
      title: 'Responsive Flex Layouts',
      description: 'Create layouts that adapt beautifully to different screen sizes',
      html: `<div class="responsive-layout">
  <nav class="nav">Navigation</nav>
  <main class="main">
    <article class="article">Main Article</article>
    <aside class="sidebar">Sidebar</aside>
  </main>
  <footer class="footer">Footer</footer>
</div>`,
      css: `.responsive-layout {
  display: flex;
  flex-direction: column;
  min-height: 400px;
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
}

.nav {
  background: #007bff;
  color: white;
  padding: 20px;
  text-align: center;
  font-weight: bold;
}

.main {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.article {
  background: #28a745;
  color: white;
  padding: 30px;
  flex: 1;
  text-align: center;
  font-weight: bold;
}

.sidebar {
  background: #ffc107;
  color: black;
  padding: 20px;
  text-align: center;
  font-weight: bold;
  order: -1; /* Shows before article on mobile */
}

.footer {
  background: #6c757d;
  color: white;
  padding: 20px;
  text-align: center;
  font-weight: bold;
}

/* Responsive behavior */
@media (min-width: 768px) {
  .main {
    flex-direction: row;
  }
  
  .article {
    flex: 2;
  }
  
  .sidebar {
    flex: 1;
    order: 0; /* Normal order on desktop */
  }
}`,
      js: `// Simulate responsive behavior
let isMobile = window.innerWidth < 768;

const updateLayout = function updateLayout() {
  const main = document.querySelector('.main');
  const sidebar = document.querySelector('.sidebar');
  
  if (window.innerWidth < 768 && !isMobile) {
    isMobile = true;
    console.log('Switched to mobile layout');
    // Add visual indicator
    sidebar.style.borderTop = '3px solid #dc3545';
  } else if (window.innerWidth >= 768 && isMobile) {
    isMobile = false;
    console.log('Switched to desktop layout');
    // Remove visual indicator
    sidebar.style.borderTop = 'none';
  }
}

// Listen for resize events
window.addEventListener('resize', updateLayout);

// Initial check
updateLayout();

// Add click to toggle demonstration
const layout = document.querySelector('.responsive-layout');
layout.addEventListener('click', () => {
  const main = document.querySelector('.main');
  const isColumn = window.getComputedStyle(main).flexDirection === 'column';
  
  // Toggle for demonstration
  main.style.flexDirection = isColumn ? 'row' : 'column';
  
  // Update sidebar order
  const sidebar = document.querySelector('.sidebar');
  if (isColumn) {
    sidebar.style.order = '0';
  } else {
    sidebar.style.order = '-1';
  }
});

console.log('Resize window or click layout to see responsive behavior!');`,
      explanation: `
        <h3>Responsive Flexbox Layouts</h3>
        <p>Flexbox makes responsive design intuitive with powerful properties.</p>
        
        <h4>Key Responsive Techniques:</h4>
        <ul>
          <li><code>flex-direction</code> changes with media queries</li>
          <li><code>order</code> property rearranges items</li>
          <li><code>flex</code> property controls sizing ratios</li>
          <li>Nested flex containers for complex layouts</li>
        </ul>
        
        <h4>Best Practices:</h4>
        <ul>
          <li>Start with mobile-first design</li>
          <li>Use <code>flex: 1</code> for equal distribution</li>
          <li>Combine with CSS Grid for 2D layouts</li>
        </ul>
      `,
      tasks: [
        'Resize the window to see responsive behavior',
        'Try different flex values for article/sidebar',
        'Experiment with order property'
      ]
    }
  ],

  challenges: [
    {
      id: 'navbar-challenge',
      title: 'Responsive Navigation Bar',
      description: 'Create a navigation bar that works on all screen sizes',
      starterCode: {
        html: `<nav class="navbar">
  <div class="navbar-brand">Logo</div>
  <ul class="navbar-menu">
    <li><a href="#">Home</a></li>
    <li><a href="#">About</a></li>
    <li><a href="#">Services</a></li>
    <li><a href="#">Contact</a></li>
  </ul>
  <div class="navbar-actions">
    <button class="btn">Login</button>
  </div>
</nav>`,
        css: `/* Your challenge: Create a responsive navbar */
.navbar {
  /* Add your flexbox styles here */
}

.navbar-brand {
  font-weight: bold;
  font-size: 1.25rem;
}

.navbar-menu {
  list-style: none;
  margin: 0;
  padding: 0;
  /* Style the menu */
}

.navbar-menu li {
  /* Position menu items */
}

.navbar-menu a {
  text-decoration: none;
  color: inherit;
  padding: 10px 15px;
  display: block;
}

.btn {
  padding: 8px 16px;
  border: 1px solid #007bff;
  background: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}`,
        js: '// Optional: Add mobile menu toggle functionality'
      },
      solution: `/* Solution */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.navbar-menu {
  display: flex;
  gap: 0;
}

@media (max-width: 768px) {
  .navbar {
    flex-wrap: wrap;
  }
  
  .navbar-menu {
    flex-direction: column;
    width: 100%;
    order: 3;
  }
}`,
      hints: [
        'Use justify-content: space-between for layout',
        'flex-wrap allows items to wrap on small screens',
        'order property can rearrange items in mobile view'
      ]
    }
  ]
};