import React, { useContext } from 'react'
import { Icon } from 'semantic-ui-react'
import GoogleAuthContext from 'contexts/google'

export const Settings = () => {
  const { googleUser, signIn, signOut } = useContext(GoogleAuthContext)

  let avatar = (
    <button
      onClick={() => signIn()}
      className="c-button"
    >
      <Icon name='power off' />
    </button>
  )
  if (googleUser && googleUser.profileObj) {
    avatar = (
      <button
        onClick={() => signOut()}
        className="c-button c-button--image"
      >
        <img
          title={googleUser.profileObj.name}
          src={googleUser.profileObj.imageUrl}
        />
      </button>

    )
  }

  return (
    <React.Fragment>{avatar}</React.Fragment>
  )
}

export default Settings
