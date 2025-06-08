# CLAUDE.md - CSS Directory

This directory contains the custom CSS that extends Tailwind CSS for the FastAppSpace website.

## Files Overview

- **main.css**: Primary stylesheet with design system, components, and utilities

## CSS Architecture

### Design System (CSS Custom Properties)
Located at the top of `main.css`, the design system defines:

```css
:root {
  /* Colors - Brand palette */
  --primary-color: #6e8efb;
  --secondary-color: #a777e3;
  
  /* Typography - Text color hierarchy */
  --text-dark: #1f2937;
  --text-medium: #374151;
  
  /* Spacing and Layout */
  --container-max-width: 1280px;
  --border-radius: 0.375rem;
  
  /* Animations */
  --transition-fast: 0.2s;
  --transition-normal: 0.3s;
}
```

### Component Organization
CSS is organized in logical sections:

1. **CSS Custom Properties**: Design tokens and variables
2. **Base Styles**: Typography, reset, and global styles  
3. **Layout Components**: Container, grid systems
4. **Navigation**: Navbar, mobile menu, scroll effects
5. **Interactive Elements**: Buttons, forms, animations
6. **Utilities**: Helper classes and animations

### Styling Approach

#### Primary: Tailwind CSS Classes
- Use Tailwind utility classes for 90% of styling
- Avoid inline styles - use Tailwind classes instead
- Example: `class="bg-purple-600 hover:bg-purple-700 transition"`

#### Secondary: Custom CSS for Complex Components
- Navigation scroll effects
- Reveal animations
- Form validation states
- Loading spinners

### Animation System

#### Scroll Reveal Animations
```css
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease-out;
}

.reveal.active {
  opacity: 1;
  transform: translateY(0);
}
```

#### Performance Considerations
- Hardware acceleration for smooth animations
- Reduced motion support with `@media (prefers-reduced-motion)`
- Throttled scroll event listeners

### Form Styling Patterns

#### Input States
- `.dirty`: User has interacted with field
- `.success`: Valid input styling
- `.error`: Invalid input with error colors

#### Error Display
- Field-level validation with contextual messages
- Toast notifications for global feedback
- Consistent error color scheme

## Development Guidelines

### Adding New Styles
1. **Check if Tailwind class exists first**
2. Use CSS custom properties for values that might change
3. Follow existing naming conventions (BEM-like)
4. Test on all screen sizes (mobile-first approach)

### CSS Best Practices
- Use relative units (rem, em, %) over fixed pixels
- Leverage CSS custom properties for theming
- Maintain consistent spacing using design tokens
- Test with and without JavaScript enabled

### Responsive Design
- Mobile-first approach (min-width media queries)
- Breakpoints align with Tailwind defaults
- Flexible layouts using CSS Grid and Flexbox
- Touch-friendly interactive elements (44px minimum)

### Browser Support
- Modern browsers with CSS custom properties support
- Graceful degradation for older browsers
- Avoid cutting-edge CSS features without fallbacks