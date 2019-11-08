import React, { useContext } from 'react'
import { Button, Image } from 'semantic-ui-react'
import GoogleAuthContext from '../../contexts/google'

export const Settings = () => {
  const { googleUser, signIn, signOut } = useContext(GoogleAuthContext)

  let avatar = (
    <Button
      icon='power off'
      floated='right'
      onClick={() => signIn()}
      className='jb-settings-toggle'
      title='Login using Google'
    />
  )
  if (googleUser && googleUser.profileObj) {
    avatar = (
      <Image
        rounded
        size='mini'
        floated='right'
        title={googleUser.profileObj.name}
        src={googleUser.profileObj.imageUrl}
        onClick={() => signOut()}
      />
    )
  }

  return (
    <React.Fragment>{avatar}</React.Fragment>
  )
}

export default Settings
