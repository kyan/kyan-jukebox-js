import React, { useState, useEffect } from 'react'
import { Modal, Form, Button, Message } from 'semantic-ui-react'
import './index.css'

export const LoginModal = ({ open, onSubmit, error }) => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Stop loading when there's an error
  useEffect(() => {
    if (error) {
      setIsLoading(false)
    }
  }, [error])

  const handleSubmit = async e => {
    e.preventDefault()
    if (email) {
      setIsLoading(true)
      await onSubmit({ email })
      setIsLoading(false)
    }
  }

  return (
    <Modal open={open} size='small' closeOnDimmerClick={false} closeOnEscape={false}>
      <Modal.Header>Sign in to Jukebox</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit} error={!!error}>
          <Form.Field>
            <label>Email Address</label>
            <input
              type='email'
              placeholder='your.email@example.com'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </Form.Field>
          {error && <Message error header='Authentication Failed' content={error} />}
          <Button type='submit' primary fluid disabled={!email || isLoading} loading={isLoading}>
            Sign In
          </Button>
        </Form>
      </Modal.Content>
    </Modal>
  )
}

export default LoginModal
