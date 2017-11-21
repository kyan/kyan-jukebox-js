const millisToMinutesAndSeconds = (millis) => {
  var minutes = Math.floor(millis / 60000)
  var seconds = ((millis % 60000) / 1000).toFixed(0)
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds
}

const millisToSeconds = (millis) => {
  return millis * 0.001
}

const timerToPercentage = timer => {
  if (timer.duration === 0) { return 0 }
  const position = millisToSeconds(timer.position);
  const duration = millisToSeconds(timer.duration);

  return (position/duration) * 100
}

module.exports = {
  millisToMinutesAndSeconds,
  millisToSeconds,
  timerToPercentage
}
