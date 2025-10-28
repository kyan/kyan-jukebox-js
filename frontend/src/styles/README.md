# Jukebox Styling System

## Overview

This project uses a **semantic, component-based CSS architecture** built on top of Tailwind CSS. Instead of cluttering components with dozens of inline utility classes, we organize styles into meaningful, reusable classes using Tailwind's `@apply` directive within component-specific CSS files.

## Architecture

```
frontend/src/styles/
├── globals.css       # Global styles, theme variables, base utilities
├── theme.css         # Reusable component patterns (NEW!)
└── README.md         # This file

frontend/src/components/
├── controls/
│   ├── index.tsx
│   ├── index.css     # Component-specific styles
│   └── README.md     # Component documentation
├── volume-buttons/
│   ├── index.tsx
│   └── index.css
└── ...
```

## Philosophy

### ❌ Before (Messy)
```tsx
<div className='flex items-center gap-2 bg-card/50 backdrop-blur-sm rounded-full px-2 border border-border/50 shadow-sm h-[45px]'>
  <button className='h-[45px] w-[45px] rounded-full transition-all duration-200 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ring...'>
```

### ✅ After (Clean)
```tsx
<div className='controls-wrapper'>
  <button className='controls-button--skip'>
```

## File Structure

### `globals.css`
- Base theme configuration (`@theme` block)
- CSS variables for colors
- Global resets and utilities
- Custom scrollbar styles
- Accessibility features

### `theme.css` (Reference Guide)
A reference document listing common patterns used across components. These patterns are implemented directly in each component's CSS file, not imported globally.

**Note:** The theme.css file serves as a **documentation and reference guide** for consistent patterns. Each component implements its own styles using `@apply` within its own CSS file to avoid cross-file composition issues.

#### Common Patterns Reference

**Glass Morphism:**
```css
bg-card/50 backdrop-blur-sm border border-border/50 shadow-sm
```

**Icon Buttons (45px):**
```css
h-[45px] w-[45px] rounded-full transition-all duration-200 flex items-center justify-center
focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
```

**Card Elevated:**
```css
overflow-hidden shadow-xl border-border/50 rounded-2xl bg-linear-to-br from-card to-card/95
```

**Hover Lift:**
```css
transition-all duration-200 hover:scale-105 active:scale-95
```

**Active State:**
```css
bg-linear-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 shadow-md
```

**Empty State Container:**
```css
text-center py-12
```

See `theme.css` for a complete reference of common utility combinations.

### Component CSS Files

Each component has its own CSS file with component-specific styles:

- **Controls** (`components/controls/index.css`) - Playback controls
- **Volume Buttons** (`components/volume-buttons/index.css`) - Volume controls
- **Progress Bar** (`components/progress-bar/index.css`) - Progress bar
- **Tracklist** (`components/tracklist/index.css`) - Track list items
- **Current Track** (`components/current-track/index.css`) - Now playing card
- **Clear Playlist** (`components/clear-playlist/index.css`) - Clear button/dialog

## Usage Guidelines

### 1. Check Theme Patterns First

Before creating new styles, check `theme.css` for common patterns you can reference:

```tsx
// ✅ Good - uses component-specific semantic class
<button className='controls-button--play'>

// ❌ Bad - duplicates utilities everywhere
<button className='h-[45px] w-[45px] rounded-full bg-primary...'>
```

Define the semantic class in your component's CSS file:
```css
/* component/index.css */
.controls-button--play {
  @apply h-[40px] w-[40px] rounded-full bg-primary text-primary-foreground;
  @apply transition-all duration-200 hover:scale-110;
}
```

### 2. Component-Specific Styles

For component-specific styles, create a local CSS file and reference theme patterns:

```css
/* components/my-component/index.css */
@reference 'tailwindcss';

@layer components {
  /* Check theme.css for glass morphism pattern, then implement it here */
  .my-component-wrapper {
    @apply bg-card/50 backdrop-blur-sm border border-border/50 shadow-sm rounded-lg;
    @apply flex items-center gap-4;
  }
  
  .my-component-special {
    /* Component-specific styling */
    @apply bg-gradient-to-r from-purple-500 to-pink-500;
  }
}
```

**Important:** All component CSS files MUST include `@reference 'tailwindcss';` at the top to allow `@apply` to work with Tailwind v4.

### 3. Naming Convention

Follow BEM-inspired naming:

```css
.component-name            /* Block */
.component-name__element   /* Element (optional) */
.component-name--modifier  /* Modifier */
```

Examples:
- `controls-wrapper`
- `controls-button--skip`
- `track-item--current`
- `rating-badge--positive`

### 4. Import Order

```tsx
import React from 'react'
import { SomeLib } from 'some-lib'
import { cn } from '@/lib/utils'
import './index.css'  // Component CSS last
```

### 5. Combining Classes

Use the `cn()` utility for conditional classes:

```tsx
<div className={cn(
  'track-item',
  isCurrent && 'track-item--current',
  !beenPlayed && 'track-item--unplayed'
)}>
```

