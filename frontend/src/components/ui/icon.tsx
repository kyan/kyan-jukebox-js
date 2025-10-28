import React from 'react'
import { cn } from '@/lib/utils'
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  VolumeX,
  Volume1,
  Volume2,
  Search,
  User,
  ThumbsUp,
  ThumbsDown,
  Handshake,
  Power,
  ChevronLeft,
  ChevronRight,
  Music,
  Clock,
  Heart,
  Star,
  Settings,
  LogOut,
  Plus,
  Minus,
  X,
  Check,
  AlertCircle,
  Info,
  Sun,
  Moon,
  Monitor
} from 'lucide-react'

// Icon name to component mapping
const iconMap = {
  // Playback controls
  play: Play,
  pause: Pause,
  'step forward': SkipForward,
  'step backward': SkipBack,

  // Volume controls
  'volume down': Volume1,
  'volume up': Volume2,
  'volume off': VolumeX,
  'volume mute': VolumeX,

  // User & Auth
  user: User,
  'power off': Power,
  logout: LogOut,

  // Ratings & Feedback
  'thumbs up': ThumbsUp,
  'thumbs down': ThumbsDown,
  handshake: Handshake,
  heart: Heart,
  star: Star,

  // Navigation
  'chevron left': ChevronLeft,
  'chevron right': ChevronRight,
  left: ChevronLeft,
  right: ChevronRight,

  // Actions
  search: Search,
  settings: Settings,
  plus: Plus,
  minus: Minus,
  close: X,
  remove: X,
  delete: X,
  check: Check,

  // Status
  info: Info,
  warning: AlertCircle,
  error: AlertCircle,

  // Media
  music: Music,
  clock: Clock,

  // Theme
  sun: Sun,
  moon: Moon,
  desktop: Monitor,
  monitor: Monitor,

  // Additional Actions
  'sign out': LogOut
} as const

export type IconName = keyof typeof iconMap

export interface IconProps {
  name: IconName
  size?: 'mini' | 'tiny' | 'small' | 'default' | 'large' | 'big' | 'huge' | 'massive'
  className?: string
  color?: string
  style?: React.CSSProperties
}

export const Icon = React.forwardRef<HTMLElement, IconProps>(
  ({ name, size = 'default', className, color, style, ...props }, ref) => {
    const IconComponent = iconMap[name]

    if (!IconComponent) {
      console.warn(`Icon "${name}" not found in icon map`)
      return null
    }

    const sizeClass = size ? `icon--${size}` : ''

    const combinedStyle = {
      ...style,
      ...(color && { color })
    }

    return (
      <IconComponent
        ref={ref as any}
        className={cn('icon', sizeClass, className)}
        style={combinedStyle}
        {...props}
      />
    )
  }
)

Icon.displayName = 'Icon'

export default Icon
