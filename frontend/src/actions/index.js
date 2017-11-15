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

export const getImage = (uri, key) => {
  return {
    type: 'SEND',
    key: 'library.getImages',
    params: [[uri]],
    asset: {
      uri: uri,
      key: key
    }
  }
}

export const newImage = (asset) => {
  const { uri, key } = asset
  return {
    type: 'NEW_IMAGE',
    uri,
    key
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

