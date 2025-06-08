# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FastAppSpace is a personal portfolio website showcasing mobile app development services. It's a static website built with HTML, Tailwind CSS, and vanilla JavaScript, focusing on clean design and performance.

## Development Commands

### Local Development Server
```bash
# Using Python
python -m http.server 3000

# Using Node.js
npx serve
```

Visit `http://localhost:3000` after starting the server.

### Deployment
- Site deploys automatically via Netlify on push to master branch
- Configuration in `netlify.toml`
- Uses SPA routing redirecting all requests to `index.html`

## Configuration Setup

### Web3Forms Integration
1. Create `config.js` in root directory:
```javascript
const config = {
    web3forms: {
        accessKey: 'YOUR_ACCESS_KEY_HERE'
    }
};
```
2. Never commit `config.js` to main branch
3. Only exists in gh-pages branch for deployment

## Code Architecture

### Core Structure
- **index.html**: Single-page application with embedded CSS and JavaScript, optimized for SEO
- **error-handler.js**: Global error handling utility with form validation and network error management
- **Static assets**: Icons, manifest, and SEO files
- **robots.txt**: Search engine crawling directives
- **sitemap.xml**: XML sitemap for search engine indexing

### Error Handling System
The `ErrorHandler` class provides:
- Toast notification system for user feedback
- Form validation with field-level error display
- Network error interception and user-friendly messages
- API error handling with status code mapping

### Styling Approach
- Tailwind CSS via CDN
- Critical CSS inlined in `<head>` for performance
- Custom CSS classes prefixed with component names
- Responsive design with mobile-first approach

### JavaScript Patterns
- Vanilla JavaScript with ES6+ features
- Event-driven architecture
- Error handling with try/catch and Promise rejection handling
- DOM manipulation with accessibility considerations

## Frontend Development Guidelines

Based on the Cursor rules configuration:
- Use early returns for better readability
- Always use Tailwind classes for styling (avoid inline CSS)
- Use descriptive names with "handle" prefix for event functions
- Implement accessibility features (tabindex, aria-label, keyboard events)
- Use const declarations instead of function declarations
- Focus on readable code over performance optimization

## SEO Optimization

### Current SEO Implementation
- **Title Tag**: "Mobile App Development Company | iOS & Android Apps | FastAppSpace"
- **Meta Description**: Optimized for search engines with target keywords and call-to-action
- **Image Alt Text**: All images include descriptive, keyword-rich alt attributes
- **Heading Structure**: Strategic H1/H2 hierarchy with target keywords
- **Structured Data**: Organization, WebSite, and BreadcrumbList schema markup
- **Sitemap**: Updated XML sitemap with proper change frequencies and priorities
- **Robots.txt**: Configured to block development files while allowing content crawling

### Target Keywords
- Primary: "mobile app development", "iOS app development", "Android app development"
- Secondary: "mobile app development company", "custom mobile apps", "app developers"
- Long-tail: "mobile app development services San Francisco", "professional mobile application development"

### SEO Best Practices
- Meta descriptions under 155 characters
- Title tags under 60 characters
- Descriptive alt text for all images
- Proper heading hierarchy (H1 → H2 → H3)
- Clean URL structure
- Mobile-first responsive design
- Fast loading times with optimized assets

## Important Branches
- **master**: Source code and development
- **gh-pages**: Deployed version with config files

## Security Features
- Content Security Policy configured in netlify.toml
- XSS protection headers
- Form validation and sanitization
- No sensitive data in source code