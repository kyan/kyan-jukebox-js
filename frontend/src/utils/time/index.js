import ProgressTimer from 'media-progress-timer'

export const millisToMinutesAndSeconds = (millis) => {
  let minutes = Math.floor(millis / 60000)
  let seconds = ((millis % 60000) / 1000).toFixed(0)
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
}

export const millisToSeconds = (millis) => {
  return millis * 0.001
}

export const timerToPercentage = timer => {
  if (timer.duration === 0) { return 0 }
  const position = millisToSeconds(timer.position)
  const duration = millisToSeconds(timer.duration)
  const percentage = Math.round((position / duration) * 100)

  return isNaN(percentage) ? 0 : percentage
}

export const trackProgressTimer = (store, actions) => {
  return ProgressTimer({
    callback: (position, duration) => {
      store.dispatch(actions.updateProgressTimer(position, duration))
    },
    fallbackTargetFrameRate: 1,
    disableRequestAnimationFrame: true
  })
}
