import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Confirm, Button, Icon } from 'semantic-ui-react'

class ClearPlaylist extends Component {
  state = { open: false }

  clearButton = () => {
    return (
      <Button
        onClick={this.show}
        animated='vertical'
        className='jb-clear-button'
      >
        <Button.Content hidden>Clear</Button.Content>
        <Button.Content visible>
          <Icon name='ban' />
        </Button.Content>
      </Button>
    )
  }

  show = () => {
    this.setState({ open: true })
  }

  handleConfirm = (ev) => {
    this.setState({ open: false })
    this.props.onClear(ev)
  }

  handleCancel = () => {
    this.setState({ open: false })
  }

  render () {
    return (
      <span>
        {this.clearButton()}
        <Confirm
          content='Are you sure you want to nuke the playlist?'
          cancelButton='No thanks'
          confirmButton='Do it!'
          open={this.state.open}
          onCancel={this.handleCancel}
          onConfirm={this.handleConfirm}
        />
      </span>
    )
  }
}

ClearPlaylist.propTypes = {
  onClear: PropTypes.func.isRequired
}

export default ClearPlaylist
