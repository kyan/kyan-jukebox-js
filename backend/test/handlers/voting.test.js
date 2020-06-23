import Broadcaster from '../../src/utils/broadcaster'
import { updateTrackVote } from '../../src/models/track'
import VoteHandler from '../../src/handlers/voting'
jest.mock('../../src/utils/event-logger')
jest.mock('../../src/utils/broadcaster')
jest.mock('../../src/models/track')

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
