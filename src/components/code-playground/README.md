# Code Playground Component

> 🎨 **Interactive learning through live code editing**

An advanced, educational code playground component that enables real-time HTML, CSS, and JavaScript editing with immediate visual feedback. Designed specifically for learning web development concepts through hands-on experimentation.

## 🎯 Purpose

The Code Playground component transforms static code examples into interactive learning experiences. Users can:

- **Edit code in real-time** with immediate visual feedback
- **Experiment safely** in a sandboxed environment
- **Learn by doing** with guided examples and hints
- **Share their creations** with others
- **Track their progress** with metrics and feedback

## 🏗️ Architecture

### File Structure
```
code-playground/
├── code-playground.html    # Component structure
├── code-playground.css     # Styling and responsive design
├── code-playground.js      # Interactive functionality
├── modules/
│   ├── syntax-highlighter.js    # Syntax highlighting engine
│   ├── code-validator.js        # Real-time code validation
│   ├── code-hints.js           # Intelligent code completion
│   ├── tutorial-loader.js       # Tutorial system
│   └── preview-document-generator.js  # Preview generation
└── README.md              # This documentation
```

### Key Components

1. **Editor Interface**
   - Tabbed code editors (HTML, CSS, JavaScript)
   - **Full syntax highlighting** with custom highlighting engine
   - **Intelligent code completion** with context-aware hints
   - **Real-time validation** with error detection
   - Keyboard shortcuts and productivity features

2. **Live Preview**
   - Sandboxed iframe rendering
   - Real-time updates with debouncing
   - Error handling and console capture
   - Performance monitoring and metrics

3. **Educational Features**
   - **Tutorial system** with progressive lessons
   - **Code validation** with best practice suggestions
   - **Smart hints** for HTML tags, CSS properties, JS APIs
   - **Progress tracking** and achievement system
   - Console output capture and display

## 🚀 Features

### Core Functionality
- ✅ **Multi-language editing** - HTML, CSS, JavaScript with syntax highlighting
- ✅ **Live preview** - Instant visual feedback with intelligent debouncing
- ✅ **Code persistence** - Auto-save to localStorage with versioning
- ✅ **Error handling** - Graceful error display with suggestions
- ✅ **Performance metrics** - Track code size, render time, and quality score

### Enhanced Features (NEW!)
- ✅ **Syntax Highlighting** - Language-aware code coloring
- ✅ **Code Validation** - Real-time error detection and best practices
- ✅ **Code Hints** - Intelligent autocomplete for all languages
- ✅ **Tutorial System** - Load and track progress through lessons
- ✅ **Solution Comparison** - Compare your code with solutions
- ✅ **Quality Scoring** - Get feedback on code quality

### Educational Features
- ✅ **Progressive tutorials** - Step-by-step guided learning
- ✅ **Context-aware hints** - Smart suggestions based on current code
- ✅ **Console integration** - Capture and display all output
- ✅ **Sharing functionality** - URL-based code and tutorial sharing
- ✅ **Keyboard shortcuts** - Professional developer workflow
- ✅ **Fullscreen mode** - Distraction-free coding environment

### Accessibility
- ✅ **Screen reader support** - ARIA labels and descriptions
- ✅ **Keyboard navigation** - Full keyboard accessibility
- ✅ **High contrast** - Supports high contrast mode
- ✅ **Reduced motion** - Respects motion preferences

## 📱 Responsive Design

The playground adapts seamlessly across device sizes:

- **Desktop** (1200px+): Full side-by-side layout
- **Tablet** (768px-1199px): Stacked layout with optimized spacing
- **Mobile** (320px-767px): Compact layout with touch-friendly controls

### Mobile Optimizations
- Touch-friendly tab navigation
- Optimized editor sizing
- Simplified control layout
- Swipe gesture support

## 🎨 Visual Design

### Design System Integration
- Uses BSB design tokens for consistency
- Supports light/dark theme switching
- Follows BSB component patterns
- Maintains brand consistency

### Code Editor Styling
- Professional code editor appearance
- Syntax highlighting preparation (ready for Prism.js)
- Customizable themes
- Focus indicators for accessibility

## ⚡ Performance

### Optimization Strategies
- **Debounced updates** - Prevents excessive re-rendering
- **Lazy loading** - Iframe content loaded on demand
- **Code splitting** - Modular loading of features
- **Caching** - Intelligent localStorage usage

### Performance Metrics
- Code size tracking
- Render time monitoring
- Memory usage awareness
- Network request counting

## 🔧 Implementation

### Basic Usage

1. **Include the component files:**
```html
<link rel="stylesheet" href="./components/code-playground/code-playground.css">
<script type="module" src="./components/code-playground/code-playground.js"></script>
```

2. **Add the HTML structure:**
```html
<div data-bsb-component="code-playground">
  <!-- Component content from code-playground.html -->
</div>
```

### Advanced Configuration

```javascript
// Access playground instance
const playground = document.querySelector('.bsb-code-playground').codePlaygroundInstance;

// Configure features
playground.syntaxHighlighting = true;  // Enable syntax highlighting
playground.codeHints = true;          // Enable code completion
playground.validation = true;         // Enable validation
playground.autoSave = true;          // Enable auto-save

// Load a tutorial
playground.loadTutorialContent({
  title: 'Flexbox Basics',
  html: '<div class="container">...</div>',
  css: '.container { display: flex; }',
  js: '// Add interactivity'
});
```

