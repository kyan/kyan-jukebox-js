import React, { useContext } from 'react'
import { Button, Image } from 'semantic-ui-react'
import './index.css'

export const Settings = () => {
  let avatar = (
    <Button
      icon='power off'
      floated='right'
      onClick={() => console.log('DO SOMETHING')}
      className='jb-settings-toggle'
      title='Login using Google'
    />
  )
  // if (googleUser && googleUser.profileObj) {
  //   avatar = (
  //     <Image
  //       rounded
  //       size='mini'
  //       floated='right'
  //       title="Duncan"
  //       src={null}
  //       onClick={() => signOut()}
  //     />
  //   )
  // }

  return <React.Fragment>{avatar}</React.Fragment>
}

export default Settings
