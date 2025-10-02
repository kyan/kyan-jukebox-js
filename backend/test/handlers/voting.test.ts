import { Server } from 'socket.io'
import Broadcaster from '../../src/utils/broadcaster'
import { updateTrackVote } from '../../src/models/track'
import VoteHandler from '../../src/handlers/voting'
import { JBUser } from '../../src/models/user'
jest.mock('../../src/utils/event-logger')
jest.mock('../../src/utils/broadcaster')
jest.mock('../../src/models/track')

const mockUpdateTrackVote = updateTrackVote as jest.Mock

describe('VoteHandler', () => {
  const socketio = {} as Server

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should handle a valid vote', async () => {
    expect.assertions(2)
    const user = {
      _id: '123',
      fullname: 'Test User',
      email: 'test@example.com'
    } as JBUser
    const payload = {
      key: 'castVote',
      user: user,
      data: { uri: 'uri123', vote: 'vote' },
      payload: {}
    }
    mockUpdateTrackVote.mockResolvedValue('track')

    VoteHandler({ payload, socketio })

    // Wait for the promise to resolve
    await new Promise((resolve) => setImmediate(resolve))

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
  })
})
