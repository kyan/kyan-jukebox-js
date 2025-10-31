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
        showClose={false}
        onInteractOutside={e => e.preventDefault()}
        onEscapeKeyDown={e => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Sign in to Jukebox</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Label htmlFor='email'>Email Address</Label>
            <Input
              id='email'
              type='email'
              placeholder='your.email@example.com'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          {error && (
            <Alert variant='destructive'>
              <AlertTitle>Authentication Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button type='submit' disabled={!email || isLoading} style={{ width: '100%' }}>
            {isLoading && (
              <Loader2
                style={{ marginRight: '0.5rem', height: '1rem', width: '1rem' }}
                className='animate-spin'
              />
            )}
            Sign In
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default LoginModal
