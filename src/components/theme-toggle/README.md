# Theme Toggle Component

A comprehensive theme switching component that allows users to toggle between light, dark, and auto (system preference) themes.

## Features

- **Three Theme Modes**: Light, Dark, and Auto (follows system preference)
- **Persistent Storage**: Remembers user preference using localStorage
- **System Integration**: Respects and responds to system color scheme changes
- **Accessible**: Full keyboard navigation and screen reader support
- **Smooth Transitions**: Elegant animations between theme changes
- **Mobile Optimized**: Touch-friendly design for mobile devices

## Usage

### Basic Implementation

1. **Include the component files**:
   ```html
   <link rel="stylesheet" href="./components/theme-toggle/theme-toggle.css">
   <script src="./components/theme-toggle/theme-toggle.js"></script>
   ```

2. **Add the HTML** (copy from `theme-toggle.html`):
   ```html
   <div class="bsb-theme-toggle" data-bsb-component="theme-toggle">
     <!-- Component HTML goes here -->
   </div>
   ```

3. **Initialize** (automatic when included):
   ```javascript
   // Automatically initializes all theme toggles on page load
   // Or manually initialize:
   new BSBThemeToggle(document.querySelector('[data-bsb-component="theme-toggle"]'));
   ```

### Integration with Header

The theme toggle is designed to integrate seamlessly with the BSB header component:

```html
<!-- In your header component -->
<div class="bsb-header__actions">
  <!-- Include theme toggle component here -->
  <div class="bsb-theme-toggle" data-bsb-component="theme-toggle">
    <!-- ... -->
  </div>
</div>
```

## Theme Modes

### Light Mode
- Bright backgrounds with dark text
- Optimal for well-lit environments
- Classic web appearance

### Dark Mode
- Dark backgrounds with light text
- Reduces eye strain in low-light conditions
- Battery-friendly on OLED screens

### Auto Mode (Default)
- Follows system preference
- Automatically switches based on user's OS setting
- Respects `prefers-color-scheme` media query

## JavaScript API

### Methods

```javascript
const themeToggle = new BSBThemeToggle(element);

// Set theme programmatically
themeToggle.setTheme('dark');  // 'light', 'dark', or 'auto'

// Get current theme
const currentTheme = themeToggle.currentTheme;

// Open/close menu programmatically
themeToggle.openMenu();
themeToggle.closeMenu();
```

### Events

Listen for theme changes:

```javascript
document.addEventListener('bsb:themechange', (event) => {
  console.log('Theme changed to:', event.detail.theme);
  // Custom logic here
});
```

## Customization

### CSS Custom Properties

The theme toggle uses BSB design tokens and can be customized via CSS variables:

```css
.bsb-theme-toggle {
  /* Button size */
  --toggle-size: 40px;
  
  /* Colors (uses BSB tokens by default) */
  --toggle-bg: var(--bsb-bg-secondary);
  --toggle-border: var(--bsb-border-color);
  
  /* Menu positioning */
  --menu-offset: 8px;
}
```

### Icon Customization

Replace the SVG icons in `theme-toggle.html` with your preferred icons while maintaining the same structure and classes.

### Animation Customization

Modify transition timings:

```css
.bsb-theme-toggle__button {
  transition-duration: 300ms; /* Custom timing */
}
```

## Accessibility

### Keyboard Navigation
- **Tab**: Navigate to theme toggle
- **Enter/Space**: Open theme menu
- **Arrow Keys**: Navigate menu options
- **Enter/Space**: Select theme option
- **Escape**: Close menu

### Screen Reader Support
- Proper ARIA labels and states
- Role attributes for menu navigation
- Live region updates for theme changes
- Meaningful text descriptions

### High Contrast Support
- Enhanced border visibility
- Stronger focus indicators
- Increased contrast ratios

## Browser Support

- **Modern browsers**: Full support with all features
- **Legacy browsers**: Graceful degradation to system theme
- **No JavaScript**: Falls back to CSS-only system preference detection

## Performance

- **Lightweight**: ~3KB CSS, ~5KB JavaScript (minified)
- **Efficient**: Uses CSS custom properties for instant theme switching
- **Optimized**: Minimal DOM manipulation and smooth transitions

## Related Documentation

- [Theming Guide](../../docs/tutorials/theming.md)
- [Dark Mode Best Practices](../../docs/tutorials/dark-mode.md)
- [Accessibility Guidelines](../../docs/tutorials/accessibility.md)
- [CSS Custom Properties](../../styles/base/variables.css)

## Troubleshooting

### Theme not persisting
- Check localStorage availability
- Verify JavaScript is enabled
- Ensure component is properly initialized

### System preference not detected
- Check browser support for `prefers-color-scheme`
- Verify media query syntax
- Test in different browsers

### Styling issues
- Ensure CSS variables are properly defined
- Check for conflicting styles
- Verify component CSS is loaded after base styles