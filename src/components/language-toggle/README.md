# Language Toggle Component

A comprehensive bilingual language switcher component that provides seamless English/Spanish language switching across the entire website.

## Features

- **Bilingual Support**: Complete English and Spanish translations
- **Smart Detection**: Automatically detects user's preferred language from browser settings
- **Persistent Storage**: Remembers user's language choice across sessions
- **Accessible Interface**: Full keyboard navigation and screen reader support
- **Real-time Translation**: Instantly updates all page content when language changes
- **URL Integration**: Updates URL parameters for shareable links
- **Multi-tab Sync**: Language changes sync across browser tabs

## Usage

### Basic Implementation

```html
<!-- Include in your header -->
<div class="bsb-language-toggle" data-bsb-component="language-toggle">
  <!-- Component automatically loads -->
</div>
```

### CSS Import

```css
@import url('./language-toggle.css');
```

### JavaScript Integration

```javascript
// Automatic initialization
// Component auto-initializes when DOM is ready

// Manual initialization
import BSBLanguageToggle from './language-toggle.js';
const toggle = new BSBLanguageToggle(container);

// Listen for language changes
document.addEventListener('bsb:languageChange', (event) => {
  const { language, translations } = event.detail;
  console.log(`Language changed to: ${language}`);
});
```

## Making Content Translatable

### HTML Elements

Add `data-i18n` attributes to elements you want to translate:

```html
<!-- Automatic translation -->
<h1 data-i18n="home.title">Page Title</h1>
<p data-i18n="home.description">Page description</p>

<!-- Navigation items -->
<a href="/about" data-i18n="nav.about">About</a>

<!-- Form placeholders -->
<input type="text" data-i18n="contact.form.name" placeholder="Your Name">
```

### Meta Tags

```html
<!-- Page title -->
<title data-i18n="home.title">Home - BSB</title>

<!-- Meta description -->
<meta name="description" data-i18n="home.description" content="Page description">
```

## Translation System

### Key Structure

The translation system uses dot notation for nested keys:

```javascript
// translations.js
export const translations = {
  en: {
    nav: {
      home: 'Home',
      about: 'About'
    },
    home: {
      title: 'Welcome',
      description: 'Learn web development'
    }
  },
  es: {
    nav: {
      home: 'Inicio',
      about: 'Acerca de'
    },
    home: {
      title: 'Bienvenido',
      description: 'Aprende desarrollo web'
    }
  }
};
```

### Usage in HTML

```html
<!-- nav.home -->
<a data-i18n="nav.home">Home</a>

<!-- home.title -->
<h1 data-i18n="home.title">Welcome</h1>

<!-- home.description -->
<p data-i18n="home.description">Learn web development</p>
```

## Language Detection Priority

1. **localStorage**: Previously saved user preference
2. **URL Parameter**: `?lang=es` in the URL
3. **Browser Language**: Navigator language preference
4. **Default**: English (en)

## API Reference

### Methods

```javascript
// Get current language
const currentLang = toggle.getCurrentLanguage(); // 'en' | 'es'

// Get current translations
const translations = toggle.getCurrentTranslations();

// Set language programmatically
toggle.setLanguage('es');

// Check if language is RTL (future-proofing)
const isRTL = toggle.isRTL('ar'); // false for en/es
```

### Events

```javascript
// Language change event
document.addEventListener('bsb:languageChange', (event) => {
  const { language, previousLanguage, translations } = event.detail;
  
  // Update your custom components
  updateCustomContent(translations);
});
```

## Accessibility Features

- **Keyboard Navigation**: Full arrow key navigation in dropdown
- **ARIA Labels**: Proper labeling for screen readers
- **Focus Management**: Maintains focus state during interactions
- **High Contrast**: Supports high contrast mode
- **Reduced Motion**: Respects user's motion preferences

### Keyboard Shortcuts

- `Space/Enter`: Open language menu
- `Arrow Keys`: Navigate options
- `Escape`: Close menu
- `Tab`: Navigate to next element

## Styling

### CSS Custom Properties

```css
:root {
  --bsb-language-toggle-bg: var(--bsb-bg-secondary);
  --bsb-language-toggle-border: var(--bsb-border-light);
  --bsb-language-toggle-text: var(--bsb-text-primary);
  --bsb-language-toggle-hover: var(--bsb-bg-tertiary);
  --bsb-language-toggle-active: var(--bsb-primary);
}
```

### Component States

- `.bsb-language-toggle__button[aria-expanded="true"]`: Active state
- `.bsb-language-toggle__option[aria-current="true"]`: Selected option
- `.bsb-language-toggle__menu[aria-hidden="false"]`: Open menu

## Browser Support

- **Modern Browsers**: Chrome 91+, Firefox 90+, Safari 14+, Edge 91+
- **Language Features**: Uses modern Intl API for language detection
- **Storage**: localStorage with fallback graceful degradation
- **Events**: CustomEvent API with polyfill support

## Performance

- **Lazy Loading**: Translations loaded on demand
- **Memory Efficient**: Minimal memory footprint
- **Fast Switching**: Instant language changes with cached translations
- **Bundle Size**: ~8KB minified (component + translations)

## Integration Examples

### With Form Validation

```javascript
document.addEventListener('bsb:languageChange', (event) => {
  const { translations } = event.detail;
  
  // Update form validation messages
  updateValidationMessages(translations.validation);
});
```

### With Dynamic Content

```javascript
// Update content loaded via AJAX
function updateDynamicContent(language) {
  const t = translations[language];
  
  document.querySelectorAll('.dynamic-content').forEach(element => {
    const key = element.dataset.i18n;
    if (key) {
      element.textContent = getNestedTranslation(t, key);
    }
  });
}
```

## Development

### Adding New Languages

1. Add language to `supportedLanguages` array
2. Add translations to `translations` object
3. Update language detection logic if needed
4. Add language flag/icon to component

### Extending Translations

```javascript
// Add new translation keys
translations.en.newSection = {
  title: 'New Section',
  content: 'New content'
};

translations.es.newSection = {
  title: 'Nueva Sección',
  content: 'Nuevo contenido'
};
```

## Testing

The component includes comprehensive test coverage:

- Unit tests for language detection
- Integration tests for UI interactions
- Accessibility tests with axe-core
- Performance tests for language switching
- Cross-browser compatibility tests

## Troubleshooting

### Common Issues

1. **Translations not updating**: Check `data-i18n` attribute format
2. **Language not persisting**: Verify localStorage is enabled
3. **URL not updating**: Check browser history API support
4. **Dropdown not opening**: Verify click event handlers are attached

### Debug Mode

```javascript
// Enable debug logging
localStorage.setItem('bsb-debug-i18n', 'true');

// The component will log translation events to console
```

## Contributing

When adding new translatable content:

1. Add English text first
2. Add corresponding Spanish translation
3. Use descriptive, hierarchical keys
4. Test with both languages
5. Verify accessibility with screen readers