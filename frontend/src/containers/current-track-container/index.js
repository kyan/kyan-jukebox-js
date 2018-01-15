import React from 'react'
import { connect } from 'react-redux'
import { timerToPercentage } from '../../utils/time'
import { getCurrentTrackImageInCache } from '../../selectors'
import CurrentTrack from '../../components/current-track'

export const CurrentTrackContainer = ({ track, image, progress }) => (
  <CurrentTrack
    track={track}
    image={image}
    progress={progress}
  />
)

const mapStateToProps = state => {
  return {
    track: state.track,
    image: getCurrentTrackImageInCache(state),
    progress: timerToPercentage(state.timer)
  }
}

export default connect(
  mapStateToProps
)(CurrentTrackContainer)
