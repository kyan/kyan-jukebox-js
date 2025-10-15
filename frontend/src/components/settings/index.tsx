import React, { useState } from 'react'
import { Button, Image, Popup, List } from 'semantic-ui-react'
import { getAvatarUrl } from '../../utils/avatar'
import './index.css'

interface User {
  fullname: string
  email: string
  picture?: string
}

interface SettingsProps {
  user?: User
  isSignedIn: boolean
  onSignOut: () => void
}

export const Settings: React.FC<SettingsProps> = ({ user, isSignedIn, onSignOut }) => {
  const [isOpen, setIsOpen] = useState(false)

  let avatar = (
    <Button
      icon='power off'
      floated='right'
      className='jb-settings-toggle'
      title='Not signed in'
      disabled
    />
  )

  if (isSignedIn && user) {
    const avatarUrl = getAvatarUrl(user, 50)

    avatar = (
      <Popup
        trigger={
          <Image
            rounded
            size='mini'
            floated='right'
            src={avatarUrl}
            className='jb-settings-avatar'
            style={{ cursor: 'pointer' }}
          />
        }
        content={
          <div>
            <List>
              <List.Item>
                <List.Header>{user.fullname}</List.Header>
                <List.Description>{user.email}</List.Description>
              </List.Item>
            </List>
            <Button
              fluid
              size='small'
              onClick={() => {
                setIsOpen(false)
                onSignOut()
              }}
              style={{ marginTop: '10px' }}
            >
              Sign Out
            </Button>
          </div>
        }
        on='click'
        position='bottom right'
        open={isOpen}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
      />
    )
  }

  return <React.Fragment>{avatar}</React.Fragment>
}

export default Settings
