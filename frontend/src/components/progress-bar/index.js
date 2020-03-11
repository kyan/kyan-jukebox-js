import React from 'react'
import { useSelector } from 'react-redux'
import { Line } from 'rc-progress'
import { timerToPercentage, millisToMinutesAndSeconds } from 'utils/time'
import './styles.scss'

const ProgressBar = () => {
  const timer = useSelector(state => state.timer)
  const track = useSelector(state => state.track)
  const progressPercentage = timerToPercentage(timer)

  return (
    <div className='c-progressBar'>
      <span className='c-progressBar__trackLength'>{millisToMinutesAndSeconds(track.length)}</span>
      <span className='c-progressBar__remainingTime'>{millisToMinutesAndSeconds(timer.remaining)}</span>
      <Line percent={progressPercentage} strokeLinecap="square" />
    </div>
  )
}

export default ProgressBar
