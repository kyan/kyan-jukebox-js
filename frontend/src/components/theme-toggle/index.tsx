import React, { useEffect, useState } from 'react'
import { Icon } from '@/components/ui/icon'
import { Button } from '@/components/ui/button'
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
      <Button
        variant='outline'
        size='icon'
        className='h-[45px] w-[45px] rounded-full border-border/50 bg-card/50 backdrop-blur-sm shadow-sm'
        disabled
      >
        <Icon name='sun' />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          className='h-[45px] w-[45px] rounded-full border-border/50 bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:scale-110 hover:shadow-lg active:scale-95'
        >
          {theme === 'light' && (
            <Icon name='sun' className='transition-transform hover:rotate-45' />
          )}
          {theme === 'dark' && (
            <Icon name='moon' className='transition-transform hover:-rotate-12' />
          )}
          {theme === 'system' && (
            <Icon name='desktop' className='transition-transform hover:scale-110' />
          )}
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='animate-slide-down shadow-xl border-border/50 bg-card/95 backdrop-blur-sm p-2'
      >
        <DropdownMenuItem
          onClick={() => handleThemeChange('light')}
          className='cursor-pointer transition-all duration-200 hover:bg-accent rounded-md font-medium'
        >
          <Icon name='sun' className='mr-2' />
          <span>Light</span>
          {theme === 'light' && <Icon name='check' className='ml-auto text-primary' size='small' />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleThemeChange('dark')}
          className='cursor-pointer transition-all duration-200 hover:bg-accent rounded-md font-medium'
        >
          <Icon name='moon' className='mr-2' />
          <span>Dark</span>
          {theme === 'dark' && <Icon name='check' className='ml-auto text-primary' size='small' />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleThemeChange('system')}
          className='cursor-pointer transition-all duration-200 hover:bg-accent rounded-md font-medium'
        >
          <Icon name='desktop' className='mr-2' />
          <span>System</span>
          {theme === 'system' && (
            <Icon name='check' className='ml-auto text-primary' size='small' />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ThemeToggle