### Tutorial Mode

Load tutorials via URL parameter:
```
// Load a specific tutorial
?tutorial=html/basics/semantic-structure
?tutorial=css/intermediate/flexbox-layout
?tutorial=javascript/basics/dom-manipulation
```

Available tutorials include:
- **HTML Basics**: Semantic structure, forms, responsive images
- **CSS Mastery**: Flexbox, Grid, custom properties
- **JavaScript**: DOM manipulation, async data fetching

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Enter` | Run/update preview |
| `Ctrl/Cmd + S` | Save code |
| `Ctrl/Cmd + 1/2/3` | Switch to HTML/CSS/JS tab |
| `Tab` | Indent code |
| `Shift + Tab` | Unindent code |
| `Escape` | Exit fullscreen |

## 🎓 Educational Value

### Learning Objectives
- **HTML Structure** - Semantic markup and accessibility
- **CSS Styling** - Modern layout techniques and responsive design
- **JavaScript Interactivity** - DOM manipulation and event handling
- **Web Performance** - Optimization techniques and metrics
- **Best Practices** - Industry standards and conventions

### Progressive Learning
1. **Beginner** - Basic HTML/CSS structure
2. **Intermediate** - JavaScript interactions and animations
3. **Advanced** - Performance optimization and advanced APIs

### Assessment Features
- Code quality scoring
- Best practices checking
- Performance benchmarking
- Accessibility validation

## 🔐 Security

### Sandbox Protection
- Iframe sandboxing prevents malicious code execution
- Content Security Policy enforcement
- No access to parent window or localStorage
- Safe execution environment

### Input Validation
- XSS prevention measures
- Code injection protection
- Safe HTML rendering
- Sanitized output display

## 🌐 Browser Support

### Modern Browsers (Fully Supported)
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Fallback Support
- Graceful degradation for older browsers
- Progressive enhancement approach
- Feature detection for advanced functionality

## 📖 Code Validation

The playground provides real-time validation for all languages:

### HTML Validation
- DOCTYPE declaration check
- Missing alt attributes on images
- Empty headings detection
- Deprecated tag warnings
- Unclosed tag detection
- Accessibility attribute suggestions

### CSS Validation
- Invalid property detection
- Missing semicolon warnings
- Empty rule cleanup
- !important overuse detection
- Vendor prefix suggestions

### JavaScript Validation
- Console statement warnings
- var usage suggestions (prefer const/let)
- Missing semicolon detection
- eval() security warnings
- Basic syntax checking

## 💡 Code Hints System

Intelligent autocomplete provides context-aware suggestions:

### HTML Hints
- Tag suggestions with descriptions
- Attribute suggestions for current tag
- Common attribute values
- ARIA attribute recommendations

### CSS Hints
- Property suggestions with descriptions
- Value suggestions for current property
- Unit recommendations
- Color format suggestions

### JavaScript Hints
- API method suggestions (document., console., Array.)
- Keyword completion
- Common patterns and snippets
- Parameter hints

## 🚀 Future Enhancements

### Planned Features
- [x] **Syntax highlighting** - ✅ Custom highlighting engine implemented
- [x] **Code completion** - ✅ Intelligent autocomplete system
- [x] **Validation system** - ✅ Real-time error detection
- [x] **Tutorial system** - ✅ Progressive learning paths
- [ ] **Version control** - Code history and versioning
- [ ] **Collaboration** - Real-time collaborative editing
- [ ] **External libraries** - CDN import support

### Advanced Educational Features
- [x] **Interactive tutorials** - ✅ Step-by-step guided lessons
- [x] **Code validation** - ✅ Automated code evaluation
- [x] **Progress tracking** - ✅ Tutorial progress saved
- [ ] **Badge system** - Achievement and milestone tracking
- [ ] **AI suggestions** - ML-powered code improvements

## 🤝 Contributing

To enhance the Code Playground component:

1. **Study the architecture** - Understand the component structure
2. **Follow patterns** - Maintain consistency with BSB conventions
3. **Test thoroughly** - Ensure cross-browser compatibility
4. **Document changes** - Update this README and code comments

### Development Guidelines
- Use semantic HTML and ARIA attributes
- Follow BSB CSS methodology and design tokens
- Write comprehensive JSDoc comments
- Test on multiple devices and browsers
- Maintain accessibility standards

## 📚 Related Components

- **[Hero Component](../hero/README.md)** - Landing page sections
- **[Card Component](../card/README.md)** - Content containers
- **[Header Component](../header/README.md)** - Navigation patterns

## 🎯 Success Metrics

The Code Playground component is successful when it:
- Reduces time-to-understanding for web concepts
- Increases engagement with educational content
- Enables successful completion of coding exercises
- Provides accessible learning for all users
- Maintains high performance across devices

---

> **💡 Pro Tip**: Use the playground to teach concepts progressively - start with simple HTML, add CSS styling, then enhance with JavaScript interactivity. The live feedback helps learners connect cause and effect immediately.

*This component exemplifies BSB's commitment to making web development education accessible, engaging, and effective through interactive technology.*