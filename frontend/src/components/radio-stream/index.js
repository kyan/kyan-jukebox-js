import React from 'react'
import PropTypes from 'prop-types'
import ReactHowler from 'react-howler'

const RadioStream = ({ active }) => (
  <ReactHowler
    src='http://icecast.local:8000/radio-kyan.mp3'
    playing={active}
    html5
  />
)

RadioStream.propTypes = {
  active: PropTypes.bool
}

export default RadioStream
