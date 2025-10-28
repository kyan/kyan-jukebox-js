import React, { useEffect, useState } from 'react'
import { Icon } from '@/components/ui/icon'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

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
      <button className='theme-toggle-button' disabled aria-label='Toggle theme'>
        <Icon name='sun' />
      </button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='theme-toggle-button' aria-label='Toggle theme'>
          {theme === 'light' && (
            <Icon name='sun' className='theme-toggle-icon theme-toggle-icon--sun' />
          )}
          {theme === 'dark' && (
            <Icon name='moon' className='theme-toggle-icon theme-toggle-icon--moon' />
          )}
          {theme === 'system' && (
            <Icon name='desktop' className='theme-toggle-icon theme-toggle-icon--system' />
          )}
          <span className='theme-toggle-sr-only'>Toggle theme</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='theme-toggle-menu'>
        <DropdownMenuItem
          onClick={() => handleThemeChange('light')}
          className='theme-toggle-menu-item'
        >
          <Icon name='sun' />
          <span>Light</span>
          {theme === 'light' && <Icon name='check' className='theme-toggle-check' size='small' />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleThemeChange('dark')}
          className='theme-toggle-menu-item'
        >
          <Icon name='moon' />
          <span>Dark</span>
          {theme === 'dark' && <Icon name='check' className='theme-toggle-check' size='small' />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleThemeChange('system')}
          className='theme-toggle-menu-item'
        >
          <Icon name='desktop' />
          <span>System</span>
          {theme === 'system' && <Icon name='check' className='theme-toggle-check' size='small' />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ThemeToggle
