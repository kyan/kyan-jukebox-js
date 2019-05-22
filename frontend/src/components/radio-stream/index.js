import React from 'react'
import PropTypes from 'prop-types'
import ReactAudioPlayer from 'react-audio-player'

const RadioStream = ({ active }) => {
  if (!active) { return null }

  return <ReactAudioPlayer
    src='http://icecast.local:8000/radio-kyan.mp3'
    autoPlay
    controls
  />
}

RadioStream.propTypes = {
  active: PropTypes.bool
}

export default RadioStream
