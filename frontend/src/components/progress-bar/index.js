import React from 'react'
import { useSelector } from 'react-redux'
import { Line } from 'rc-progress'
import { timerToPercentage, millisToMinutesAndSeconds } from 'utils/time'

const ProgressBar = () => {
  const timer = useSelector(state => state.timer)
  const track = useSelector(state => state.track)
  const progressPercentage = timerToPercentage(timer)

  return (
    <div className='progress-container'>
      <span className='remaining-text'>{millisToMinutesAndSeconds(timer.remaining)}</span>
      <span className='track-length'>{millisToMinutesAndSeconds(track.length)}</span>
      <Line percent={progressPercentage} />
    </div>
  )
}

export default ProgressBar
