import { Server } from 'socket.io'
import Broadcaster from '../../src/utils/broadcaster'
import VoteHandler from '../../src/handlers/voting'
import { getDatabase } from '../../src/services/database/factory'
import { JBUser } from '../../src/types/database'

jest.mock('../../src/utils/event-logger')
jest.mock('../../src/utils/broadcaster')
jest.mock('../../src/services/database/factory')

// Mock database service
const mockDatabase = {
  tracks: {
    updateVote: jest.fn()
  }
}

const mockGetDatabase = getDatabase as jest.Mock
mockGetDatabase.mockReturnValue(mockDatabase)

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
    mockDatabase.tracks.updateVote.mockResolvedValue('track')

    VoteHandler({ payload, socketio })

    // Wait for the promise to resolve
    await new Promise((resolve) => setImmediate(resolve))

    expect(mockDatabase.tracks.updateVote).toHaveBeenCalledWith(
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
