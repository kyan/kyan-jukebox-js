import React from 'react'
import { useSelector } from 'react-redux'
import { timerToPercentage, millisToMinutesAndSeconds } from 'utils/time'

interface TimerState {
  position: number
  duration: number
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
    <div className='progress-bar-container'>
      <div className='progress-bar-times'>
        <span className='progress-bar-time'>
          {millisToMinutesAndSeconds(track.length - timer.remaining)}
        </span>
        <span className='progress-bar-time'>{millisToMinutesAndSeconds(track.length)}</span>
      </div>
      <div className='progress-bar-track'>
        <div className='progress-bar-fill' style={{ width: `${progressPercentage}%` }}>
          <div className='progress-bar-shimmer'></div>
        </div>
      </div>
    </div>
  )
}

export default ProgressBar
