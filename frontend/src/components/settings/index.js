import React, { useContext } from 'react'
import { Button, Image } from 'semantic-ui-react'
import GoogleAuthContext from 'contexts/google'
import './index.css'

export const Settings = () => {
  const { googleUser, grantOfflineAccess, signOut } = useContext(GoogleAuthContext)

  let avatar = googleUser?.profileObj ? (
    <Image
      rounded
      size='mini'
      floated='right'
      title={googleUser.profileObj.name}
      src={googleUser.profileObj.imageUrl}
      onClick={() => signOut()}
    />
  ) : (
    <Button
      icon='power off'
      floated='right'
      onClick={() => grantOfflineAccess()}
      className='jb-settings-toggle'
      title='Login using Google'
    />
  )

  return <React.Fragment>{avatar}</React.Fragment>
}

export default Settings
