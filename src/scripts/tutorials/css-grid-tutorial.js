/**
 * CSS Grid Interactive Tutorial
 * =============================
 *
 * Comprehensive tutorial for learning CSS Grid layout with interactive examples.
 */

export const cssGridTutorial = {
  id: 'css-grid',
  title: 'Master CSS Grid Layout',
  description: 'Learn CSS Grid with hands-on examples and visual feedback',
  difficulty: 'intermediate',
  estimatedTime: '20 minutes',

  lessons: [
    {
      id: 'grid-basics',
      title: 'Grid Container Basics',
      description: 'Learn how to create a grid container and understand the fundamentals',
      html: `<div class="grid-container">
  <div class="grid-item">Item 1</div>
  <div class="grid-item">Item 2</div>
  <div class="grid-item">Item 3</div>
  <div class="grid-item">Item 4</div>
  <div class="grid-item">Item 5</div>
  <div class="grid-item">Item 6</div>
</div>`,
      css: `.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
  padding: 20px;
  background: #f0f0f0;
  border-radius: 8px;
}

.grid-item {
  background: #007bff;
  color: white;
  padding: 20px;
  text-align: center;
  border-radius: 4px;
  font-weight: bold;
}`,
      js: `// No JavaScript needed for this example
console.log('Grid container created!');`,
      explanation: `
        <h3>Grid Container Basics</h3>
        <p>CSS Grid is a powerful layout system that allows you to create complex layouts with ease.</p>
        
        <h4>Key Properties:</h4>
        <ul>
          <li><code>display: grid</code> - Creates a grid container</li>
          <li><code>grid-template-columns</code> - Defines column sizes</li>
          <li><code>grid-gap</code> - Sets spacing between grid items</li>
        </ul>
        
        <h4>Try This:</h4>
        <p>Change <code>repeat(3, 1fr)</code> to <code>200px 1fr 100px</code> to see different column sizes!</p>
      `,
      tasks: [
        'Change the number of columns to 2',
        'Modify the gap between items',
        'Try different column sizes'
      ]
    },

    {
      id: 'grid-areas',
      title: 'Grid Template Areas',
      description: 'Create named grid areas for semantic layouts',
      html: `<div class="layout">
  <header class="header">Header</header>
  <nav class="sidebar">Sidebar</nav>
  <main class="content">Main Content</main>
  <footer class="footer">Footer</footer>
</div>`,
      css: `.layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar content"
    "footer footer";
  grid-template-columns: 200px 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 400px;
  gap: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.header { 
  grid-area: header; 
  background: #28a745;
  color: white;
  padding: 20px;
  text-align: center;
  border-radius: 4px;
}

.sidebar { 
  grid-area: sidebar; 
  background: #ffc107;
  color: black;
  padding: 20px;
  border-radius: 4px;
}

.content { 
  grid-area: content; 
  background: #007bff;
  color: white;
  padding: 20px;
  border-radius: 4px;
}

.footer { 
  grid-area: footer; 
  background: #6c757d;
  color: white;
  padding: 20px;
  text-align: center;
  border-radius: 4px;
}`,
      js: `// Add interactivity
const areas = document.querySelectorAll('.layout > *');
areas.forEach(area => {
  area.addEventListener('click', () => {
    area.style.transform = area.style.transform ? '' : 'scale(1.05)';
    area.style.transition = 'transform 0.3s ease';
  });
});`,
      explanation: `
        <h3>Grid Template Areas</h3>
        <p>Named grid areas make layouts more semantic and easier to understand.</p>
        
        <h4>Benefits:</h4>
        <ul>
          <li>Visual representation in CSS</li>
          <li>Easy to rearrange layouts</li>
          <li>More readable code</li>
        </ul>
        
        <h4>Try This:</h4>
        <p>Rearrange the areas in <code>grid-template-areas</code> to change the layout!</p>
      `,
      tasks: [
        'Move the sidebar to the right side',
        'Create a mobile layout with single column',
        'Add a new area for an advertisement'
      ]
    },

    {
      id: 'responsive-grid',
      title: 'Responsive Grid Layouts',
      description: 'Build responsive layouts that adapt to different screen sizes',
      html: `<div class="responsive-grid">
  <div class="card">
    <h3>Card 1</h3>
    <p>This is a responsive card that adapts to screen size.</p>
  </div>
  <div class="card">
    <h3>Card 2</h3>
    <p>Grid items automatically wrap to new rows when needed.</p>
  </div>
  <div class="card">
    <h3>Card 3</h3>
    <p>Perfect for creating responsive card layouts.</p>
  </div>
  <div class="card">
    <h3>Card 4</h3>
    <p>No media queries needed for basic responsiveness!</p>
  </div>
  <div class="card">
    <h3>Card 5</h3>
    <p>Auto-fit and auto-fill make grids responsive by default.</p>
  </div>
  <div class="card">
    <h3>Card 6</h3>
    <p>Minmax() ensures cards don't get too small or large.</p>
  </div>
</div>`,
      css: `.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.card {
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.card h3 {
  margin: 0 0 10px 0;
  color: #495057;
  font-size: 1.25rem;
}

.card p {
  margin: 0;
  color: #6c757d;
  line-height: 1.5;
}

/* Optional: Add media query for extra control */
@media (max-width: 768px) {
  .responsive-grid {
    grid-template-columns: 1fr;
  }
}`,
      js: `// Add resize listener to show responsiveness
let resizeTimeout = null;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    const grid = document.querySelector('.responsive-grid');
    const computedStyle = window.getComputedStyle(grid);
    const columns = computedStyle.gridTemplateColumns.split(' ').length;
    
    console.log(\`Current grid has \${columns} columns\`);
    
    // Visual feedback
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
      if (index < columns) {
        card.style.borderTop = '3px solid #007bff';
      } else {
        card.style.borderTop = '3px solid transparent';
      }
    });
  }, 100);
});

// Trigger initial update
window.dispatchEvent(new Event('resize'));`,
      explanation: `
        <h3>Responsive Grid Magic</h3>
        <p>CSS Grid provides powerful responsive features without media queries!</p>
        
        <h4>Key Functions:</h4>
        <ul>
          <li><code>auto-fit</code> - Fills available space</li>
          <li><code>auto-fill</code> - Creates empty columns if space available</li>
          <li><code>minmax()</code> - Sets minimum and maximum sizes</li>
        </ul>
        
        <h4>Try This:</h4>
        <p>Change <code>auto-fit</code> to <code>auto-fill</code> and resize the window to see the difference!</p>
      `,
      tasks: [
        'Change auto-fit to auto-fill',
        'Modify the minimum card width',
        'Add more cards to test the layout'
      ]
    }
  ],

  challenges: [
    {
      id: 'photo-gallery',
      title: 'Photo Gallery Challenge',
      description: 'Create a responsive photo gallery using CSS Grid',
      starterCode: {
        html: `<div class="gallery">
  <img src="https://picsum.photos/300/200?random=1" alt="Photo 1">
  <img src="https://picsum.photos/300/300?random=2" alt="Photo 2">
  <img src="https://picsum.photos/300/200?random=3" alt="Photo 3">
  <img src="https://picsum.photos/300/400?random=4" alt="Photo 4">
  <img src="https://picsum.photos/300/200?random=5" alt="Photo 5">
  <img src="https://picsum.photos/300/300?random=6" alt="Photo 6">
</div>`,
        css: `/* Your challenge: Create a masonry-like photo gallery */
.gallery {
  /* Add your grid styles here */
}

.gallery img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.gallery img:hover {
  transform: scale(1.05);
}`,
        js: '// Optional: Add lightbox functionality'
      },
      solution: `/* Solution */
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-auto-rows: 10px;
  gap: 15px;
  padding: 20px;
}

.gallery img {
  grid-row-end: span calc(var(--height, 200) / 10);
}`,
      hints: [
        'Use grid-auto-rows with a small value for masonry effect',
        'Calculate grid-row-end based on image height',
        'Consider using object-fit for consistent image display'
      ]
    }
  ]
};