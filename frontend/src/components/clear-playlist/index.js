import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Confirm, Label } from 'semantic-ui-react'

class ClearPlaylist extends Component {
  state = { open: false }

  clearButton = () => {
    return (
      <Label
        horizontal
        size='mini'
        as='a'
        color='red'
        onClick={this.show}
        className='jb-clear-button'
      >CLEAR</Label>
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
    if (this.props.disabled) { return null }

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
  disabled: PropTypes.bool,
  onClear: PropTypes.func.isRequired
}

export default ClearPlaylist
