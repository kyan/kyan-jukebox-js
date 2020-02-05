import Broadcaster from 'utils/broadcaster'
import { updateTrackVote } from 'services/mongodb/models/track'
import VoteHandler from './index'
jest.mock('utils/event-logger')
jest.mock('utils/broadcaster')
jest.mock('services/mongodb/models/track')

describe('VoteHandler', () => {
  const socket = jest.fn()
  const socketio = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should handle a valid vote', done => {
    expect.assertions(2)
    const payload = {
      key: 'castVote',
      user: 'user',
      data: { uri: 'uri123', vote: 'vote' }
    }
    updateTrackVote.mockResolvedValue('track')

    VoteHandler(payload, socket, socketio)

    setTimeout(() => {
      try {
        expect(updateTrackVote).toHaveBeenCalledWith(
          payload.data.uri,
          payload.user,
          payload.data.vote
        )
        expect(Broadcaster.toAll).toHaveBeenCalledWith(
          socketio,
          'voteCasted',
          'track',
          'vote'
        )
        done()
      } catch (err) {
        done.fail(err)
      }
    })
  })

  it('should handle invalid vote', done => {
    expect.assertions(2)
    const payload = {
      key: 'castVote',
      user: 'user',
      data: { uri: 'uri123', vote: 'vote' }
    }
    updateTrackVote.mockRejectedValue(new Error('boom'))

    VoteHandler(payload, socket, socketio)

    setTimeout(() => {
      try {
        expect(updateTrackVote).toHaveBeenCalledWith(
          payload.data.uri,
          payload.user,
          payload.data.vote
        )
        expect(Broadcaster.toClient).toHaveBeenCalledWith(
          socket,
          {
            data: {
              uri: 'uri123',
              vote: 'vote'
            },
            key: 'validationError',
            user: 'user'
          },
          'boom',
          'vote'
        )
        done()
      } catch (err) {
        done.fail(err)
      }
    })
  })
})
