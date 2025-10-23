import { Server } from 'socket.io'
import Broadcaster from '../../src/utils/broadcaster'
import VotingHandler from '../../src/handlers/voting'
import { JBUser } from '../../src/types/database'
import { expect, test, describe, mock, beforeEach } from 'bun:test'

// Mock EventLogger
mock.module('../../src/utils/event-logger', () => ({
  default: {
    info: mock(() => {})
  }
}))

// Mock Broadcaster
mock.module('../../src/utils/broadcaster', () => ({
  default: {
    toClient: mock(() => {}),
    toAll: mock(() => {})
  }
}))

// Mock database factory
mock.module('../../src/services/database/factory', () => ({
  getDatabase: mock(() => mockDatabase)
}))

// Mock database service
const mockDatabase = {
  tracks: {
    updateVote: mock()
  }
}

// Mock variables are already defined above

describe('VoteHandler', () => {
  const socketio = {} as Server

  beforeEach(() => {
    mockDatabase.tracks.updateVote.mockClear()
  })

  test('should handle a valid vote', async () => {
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

    VotingHandler({ payload, socketio })

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
