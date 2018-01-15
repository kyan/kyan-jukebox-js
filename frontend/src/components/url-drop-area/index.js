import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DropTarget } from 'react-dnd'

const boxTarget = {
  drop (props, monitor) {
    if (props.onDrop) {
      props.onDrop(props, monitor)
    }
  }
}

const boxHandler = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget()
  }
}

class UrlDropArea extends Component {
  render () {
    const { connectDropTarget } = this.props

    return connectDropTarget(
      <div>
        { this.props.children }
      </div>
    )
  }
}

UrlDropArea.propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  accepts: PropTypes.arrayOf(PropTypes.string).isRequired,
  onDrop: PropTypes.func
}

export default DropTarget(props => props.accepts, boxTarget, boxHandler)(UrlDropArea)
