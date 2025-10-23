import MopidyApi from 'constants/mopidy-api'
import Types from 'constants/common'
import { transformUrl } from 'utils/spotify'

export const validateUser = (email, user) => {
  return {
    type: Types.VALIDATE_USER,
    email,
    user
  }
}

export const updateUser = (email, user) => {
  return {
    type: Types.STORE_USER,
    email,
    user
  }
}

export const clearUser = () => {
  return {
    type: Types.CLEAR_USER
  }
}

export const setAuthError = error => {
  return {
    type: Types.SET_AUTH_ERROR,
    error
  }
}

export const validateUserRequest = () => {
  return {
    type: Types.SEND,
    key: MopidyApi.VALIDATE_USER
  }
}

export const addNewTrack = url => {
  let uri = transformUrl(url)

  return {
    type: Types.SEND,
    key: MopidyApi.TRACKLIST_ADD_TRACK,
    params: { uris: [uri] }
  }
}

export const addNewTracks = uris => {
  return {
    type: Types.SEND,
    key: MopidyApi.TRACKLIST_ADD_TRACK,
    params: { uris: uris.map(uri => transformUrl(uri)) }
  }
}

export const addCurrentTrack = track => {
  return {
    type: Types.ADD_CURRENT_TRACK,
    track
  }
}

export const syncSocialData = track => {
  return {
    type: Types.SYNC_SOCIAL_DATA,
    track
  }
}

export const addTrackList = tracks => {
  return {
    type: Types.ADD_TRACKS,
    tracks
  }
}

export const removeFromTracklist = uri => {
  return {
    type: Types.SEND,
    key: MopidyApi.TRACKLIST_REMOVE_TRACK,
    params: { criteria: { uri: [uri] } }
  }
}

export const updateProgressTimer = (position, duration) => {
  if (duration === Infinity) {
    duration = 0
  }

  return {
    type: Types.UPDATE_PROGRESS_TIMER,
    position,
    duration
  }
}

export const wsConnect = () => {
  return {
    type: Types.CONNECT
  }
}

export const wsConnecting = () => {
  return {
    type: Types.CONNECTING
  }
}

export const wsConnected = () => {
  return {
    type: Types.CONNECTED
  }
}

export const wsDisconnect = () => {
  return {
    type: Types.DISCONNECT
  }
}

export const wsDisconnected = () => {
  return {
    type: Types.DISCONNECTED
  }
}

export const mopidyConnected = () => {
  return {
    type: Types.MOPIDY_CONNECTED
  }
}

export const mopidyDisconnected = () => {
  return {
    type: Types.MOPIDY_DISCONNECTED
  }
}

export const getCurrentTrack = () => {
  return {
    type: Types.SEND,
    key: MopidyApi.PLAYBACK_GET_CURRENT_TRACK
  }
}

export const getTimePosition = () => {
  return {
    type: Types.SEND,
    key: MopidyApi.PLAYBACK_GET_TIME_POSITION
  }
}

export const getState = () => {
  return {
    type: Types.SEND,
    key: MopidyApi.PLAYBACK_GET_PLAYBACK_STATE
  }
}

export const getTrackList = () => {
  return {
    type: Types.SEND,
    key: MopidyApi.TRACKLIST_GET_TRACKS
  }
}

export const clearTrackList = () => {
  return {
    type: Types.SEND,
    key: MopidyApi.TRACKLIST_CLEAR
  }
}

export const startPlaying = () => {
  return {
    type: Types.SEND,
    key: MopidyApi.PLAYBACK_PLAY
  }
}

export const stopPlaying = () => {
  return {
    type: Types.SEND,
    key: MopidyApi.PLAYBACK_STOP
  }
}

export const pausePlaying = () => {
  return {
    type: Types.SEND,
    key: MopidyApi.PLAYBACK_PAUSE
  }
}

export const nextPlaying = () => {
  return {
    type: Types.SEND,
    key: MopidyApi.PLAYBACK_NEXT
  }
}

export const previousPlaying = () => {
  return {
    type: Types.SEND,
    key: MopidyApi.PLAYBACK_BACK
  }
}

export const getVolume = () => {
  return {
    type: Types.SEND,
    key: MopidyApi.GET_VOLUME
  }
}

export const updateVolume = volume => {
  return {
    type: Types.UPDATE_VOLUME,
    volume
  }
}

export const updatePlaybackState = state => {
  return {
    type: Types.UPDATE_PLAYBACK_STATE,
    state
  }
}

export const setVolume = volume => {
  return {
    type: Types.SEND,
    key: MopidyApi.SET_VOLUME,
    params: [Number(volume)]
  }
}
