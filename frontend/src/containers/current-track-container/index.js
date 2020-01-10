import React from 'react'
import { connect } from 'react-redux'
import { timerToPercentage } from 'utils/time'
import CurrentTrack from 'components/current-track'

export const CurrentTrackContainer = ({ track, progress, remaining }) => (
  <CurrentTrack
    track={track}
    progress={progress}
    remaining={remaining}
  />
)

const mapStateToProps = state => {
  return {
    track: state.track,
    progress: timerToPercentage(state.timer),
    remaining: state.timer.remaining
  }
}

export default connect(
  mapStateToProps
)(CurrentTrackContainer)
