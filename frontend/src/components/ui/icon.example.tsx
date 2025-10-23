import React from 'react'
import { Icon, IconName } from './icon'

/**
 * Icon Component Showcase
 *
 * This file demonstrates all available icons and their usage.
 * Use this as a reference when migrating from Semantic UI React icons.
 */

export const IconShowcase: React.FC = () => {
  const iconGroups: Record<string, IconName[]> = {
    'Playback Controls': ['play', 'pause', 'step forward', 'step backward'],
    'Volume Controls': ['volume up', 'volume down', 'volume off', 'volume mute'],
    'User & Auth': ['user', 'power off', 'logout'],
    'Ratings & Feedback': ['thumbs up', 'thumbs down', 'handshake', 'heart', 'star'],
    Navigation: ['chevron left', 'chevron right', 'left', 'right'],
    Actions: ['search', 'settings', 'plus', 'minus', 'close', 'remove', 'delete', 'check'],
    Status: ['info', 'warning', 'error'],
    Media: ['music', 'clock']
  }

  const sizes = ['mini', 'tiny', 'small', 'default', 'large', 'big', 'huge', 'massive'] as const

  return (
    <div className='p-8 space-y-12'>
      <div>
        <h1 className='text-3xl font-bold mb-2'>Icon Component Showcase</h1>
        <p className='text-muted-foreground'>
          All available icons with their Semantic UI equivalent names
        </p>
      </div>

      {/* Icons by Category */}
      {Object.entries(iconGroups).map(([category, icons]) => (
        <div key={category} className='space-y-4'>
          <h2 className='text-2xl font-semibold'>{category}</h2>
          <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6'>
            {icons.map(iconName => (
              <div
                key={iconName}
                className='flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-accent'
              >
                <Icon name={iconName} size='large' />
                <span className='text-xs text-center text-muted-foreground'>{iconName}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Size Variants */}
      <div className='space-y-4'>
        <h2 className='text-2xl font-semibold'>Size Variants</h2>
        <div className='flex flex-wrap items-end gap-6 p-6 border rounded-lg'>
          {sizes.map(size => (
            <div key={size} className='flex flex-col items-center gap-2'>
              <Icon name='music' size={size} />
              <span className='text-xs text-muted-foreground'>{size}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Color Variants */}
      <div className='space-y-4'>
        <h2 className='text-2xl font-semibold'>Color Variants</h2>
        <div className='flex flex-wrap gap-6 p-6 border rounded-lg'>
          <div className='flex flex-col items-center gap-2'>
            <Icon name='thumbs up' size='large' color='green' />
            <span className='text-xs text-muted-foreground'>green</span>
          </div>
          <div className='flex flex-col items-center gap-2'>
            <Icon name='thumbs down' size='large' color='red' />
            <span className='text-xs text-muted-foreground'>red</span>
          </div>
          <div className='flex flex-col items-center gap-2'>
            <Icon name='star' size='large' color='gold' />
            <span className='text-xs text-muted-foreground'>gold</span>
          </div>
          <div className='flex flex-col items-center gap-2'>
            <Icon name='heart' size='large' color='blue' />
            <span className='text-xs text-muted-foreground'>blue</span>
          </div>
          <div className='flex flex-col items-center gap-2'>
            <Icon name='warning' size='large' color='orange' />
            <span className='text-xs text-muted-foreground'>orange</span>
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div className='space-y-4'>
        <h2 className='text-2xl font-semibold'>Usage Examples</h2>
        <div className='space-y-4'>
          <div className='p-4 border rounded-lg space-y-2'>
            <h3 className='font-medium'>Basic Icon</h3>
            <code className='block bg-muted p-2 rounded text-sm'>{`<Icon name="play" />`}</code>
            <div className='pt-2'>
              <Icon name='play' />
            </div>
          </div>

          <div className='p-4 border rounded-lg space-y-2'>
            <h3 className='font-medium'>Icon with Size</h3>
            <code className='block bg-muted p-2 rounded text-sm'>
              {`<Icon name="play" size="large" />`}
            </code>
            <div className='pt-2'>
              <Icon name='play' size='large' />
            </div>
          </div>

          <div className='p-4 border rounded-lg space-y-2'>
            <h3 className='font-medium'>Icon with Color</h3>
            <code className='block bg-muted p-2 rounded text-sm'>
              {`<Icon name="thumbs up" color="green" />`}
            </code>
            <div className='pt-2'>
              <Icon name='thumbs up' color='green' />
            </div>
          </div>

          <div className='p-4 border rounded-lg space-y-2'>
            <h3 className='font-medium'>Icon with Custom Class</h3>
            <code className='block bg-muted p-2 rounded text-sm'>
              {`<Icon name="heart" className="text-red-500" />`}
            </code>
            <div className='pt-2'>
              <Icon name='heart' className='text-red-500' />
            </div>
          </div>
        </div>
      </div>

      {/* Migration Guide */}
      <div className='space-y-4'>
        <h2 className='text-2xl font-semibold'>Migration from Semantic UI</h2>
        <div className='p-6 border rounded-lg space-y-3'>
          <div className='grid grid-cols-2 gap-4 text-sm'>
            <div>
              <strong>Semantic UI</strong>
              <code className='block bg-muted p-2 rounded mt-1'>{`<Icon name='play' />`}</code>
            </div>
            <div>
              <strong>New Icon Component</strong>
              <code className='block bg-muted p-2 rounded mt-1'>{`<Icon name="play" />`}</code>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4 text-sm'>
            <div>
              <strong>Semantic UI with Size</strong>
              <code className='block bg-muted p-2 rounded mt-1'>
                {`<Icon name='play' size='large' />`}
              </code>
            </div>
            <div>
              <strong>New Icon Component</strong>
              <code className='block bg-muted p-2 rounded mt-1'>
                {`<Icon name="play" size="large" />`}
              </code>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4 text-sm'>
            <div>
              <strong>Semantic UI with Color</strong>
              <code className='block bg-muted p-2 rounded mt-1'>
                {`<Icon name='thumbs up' color='green' />`}
              </code>
            </div>
            <div>
              <strong>New Icon Component</strong>
              <code className='block bg-muted p-2 rounded mt-1'>
                {`<Icon name="thumbs up" color="green" />`}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IconShowcase
