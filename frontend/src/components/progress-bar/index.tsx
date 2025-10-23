import React from 'react'
import { useSelector } from 'react-redux'
import { Line } from 'rc-progress'
import { timerToPercentage, millisToMinutesAndSeconds } from 'utils/time'

interface TimerState {
  remaining: number
}

interface TrackState {
  length: number
}

interface RootState {
  timer: TimerState
  track: TrackState
}

const ProgressBar: React.FC = () => {
  const timer = useSelector((state: RootState) => state.timer)
  const track = useSelector((state: RootState) => state.track)
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
