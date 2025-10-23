import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

interface LoginData {
  email: string
}

interface LoginModalProps {
  open: boolean
  onSubmit: (data: LoginData) => Promise<void>
  error?: string
}

export const LoginModal: React.FC<LoginModalProps> = ({ open, onSubmit, error }) => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Stop loading when there's an error
  useEffect(() => {
    if (error) {
      setIsLoading(false)
    }
  }, [error])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsLoading(true)
      await onSubmit({ email })
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} modal>
      <DialogContent
        className='sm:max-w-md'
        onInteractOutside={e => e.preventDefault()}
        onEscapeKeyDown={e => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className='text-center'>Sign in to Jukebox</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='email' className='font-semibold text-gray-700'>
              Email Address
            </Label>
            <Input
              id='email'
              type='email'
              placeholder='your.email@example.com'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className='text-base'
            />
          </div>
          {error && (
            <Alert variant='destructive'>
              <AlertTitle>Authentication Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button type='submit' className='w-full' disabled={!email || isLoading}>
            {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Sign In
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default LoginModal
