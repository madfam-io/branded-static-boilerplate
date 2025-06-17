# Learning Progress Tracker Component

A gamified progress tracking system that monitors and visualizes a user's learning journey through the BSB codebase, creating motivation through achievements and milestones.

## 🎯 Educational Purpose

The Learning Progress Tracker transforms code exploration into an engaging learning experience by:
- Tracking which components have been explored
- Measuring time invested in learning
- Awarding achievements for milestones
- Providing personalized learning recommendations
- Creating a sense of progression and accomplishment

## Features

- 📊 **Real-time Progress Tracking**: Monitors component exploration automatically
- 🏆 **Achievement System**: Unlocks badges for learning milestones
- 📈 **Learning Analytics**: Tracks time spent and concepts mastered
- 🎯 **Learning Paths**: Structured progression through different skill areas
- 💾 **Persistent Progress**: Saves learning data locally
- 🎨 **Visual Feedback**: Progress bars, timelines, and statistics
- 📱 **Responsive Design**: Works on all devices
- ♿ **Accessible**: Full keyboard and screen reader support

## Usage

### Automatic Activation

The Learning Progress Tracker automatically initializes when learning mode is enabled:

```javascript
// Enable learning mode to start tracking
localStorage.setItem('bsb-learning-mode', 'true');
// The tracker will initialize automatically
```

### Manual Integration

```html
<!-- Include component files -->
<link rel="stylesheet" href="/components/learning-progress/learning-progress.css">
<script type="module" src="/components/learning-progress/learning-progress.js"></script>
```

### Programmatic Control

```javascript
// Access the tracker instance
const tracker = window.BSBLearningProgress;

// Log custom learning activity
tracker.logActivity('custom', 'Completed advanced tutorial');

// Check specific achievement
tracker.checkAchievements();

// Export progress data
tracker.exportProgress();
```

## Learning Paths

The tracker organizes learning into four main paths:

### 1. HTML & Structure Path
- Semantic HTML elements
- Component structure patterns
- Accessibility markup

### 2. CSS & Styling Path
- CSS architecture (BEM, utilities)
- Responsive design techniques
- CSS custom properties

### 3. JavaScript & Interactivity Path
- Event handling patterns
- Component state management
- ES6+ modern features

### 4. Best Practices Path
- Performance optimization
- Security implementation
- Testing approaches

## Achievement System

### Available Achievements

#### 👣 First Steps
- **Requirement**: Explore your first component
- **Teaches**: How to navigate the codebase

#### 🗺️ Explorer
- **Requirement**: Explore 5 different components
- **Teaches**: Component diversity and patterns

#### 🏆 Completionist
- **Requirement**: Explore all components
- **Teaches**: Comprehensive understanding

#### ⏰ Time Investor
- **Requirement**: Spend 30 minutes learning
- **Teaches**: Dedication pays off

#### 📖 Code Reader
- **Requirement**: View source code 10 times
- **Teaches**: Reading code is crucial

#### 🎮 Playground Master
- **Requirement**: Use code playground 5 times
- **Teaches**: Practice makes perfect

## Component API

### Properties

```javascript
tracker.progress = {
  componentsExplored: Set,      // Components user has viewed
  conceptsLearned: Set,         // Concepts mastered
  timeSpent: number,            // Total milliseconds spent
  achievements: Set,            // Unlocked achievement IDs
  checkpoints: Map,             // Completed learning checkpoints
  activityLog: Array            // Recent activity history
}
```

### Methods

#### `logActivity(type, description)`
Logs a learning activity.

```javascript
tracker.logActivity('explore', 'Explored header component');
```

#### `addComponentExplored(componentName)`
Records that a component has been explored.

```javascript
tracker.addComponentExplored('hero');
```

#### `addConceptLearned(concept)`
Records a learned concept.

```javascript
tracker.addConceptLearned('responsive-design');
```

#### `exportProgress()`
Exports progress data as JSON.

```javascript
tracker.exportProgress(); // Downloads progress file
```

#### `resetProgress()`
Resets all progress (with confirmation).

```javascript
tracker.resetProgress(); // Asks for confirmation
```

### Events

The tracker dispatches and listens to various events:

