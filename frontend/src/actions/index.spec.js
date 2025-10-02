import * as actions from './index'
import MopidyApi from 'constants/mopidy-api'
import Types from 'constants/common'
jest.mock('utils/notify')

describe('actions', () => {
  it('should handle validateUser', () => {
    const email = 'test@example.com'
    const user = { email, fullname: 'Test User' }
    const expectedAction = {
      type: Types.VALIDATE_USER,
      email,
      user
    }
    expect(actions.validateUser(email, user)).toEqual(expectedAction)
  })

  it('should handle updateUser', () => {
    const email = 'test@example.com'
    const user = { email, fullname: 'Test User', picture: 'avatar.jpg' }
    const expectedAction = {
      type: Types.STORE_USER,
      email,
      user
    }
    expect(actions.updateUser(email, user)).toEqual(expectedAction)
  })

  it('should handle clearUser', () => {
    const expectedAction = {
      type: Types.CLEAR_USER
    }
    expect(actions.clearUser()).toEqual(expectedAction)
  })

  it('should handle setAuthError', () => {
    const error = 'Invalid credentials'
    const expectedAction = {
      type: Types.SET_AUTH_ERROR,
      error
    }
    expect(actions.setAuthError(error)).toEqual(expectedAction)
  })

  it('should handle validateUserRequest', () => {
    const expectedAction = {
      type: Types.SEND,
      key: MopidyApi.VALIDATE_USER
    }
    expect(actions.validateUserRequest()).toEqual(expectedAction)
  })

  it('should handle addNewTrack', () => {
    const url = 'https://open.spotify.com/track/0c41pMosF5Kqwwegcps8ES'
    const expectedAction = {
      type: Types.SEND,
      key: MopidyApi.TRACKLIST_ADD_TRACK,
      params: { uris: ['spotify:track:0c41pMosF5Kqwwegcps8ES'] }
    }
    expect(actions.addNewTrack(url)).toEqual(expectedAction)
  })

  it('should handle addCurrentTrack', () => {
    const track = 'spotify:track:0c41pMosF5Kqwwegcps8ES'
    const expectedAction = {
      type: Types.ADD_CURRENT_TRACK,
      track
    }
    expect(actions.addCurrentTrack(track)).toEqual(expectedAction)
  })

  it('should handle addTrackList', () => {
    const tracks = ['track1', 'track2']
    const expectedAction = {
      type: Types.ADD_TRACKS,
      tracks
    }
    expect(actions.addTrackList(tracks)).toEqual(expectedAction)
  })

  it('should handle removeFromTracklist', () => {
    const uri = 'spotify:track:0c41pMosF5Kqwwegcps8ES'
    const expectedAction = {
      type: Types.SEND,
      key: MopidyApi.TRACKLIST_REMOVE_TRACK,
      params: { criteria: { uri: ['spotify:track:0c41pMosF5Kqwwegcps8ES'] } }
    }
    expect(actions.removeFromTracklist(uri)).toEqual(expectedAction)
  })

  describe('updateProgressTimer', () => {
    it('should handle normal position and duration values', () => {
      const position = 1230
      const duration = 55
      const expectedAction = {
        type: Types.UPDATE_PROGRESS_TIMER,
        position,
        duration
      }
      expect(actions.updateProgressTimer(position, duration)).toEqual(expectedAction)
    })

    it('should handle when Infinity is set', () => {
      const position = 100
      const duration = Infinity
      const expectedAction = {
        type: Types.UPDATE_PROGRESS_TIMER,
        position,
        duration: 0
      }
      expect(actions.updateProgressTimer(position, duration)).toEqual(expectedAction)
    })
  })

  it('should handle wsConnect', () => {
    const expectedAction = {
      type: Types.CONNECT
    }
    expect(actions.wsConnect()).toEqual(expectedAction)
  })

  it('should handle wsConnecting', () => {
    const expectedAction = {
      type: Types.CONNECTING
    }
    expect(actions.wsConnecting()).toEqual(expectedAction)
  })

  it('should handle wsConnected', () => {
    const expectedAction = {
      type: Types.CONNECTED
    }
    expect(actions.wsConnected()).toEqual(expectedAction)
  })

  it('should handle wsDisconnect', () => {
    const expectedAction = {
      type: Types.DISCONNECT
    }
    expect(actions.wsDisconnect()).toEqual(expectedAction)
  })

  it('should handle wsDisconnected', () => {
    const expectedAction = {
      type: Types.DISCONNECTED
    }
    expect(actions.wsDisconnected()).toEqual(expectedAction)
  })

  it('should handle mopidyConnected', () => {
    const expectedAction = {
      type: Types.MOPIDY_CONNECTED
    }
    expect(actions.mopidyConnected()).toEqual(expectedAction)
  })

  it('should handle mopidyDisconnected', () => {
    const expectedAction = {
      type: Types.MOPIDY_DISCONNECTED
    }
    expect(actions.mopidyDisconnected()).toEqual(expectedAction)
  })

  it('should handle getCurrentTrack', () => {
    const expectedAction = {
      type: Types.SEND,
      key: MopidyApi.PLAYBACK_GET_CURRENT_TRACK
    }
    expect(actions.getCurrentTrack()).toEqual(expectedAction)
  })

  it('should handle getTimePosition', () => {
    const expectedAction = {
      type: Types.SEND,
      key: MopidyApi.PLAYBACK_GET_TIME_POSITION
    }
    expect(actions.getTimePosition()).toEqual(expectedAction)
  })

  it('should handle getTrackList', () => {
    const expectedAction = {
      type: Types.SEND,
      key: MopidyApi.TRACKLIST_GET_TRACKS
    }
    expect(actions.getTrackList()).toEqual(expectedAction)
  })

  it('should handle clearTrackList', () => {
    const expectedAction = {
      type: Types.SEND,
      key: MopidyApi.TRACKLIST_CLEAR
    }
    expect(actions.clearTrackList()).toEqual(expectedAction)
  })

  it('should handle startPlaying', () => {
    const expectedAction = {
      type: Types.SEND,
      key: MopidyApi.PLAYBACK_PLAY
    }
    expect(actions.startPlaying()).toEqual(expectedAction)
  })

  it('should handle stopPlaying', () => {
    const expectedAction = {
      type: Types.SEND,
      key: MopidyApi.PLAYBACK_STOP
    }
    expect(actions.stopPlaying()).toEqual(expectedAction)
  })

  it('should handle pausePlaying', () => {
    const expectedAction = {
      type: Types.SEND,
      key: MopidyApi.PLAYBACK_PAUSE
    }
    expect(actions.pausePlaying()).toEqual(expectedAction)
  })

  it('should handle nextPlaying', () => {
    const expectedAction = {
      type: Types.SEND,
      key: MopidyApi.PLAYBACK_NEXT
    }
    expect(actions.nextPlaying()).toEqual(expectedAction)
  })

  it('should handle previousPlaying', () => {
    const expectedAction = {
      type: Types.SEND,
      key: MopidyApi.PLAYBACK_BACK
    }
    expect(actions.previousPlaying()).toEqual(expectedAction)
  })

  it('should handle getVolume', () => {
    const expectedAction = {
      type: Types.SEND,
      key: MopidyApi.GET_VOLUME
    }
    expect(actions.getVolume()).toEqual(expectedAction)
  })

  it('should handle updateVolume', () => {
    const expectedAction = {
      type: Types.UPDATE_VOLUME,
      volume: 32
    }
    expect(actions.updateVolume(32)).toEqual(expectedAction)
  })

  it('should handle updatePlaybackState', () => {
    const expectedAction = {
      type: Types.UPDATE_PLAYBACK_STATE,
      state: 'playing'
    }
    expect(actions.updatePlaybackState('playing')).toEqual(expectedAction)
  })

  it('should handle setVolume', () => {
    const expectedAction = {
      type: Types.SEND,
      key: MopidyApi.SET_VOLUME,
      params: [32]
    }
    expect(actions.setVolume(32)).toEqual(expectedAction)
  })

  it('should handle getState', () => {
    const expectedAction = {
      type: Types.SEND,
      key: MopidyApi.PLAYBACK_GET_PLAYBACK_STATE
    }
    expect(actions.getState()).toEqual(expectedAction)
  })

  it('should handle syncSocialData', () => {
    const track = { uri: 'spotify:track:123', name: 'Test Track' }
    const expectedAction = {
      type: Types.SYNC_SOCIAL_DATA,
      track
    }
    expect(actions.syncSocialData(track)).toEqual(expectedAction)
  })
})
