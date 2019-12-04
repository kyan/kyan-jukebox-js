import React from 'react'
import PropTypes from 'prop-types'
import { DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Constants from 'constants/common'
import UrlDropArea from 'components/url-drop-area'

const DragInTrack = ({ disabled, onDrop, children }) => {
  if (disabled) { return children }

  return (
    <DragDropContextProvider backend={HTML5Backend}>
      <UrlDropArea accepts={Constants.DROP_TYPES} onDrop={onDrop}>
        { children }
      </UrlDropArea>
    </DragDropContextProvider>
  )
}

DragInTrack.propTypes = {
  disabled: PropTypes.bool,
  onDrop: PropTypes.func.isRequired
}

export default DragInTrack
