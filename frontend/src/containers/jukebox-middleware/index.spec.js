import configureMockStore from 'redux-mock-store'
import Constants from '../../constants'
import MopidyApi from '../../constants/mopidy-api'
import onMessageHandler from '../../utils/on-message-handler'
import { trackProgressTimer } from '../../utils/time'
import JukeboxMiddleware from './index'

const mockEmit = jest.fn()
const mockClose = jest.fn()
jest.mock('socket.io-client', () => {
  return jest.fn().mockImplementation(() => {
    return {
      on: (_event, callback) => {
        if (_event === 'message') {
          return callback(JSON.stringify({ key: 'foo', data: 'bar' }))
        }

        return callback()
      },
      emit: mockEmit,
      close: mockClose
    }
  })
})
jest.mock('../../utils/on-message-handler')
jest.mock('../../utils/time')
jest.useFakeTimers()

describe('JukeboxMiddleware', () => {
  const mockStore = configureMockStore()

  const payload = JSON.stringify({ key: 'foo', data: 'bar' })
  const next = jest.fn()
  const reset = jest.fn()

  trackProgressTimer.mockImplementation(() => {
    return { reset: reset }
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Constants.CONNECT', () => {
    it('should skip messages it does not understand', () => {
      const store = mockStore()
      JukeboxMiddleware(store)(next)({ type: 'YEAHWHATEVER' })
      expect(next).lastCalledWith({ type: 'YEAHWHATEVER' })
    })

    it('should handle connecting and getting new message', () => {
      const store = mockStore()

      JukeboxMiddleware(store)(next)({ type: Constants.DISCONNECT })
      JukeboxMiddleware(store)(next)({ type: Constants.CONNECT })
      JukeboxMiddleware(store)(next)({ type: Constants.CONNECT })
      jest.runOnlyPendingTimers()
      const actions = store.getActions()

      expect(onMessageHandler).toHaveBeenCalledWith(
        store,
        payload,
        jasmine.any(Object)
      )
      expect(actions).toEqual([
        { type: 'actionDisconnected' },
        { type: 'actionConnected' },
        { key: 'mopidy::playback.getCurrentTrack', type: 'actionSend' },
        { key: 'mopidy::playback.getTimePosition', type: 'actionSend' },
        { key: 'mopidy::playback.getState', type: 'actionSend' },
        { key: 'mopidy::tracklist.getTracks', type: 'actionSend' },
        { key: 'mopidy::mixer.getVolume', type: 'actionSend' },
        { type: 'actionDisconnect' }, { type: 'actionConnecting' },
        { type: 'actionConnected' }, { key: 'mopidy::playback.getCurrentTrack', type: 'actionSend' },
        { key: 'mopidy::playback.getTimePosition', type: 'actionSend' },
        { key: 'mopidy::playback.getState', type: 'actionSend' },
        { key: 'mopidy::tracklist.getTracks', type: 'actionSend' },
        { key: 'mopidy::mixer.getVolume', type: 'actionSend' },
        { type: 'actionDisconnect' },
        { type: 'actionConnecting' }
      ])
    })

    it('should dispatch disconnect message', () => {
      const store = mockStore()
      JukeboxMiddleware(store)(next)({ type: Constants.CONNECT })
      JukeboxMiddleware(store)(next)({ type: Constants.DISCONNECT })
      const actions = store.getActions()
      expect(actions).toEqual([
        { type: 'actionConnected' },
        { key: 'mopidy::playback.getCurrentTrack', type: 'actionSend' },
        { key: 'mopidy::playback.getTimePosition', type: 'actionSend' },
        { key: 'mopidy::playback.getState', type: 'actionSend' },
        { key: 'mopidy::tracklist.getTracks', type: 'actionSend' },
        { key: 'mopidy::mixer.getVolume', type: 'actionSend' },
        { type: 'actionDisconnect' },
        { type: 'actionConnecting' },
        { type: 'actionDisconnected' }
      ])
    })

    it('should dispatch various send messages', () => {
      let actions
      const store = mockStore({
        assets: [],
        settings: { token: 'token' }
      })

      // connecting
      JukeboxMiddleware(store)(next)({ type: Constants.CONNECT })
      actions = store.getActions()
      expect(actions).toEqual([
        { type: 'actionConnected' },
        { key: 'mopidy::playback.getCurrentTrack', type: 'actionSend' },
        { key: 'mopidy::playback.getTimePosition', type: 'actionSend' },
        { key: 'mopidy::playback.getState', type: 'actionSend' },
        { key: 'mopidy::tracklist.getTracks', type: 'actionSend' },
        { key: 'mopidy::mixer.getVolume', type: 'actionSend' },
        { type: 'actionDisconnect' },
        { type: 'actionConnecting' }
      ])

      // fetch image not in the cache
      store.clearActions()
      JukeboxMiddleware(store)(next)({
        type: Constants.SEND,
        key: MopidyApi.LIBRARY_GET_IMAGES,
        params: 'params',
        uri: '12345678'
      })
      actions = store.getActions()
      expect(actions).toEqual([{ type: 'actionNewImage', uri: '12345678' }])

      // fetch image already in the cache
      store.clearActions()
      const imageInStore = mockStore({
        assets: [{ ref: 'imageincache', uri: 'image123' }]
      })
      JukeboxMiddleware(imageInStore)(next)({
        type: Constants.SEND,
        key: MopidyApi.LIBRARY_GET_IMAGES,
        params: 'params',
        uri: 'imageincache'
      })
      actions = store.getActions()
      expect(actions).toEqual([])

      // send message with params
      mockEmit.mockClear()
      store.clearActions()
      JukeboxMiddleware(store)(next)({
        type: Constants.SEND,
        params: 'myparams'
      })
      actions = store.getActions()
      expect(actions).toEqual([])
      expect(mockEmit.mock.calls).toEqual([['message', '{"jwt":"token","data":"myparams"}']])
    })
  })
})
