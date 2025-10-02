import { Socket } from 'socket.io'
import Broadcaster from '../../src/utils/broadcaster'
import User from '../../src/models/user'
import logger from '../../src/config/logger'
import AuthenticateHandler from '../../src/handlers/authenticate'
import AuthConsts from '../../src/constants/auth'

jest.mock('../../src/config/logger')
jest.mock('../../src/utils/broadcaster')
jest.mock('../../src/models/user')

const mockUserFindOne = User.findOne as jest.Mock
const mockLoggerError = logger.error as jest.Mock

describe('AuthenticateHandler', () => {
  const mock = {} as unknown
  const wsMock = mock as Socket

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('handles non-authorised requests without authentication', async () => {
    expect.assertions(2)

    const payload = {
      key: 'some.non.authorised.key',
      data: ['12']
    }

    const response = await AuthenticateHandler(payload, wsMock)

    expect(response).toEqual({
      data: ['12'],
      key: 'some.non.authorised.key'
    })
    expect(Broadcaster.toClient).not.toHaveBeenCalled()
  })

  it('handles successful authentication for authorised request', async () => {
    expect.assertions(3)

    const payload = {
      key: 'mixer.setVolume',
      data: ['12'],
      user: {
        email: 'duncan@kyan.com'
      }
    }

    const mockUser = {
      _id: 'user123',
      fullname: 'Duncan Robotson',
      email: 'duncan@kyan.com'
    }

    mockUserFindOne.mockResolvedValue(mockUser)
    const response = await AuthenticateHandler(payload, wsMock)

    expect(mockUserFindOne).toHaveBeenCalledWith({ email: 'duncan@kyan.com' })
    expect(response).toEqual({
      data: ['12'],
      key: 'mixer.setVolume',
      user: {
        _id: 'user123',
        fullname: 'Duncan Robotson',
        email: 'duncan@kyan.com'
      }
    })
    expect(Broadcaster.toClient).not.toHaveBeenCalled()
  })

  it('handles successful user validation', async () => {
    expect.assertions(3)

    const payload = {
      key: 'validateUser',
      data: {},
      user: {
        email: 'duncan@kyan.com'
      }
    }

    const mockUser = {
      _id: 'user123',
      fullname: 'Duncan Robotson',
      email: 'duncan@kyan.com'
    }

    mockUserFindOne.mockResolvedValue(mockUser)
    const response = await AuthenticateHandler(payload, wsMock)

    expect(mockUserFindOne).toHaveBeenCalledWith({ email: 'duncan@kyan.com' })
    expect(response).toEqual({
      data: { success: true, message: 'User validated' },
      key: 'validateUser',
      user: {
        _id: 'user123',
        fullname: 'Duncan Robotson',
        email: 'duncan@kyan.com'
      }
    })
    expect(Broadcaster.toClient).toHaveBeenCalledWith({
      headers: {
        data: { success: true, message: 'User validated' },
        key: 'validateUser',
        user: {
          _id: 'user123',
          fullname: 'Duncan Robotson',
          email: 'duncan@kyan.com'
        }
      },
      message: { success: true, message: 'User validated' },
      socket: wsMock
    })
  })

  it('handles missing user data', async () => {
    expect.assertions(2)

    const payload = {
      key: 'mixer.setVolume',
      data: ['12']
    }

    const response = await AuthenticateHandler(payload, wsMock)

    expect(response).toEqual({
      key: AuthConsts.USER_NOT_FOUND,
      data: { error: 'No user data provided' },
      user: undefined
    })
    expect(Broadcaster.toClient).toHaveBeenCalledWith({
      headers: {
        key: AuthConsts.USER_NOT_FOUND,
        data: { error: 'No user data provided' },
        user: undefined
      },
      message: { error: 'No user data provided' },
      socket: wsMock
    })
  })

  it('handles user not found', async () => {
    expect.assertions(2)

    const payload = {
      key: 'mixer.setVolume',
      data: ['12'],
      user: {
        email: 'unknown@example.com'
      }
    }

    mockUserFindOne.mockResolvedValue(null)
    const response = await AuthenticateHandler(payload, wsMock)

    expect(response).toEqual({
      key: AuthConsts.USER_NOT_FOUND,
      data: { error: 'User not found with email: unknown@example.com' },
      user: {
        email: 'unknown@example.com'
      }
    })
    expect(Broadcaster.toClient).toHaveBeenCalledWith({
      headers: {
        key: AuthConsts.USER_NOT_FOUND,
        data: { error: 'User not found with email: unknown@example.com' },
        user: {
          email: 'unknown@example.com'
        }
      },
      message: { error: 'User not found with email: unknown@example.com' },
      socket: wsMock
    })
  })

  it('handles database error', async () => {
    expect.assertions(3)

    const payload = {
      key: 'mixer.setVolume',
      data: ['12'],
      user: {
        email: 'duncan@kyan.com'
      }
    }

    const error = new Error('Database connection failed')
    mockUserFindOne.mockRejectedValue(error)
    const response = await AuthenticateHandler(payload, wsMock)

    expect(mockLoggerError).toHaveBeenCalledWith('Error looking up user', {
      error: 'Database connection failed'
    })
    expect(response).toEqual({
      key: AuthConsts.USER_NOT_FOUND,
      data: { error: 'Database connection failed' },
      user: {
        email: 'duncan@kyan.com'
      }
    })
    expect(Broadcaster.toClient).toHaveBeenCalledWith({
      headers: {
        key: AuthConsts.USER_NOT_FOUND,
        data: { error: 'Database connection failed' },
        user: {
          email: 'duncan@kyan.com'
        }
      },
      message: { error: 'Database connection failed' },
      socket: wsMock
    })
  })
})
