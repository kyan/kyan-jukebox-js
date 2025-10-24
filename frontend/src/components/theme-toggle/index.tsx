import React, { useEffect, useState } from 'react'
import { Icon } from 'components/ui/icon'
import { Button } from 'components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from 'components/ui/dropdown-menu'

type Theme = 'light' | 'dark' | 'system'

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('system')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') as Theme | null
    if (savedTheme) {
      setTheme(savedTheme)
      applyTheme(savedTheme)
    } else {
      applyTheme('system')
    }
  }, [])

  const applyTheme = (newTheme: Theme) => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(newTheme)
    }
  }

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <Button variant='ghost' size='icon' disabled>
        <Icon name='sun' />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='transition-smooth hover-lift'>
          {theme === 'light' && <Icon name='sun' />}
          {theme === 'dark' && <Icon name='moon' />}
          {theme === 'system' && <Icon name='desktop' />}
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='animate-slide-down'>
        <DropdownMenuItem
          onClick={() => handleThemeChange('light')}
          className='cursor-pointer transition-smooth'
        >
          <Icon name='sun' className='mr-2' />
          <span>Light</span>
          {theme === 'light' && <Icon name='check' className='ml-auto' size='small' />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleThemeChange('dark')}
          className='cursor-pointer transition-smooth'
        >
          <Icon name='moon' className='mr-2' />
          <span>Dark</span>
          {theme === 'dark' && <Icon name='check' className='ml-auto' size='small' />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleThemeChange('system')}
          className='cursor-pointer transition-smooth'
        >
          <Icon name='desktop' className='mr-2' />
          <span>System</span>
          {theme === 'system' && <Icon name='check' className='ml-auto' size='small' />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ThemeToggle
