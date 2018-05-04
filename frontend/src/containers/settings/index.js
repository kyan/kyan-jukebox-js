import React from 'react'
import { connect } from 'react-redux'
import { authenticate, updateUsername, toggleSettings } from '../../actions'
import { Modal, Form, Button, Image, Progress } from 'semantic-ui-react'

const toggleModal = (dispatch) => {
  return () => {
    dispatch(toggleSettings())
  }
}

const handleUserChange = (dispatch) => {
  return (_e, { value }) => {
    dispatch(updateUsername(value))
  }
}

const authenticateUser = (dispatch, username) => {
  return () => {
    if (username) dispatch(authenticate(username))
  }
}

const authActions = (dispatch, settings) => {
  let defaults = {
    icon: 'checkmark',
    labelPosition: 'right',
    content: 'Click to validate',
    onClick: authenticateUser(dispatch, settings.username),
    className: 'jb-authenticate-button'
  }

  if (isAuthorized(settings)) {
    defaults = Object.assign(defaults, {
      content: 'Authenticated'
    })
  }

  return defaults
}

const isAuthorized = (settings) => {
  return settings.token
}

const progress = (settings) => {
  let options = { percent: 100 }
  const username = settings.user ? settings.user.username : ''
  const typeStr = isAuthorized(settings) ? 'success' : 'error'
  const typeTxt = isAuthorized(settings) ? `${username} is now logged in` : 'Unknown User!'
  options[typeStr] = true

  return (
    <Progress {...options} >
      {typeTxt}
    </Progress>
  )
}

const modal = (dispatch, settings) => (
  <Modal
    closeIcon
    size='small'
    dimmer='blurring'
    open={settings.open}
    onClose={toggleModal(dispatch)}
  >
    <Modal.Header>Settings</Modal.Header>
    <Modal.Content>
      <Modal.Description>
        <Form>
          <Form.Input
            label='Enter your USERNAME below'
            size='massive'
            icon='user'
            iconPosition='left'
            placeholder='example: user123'
            onChange={handleUserChange(dispatch)}
            value={settings.username || ''}
            action={authActions(dispatch, settings)}
          />
          {progress(settings)}
        </Form>
      </Modal.Description>
    </Modal.Content>
  </Modal>
)

const accountLink = (dispatch, settings) => {
  if (settings.user && settings.user.emailHash) {
    return (
      <Image
        rounded
        size='mini'
        floated='right'
        className='jb-settings-toggle'
        onClick={toggleModal(dispatch)}
        title={settings.user.fullname}
        src={`https://www.gravatar.com/avatar/${settings.user.emailHash}`}
      />
    )
  }

  return (
    <Button
      icon='user'
      floated='right'
      onClick={toggleModal(dispatch)}
      className='jb-settings-toggle'
    />
  )
}

export const Settings = ({ dispatch, settings }) => (
  <React.Fragment>
    {accountLink(dispatch, settings)}
    {modal(dispatch, settings)}
  </React.Fragment>
)

const mapStateToProps = state => {
  return {
    settings: state.settings
  }
}

export default connect(
  mapStateToProps
)(Settings)
