import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DropTarget } from 'react-dnd'
import './index.css'

const boxTarget = {
  drop(props, monitor) {
    if (props.onDrop) {
      props.onDrop(props, monitor)
    }
  }
}

const boxHandler = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}

const dropTrack = show => {
  if (!show) return null
  return (
    <div className='drag-is-over'>
      <p>Drop da track</p>
    </div>
  )
}

class UrlDropArea extends Component {
  render() {
    const { connectDropTarget, isOver } = this.props

    return connectDropTarget(
      <div>
        {dropTrack(isOver)}
        {this.props.children}
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
