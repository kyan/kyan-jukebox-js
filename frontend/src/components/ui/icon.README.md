# Icon Component

A flexible, modern icon component that replaces Semantic UI React icons using [Lucide React](https://lucide.dev/) icons.

## Features

- ✅ Drop-in replacement for Semantic UI `<Icon>` component
- ✅ Type-safe icon names with TypeScript support
- ✅ Multiple size variants (mini, tiny, small, default, large, big, huge, massive)
- ✅ Color customization support
- ✅ Consistent API with Semantic UI for easy migration
- ✅ Tree-shakeable and optimized bundle size
- ✅ Full accessibility support

## Installation

The Icon component uses `lucide-react` which is already installed in the project:

```json
"lucide-react": "^0.546.0"
```

## Basic Usage

```tsx
import { Icon } from '@/components/ui/icon'

// Basic icon
<Icon name="play" />

// Icon with size
<Icon name="play" size="large" />

// Icon with color
<Icon name="thumbs up" color="green" />

// Icon with custom className
<Icon name="heart" className="text-red-500" />
```

## Available Icons

### Playback Controls
- `play` - Play button
- `pause` - Pause button
- `step forward` - Skip forward
- `step backward` - Skip backward

### Volume Controls
- `volume up` - Increase volume
- `volume down` - Decrease volume
- `volume off` / `volume mute` - Mute audio

### User & Authentication
- `user` - User profile
- `power off` - Power/logout button
- `logout` - Sign out

### Ratings & Feedback
- `thumbs up` - Positive feedback
- `thumbs down` - Negative feedback
- `handshake` - Neutral/agreement
- `heart` - Favorite/like
- `star` - Rating/favorite

### Navigation
- `chevron left` / `left` - Navigate left
- `chevron right` / `right` - Navigate right

### Actions
- `search` - Search functionality
- `settings` - Settings/preferences
- `plus` - Add/create
- `minus` - Remove/subtract
- `close` / `remove` / `delete` - Close/remove
- `check` - Confirm/success

### Status
- `info` - Information
- `warning` - Warning message
- `error` - Error message

### Media
- `music` - Music/audio
- `clock` - Time/duration

## Size Variants

The Icon component supports 8 size variants:

| Size | Dimensions | Usage |
|------|-----------|-------|
| `mini` | 12px × 12px | Very small UI elements |
| `tiny` | 14px × 14px | Compact layouts |
| `small` | 16px × 16px | Inline text icons |
| `default` | 20px × 20px | Standard icons (default) |
| `large` | 24px × 24px | Prominent icons |
| `big` | 32px × 32px | Large buttons |
| `huge` | 40px × 40px | Hero sections |
| `massive` | 48px × 48px | Extra large displays |

```tsx
<Icon name="music" size="mini" />
<Icon name="music" size="tiny" />
<Icon name="music" size="small" />
<Icon name="music" /> {/* default */}
<Icon name="music" size="large" />
<Icon name="music" size="big" />
<Icon name="music" size="huge" />
<Icon name="music" size="massive" />
```

## Color Customization

### Using the `color` prop

```tsx
<Icon name="thumbs up" color="green" />
<Icon name="thumbs down" color="red" />
<Icon name="star" color="gold" />
```

### Using Tailwind CSS classes

```tsx
<Icon name="heart" className="text-red-500" />
<Icon name="star" className="text-yellow-400" />
<Icon name="check" className="text-green-600" />
```

### Using inline styles

```tsx
<Icon name="music" style={{ color: '#FF5733' }} />
```

## Migration from Semantic UI

The Icon component is designed as a drop-in replacement for Semantic UI React icons:

### Before (Semantic UI)
```tsx
import { Icon } from 'semantic-ui-react'

<Icon name='play' />
<Icon name='play' size='large' />
<Icon name='thumbs up' color='green' />
<Icon name={`step ${type}`} size='large' />
```

### After (New Icon Component)
```tsx
import { Icon } from '@/components/ui/icon'

<Icon name="play" />
<Icon name="play" size="large" />
<Icon name="thumbs up" color="green" />
<Icon name={`step ${type}` as IconName} size="large" />
```

### Key Differences

1. **String literals**: Use double quotes instead of single quotes (for consistency)
2. **Type safety**: TypeScript will warn about invalid icon names
3. **Icon library**: Uses Lucide React instead of Semantic UI's icon font

## TypeScript Support

The component is fully typed with TypeScript:

```tsx
import { Icon, IconName, IconProps } from '@/components/ui/icon'

// Type-safe icon name
const iconName: IconName = 'play'

// Custom component with icon prop
interface MyComponentProps {
  icon: IconName
  size?: IconProps['size']
}

const MyComponent: React.FC<MyComponentProps> = ({ icon, size }) => (
  <Icon name={icon} size={size} />
)
```

## Examples

### Playback Controls

```tsx
<div className="flex gap-2">
  <button>
    <Icon name="step backward" size="large" />
  </button>
  <button>
    <Icon name="play" size="big" />
  </button>
  <button>
    <Icon name="step forward" size="large" />
  </button>
</div>
```

### Volume Controls

```tsx
<div className="flex gap-2">
  <button onClick={volumeDown}>
    <Icon name="volume down" />
  </button>
  <button onClick={volumeUp}>
    <Icon name="volume up" />
  </button>
</div>
```

### Rating System

```tsx
<div className="flex gap-4">
  <Icon name="thumbs down" color="red" size="large" />
  <Icon name="handshake" size="large" />
  <Icon name="thumbs up" color="green" size="large" />
</div>
```

### User Profile

```tsx
{user ? (
  <img src={user.avatar} alt={user.name} />
) : (
  <Icon name="user" className="text-gray-400" />
)}
```

## Extending the Icon Component

To add new icons, update the `iconMap` in `icon.tsx`:

```tsx
import { NewIcon } from 'lucide-react'

const iconMap = {
  // ... existing icons
  'new-icon': NewIcon,
} as const
```

## Testing

The Icon component includes comprehensive tests covering:

- ✅ Rendering all icon variants
- ✅ Size variants
- ✅ Color customization
- ✅ Custom className support
- ✅ Style merging
- ✅ Unknown icon handling

Run tests:

```bash
bun test --bail --preload ./happydom.ts --preload ./src/setupTests-bun.ts icon.test.tsx
```

## Showcase

To view all available icons and their usage examples, see `icon.example.tsx`:

```tsx
import { IconShowcase } from '@/components/ui/icon.example'

// In your app or Storybook
<IconShowcase />
```

## Performance

- **Tree-shakeable**: Only imports the icons you use
- **Optimized**: Uses SVG icons instead of icon fonts
- **Small bundle**: Lucide React icons are lightweight (~1KB per icon)
- **No FOUT**: No flash of unstyled content (unlike icon fonts)

## Accessibility

The Icon component is accessible by default:

- Uses semantic SVG elements
- Supports `aria-label` and other ARIA attributes
- Works with screen readers
- Keyboard navigable when used in buttons

```tsx
<button aria-label="Play track">
  <Icon name="play" />
</button>
```

## Browser Support

The Icon component works in all modern browsers:

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Resources

- [Lucide React Documentation](https://lucide.dev/guide/packages/lucide-react)
- [Lucide Icon Library](https://lucide.dev/icons/)
- [Migration Plan](../../UI_MIGRATION_PLAN.md)

## Questions?

If you need an icon that's not available, check the [Lucide icon library](https://lucide.dev/icons/) and add it to the `iconMap`.