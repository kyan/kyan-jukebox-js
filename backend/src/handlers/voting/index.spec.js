import Broadcaster from 'utils/broadcaster'
import { updateTrackVote } from 'services/mongodb/models/track'
import VoteHandler from './index'
jest.mock('utils/event-logger')
jest.mock('utils/broadcaster')
jest.mock('services/mongodb/models/track')

describe('VoteHandler', () => {
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

    VoteHandler({ payload, socketio })

    setTimeout(() => {
      try {
        expect(updateTrackVote).toHaveBeenCalledWith(
          payload.data.uri,
          payload.user,
          payload.data.vote
        )
        expect(Broadcaster.toAll).toHaveBeenCalledWith({
          socketio,
          headers: { key: 'voteCasted', user: payload.user },
          message: 'track',
          type: 'vote'
        })
        done()
      } catch (err) {
        done.fail(err)
      }
    })
  })
})
