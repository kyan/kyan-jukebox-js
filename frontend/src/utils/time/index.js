import ProgressTimer from 'media-progress-timer'

export const millisToMinutesAndSeconds = (millis) => {
  var minutes = Math.floor(millis / 60000)
  var seconds = ((millis % 60000) / 1000).toFixed(0)
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds
}

export const millisToSeconds = (millis) => {
  return millis * 0.001
}

export const timerToPercentage = timer => {
  if (timer.duration === 0) { return 0 }
  const position = millisToSeconds(timer.position)
  const duration = millisToSeconds(timer.duration)

  return Math.round((position/duration) * 100)
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
