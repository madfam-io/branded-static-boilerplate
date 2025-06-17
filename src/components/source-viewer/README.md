# Source Viewer Component

A meta-learning component that reveals the implementation details of any BSB component, creating a self-referential educational experience.

## 🎯 Educational Purpose

The Source Viewer embodies the principle of "learning through transparency" by showing users exactly how each component they interact with is built. This creates a powerful meta-learning experience where the code itself becomes the primary teaching tool.

## Features

- 🔍 **Real-time Source Extraction**: Dynamically extracts HTML, CSS, and JavaScript for any component
- 🎨 **Syntax Highlighting**: Color-coded display for better code readability
- 📊 **Performance Insights**: Shows render time, DOM nodes, CSS rules, and event listeners
- ✅ **Best Practices Detection**: Automatically identifies and highlights good coding practices
- 🚀 **Playground Integration**: One-click to experiment with code in the interactive playground
- 📋 **Copy to Clipboard**: Easy code copying for your own projects
- 🌓 **Theme Support**: Works seamlessly with light and dark modes
- ♿ **Accessible**: Full keyboard navigation and screen reader support

## Usage

### Automatic Mode (Learning Mode)

When learning mode is enabled, "View Source" buttons automatically appear on all BSB components:

```javascript
// Enable learning mode
localStorage.setItem('bsb-learning-mode', 'true');

// Refresh the page to see view source buttons
location.reload();
```

### Manual Integration

```html
<!-- Include the component files -->
<link rel="stylesheet" href="/components/source-viewer/source-viewer.css">
<script type="module" src="/components/source-viewer/source-viewer.js"></script>

<!-- The viewer will be automatically initialized -->
```

### Programmatic Usage

```javascript
// Show source for a specific component
const component = document.querySelector('[data-bsb-component="header"]');
window.BSBSourceViewer.showComponentSource(component);

// Manually add view source buttons
window.BSBSourceViewer.addViewSourceButtons();
```

## Component API

### Methods

#### `showComponentSource(element)`
Shows the source viewer for a specific component.

```javascript
const card = document.querySelector('.bsb-card');
BSBSourceViewer.showComponentSource(card);
```

#### `open()`
Opens the source viewer with current content.

#### `close()`
Closes the source viewer.

#### `addViewSourceButtons()`
Manually adds view source buttons to all components.

### Events

The component dispatches custom events:

```javascript
// When viewer opens
document.addEventListener('bsb:source-viewer:open', (e) => {
  console.log('Viewing source for:', e.detail.componentName);
});

// When code is copied
document.addEventListener('bsb:source-viewer:copy', (e) => {
  console.log('Copied code:', e.detail.language);
});
```

## How It Works

### 1. Source Extraction

The component uses several techniques to extract source code:

```javascript
// HTML extraction - serializes the DOM
const html = component.outerHTML;

// CSS extraction - finds matching rules
document.styleSheets.forEach(sheet => {
  sheet.cssRules.forEach(rule => {
    if (matches(rule, component)) {
      css += rule.cssText;
    }
  });
});

// JavaScript - uses component registry
const js = ComponentRegistry.getSource(componentName);
```

### 2. Performance Metrics

Collects real-time performance data:

- **Render Time**: Uses Performance API to measure component render
- **DOM Nodes**: Counts all child elements
- **CSS Rules**: Counts applicable style rules
- **Event Listeners**: Detects attached event handlers

### 3. Best Practices Detection

Automatically identifies good practices:

- Semantic HTML usage
- ARIA attributes for accessibility
- BEM naming convention
- Responsive image implementation
- Keyboard navigation support

## Customization

### CSS Variables

```css
.bsb-source-viewer {
  /* Sizing */
  --source-viewer-width: 90%;
  --source-viewer-max-width: 1200px;
  --source-viewer-height: 85vh;
  
  /* Colors */
  --source-viewer-bg: var(--bsb-bg-primary);
  --source-viewer-border: var(--bsb-border-color);
  
  /* Code highlighting */
  --source-viewer-keyword: #c084fc;
  --source-viewer-string: #34d399;
  --source-viewer-function: #60a5fa;
}
```

### Learning Tips

Customize the learning tips shown in the footer:

```javascript
BSBSourceViewer.setLearningTip('html', 'Try changing the HTML structure to see immediate results!');
BSBSourceViewer.setLearningTip('css', 'Experiment with CSS Grid or Flexbox layouts');
BSBSourceViewer.setLearningTip('js', 'Add console.log statements to understand the flow');
```

## Meta-Learning Benefits

### 1. **Transparency Builds Understanding**
By seeing the actual code behind what they use, learners develop a deeper understanding of how web applications work.

### 2. **Learning by Example**
Real, working code provides better learning than abstract examples.

### 3. **Immediate Context**
Viewing source in context of usage helps connect theory to practice.

### 4. **Encourages Exploration**
The ability to instantly see "how it's made" encourages curiosity and experimentation.

## Integration with Other Components

### Code Playground
One-click integration to experiment with extracted code:

```javascript
// Automatically sends code to playground
BSBSourceViewer.openInPlayground();
```

### BSB Helper (Dev Mode)
Works alongside the BSB Helper for a complete learning experience:

```javascript
// Both tools complement each other
if (BSBHelper.devMode) {
  BSBSourceViewer.enhancedMode = true;
}
```

## Accessibility

- **Keyboard Navigation**: Tab through all interactive elements
- **Screen Reader Support**: Proper ARIA labels and live regions
- **Focus Management**: Returns focus to trigger element on close
- **High Contrast**: Supports Windows High Contrast mode

## Performance Considerations

- **Lazy Loading**: Source extraction happens on-demand
- **Caching**: Extracted source is cached to avoid reprocessing
- **Debouncing**: Prevents excessive extraction during rapid interactions
- **Efficient Selectors**: Uses optimized CSS selectors for rule matching

## Future Enhancements

1. **Git Integration**: Show commit history and evolution of components
2. **AI Explanations**: Add GPT-powered code explanations
3. **Collaborative Annotations**: Allow users to add helpful notes
4. **Performance Profiling**: Deep performance analysis with flame charts
5. **Dependency Visualization**: Interactive component dependency graphs

## Example: Creating Your Own Meta-Learning Component

Here's how to create a component that teaches about itself:

```javascript
class SelfDocumentingComponent {
  constructor(element) {
    this.element = element;
    this.attachMetaLearning();
  }
  
  attachMetaLearning() {
    // Add inline documentation
    this.element.setAttribute('data-learning-note', 
      'This component demonstrates self-documentation'
    );
    
    // Create explanation overlay
    const explanation = document.createElement('div');
    explanation.className = 'component-explanation';
    explanation.innerHTML = `
      <h4>How This Works</h4>
      <p>This component includes its own documentation...</p>
      <button onclick="showMySource()">See Implementation</button>
    `;
    
    this.element.appendChild(explanation);
  }
}
```

## Contributing

The Source Viewer is a core part of BSB's educational mission. When contributing:

1. Maintain the focus on education and clarity
2. Add helpful comments explaining complex logic
3. Include examples of how your changes enhance learning
4. Test with various component types
5. Ensure accessibility standards are met

## License

Part of the Branded Static Boilerplate project. See main LICENSE file.