```javascript
// Component view tracking
document.addEventListener('bsb:component:viewed', (e) => {
  console.log('Component viewed:', e.detail.componentName);
});

// Achievement unlocked
document.addEventListener('bsb:achievement:unlocked', (e) => {
  console.log('Achievement:', e.detail.achievement);
});

// Progress milestone
document.addEventListener('bsb:progress:milestone', (e) => {
  console.log('Milestone reached:', e.detail.percentage);
});
```

## Customization

### CSS Variables

```css
.bsb-learning-progress {
  /* Positioning */
  --progress-tracker-bottom: 1.5rem;
  --progress-tracker-right: 1.5rem;
  --progress-tracker-width: 400px;
  
  /* Colors */
  --progress-bar-bg: var(--bsb-bg-secondary);
  --progress-bar-fill: linear-gradient(90deg, #34d399 0%, #10b981 100%);
  --achievement-unlocked: var(--bsb-success-light);
  
  /* Animations */
  --progress-animation-duration: 0.5s;
}
```

### Adding Custom Achievements

```javascript
// Add a custom achievement
tracker.achievements['custom-achievement'] = {
  name: 'Custom Master',
  icon: '⭐',
  description: 'Complete a custom task',
  condition: () => tracker.progress.customMetric >= 10
};

// Check if it should be unlocked
tracker.checkAchievements();
```

### Custom Learning Paths

```javascript
// Add a custom learning path
tracker.learningPaths['custom-path'] = {
  name: 'Custom Skills',
  icon: '🔧',
  checkpoints: [
    {
      id: 'custom-1',
      name: 'First custom skill',
      trigger: 'custom-action-1'
    }
  ]
};
```

## Data Storage

Progress is automatically saved to localStorage:

```javascript
// Data structure in localStorage
{
  componentsExplored: ['header', 'hero', 'card'],
  conceptsLearned: ['semantic-html', 'bem-naming'],
  timeSpent: 1800000, // milliseconds
  achievements: ['first-steps', 'explorer'],
  checkpoints: [['semantic-html', true]],
  activityLog: [...],
  lastSaved: 1234567890
}
```

## Integration with Other Components

### Source Viewer Integration
When a user views component source code, it's automatically tracked:

```javascript
document.addEventListener('bsb:source-viewer:open', (e) => {
  tracker.logActivity('view-source', `Viewed ${e.detail.componentName} source`);
});
```

### Code Playground Integration
Playground usage is tracked for learning insights:

```javascript
document.addEventListener('bsb:playground:run', () => {
  tracker.logActivity('playground-use', 'Executed code in playground');
});
```

## Best Practices

### 1. **Meaningful Activities**
Log activities that represent actual learning:
```javascript
// Good: Specific and meaningful
tracker.logActivity('complete-tutorial', 'Completed flexbox tutorial');

// Bad: Too generic
tracker.logActivity('click', 'Clicked something');
```

### 2. **Progressive Challenges**
Structure achievements to encourage progression:
```javascript
// Beginner → Intermediate → Advanced
achievements: {
  'html-beginner': { requirement: 'View 1 HTML component' },
  'html-intermediate': { requirement: 'Modify HTML in playground' },
  'html-advanced': { requirement: 'Create custom component' }
}
```

### 3. **Respect Privacy**
- All data is stored locally
- No external tracking or analytics
- Users can export or delete their data

## Accessibility

- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Screen Reader Support**: Proper ARIA labels and live regions
- **Focus Management**: Logical focus order maintained
- **Color Contrast**: Meets WCAG AA standards

## Performance

- **Lazy Loading**: Only loads when learning mode is active
- **Debounced Saves**: Prevents excessive localStorage writes
- **Efficient Tracking**: Uses Intersection Observer for component visibility
- **Minimal DOM Updates**: React-style virtual DOM diffing

## Future Enhancements

1. **Social Features**: Share progress with others
2. **Certificates**: Generate completion certificates
3. **Learning Streaks**: Track consecutive days of learning
4. **Difficulty Levels**: Adaptive learning based on progress
5. **Export to Portfolio**: Convert progress to portfolio items

## Contributing

When adding features to the Learning Progress Tracker:

1. Ensure new achievements are meaningful and attainable
2. Add proper documentation for new tracking events
3. Test with various progress states
4. Maintain accessibility standards
5. Keep the gamification balanced and educational

## License

Part of the Branded Static Boilerplate project. See main LICENSE file.