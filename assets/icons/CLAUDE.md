# CLAUDE.md - Icons Directory

This directory contains all icons, favicons, and brand assets for the FastAppSpace website.

## Icon Inventory

### Favicons (Standard Set)
- **favicon.ico**: Traditional favicon for legacy browsers
- **favicon-16x16.png**: Small browser tab icon
- **favicon-32x32.png**: Standard browser tab icon

### Apple Touch Icons
- **apple-touch-icon.png**: 180x180px for iOS home screen

### Android/PWA Icons
- **android-chrome-192x192.png**: Android home screen (standard)
- **android-chrome-512x512.png**: Android home screen (high-res)

### Brand Assets
- **rocket.svg**: Primary brand icon used in navigation and hero

## Icon Specifications

### Favicon Requirements
- **Format**: PNG for modern browsers, ICO for legacy
- **Sizes**: 16x16, 32x32 minimum required
- **Background**: Transparent or brand color
- **Design**: Simple, recognizable at small sizes

### PWA/Mobile Icons
- **Apple Touch Icon**: 180x180px PNG, no rounded corners (iOS adds automatically)
- **Android Chrome**: 192x192px and 512x512px PNG with transparent background
- **Design consistency**: Same visual identity across all sizes

### SVG Icons
- **Format**: Optimized SVG with cleaned viewBox
- **Colors**: Use currentColor for theme adaptability
- **Size**: Scalable, no fixed dimensions in SVG
- **Accessibility**: Include title/desc elements if needed

## Generation Workflow

### Using generate-icons.sh
The project includes `generate-icons.sh` script for icon generation:

```bash
# Generate all required icon sizes from source
./generate-icons.sh source-icon.png
```

### Manual Generation
For new icons or updates:

1. **Source file**: Start with high-resolution PNG (at least 512x512px)
2. **Optimize SVG**: Use SVGO or similar tools to minimize file size
3. **Generate sizes**: Create all required PNG variants
4. **Test**: Verify icons display correctly across devices

## Integration Points

### HTML References
Icons are referenced in `index.html` head section:

```html
<!-- Favicon -->
<link rel="icon" type="image/x-icon" href="/assets/icons/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/icons/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/assets/icons/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/assets/icons/apple-touch-icon.png">
```

### PWA Manifest
Icons are defined in `site.webmanifest`:

```json
{
  "icons": [
    {
      "src": "/assets/icons/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

### Preloading
Critical icons can be preloaded for performance:

```html
<link rel="preload" href="/assets/icons/rocket.svg" as="image" type="image/svg+xml">
```

## Design Guidelines

### Brand Consistency
- **Color palette**: Use FastAppSpace brand colors (#6e8efb, #a777e3)
- **Style**: Modern, clean, minimal design
- **Recognition**: Consistent rocket theme across all icons

### Technical Requirements
- **File size**: Keep PNG icons under 50KB each
- **Optimization**: Use image compression tools
- **Formats**: PNG for raster, SVG for vector graphics
- **Naming**: Follow platform conventions exactly

### Accessibility
- **Contrast**: Ensure sufficient contrast against common backgrounds
- **Simplicity**: Icons should be clear at 16x16 pixel size
- **Alternatives**: Provide text alternatives where needed

## Maintenance

### When to Update Icons
- Brand redesign or color changes
- Platform requirement updates (new iOS/Android specs)
- Performance optimization needs
- User feedback on visibility/recognition

### Testing Checklist
- [ ] Icons display correctly in browser tabs
- [ ] Mobile home screen appearance
- [ ] PWA install prompt shows correct icon
- [ ] Icons load quickly on slow connections
- [ ] Consistent appearance across light/dark themes

### File Size Monitoring
- Regular audits of icon file sizes
- Optimize without quality loss
- Consider WebP format for supported browsers
- Balance quality vs. loading performance