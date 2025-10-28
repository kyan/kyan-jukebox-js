# Theme Classes Quick Reference

A quick cheat sheet for the most commonly used theme classes.

## 🎨 Glass Effects

```tsx
glass-wrapper              // Standard glass morphism
glass-wrapper--rounded     // Rounded pill shape
glass-wrapper--rounded-lg  // Rounded corners
glass-dialog              // Enhanced glass for modals
```

## 🔘 Buttons

```tsx
icon-button--md           // 45px circular button
icon-button--sm           // 40px circular button
icon-button--primary      // Primary styled button
icon-button--interactive  // Hover + active states
icon-button--disabled     // Disabled appearance
```

## 🎴 Cards

```tsx
card-elevated            // Elevated card with gradient
card-hover              // Hover lift effect
card-section            // Section divider
card-section--subtle    // Subtle background
card-section--gradient  // Gradient background
```

## 📝 Typography

```tsx
section-title              // Main heading (2xl)
subsection-title          // Sub heading (xl)
metadata-text             // Small metadata
metadata-text--emphasized // Emphasized metadata
label-text                // Uppercase label
tabular-text              // Numbers/time
```

## 🖼️ Artwork

```tsx
artwork-wrapper    // Container with hover
artwork-overlay    // Overlay on hover
artwork-image      // Image with scale
artwork-rounded    // Rounded container
artwork-ring       // Active indicator ring
```

## 📦 Layout

```tsx
flex-center       // Centered flexbox
flex-gap-sm       // Flex with gap-2
flex-gap-md       // Flex with gap-4
content-wrapper   // Flexible content area
container-45      // Fixed 45px height
```

## 🔗 Interactive

```tsx
hover-lift          // Scale on hover
hover-lift--shadow  // Lift with shadow
hover-subtle        // Subtle bg change
link-hover          // Underline on hover
link-colored        // Color change
link-translate      // Slide effect
```

## 🎯 States

```tsx
state-active    // Current/active item
state-disabled  // Disabled state
state-dimmed    // Dimmed/unplayed
state-loading   // Loading state
```

## 🏷️ Badges

```tsx
badge-animated       // Hover animation
badge-interactive    // Interactive badge
rating-badge--neutral   // Gray rating
rating-badge--positive  // Green rating
rating-badge--negative  // Red rating
```

## 🎭 Empty States

```tsx
empty-state             // Container
empty-state-icon        // Icon wrapper
empty-state-title       // Title text
empty-state-description // Description text
```

## 🎨 Icons

```tsx
icon-transition     // Smooth color transition
icon-hover-scale    // Scale on hover
icon-sm            // 4x4 (h-4 w-4)
icon-md            // 5x5 (h-5 w-5)
icon-lg            // 8x8 (h-8 w-8)
```

## 📏 Spacing

```tsx
space-y-tracks      // Vertical spacing for lists
content-padding     // Standard padding (px-6 py-4)
content-padding--lg // Large padding (px-6 py-5)
content-padding--xl // XL padding (p-8)
```

## ✨ Animations

```tsx
animate-fade-in-up     // Fade in from bottom
animate-scale-in-smooth // Scale in
shimmer-effect         // Shimmer/loading effect
```

---

## 🚀 Common Patterns

### Glass Button Group
```tsx
<div className='glass-wrapper--rounded flex-gap-sm container-45 px-2'>
  <button className='icon-button--md icon-button--interactive'>
    <Icon className='icon-sm icon-transition' />
  </button>
</div>
```

### Card with Sections
```tsx
<Card className='card-elevated card-hover'>
  <CardContent className='content-padding'>
    <h2 className='section-title'>Title</h2>
    <p className='metadata-text'>Description</p>
  </CardContent>
  <CardContent className='card-section content-padding'>
    <div className='flex-gap-sm'>
      <Badge className='badge-animated'>Badge</Badge>
    </div>
  </CardContent>
</Card>
```

### Track Item
```tsx
<div className={cn(
  'track-item',
  isCurrent && 'state-active',
  !played && 'state-dimmed'
)}>
  <div className='artwork-wrapper'>
    <img className='artwork-image' />
  </div>
  <div className='content-wrapper'>
    <h3 className='section-title'>Track</h3>
    <p className='metadata-text'>Artist</p>
  </div>
</div>
```

### Empty State
```tsx
<div className='empty-state'>
  <div className='empty-state-icon'>
    <Icon className='icon-lg' />
  </div>
  <h3 className='empty-state-title'>No Items</h3>
  <p className='empty-state-description'>Add some items</p>
</div>
```

### Interactive Link
```tsx
<a className='link-hover link-colored link-translate'>
  Click me
</a>
```

### Rating Badge
```tsx
<span className={cn(
  'rating-badge',
  rating > 5 ? 'rating-badge--positive' :
  rating < 5 ? 'rating-badge--negative' :
  'rating-badge--neutral'
)}>
  {rating}
</span>
```

---

## 💡 Tips

1. **Combine theme classes** for complex components
2. **Use `cn()`** for conditional styling
3. **Check theme first** before creating new classes
4. **Follow BEM naming** for component-specific classes
5. **Document complex patterns** in component README

---

## 📚 More Info

- Full documentation: `styles/README.md`
- Component examples: Each component's `README.md`
- Theme source: `styles/theme.css`
