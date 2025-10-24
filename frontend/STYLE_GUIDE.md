# Kyan Jukebox Frontend Style Guide

## Overview

This style guide documents the design system, component patterns, and best practices for the Kyan Jukebox frontend application. We use **shadcn/ui** components with **Tailwind CSS** for styling.

---

## Table of Contents

1. [Design Tokens](#design-tokens)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing](#spacing)
5. [Animation & Transitions](#animation--transitions)
6. [Component Patterns](#component-patterns)
7. [Accessibility](#accessibility)
8. [Best Practices](#best-practices)

---

## Design Tokens

### CSS Variables

All design tokens are defined as CSS custom properties in `src/styles/globals.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --secondary: 210 40% 96.1%;
  --muted: 210 40% 96.1%;
  --accent: 210 40% 96.1%;
  --destructive: 0 84.2% 60.2%;
  --border: 214.3 31.8% 91.4%;
  --radius: 0.5rem;
  
  /* Custom Jukebox Colors */
  --spotify-green: 142 76% 36%;
  --success: 142 76% 36%;
  --warning: 38 92% 50%;
  --info: 199 89% 48%;
}
```

### Accessing Tokens

Use Tailwind utility classes that reference these tokens:

```tsx
<div className="bg-background text-foreground border-border">
  <h1 className="text-primary">Hello World</h1>
</div>
```

---

## Color System

### Primary Colors

| Token | Usage | Class |
|-------|-------|-------|
| `background` | Page background | `bg-background` |
| `foreground` | Primary text | `text-foreground` |
| `primary` | Primary actions | `bg-primary`, `text-primary` |
| `secondary` | Secondary elements | `bg-secondary` |
| `muted` | Subtle backgrounds | `bg-muted` |
| `accent` | Highlighted elements | `bg-accent` |

### Semantic Colors

| Token | Usage | Class |
|-------|-------|-------|
| `destructive` | Errors, deletions | `bg-destructive`, `text-destructive` |
| `success` | Success states | `bg-success`, `text-success` |
| `warning` | Warnings | `bg-warning`, `text-warning` |
| `info` | Informational | `bg-info`, `text-info` |
| `spotify-green` | Spotify brand | `spotify-green`, `bg-spotify-green` |

### Color Usage Examples

```tsx
// Success state
<Badge className="bg-success text-white">Added</Badge>

// Error state
<Button variant="destructive">Delete Track</Button>

// Spotify-themed action
<Button className="bg-spotify-green hover:bg-spotify-green/90">
  Connect to Spotify
</Button>
```

---

## Typography

### Font Family

We use a system font stack for optimal performance:

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 
  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
```

### Font Scales

| Size | Class | Usage |
|------|-------|-------|
| 12px | `text-xs` | Labels, metadata |
| 14px | `text-sm` | Body text, buttons |
| 16px | `text-base` | Default body |
| 18px | `text-lg` | Large body |
| 20px | `text-xl` | Section headings |
| 24px | `text-2xl` | Page headings |
| 30px | `text-3xl` | Hero headings |

### Font Weights

| Weight | Class | Usage |
|--------|-------|-------|
| 300 | `font-light` | Subtle text |
| 400 | `font-normal` | Body text |
| 500 | `font-medium` | Emphasis |
| 600 | `font-semibold` | Headings |
| 700 | `font-bold` | Strong emphasis |

### Typography Examples

```tsx
// Page heading
<h1 className="text-2xl font-semibold mb-4">Now Playing</h1>

// Section heading
<h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
  Playlist
</h2>

// Body text with emphasis
<p className="text-sm text-muted-foreground font-medium">
  {artist.name}
</p>

// Metadata
<span className="text-xs text-muted-foreground">Added 2 hours ago</span>
```

---

## Spacing

### Spacing Scale

We use Tailwind's default spacing scale (0.25rem = 1 unit):

| Value | Class | Pixels |
|-------|-------|--------|
| 0 | `p-0`, `m-0` | 0px |
| 1 | `p-1`, `m-1` | 4px |
| 2 | `p-2`, `m-2` | 8px |
| 3 | `p-3`, `m-3` | 12px |
| 4 | `p-4`, `m-4` | 16px |
| 5 | `p-5`, `m-5` | 20px |
| 6 | `p-6`, `m-6` | 24px |
| 8 | `p-8`, `m-8` | 32px |

### Gap Utilities

For flex and grid layouts:

```tsx
// Horizontal gap
<div className="flex gap-2">...</div>

// Vertical gap
<div className="flex flex-col gap-4">...</div>

// Grid gap
<div className="grid grid-cols-2 gap-6">...</div>
```

---

## Animation & Transitions

### Built-in Animations

| Animation | Class | Usage |
|-----------|-------|-------|
| Fade In | `animate-fade-in` | Content appearing |
| Fade Out | `animate-fade-out` | Content disappearing |
| Slide Up | `animate-slide-up` | Modals, toasts |
| Slide Down | `animate-slide-down` | Dropdowns |
| Scale In | `animate-scale-in` | Cards, popups |
| Pulse | `animate-pulse` | Loading states |
| Shimmer | `animate-shimmer` | Skeleton loading |

### Transition Utilities

```tsx
// Smooth transitions (200ms cubic-bezier)
<button className="transition-smooth hover:bg-primary">Click me</button>

// All properties
<div className="transition-all duration-300">...</div>

// Specific properties
<div className="transition-colors duration-200">...</div>
<div className="transition-transform duration-300">...</div>
```

### Hover Effects

```tsx
// Lift effect
<Card className="hover-lift">...</Card>

// Card hover
<Card className="card-hover">...</Card>

// Scale
<img className="transition-transform hover:scale-105" />

// Translate
<a className="transition-all hover:translate-x-1">Link</a>
```

### Animation Examples

```tsx
// Fade in content
<div className="animate-fade-in">
  <CurrentTrack />
</div>

// Staggered animations
<div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
  <TrackList />
</div>

// Loading skeleton
<div className="skeleton-shimmer h-20 w-full rounded" />
```

---

## Component Patterns

### Cards

```tsx
import { Card, CardContent } from 'components/ui/card'

<Card className="overflow-hidden shadow-medium hover:shadow-hard transition-all">
  <img src={artwork} className="w-full" />
  <CardContent className="p-6">
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="text-sm text-muted-foreground">{artist}</p>
  </CardContent>
</Card>
```

### Buttons

```tsx
import { Button } from 'components/ui/button'
import { Icon } from 'components/ui/icon'

// Primary action
<Button variant="default">Save</Button>

// Secondary action
<Button variant="secondary">Cancel</Button>

// Destructive action
<Button variant="destructive">Delete</Button>

// Ghost button
<Button variant="ghost">More</Button>

// Icon button
<Button variant="ghost" size="icon">
  <Icon name="play" />
</Button>

// Button with icon
<Button>
  <Icon name="plus" className="mr-2" />
  Add Track
</Button>
```

### Badges

```tsx
import { Badge } from 'components/ui/badge'

<Badge variant="default">New</Badge>
<Badge variant="secondary">Popular</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Draft</Badge>
```

### Loading States

```tsx
import { Skeleton, SkeletonCard, SkeletonTrack } from 'components/ui/skeleton'

// Simple skeleton
<Skeleton className="h-4 w-full" />

// Card skeleton
<SkeletonCard />

// Track skeleton
<SkeletonTrack />

// Custom skeleton
<div className="space-y-2">
  <Skeleton className="h-4 w-3/4" />
  <Skeleton className="h-4 w-1/2" />
</div>
```

### Forms

```tsx
import { Input } from 'components/ui/input'
import { Label } from 'components/ui/label'

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input 
    id="email" 
    type="email" 
    placeholder="you@example.com"
    className="transition-all focus:ring-2"
  />
</div>
```

---

## Accessibility

### Focus States

Always include visible focus indicators:

```tsx
// Built-in focus ring
<button className="focus-ring">Click me</button>

// Custom focus state
<button className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
  Click me
</button>
```

### ARIA Labels

```tsx
// Icon-only buttons
<Button variant="ghost" size="icon" aria-label="Play track">
  <Icon name="play" />
</Button>

// Screen reader text
<span className="sr-only">Loading...</span>
```

### Keyboard Navigation

Ensure all interactive elements are keyboard accessible:

```tsx
// Proper button semantics
<button onClick={handleClick}>Action</button>

// Not a div acting as a button
<div role="button" tabIndex={0} onKeyDown={handleKeyDown}>
  Action
</div>
```

### Color Contrast

- Ensure text meets WCAG AA standards (4.5:1 for normal text)
- Test with tools like Chrome DevTools Accessibility panel
- Use `text-foreground` on `bg-background` for guaranteed contrast

---

## Best Practices

### 1. Use Tailwind Classes Over Custom CSS

**Prefer:**
```tsx
<div className="flex items-center gap-4 p-6 rounded-lg bg-card">
```

**Avoid:**
```tsx
<div className="custom-container">
  <style>{`.custom-container { ... }`}</style>
</div>
```

### 2. Compose Reusable Class Patterns

```tsx
// Define common patterns as constants
const cardClasses = "rounded-lg border bg-card text-card-foreground shadow-sm"
const buttonPrimaryClasses = "bg-primary text-primary-foreground hover:bg-primary/90"

<div className={cardClasses}>...</div>
```

### 3. Use Semantic HTML

```tsx
// Good
<nav>
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>

// Bad
<div className="nav">
  <div className="nav-item">Home</div>
</div>
```

### 4. Maintain Consistent Spacing

```tsx
// Section spacing
<section className="px-4 sm:px-5 pt-2.5 pb-5">

// Card spacing
<CardContent className="p-6">

// Gap between elements
<div className="flex gap-4">
```

### 5. Mobile-First Responsive Design

```tsx
// Mobile default, desktop override
<div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
  <div className="w-full lg:w-1/3">...</div>
  <div className="w-full lg:w-2/3">...</div>
</div>
```

### 6. Optimize Performance

```tsx
// Use CSS transforms for animations (GPU accelerated)
<div className="transition-transform hover:translate-y-[-2px]">

// Lazy load images
<img loading="lazy" src={artwork} alt={title} />

// Reduce motion for accessibility
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; }
}
```

### 7. Consistent Icon Usage

```tsx
import { Icon } from 'components/ui/icon'

// Always provide size
<Icon name="play" size="small" />
<Icon name="heart" size="default" />
<Icon name="music" size="large" />

// Add context for screen readers
<Icon name="delete" aria-label="Delete track" />
```

### 8. Error Boundaries

```tsx
import ErrorBoundary from 'components/error-boundary'

<ErrorBoundary>
  <ComplexComponent />
</ErrorBoundary>
```

---

## Common Patterns

### Page Layout

```tsx
<div className="min-h-screen bg-background">
  {/* Header */}
  <header className="w-full px-5 sm:px-8 pt-5 pb-2.5 border-b">
    <div className="flex items-center gap-4">...</div>
  </header>
  
  {/* Body */}
  <main className="w-full px-4 sm:px-5 pt-2.5 pb-5">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <aside className="lg:col-span-4">...</aside>
      <section className="lg:col-span-8">...</section>
    </div>
  </main>
</div>
```

### List Items

```tsx
<div className="space-y-2">
  {items.map(item => (
    <div 
      key={item.id}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
    >
      <img src={item.image} className="w-12 h-12 rounded" />
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{item.title}</p>
        <p className="text-sm text-muted-foreground truncate">{item.subtitle}</p>
      </div>
      <Button variant="ghost" size="icon">
        <Icon name="more vertical" />
      </Button>
    </div>
  ))}
</div>
```

### Empty States

```tsx
<div className="flex flex-col items-center justify-center py-12 text-center">
  <Icon name="music" size="large" className="mb-4 text-muted-foreground" />
  <h3 className="text-xl font-semibold mb-2">No tracks yet</h3>
  <p className="text-muted-foreground mb-4">
    Add some music to get started
  </p>
  <Button>
    <Icon name="plus" className="mr-2" />
    Add Track
  </Button>
</div>
```

---

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Radix UI Primitives](https://www.radix-ui.com)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## Questions?

For questions about the style guide or to propose changes, please contact the frontend team or open a discussion in the project repository.