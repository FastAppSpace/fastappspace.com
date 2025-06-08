# CLAUDE.md - Assets Directory

This directory contains all static assets for the FastAppSpace website.

## Directory Structure

- **css/**: Stylesheets and design system
- **js/**: JavaScript modules and functionality
- **icons/**: Favicons, app icons, and brand assets

## Asset Organization Principles

### Performance First
- Critical CSS is inlined in `index.html` for faster loading
- JavaScript modules are loaded with `defer` attribute
- Icons use optimized SVG format where possible
- Preload directives for critical assets

### File Naming Conventions
- Use kebab-case for all filenames: `contact-form.js`
- CSS files should match their component scope: `main.css`
- Icons follow platform conventions: `favicon-32x32.png`

### Loading Strategy
1. Critical CSS inlined in HTML head
2. External CSS loaded after Tailwind CDN
3. JavaScript modules loaded in dependency order:
   - `error-handler.js` (global error handling)
   - Component-specific modules
   - Analytics and tracking last

## Development Guidelines

### Adding New Assets
- Place CSS in `/css/` directory with descriptive names
- JavaScript modules go in `/js/` with single responsibility
- Icons must include all required sizes and formats
- Test asset loading on slow connections

### Asset Dependencies
- CSS depends on Tailwind CDN being loaded first
- JavaScript modules may depend on `error-handler.js`
- Font Awesome icons require CDN script
- Google Fonts loaded asynchronously

### Browser Compatibility
- All assets should work in modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- Use CSS custom properties for theming
- Progressive enhancement for JavaScript features
- Fallbacks for critical functionality