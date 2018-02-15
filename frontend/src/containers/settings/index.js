import React from 'react'
import { connect } from 'react-redux'
import { toggleSettings } from '../../actions'
import { Modal, Form, Button } from 'semantic-ui-react'

const toggleModal = (dispatch) => {
  return () => {
    dispatch(toggleSettings())
  }
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
            label='Enter your user ID below'
            size='massive'
            icon='user'
            iconPosition='left'
            placeholder='example: 123'
            value={settings.uid}
          />
          <Button primary type='submit'>Save</Button>
        </Form>
      </Modal.Description>
    </Modal.Content>
  </Modal>
)

export const Settings = ({ dispatch, settings }) => (
  <React.Fragment>
    <Button
      icon='user'
      floated='right'
      onClick={toggleModal(dispatch)}
      className='jb-settings-toggle'
    />
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
