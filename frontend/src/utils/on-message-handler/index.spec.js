import configureStore from 'redux-mock-store'
import MopidyApi from 'constants/mopidy-api'
import Search from 'search/constants'
import VoteConst from 'votes/constants'
import AuthApi from 'constants/auth-api'
import MockTrackListJson from '__mockData__/api'
import notify from 'utils/notify'
import onMessageHandler from './index'
jest.mock('utils/notify')

describe('onMessageHandler', () => {
  const mockStore = configureStore()
  const progressStartMock = jest.fn()
  const progressStopMock = jest.fn()
  const progress = {
    set: (start, end) => {
      return { start: progressStartMock }
    },
    start: progressStartMock,
    stop: progressStopMock
  }

  beforeEach(() => {
    jest.clearAllMocks()
    spyOn(console, 'log')
  })

  describe('MESSAGE_NOT_HANDLED', () => {
    it('handles unknown message', () => {
      const payload = { key: 'message_not_handled' }
      const store = mockStore({})
      onMessageHandler(store, JSON.stringify(payload), progress)
      expect(console.log).toHaveBeenCalled()
    })
  })

  describe('PLAYBACK_GET_CURRENT_TRACK', () => {
    it('checks track playing', () => {
      const payload = {
        data: {
          track: MockTrackListJson()[1].track
        },
        key: MopidyApi.PLAYBACK_GET_CURRENT_TRACK
      }
      const store = mockStore({
        jukebox: {
          playbackState: 'playing'
        }
      })
      onMessageHandler(store, JSON.stringify(payload), progress)
      const actions = store.getActions()
      expect(actions).toEqual([
        { track: payload.data.track, type: 'actionAddCurrentTrack' },
        { track: payload.data.track, type: 'syncSocialData' }
      ])
      expect(progressStartMock.mock.calls.length).toEqual(1)
      store.clearActions()
    })

    it('checks track playing but JB stopped', () => {
      const payload = {
        data: {
          track: MockTrackListJson()[0].track
        },
        key: MopidyApi.PLAYBACK_GET_CURRENT_TRACK
      }
      const store = mockStore({
        jukebox: {
          playbackState: 'stopped'
        }
      })
      onMessageHandler(store, JSON.stringify(payload), progress)
      const actions = store.getActions()
      expect(actions).toEqual([
        { track: payload.data.track, type: 'actionAddCurrentTrack' },
        { track: payload.data.track, type: 'syncSocialData' }
      ])
      expect(progressStartMock.mock.calls.length).toEqual(0)
      store.clearActions()
    })

    it('checks when no track is actually playing', () => {
      const payload = {
        data: { track: undefined },
        key: MopidyApi.PLAYBACK_GET_CURRENT_TRACK
      }
      const store = mockStore({
        jukebox: {
          playbackState: 'stopped'
        }
      })
      onMessageHandler(store, JSON.stringify(payload), progress)
      const actions = store.getActions()
      expect(actions.length).toEqual(0)
      expect(progressStartMock.mock.calls.length).toEqual(0)
      store.clearActions()
    })
  })

  describe('EVENT_TRACK_PLAYBACK_STARTED', () => {
    it('checks track playing with image provided in payload', () => {
      const payload = {
        data: {
          track: MockTrackListJson()[1].track
        },
        key: MopidyApi.EVENT_TRACK_PLAYBACK_STARTED
      }
      const store = mockStore({
        jukebox: {
          playbackState: 'playing'
        }
      })
      onMessageHandler(store, JSON.stringify(payload), progress)
      const actions = store.getActions()
      expect(actions).toEqual([
        { track: payload.data.track, type: 'actionAddCurrentTrack' },
        { track: payload.data.track, type: 'syncSocialData' }
      ])
      expect(progressStartMock.mock.calls.length).toEqual(1)
      store.clearActions()
    })
  })

  describe('EVENT_PLAYBACK_STATE_CHANGED', () => {
    const playbackState = (state) => ({
      key: MopidyApi.EVENT_PLAYBACK_STATE_CHANGED,
      data: state
    })

    it('handles playing', () => {
      const payload = playbackState('playing')
      const store = mockStore({
        jukebox: {
          playbackState: 'stopped'
        }
      })
      onMessageHandler(store, JSON.stringify(payload), progress)
      const actions = store.getActions()
      expect(actions).toEqual([{ state: 'playing', type: 'actionPlaybackState' }])
      expect(progressStartMock.mock.calls.length).toEqual(1)
      expect(progressStopMock.mock.calls.length).toEqual(0)
      store.clearActions()
    })

    it('handles stopping', () => {
      const payload = playbackState('stopped')
      const store = mockStore({
        jukebox: {
          playbackState: 'playing'
        }
      })
      onMessageHandler(store, JSON.stringify(payload), progress)
      const actions = store.getActions()
      expect(actions).toEqual([{ state: 'stopped', type: 'actionPlaybackState' }])
      expect(progressStartMock.mock.calls.length).toEqual(0)
      expect(progressStopMock.mock.calls.length).toEqual(1)
      store.clearActions()
    })

    it('handles pausing', () => {
      const payload = playbackState('paused')
      const store = mockStore({
        jukebox: {
          playbackState: 'playing'
        }
      })
      onMessageHandler(store, JSON.stringify(payload), progress)
      const actions = store.getActions()
      expect(actions).toEqual([{ state: 'paused', type: 'actionPlaybackState' }])
      expect(progressStartMock.mock.calls.length).toEqual(0)
      expect(progressStopMock.mock.calls.length).toEqual(1)
      store.clearActions()
    })

    it('handles weirdstate', () => {
      const payload = playbackState('wat')
      const store = mockStore({
        jukebox: {
          playbackState: 'playing'
        }
      })
      onMessageHandler(store, JSON.stringify(payload), progress)
      const actions = store.getActions()
      expect(actions.length).toEqual(0)
      expect(progressStartMock.mock.calls.length).toEqual(0)
      expect(progressStopMock.mock.calls.length).toEqual(0)
      store.clearActions()
    })
  })

  describe('TRACKLIST_GET_TRACKS', () => {
    it('handles change', () => {
      const payload = {
        key: MopidyApi.TRACKLIST_GET_TRACKS,
        data: MockTrackListJson()
      }
      const store = mockStore({})
      onMessageHandler(store, JSON.stringify(payload), progress)
      const actions = store.getActions()
      expect(actions[0]).toEqual({
        list: payload.data,
        type: 'actionAddTracks'
      })
      expect(actions.length).toEqual(1)
      store.clearActions()
    })
  })

  describe('PLAYBACK_GET_TIME_POSITION', () => {
    it('handles resolving', () => {
      const payload = {
        data: 4567,
        key: MopidyApi.PLAYBACK_GET_TIME_POSITION
      }
      const store = mockStore({})
      const progMock = jest.fn()
      const progSetMock = { set: progMock }
      onMessageHandler(store, JSON.stringify(payload), progSetMock)
      expect(progMock.mock.calls.length).toEqual(1)
      expect(progMock.mock.calls[0][0]).toEqual(payload.data)
      store.clearActions()
    })
  })

  describe('GET_VOLUME', () => {
    it('gets the volume', () => {
      const payload = {
        data: 32,
        key: MopidyApi.GET_VOLUME
      }
      const store = mockStore({})
      onMessageHandler(store, JSON.stringify(payload), progress)
      const actions = store.getActions()
      expect(actions).toEqual([{ type: 'actionUpdateVolume', volume: 32 }])
      store.clearActions()
    })
  })

  describe('EVENT_VOLUME_CHANGED', () => {
    it('tests when the volume is changed', () => {
      const payload = {
        data: 32,
        key: MopidyApi.EVENT_VOLUME_CHANGED
      }
      const store = mockStore({})
      onMessageHandler(store, JSON.stringify(payload), progress)
      const actions = store.getActions()
      expect(actions).toEqual([{ type: 'actionUpdateVolume', volume: 32 }])
      expect(notify.success.mock.calls.length).toEqual(1)
      store.clearActions()
    })
  })

  describe('AUTHENTICATION_TOKEN_INVALID', () => {
    it('shows when invlid token', () => {
      const payload = {
        data: { error: 'boom' },
        key: AuthApi.AUTHENTICATION_TOKEN_INVALID
      }
      const store = mockStore({})
      onMessageHandler(store, JSON.stringify(payload), progress)
      const actions = store.getActions()
      expect(actions).toEqual([{ type: 'actionClearStoreToken' }])
      expect(console.log).toHaveBeenCalledWith('AUTHENTICATION_TOKEN_INVALID: boom')
      store.clearActions()
    })
  })

  describe('PLAYBACK_NEXT', () => {
    it('check when next track is chosen', () => {
      const payload = {
        key: MopidyApi.PLAYBACK_NEXT
      }
      const store = mockStore({})
      onMessageHandler(store, JSON.stringify(payload), progress)
      const actions = store.getActions()
      expect(actions).toEqual([{ type: 'actionSend', key: 'playback.getCurrentTrack' }])
      store.clearActions()
    })
  })

  describe('PLAYBACK_BACK', () => {
    it('check when previous track is chosen', () => {
      const payload = {
        key: MopidyApi.PLAYBACK_BACK
      }
      const store = mockStore({})
      onMessageHandler(store, JSON.stringify(payload), progress)
      const actions = store.getActions()
      expect(actions).toEqual([{ type: 'actionSend', key: 'playback.getCurrentTrack' }])
      store.clearActions()
    })
  })

  describe('VALIDATION_ERROR', () => {
    it('handles the rude', () => {
      const payload = {
        data: 'Is there a radio mix? - Boy - Naughty',
        key: MopidyApi.VALIDATION_ERROR
      }
      const store = mockStore({})
      onMessageHandler(store, JSON.stringify(payload), progress)
      expect(notify.warning.mock.calls).toEqual([['Is there a radio mix? - Boy - Naughty']])
      store.clearActions()
    })
  })

  describe('TRACKLIST_ADD_TRACK', () => {
    it('lets us know a track has been added', () => {
      const payload = {
        key: MopidyApi.TRACKLIST_ADD_TRACK,
        data: {
          track: {
            name: 'track name',
            album: {
              name: 'album name'
            },
            artist: {
              name: 'artist name'
            }
          }
        }
      }
      const store = mockStore({})
      onMessageHandler(store, JSON.stringify(payload), progress)
      expect(notify.success)
        .toHaveBeenCalledWith('Adding: track name / album name by artist name')
      store.clearActions()
    })
  })

  describe('SEARCH_GET_TRACKS', () => {
    it('stores search results', () => {
      const payload = {
        key: Search.SEARCH_GET_TRACKS,
        data: 'searchresults'
      }
      const store = mockStore({})
      onMessageHandler(store, JSON.stringify(payload), progress)
      const actions = store.getActions()
      expect(actions).toEqual([{
        type: 'actionStoreSearchResults',
        results: 'searchresults'
      }])
      store.clearActions()
    })
  })

  describe('VOTE_CASTED', () => {
    it('syncs vote data when there provided', () => {
      const payload = {
        key: VoteConst.VOTE_CASTED,
        data: 'voteData'
      }
      const store = mockStore({})
      onMessageHandler(store, JSON.stringify(payload), progress)
      const actions = store.getActions()
      expect(actions).toEqual([{
        type: 'syncSocialData',
        track: 'voteData'
      }])
      store.clearActions()
    })

    it('does not sync vote data when there none', () => {
      const payload = {
        key: VoteConst.VOTE_CASTED,
        data: null
      }
      const store = mockStore({})
      onMessageHandler(store, JSON.stringify(payload), progress)
      const actions = store.getActions()
      expect(actions).toEqual([])
      store.clearActions()
    })
  })
})
