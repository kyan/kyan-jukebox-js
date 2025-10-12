import io from 'socket.io-client'
import configureMockStore from 'redux-mock-store'
import Constants from 'constants/common'
import Search from 'search/constants'
import VoteConstant from 'votes/constants'
import onMessageHandler from 'utils/on-message-handler'
import { trackProgressTimer } from 'utils/time'
import JukeboxMiddleware from './index'
jest.mock('socket.io-client')
jest.mock('utils/on-message-handler')
jest.mock('utils/time')
jest.useFakeTimers()

describe('JukeboxMiddleware', () => {
  const mockStore = configureMockStore()
  const mockEmit = jest.fn()
  const mockClose = jest.fn()
  const mockOn = jest.fn((_event, callback) => {
    if (_event === 'message') {
      return callback(JSON.stringify({ key: 'foo', data: 'bar' }))
    }

    if (_event === 'mopidy') {
      return callback(JSON.stringify({ online: true }))
    }

    return callback()
  })

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
      io.mockImplementation(() => ({ on: mockOn, emit: mockEmit, close: mockClose }))
      const store = mockStore()
      JukeboxMiddleware(store)(next)({ type: 'YEAHWHATEVER' })
      expect(next).toHaveBeenLastCalledWith({ type: 'YEAHWHATEVER' })
    })

    it('should handle connecting and getting new message', () => {
      io.mockImplementation(() => ({ on: mockOn, emit: mockEmit, close: mockClose }))
      const store = mockStore()

      JukeboxMiddleware(store)(next)({ type: Constants.DISCONNECT })
      JukeboxMiddleware(store)(next)({ type: Constants.CONNECT })
      JukeboxMiddleware(store)(next)({ type: Constants.CONNECT })
      jest.runOnlyPendingTimers()
      const actions = store.getActions()

      expect(onMessageHandler).toHaveBeenCalledWith(store, payload, expect.any(Object))

      expect(actions).toEqual([
        { type: 'actionDisconnected' },
        { type: 'actionMopidyConnected' },
        { key: 'playback.getCurrentTrack', type: 'actionSend' },
        { key: 'playback.getState', type: 'actionSend' },
        { key: 'tracklist.getTracks', type: 'actionSend' },
        { key: 'mixer.getVolume', type: 'actionSend' },
        { key: 'playback.getTimePosition', type: 'actionSend' },
        { type: 'actionConnected' },
        { type: 'actionDisconnect' },
        { type: 'actionConnecting' },
        { type: 'actionMopidyConnected' },
        { key: 'playback.getCurrentTrack', type: 'actionSend' },
        { key: 'playback.getState', type: 'actionSend' },
        { key: 'tracklist.getTracks', type: 'actionSend' },
        { key: 'mixer.getVolume', type: 'actionSend' },
        { key: 'playback.getTimePosition', type: 'actionSend' },
        { type: 'actionConnected' },
        { type: 'actionDisconnect' },
        { type: 'actionConnecting' }
      ])
    })

    it('should dispatch disconnect message', () => {
      io.mockImplementation(() => ({ on: mockOn, emit: mockEmit, close: mockClose }))
      const store = mockStore()
      JukeboxMiddleware(store)(next)({ type: Constants.CONNECT })
      JukeboxMiddleware(store)(next)({ type: Constants.DISCONNECT })
      const actions = store.getActions()
      expect(actions).toEqual([
        { type: 'actionMopidyConnected' },
        { key: 'playback.getCurrentTrack', type: 'actionSend' },
        { key: 'playback.getState', type: 'actionSend' },
        { key: 'tracklist.getTracks', type: 'actionSend' },
        { key: 'mixer.getVolume', type: 'actionSend' },
        { key: 'playback.getTimePosition', type: 'actionSend' },
        { type: 'actionConnected' },
        { type: 'actionDisconnect' },
        { type: 'actionConnecting' },
        { type: 'actionDisconnected' }
      ])
    })

    it('should dispatch various send messages', () => {
      let actions
      io.mockImplementation(() => ({ on: mockOn, emit: mockEmit, close: mockClose }))
      const store = mockStore({
        assets: [],
        settings: { token: 'token' }
      })

      // connecting
      JukeboxMiddleware(store)(next)({ type: Constants.CONNECT })
      actions = store.getActions()
      expect(actions).toEqual([
        { type: 'actionMopidyConnected' },
        { key: 'playback.getCurrentTrack', type: 'actionSend' },
        { key: 'playback.getState', type: 'actionSend' },
        { key: 'tracklist.getTracks', type: 'actionSend' },
        { key: 'mixer.getVolume', type: 'actionSend' },
        { key: 'playback.getTimePosition', type: 'actionSend' },
        { type: 'actionConnected' },
        { type: 'actionDisconnect' },
        { type: 'actionConnecting' }
      ])

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

    it('should handle when mopidy goes offline', () => {
      const mockOffline = jest.fn((_event, callback) => {
        if (_event === 'message') {
          return callback(JSON.stringify({ key: 'foo', data: 'bar' }))
        }

        if (_event === 'mopidy') {
          return callback(JSON.stringify({ online: false }))
        }

        return callback()
      })
      io.mockImplementation(() => ({ on: mockOffline, emit: mockEmit, close: mockClose }))
      const store = mockStore()
      JukeboxMiddleware(store)(next)({ type: Constants.DISCONNECT })
      JukeboxMiddleware(store)(next)({ type: Constants.CONNECT })
      const actions = store.getActions()
      expect(actions).toEqual([
        { type: 'actionDisconnected' },
        { type: 'actionMopidyDisconnected' },
        { type: 'actionConnected' },
        { type: 'actionDisconnect' },
        { type: 'actionConnecting' }
      ])
    })

    it('should dispatch a search message', () => {
      io.mockImplementation(() => ({ on: mockOn, emit: mockEmit, close: mockClose }))
      const store = mockStore({
        settings: { token: 'token' }
      })
      JukeboxMiddleware(store)(next)({
        type: Search.SEARCH,
        key: 'search.getTracks',
        params: 'params'
      })
      const actions = store.getActions()
      expect(actions).toEqual([])
      expect(mockEmit).toHaveBeenCalledWith(
        'search',
        '{"jwt":"token","key":"search.getTracks","data":"params"}'
      )
    })

    it('should dispatch a vote message', () => {
      io.mockImplementation(() => ({ on: mockOn, emit: mockEmit, close: mockClose }))
      const store = mockStore({
        settings: { token: 'token' }
      })
      JukeboxMiddleware(store)(next)({
        type: VoteConstant.VOTE,
        key: 'castVote',
        params: '12'
      })
      const actions = store.getActions()
      expect(actions).toEqual([])
      expect(mockEmit).toHaveBeenCalledWith('vote', '{"jwt":"token","key":"castVote","data":"12"}')
    })
  })
})