## Benefits

### 🎯 Readability
Components are easier to read and understand at a glance.

### 🔧 Maintainability
Change styles in one place, not scattered across components.

### ♻️ Reusability
Common patterns are shared across components.

### 🎨 Consistency
Ensures uniform styling patterns project-wide.

### 📦 Performance
`@apply` generates optimized CSS at build time.

### 🧪 Testability
Semantic class names make testing easier.

## Migration Guide

### Step 1: Identify Messy Components
Look for components with long `className` strings (80+ characters).

### Step 2: Extract Common Patterns
Identify repeated utility combinations:
```tsx
// Repeated pattern
className='flex items-center gap-2 bg-card/50 backdrop-blur-sm...'
```

### Step 3: Check Theme
See if a theme class exists (like `glass-wrapper` or `flex-gap-sm`).

### Step 4: Create Component CSS

Create component-specific classes using the pattern from theme.css:
```css
@reference 'tailwindcss';

@layer components {
  .my-component {
    /* Reference theme.css for the glass wrapper pattern */
    @apply bg-card/50 backdrop-blur-sm border border-border/50 shadow-sm;
  }
}
```

### Step 5: Update Component
Replace inline classes with semantic ones:
```tsx
// Before
<div className='flex items-center gap-2 bg-card/50...'>

// After
<div className='my-component'>
```

## Examples

### Example 1: Button Component

```css
/* button/index.css */
@reference 'tailwindcss';

@layer components {
  .action-button {
    @apply h-[45px] w-[45px] rounded-full transition-all duration-200;
  }
  
  .action-button--danger {
    @apply action-button bg-destructive text-destructive-foreground;
  }
}
```

```tsx
// button/index.tsx
<button className='action-button--danger'>Delete</button>
```

### Example 2: Card Component

```css
/* card/index.css */
@reference 'tailwindcss';

@layer components {
  .info-card {
    @apply overflow-hidden shadow-xl rounded-2xl;
  }
  
  .info-card__header {
    @apply px-6 py-5 bg-linear-to-br from-muted/5 to-muted/20;
  }
  
  .info-card__title {
    @apply text-2xl font-bold mb-2;
  }
}
```

```tsx
// card/index.tsx
<div className='info-card'>
  <div className='info-card__header'>
    <h2 className='info-card__title'>Title</h2>
  </div>
</div>
```

## Best Practices

### ✅ Do
- Use semantic, descriptive class names
- Reference theme.css patterns for consistency
- Keep component CSS focused and minimal
- Document complex components
- Use `cn()` for conditional classes
- Implement patterns directly in your component's CSS file

### ❌ Don't
- Mix inline utilities with semantic classes excessively
- Create duplicate styles across components (check theme.css first)
- Use generic names like `.wrapper` or `.container`
- Forget to import component CSS files
- Hardcode colors (use CSS variables)
- Try to compose theme classes with `@apply` across files

## CSS Variables

Theme colors are defined as CSS variables in `globals.css`:

```css
--color-background
--color-foreground
--color-card
--color-primary
--color-secondary
--color-muted
--color-accent
--color-destructive
--color-border
--color-spotify-green
```

Use them in custom styles:
```css
background-color: hsl(var(--color-primary));
```

## Dark Mode

Dark mode is handled automatically through CSS variables. The `.dark` class switches the color palette.

No need to add `dark:` variants manually when using semantic classes.

## Responsive Design

Use Tailwind's responsive prefixes when needed:

```tsx
<div className='my-component md:my-component--large'>
```

For component-specific responsive styles:
```css
@media (max-width: 640px) {
  .my-component {
    @apply text-sm;
  }
}
```

## Performance Tips

1. **Use `@layer components`** - Ensures proper CSS ordering
2. **Avoid `!important`** - Use specificity instead
3. **Leverage Tailwind's JIT** - Classes are generated on-demand
4. **Tree-shaking works** - Unused classes are removed in production

## Testing

Semantic class names make testing easier:

```tsx
// ✅ Easy to test
const button = screen.getByTestId('controls-button--skip')
expect(button).toHaveClass('controls-button--skip')

// ❌ Brittle and hard to maintain
expect(button).toHaveClass('h-[45px] w-[45px] rounded-full...')
```

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Using @apply](https://tailwindcss.com/docs/reusing-styles#extracting-classes-with-apply)
- [CSS @layer](https://tailwindcss.com/docs/adding-custom-styles#using-css-and-layer)

## Contributing

When adding new components:

1. Check `theme.css` for documented patterns to reference
2. Create component CSS file with `@reference 'tailwindcss';` at the top
3. Implement patterns using `@apply` with Tailwind utilities
4. Use semantic class names following BEM-style
5. Document complex components in component README
6. Update `theme.css` if you discover a new reusable pattern

## Questions?

For questions or suggestions about the styling system, please reach out to the development team or create an issue in the project repository.

---

**Last Updated:** 2024
**Maintained by:** Kyan Jukebox Development Team