# Learning Mode Toggle Component

A comprehensive toggle component that provides easy access to BSB's educational learning mode features through a user-friendly interface.

## Features

- **One-Click Toggle**: Simple button to enable/disable learning mode
- **Visual Feedback**: Clear indicators showing current learning mode state
- **Smart Notifications**: Contextual messages with action buttons
- **Multi-Tab Sync**: Learning mode state syncs across browser tabs
- **Keyboard Accessible**: Full keyboard navigation support
- **Integration Ready**: Works with existing BSB learning mode system

## What Learning Mode Provides

When learning mode is enabled, users get access to:

### 🎓 **Interactive Learning Features**
- Component documentation tooltips
- Interactive development panel
- Component inspector and highlighter
- Grid overlay for layout debugging
- Performance metrics display

### ⌨️ **Educational Keyboard Shortcuts**
- `Ctrl/Cmd + G`: Toggle grid overlay
- `Ctrl/Cmd + H`: Toggle component helpers
- `Ctrl/Cmd + I`: Toggle inspect mode
- `Ctrl/Cmd + D`: Toggle development panel

### 🔍 **Developer Tools**
- Component file location display
- CSS class and attribute inspection
- Real-time performance monitoring
- Educational tooltips and explanations

## Usage

### Basic Implementation

```html
<!-- Include in your header actions -->
<div class="bsb-learning-toggle" data-bsb-component="learning-toggle">
  <!-- Component automatically loads -->
</div>
```

### CSS Import

```css
@import url('./learning-toggle.css');
```

### JavaScript Integration

```javascript
// Automatic initialization
// Component auto-initializes when DOM is ready

// Manual initialization
import BSBLearningToggle from './learning-toggle.js';
const toggle = new BSBLearningToggle(container);

// Listen for learning mode changes
document.addEventListener('bsb:learningModeChange', (event) => {
  const { enabled } = event.detail;
  console.log(`Learning mode ${enabled ? 'enabled' : 'disabled'}`);
});
```

## API Reference

### Methods

```javascript
// Get current learning mode state
const isEnabled = toggle.isEnabled(); // true | false

// Programmatically enable learning mode
toggle.enable();

// Programmatically disable learning mode
toggle.disable();
```

### Events

```javascript
// Learning mode change event
document.addEventListener('bsb:learningModeChange', (event) => {
  const { enabled, timestamp } = event.detail;
  
  if (enabled) {
    console.log('Learning mode activated!');
    // Initialize educational features
  } else {
    console.log('Learning mode deactivated');
    // Clean up educational features
  }
});
```

## Component States

### Visual States

- **Inactive State**: Regular book icon, subdued styling
- **Active State**: Graduation cap icon, gradient background with glow
- **Hover State**: Elevated appearance with subtle shadow
- **Focus State**: High-contrast outline for accessibility

### Accessibility Features

- **ARIA Attributes**: Proper `aria-pressed` state management
- **Screen Reader Support**: Descriptive labels and state announcements
- **Keyboard Navigation**: Full functionality via keyboard
- **High Contrast**: Enhanced visibility in high contrast mode
- **Reduced Motion**: Respects user's motion preferences

## Integration with Learning Mode System

### Storage Integration

The component works with the existing BSB learning mode system:

```javascript
// Learning mode state stored in localStorage
localStorage.getItem('bsb-dev-mode') // 'true' | 'false'

// Automatically syncs with:
// - Browser console enableLearningMode() function
// - Multi-tab learning mode changes
// - External learning mode activation
```

### BSBHelper Integration

Seamlessly integrates with the existing `BSBHelper` class:

```javascript
// When learning mode is enabled
if (window.BSBHelper) {
  BSBHelper.init(); // Activates all learning features
}

// When learning mode is disabled
if (window.BSBHelper && BSBHelper.disable) {
  BSBHelper.disable(); // Deactivates learning features
}
```

## Notifications System

### Smart Notifications

The component provides contextual notifications with actions:

