# Enhanced Project Hero Section Documentation

## Overview

The enhanced project hero section replaces the previous side-by-side layout with a full-width banner style hero that supports both images and videos from the Media collection, with an elegant scroll blur effect.

## Features

### 1. **Full-Width Banner Layout**
- Replaces the previous split layout (title left, image right)
- Full viewport width banner with media background
- Content overlaid on the banner with proper contrast

### 2. **Enhanced Media Support**
- New `heroMedia` field in Projects collection
- Supports both images and videos from Media collection
- Automatic fallback to legacy `heroImage` and `heroVideo` fields
- Video autoplay with muted audio for better UX

### 3. **Scroll Blur Effect**
- Progressive blur effect as user scrolls down
- GPU-accelerated for smooth performance
- Respects user's reduced motion preference
- Fallback for browsers without backdrop-filter support

### 4. **Responsive Design**
- Optimized layouts for desktop, tablet, and mobile
- Adjusted blur intensity on mobile for performance
- Proper video handling across devices

## Technical Implementation

### Components

1. **BannerHero.tsx** - Main hero component with scroll blur logic
2. **ScrollBlurWrapper.tsx** - Reusable scroll blur wrapper
3. **hero-styles.css** - Optimized CSS for performance

### Collection Schema Update

```typescript
{
  name: 'heroMedia',
  type: 'upload',
  relationTo: 'media',
  required: false,
  admin: {
    description: 'Banner image or video for the project hero section'
  }
}
```

### Migration

For existing projects, run the migration script:

```bash
npm run payload generate:types
tsx src/scripts/migrate-hero-media.ts
```

## Usage

### Admin Panel

1. Edit any project in the admin panel
2. Find the "Hero Media" field
3. Select existing media from the collection or upload new
4. Both images and videos are supported
5. Legacy fields remain available but hidden when heroMedia is set

### Frontend Display

The hero section automatically:
- Detects media type (image/video)
- Applies appropriate rendering method
- Handles fallbacks gracefully
- Optimizes for performance

## Performance Considerations

1. **GPU Acceleration**: Uses `transform3d` and `will-change` for smooth scrolling
2. **Lazy Loading**: Media is loaded with priority for above-fold content
3. **Responsive Images**: Next.js Image optimization for different viewports
4. **Video Optimization**: Muted autoplay for bandwidth efficiency

## Browser Support

- **Full Support**: Chrome, Safari, Edge (Chromium)
- **Graceful Degradation**: Firefox (blur effect via filter fallback)
- **Mobile**: Optimized for iOS Safari and Chrome Mobile

## Accessibility

- Respects `prefers-reduced-motion` setting
- Proper contrast ratios maintained with gradient overlays
- Semantic HTML structure preserved
- Screen reader compatible

## Customization

### Adjust Blur Intensity

In `BannerHero.tsx`, modify the blur calculation:

```typescript
filter: `blur(${scrollProgress * 20}px)` // Change 20 to adjust max blur
```

### Change Banner Height

Modify the className on the section:

```typescript
className="relative h-[70vh] md:h-[80vh]" // Adjust viewport height values
```

### Gradient Overlay

Edit `hero-styles.css` to customize the gradient:

```css
.hero-gradient-overlay {
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(var(--background), 0.3) 40%,
    rgba(var(--background), 0.8) 80%,
    rgb(var(--background)) 100%
  );
}
```

## Testing Checklist

See the PRD for a comprehensive testing checklist covering:
- Layout and display testing
- Media selection and rendering
- Responsive design across devices
- Performance metrics
- Accessibility compliance
- Edge cases and error handling

## Future Enhancements

1. **Multiple Media Support**: Gallery/carousel in hero
2. **Video Controls**: Optional play/pause controls
3. **Parallax Effects**: Additional scroll animations
4. **A/B Testing**: Different hero styles per project
