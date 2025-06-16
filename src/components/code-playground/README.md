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
└── README.md              # This documentation
```

### Key Components

1. **Editor Interface**
   - Tabbed code editors (HTML, CSS, JavaScript)
   - Syntax highlighting preparation
   - Auto-completion hints
   - Keyboard shortcuts

2. **Live Preview**
   - Sandboxed iframe rendering
   - Real-time updates
   - Error handling
   - Performance monitoring

3. **Educational Features**
   - Console output capture
   - Code metrics display
   - Progressive hints
   - Best practices suggestions

## 🚀 Features

### Core Functionality
- ✅ **Multi-language editing** - HTML, CSS, JavaScript
- ✅ **Live preview** - Instant visual feedback
- ✅ **Code persistence** - Auto-save to localStorage
- ✅ **Error handling** - Graceful error display
- ✅ **Performance metrics** - Track code size and render time

### Educational Features
- ✅ **Progressive hints** - Context-aware suggestions
- ✅ **Console integration** - Capture and display output
- ✅ **Sharing functionality** - URL-based code sharing
- ✅ **Keyboard shortcuts** - Power-user efficiency
- ✅ **Fullscreen mode** - Distraction-free coding

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
// Create custom playground instance
const playground = new BSBCodePlayground(element, {
  autoSave: true,
  debounceDelay: 500,
  maxConsoleMessages: 50,
  theme: 'dark'
});

// Listen to events
playground.on('codeChange', (language, code) => {
  console.log(`${language} code changed:`, code);
});
```

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

## 🚀 Future Enhancements

### Planned Features
- [ ] **Syntax highlighting** - Full Prism.js integration
- [ ] **Code completion** - Intelligent autocomplete
- [ ] **Version control** - Code history and versioning
- [ ] **Collaboration** - Real-time collaborative editing
- [ ] **Templates** - Pre-built learning exercises

### Advanced Educational Features
- [ ] **Interactive tutorials** - Step-by-step guided lessons
- [ ] **Skill assessment** - Automated code evaluation
- [ ] **Progress tracking** - Learning progress analytics
- [ ] **Badge system** - Achievement and milestone tracking

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