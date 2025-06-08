# CLAUDE.md - JavaScript Directory

This directory contains all JavaScript modules for the FastAppSpace website.

## Module Overview

### Core Modules
- **main.js**: Navigation, scroll effects, and UI interactions (`NavigationManager` class)
- **error-handler.js**: Global error handling and form validation (`ErrorHandler` class)

### Feature Modules  
- **contact-form.js**: Contact form submission and validation (`ContactFormHandler` class)
- **animations.js**: Scroll reveal animations (`ScrollAnimationManager` class)
- **analytics.js**: Google Analytics with consent management (`AnalyticsManager` class)
- **cookies.js**: Cookie consent banner and settings (`CookieConsentManager` class)
- **emailjs-init.js**: EmailJS configuration (currently unused, `EmailJSManager` class)

## Architecture Patterns

### Class-Based Modules
All modules use ES6 classes with consistent patterns:

```javascript
class ModuleName {
    constructor() {
        this.property = null;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupElements();
            this.setupEventListeners();
        });
    }
}
```

### Initialization Pattern
- Constructor calls `init()` method
- `init()` waits for `DOMContentLoaded` event
- Setup methods handle DOM queries and event binding
- Error handling with try/catch blocks

### Global Exposure
Modules expose methods globally for cross-module communication:
```javascript
// Make instance available globally
window.moduleName = new ModuleName();

// Expose static utility methods
window.utilityMethod = ModuleName.utilityMethod;
```

## Module Dependencies

### Loading Order (Important!)
1. **error-handler.js** - Must load first (provides global error handling)
2. **main.js** - Core navigation and UI
3. **animations.js** - Scroll effects 
4. **contact-form.js** - Form handling
5. **analytics.js** - Analytics with error recovery
6. **cookies.js** - Cookie consent (depends on analytics)

### Cross-Module Communication
- `window.errorHandler` - Global error display system
- `window.analyticsManager` - Analytics tracking
- `window.scrollAnimationManager` - Animation control
- Custom events for loose coupling

## Key Functionality

### Navigation (main.js)
- **Mobile menu**: Hamburger toggle with accessibility
- **Scroll effects**: Navbar styling and active menu tracking  
- **Smooth scrolling**: Anchor link behavior
- **FOUC prevention**: Visibility control during load

### Error Handling (error-handler.js)
- **Toast notifications**: User-friendly error messages
- **Form validation**: Real-time field validation
- **Network errors**: Fetch and XHR error interception
- **API error mapping**: HTTP status code handling

### Animations (animations.js)
- **Scroll reveal**: Elements fade in on scroll
- **Hardware acceleration**: Smooth performance on mobile
- **Intersection Observer**: Modern scroll detection
- **Throttling**: Performance optimization

### Analytics (analytics.js)
- **Consent-aware**: Only tracks with user permission
- **Error recovery**: Retry failed analytics on network restore
- **Local storage**: Cache failed events for retry
- **Privacy compliance**: Anonymized IP, SameSite cookies

## Development Guidelines

### Adding New Modules
1. **Follow class-based pattern** with constructor and init method
2. **Handle errors gracefully** with try/catch blocks
3. **Wait for DOM ready** before DOM manipulation
4. **Expose globals carefully** - avoid namespace pollution
5. **Add loading order** comments if dependencies exist

### Error Handling
```javascript
try {
    // Risky operation
    this.setupFeature();
} catch (error) {
    console.error('Module error:', error);
    if (window.errorHandler) {
        window.errorHandler.showError('Feature unavailable');
    }
}
```

### Event Listeners
- Use event delegation for dynamic content
- Add keyboard support for accessibility (`Enter`, `Space`)
- Throttle/debounce high-frequency events (scroll, resize)
- Clean up listeners if needed (single-page apps)

### Performance Best Practices
- **Lazy initialization**: Wait for user interaction when possible
- **Debounce expensive operations**: Form validation, scroll handlers
- **Use requestAnimationFrame**: For smooth animations
- **Minimize DOM queries**: Cache element references

### Accessibility Requirements
- **Keyboard navigation**: All interactive elements
- **ARIA attributes**: `aria-expanded`, `aria-controls`, etc.
- **Screen reader support**: Semantic HTML and labels
- **Focus management**: Visible focus indicators

### Browser Compatibility
- **ES6+ features**: Classes, arrow functions, const/let
- **Modern APIs**: Intersection Observer with fallbacks
- **Fetch API**: With error handling for network requests
- **No polyfills required**: Targets modern browsers only