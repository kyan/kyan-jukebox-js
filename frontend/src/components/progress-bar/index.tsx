import React from 'react'
import { useSelector } from 'react-redux'
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
    <div className='relative mb-4'>
      <div className='flex justify-between items-center mb-2'>
        <span className='text-xs font-semibold text-muted-foreground tabular-nums'>
          {millisToMinutesAndSeconds(track.length - timer.remaining)}
        </span>
        <span className='text-xs font-semibold text-muted-foreground tabular-nums'>
          {millisToMinutesAndSeconds(track.length)}
        </span>
      </div>
      <div className='relative h-2 bg-muted/50 rounded-full overflow-hidden shadow-inner'>
        <div
          className='absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-300 ease-linear shadow-sm'
          style={{ width: `${progressPercentage}%` }}
        >
          <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer'></div>
        </div>
      </div>
    </div>
  )
}

export default ProgressBar
