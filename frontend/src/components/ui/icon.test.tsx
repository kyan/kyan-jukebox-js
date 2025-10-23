import React from 'react'
import { render } from '@testing-library/react'
import { Icon } from './icon'

describe('Icon Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<Icon name='play' />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders play icon', () => {
    const { container } = render(<Icon name='play' />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders pause icon', () => {
    const { container } = render(<Icon name='pause' />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders user icon', () => {
    const { container } = render(<Icon name='user' />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders search icon', () => {
    const { container } = render(<Icon name='search' />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('applies size variant correctly', () => {
    const { container } = render(<Icon name='play' size='large' />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('w-6', 'h-6')
  })

  it('applies big size variant correctly', () => {
    const { container } = render(<Icon name='play' size='big' />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('w-8', 'h-8')
  })

  it('applies small size variant correctly', () => {
    const { container } = render(<Icon name='search' size='small' />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('w-4', 'h-4')
  })

  it('applies custom className', () => {
    const { container } = render(<Icon name='play' className='custom-class' />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('custom-class')
  })

  it('applies color style', () => {
    const { container } = render(<Icon name='thumbs up' color='green' />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveStyle({ color: 'green' })
  })

  it('applies custom style', () => {
    const { container } = render(<Icon name='play' style={{ opacity: 0.5 }} />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveStyle({ opacity: 0.5 })
  })

  it('combines color and custom style', () => {
    const { container } = render(<Icon name='thumbs down' color='red' style={{ opacity: 0.8 }} />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveStyle({ color: 'red', opacity: 0.8 })
  })

  it('renders volume icons', () => {
    const { container: container1 } = render(<Icon name='volume up' />)
    expect(container1.querySelector('svg')).toBeInTheDocument()

    const { container: container2 } = render(<Icon name='volume down' />)
    expect(container2.querySelector('svg')).toBeInTheDocument()
  })

  it('renders step forward icon', () => {
    const { container } = render(<Icon name='step forward' />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders step backward icon', () => {
    const { container } = render(<Icon name='step backward' />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders rating icons', () => {
    const { container: container1 } = render(<Icon name='thumbs up' />)
    expect(container1.querySelector('svg')).toBeInTheDocument()

    const { container: container2 } = render(<Icon name='thumbs down' />)
    expect(container2.querySelector('svg')).toBeInTheDocument()

    const { container: container3 } = render(<Icon name='handshake' />)
    expect(container3.querySelector('svg')).toBeInTheDocument()
  })

  it('renders power off icon', () => {
    const { container } = render(<Icon name='power off' />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('warns for unknown icon names', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
    const { container } = render(<Icon name={'unknown' as any} />)
    expect(container.firstChild).toBeNull()
    expect(consoleSpy).toHaveBeenCalledWith('Icon "unknown" not found in icon map')
    consoleSpy.mockRestore()
  })

  it('uses default size when not specified', () => {
    const { container } = render(<Icon name='play' />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('w-5', 'h-5')
  })
})