```javascript
// Enable notification with refresh button
{
  title: '🎓 Learning Mode Activated',
  message: 'Interactive learning features are now enabled...',
  actions: [
    {
      text: 'Refresh Page',
      action: () => window.location.reload(),
      primary: true
    }
  ]
}
```

### Notification Features

- **Auto-dismiss**: Notifications automatically disappear after 5 seconds
- **Manual dismiss**: Close button for immediate dismissal
- **Action buttons**: Primary and secondary action support
- **Accessibility**: Proper ARIA live regions for screen readers
- **Positioning**: Smart positioning to avoid header overlap

## Styling

### CSS Custom Properties

```css
:root {
  --bsb-learning-toggle-bg: var(--bsb-bg-secondary);
  --bsb-learning-toggle-border: var(--bsb-border-light);
  --bsb-learning-toggle-active: linear-gradient(135deg, var(--bsb-primary), var(--bsb-secondary));
  --bsb-learning-toggle-glow: 0 0 20px rgba(59, 130, 246, 0.4);
}
```

### Component States

- `.bsb-learning-toggle__button[aria-pressed="true"]`: Active learning mode
- `.bsb-learning-toggle__button[data-toggling="true"]`: During toggle animation
- `body[data-learning-mode="true"]`: Global learning mode active state

## Browser Support

- **Modern Browsers**: Chrome 91+, Firefox 90+, Safari 14+, Edge 91+
- **Storage API**: localStorage with graceful degradation
- **CSS Features**: CSS custom properties, CSS Grid, animations
- **JavaScript**: ES6+ with proper fallbacks

## Performance

- **Lightweight**: ~3KB minified (component only)
- **Efficient**: Minimal DOM manipulation and event listeners
- **Optimized**: Uses requestAnimationFrame for smooth animations
- **Memory-safe**: Proper cleanup and event listener management

## Learning Mode Benefits

### For Students

- **Visual Learning**: See code structure and component relationships
- **Interactive Exploration**: Click and inspect components
- **Performance Insights**: Understand loading and rendering metrics
- **Best Practices**: Learn through interactive documentation

### For Educators

- **Teaching Tool**: Demonstrate web development concepts visually
- **Code Exploration**: Show students how components are built
- **Debugging Skills**: Teach inspection and debugging techniques
- **Progressive Learning**: Layer complexity gradually

### For Developers

- **Component Documentation**: Quick access to component details
- **Development Tools**: Built-in debugging and inspection
- **Performance Monitoring**: Real-time metrics and optimization hints
- **Learning Resource**: Understand BSB architecture and patterns

## Troubleshooting

### Common Issues

1. **Learning mode not activating**: Check localStorage permissions
2. **Features not showing**: Ensure page refresh after enabling
3. **Toggle not responding**: Verify JavaScript is enabled
4. **Notifications not appearing**: Check for z-index conflicts

### Debug Mode

```javascript
// Enable debug logging
localStorage.setItem('bsb-debug-learning', 'true');

// The component will log all learning mode events to console
```

## Contributing

When extending the learning toggle:

1. Maintain accessibility standards
2. Follow existing component patterns
3. Test with screen readers
4. Verify keyboard navigation
5. Ensure responsive design works

## Examples

### Custom Learning Mode Handler

```javascript
// Listen for learning mode changes and add custom behavior
document.addEventListener('bsb:learningModeChange', (event) => {
  const { enabled } = event.detail;
  
  if (enabled) {
    // Add custom learning features
    document.body.classList.add('custom-learning-mode');
    initializeCustomTooltips();
  } else {
    // Remove custom learning features
    document.body.classList.remove('custom-learning-mode');
    cleanupCustomTooltips();
  }
});
```

### Integration with Tutorial System

```javascript
// Start tutorial when learning mode is enabled
document.addEventListener('bsb:learningModeChange', (event) => {
  if (event.detail.enabled) {
    // Check if user is new to learning mode
    const hasSeenTutorial = localStorage.getItem('bsb-tutorial-completed');
    if (!hasSeenTutorial) {
      startInteractiveTutorial();
    }
  }
});
```