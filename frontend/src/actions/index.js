export const storePayload = payload => {
  return {
    type: 'STORE_PAYLOAD',
    payload
  }
}

export const addTrack = track => {
  return {
    type: 'ADD_TRACK',
    track
  }
}

export const addTrackList = list => {
  return {
    type: 'ADD_TRACKS',
    list
  }
}

export const updateProgressTimer = (position, duration) => {
  if (duration === Infinity) {
    duration = 0
  }

  return {
    type: 'UPDATE_PROGRESS_TIMER',
    position,
    duration
  }
}

export const wsConnect = () => {
  return {
    type: 'CONNECT',
    url: 'ws://localhost:8000'
  }
}

export const wsConnecting = () => {
  return {
    type: 'CONNECTING'
  }
}

export const wsConnected = () => {
  return {
    type: 'CONNECTED'
  }
}

export const wsDisconnect = () => {
  return {
    type: 'DISCONNECT'
  }
}

export const wsDisconnected = () => {
  return {
    type: 'DISCONNECTED'
  }
}

export const getCurrentTrack = () => {
  return {
    type: 'SEND',
    key: 'playback.getCurrentTrack'
  }
}

export const getTimePosition = () => {
  return {
    type: 'SEND',
    key: 'playback.getTimePosition'
  }
}

export const getImage = (uri, key) => {
  return {
    type: 'SEND',
    key: 'library.getImages',
    params: [[uri]],
    uri: uri
  }
}

export const newImage = (uri) => {
  return {
    type: 'NEW_IMAGE',
    uri
  }
}

export const resolveImage = (data) => {
  return {
    type: 'RESOLVE_IMAGE',
    data
  }
}

export const getTrackList = () => {
  return {
    type: 'SEND',
    key: 'tracklist.getTracks'
  }
}

export const startPlaying = () => {
  return {
    type: 'SEND',
    key: 'playback.set_state',
    params: 'PLAYING'
  }
}

export const pausePlaying = () => {
  return {
    type: 'SEND',
    key: 'playback.set_state',
    params: 'PAUSED'
  }
}

export const skipPlaying = () => {
  return {
    type: 'SEND',
    key: 'playback.next'
  }
}

