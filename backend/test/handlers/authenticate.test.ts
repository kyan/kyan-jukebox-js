import { Socket } from 'socket.io'
import { OAuth2Client } from 'google-auth-library'
import Broadcaster from '../../src/utils/broadcaster'
import User from '../../src/models/user'
import logger from '../../src/config/logger'
import AuthenticateHandler from '../../src/handlers/authenticate'
jest.mock('google-auth-library')
jest.mock('../../src/config/logger')
jest.mock('../../src/utils/broadcaster')
jest.mock('../../src/models/user')

const mockUserFindOneAndUpdate = User.findOneAndUpdate as jest.Mock
const mockLoggerError = logger.error as jest.Mock
const googleMock = OAuth2Client as unknown
const mockOAuth2Client = googleMock as jest.Mock

describe('AuthenticateHandler', () => {
  const mock = {} as unknown
  const wsMock = mock as Socket

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('handles successfully request', async () => {
    expect.assertions(3)

    const payload = {
      key: 'mixer.setVolume',
      data: ['12'],
      jwt: 'somevalidjwttoken'
    }

    mockOAuth2Client.mockImplementation(() => {
      return {
        verifyIdToken: jest.fn().mockResolvedValue({
          getPayload: jest.fn().mockImplementationOnce(() => ({
            sub: 'abcdefg123456',
            name: 'Duncan Robotson',
            picture: 'a/beautiful/image',
            hd: 'kyan.com'
          }))
        })
      }
    })

    mockUserFindOneAndUpdate.mockResolvedValue(true)
    const response = await AuthenticateHandler(payload, wsMock)

    expect(response).toEqual({
      data: ['12'],
      key: 'mixer.setVolume',
      user: {
        _id: 'abcdefg123456',
        fullname: 'Duncan Robotson',
        picture: 'a/beautiful/image'
      }
    })
    expect(Broadcaster.toClient).not.toHaveBeenCalled()
    expect(mockUserFindOneAndUpdate.mock.calls[0]).toEqual([
      { _id: 'abcdefg123456' },
      {
        _id: 'abcdefg123456',
        fullname: 'Duncan Robotson',
        picture: 'a/beautiful/image'
      },
      { new: true, setDefaultsOnInsert: true, upsert: true }
    ])
  })

  it('handles verify error', () => {
    expect.assertions(2)
    const payload = {
      key: 'mixer.setVolume',
      data: ['12'],
      jwt: 'somevalidjwttoken'
    }
    mockOAuth2Client.mockImplementation(() => {
      return {
        verifyIdToken: jest.fn().mockRejectedValue({ message: 'authError' })
      }
    })
    AuthenticateHandler(payload, wsMock)

    return new Promise((resolve) => {
      setTimeout(() => {
        expect(User.findOneAndUpdate).not.toHaveBeenCalled()
        expect(Broadcaster.toClient).toHaveBeenCalledWith({
          headers: {
            data: ['12'],
            jwt: 'somevalidjwttoken',
            key: 'mixer.setVolume'
          },
          message: {
            error: 'authError'
          },
          socket: wsMock
        })
        resolve(null)
      }, 0)
    })
  })

  it('handles incorrect domain', () => {
    expect.assertions(2)
    const payload = {
      key: 'mixer.setVolume',
      data: ['12'],
      jwt: 'somevalidjwttoken'
    }
    mockOAuth2Client.mockImplementation(() => {
      return {
        verifyIdToken: jest.fn().mockResolvedValue({
          getPayload: jest.fn().mockImplementationOnce(() => ({
            sub: 'abcdefg123456',
            name: 'Fred Spanner',
            hd: 'madeup.com'
          }))
        })
      }
    })
    jest.spyOn(User, 'findOneAndUpdate')
    AuthenticateHandler(payload, wsMock)

    return new Promise((resolve) => {
      setTimeout(() => {
        expect(User.findOneAndUpdate).not.toHaveBeenCalled()
        expect(Broadcaster.toClient).toHaveBeenCalledWith({
          headers: {
            data: ['12'],
            jwt: 'somevalidjwttoken',
            key: 'authenticationTokenInvalid'
          },
          message: {
            error: 'Invalid domain: madeup.com'
          },
          socket: wsMock
        })
        resolve(null)
      }, 0)
    })
  })

  it('handles non-autherised requests', async () => {
    expect.assertions(2)

    const payload = {
      key: 'somenonauthtask',
      data: ['12']
    }
    const response = await AuthenticateHandler(payload, wsMock)

    expect(response).toEqual({
      data: ['12'],
      key: 'somenonauthtask'
    })
    expect(Broadcaster.toClient).not.toHaveBeenCalled()
  })

  it('handles User.findOneAndUpdate error', () => {
    expect.assertions(3)
    const payload = {
      key: 'mixer.setVolume',
      data: ['12'],
      jwt: 'somevalidjwttoken'
    }
    mockOAuth2Client.mockImplementation(() => {
      return {
        verifyIdToken: jest.fn().mockResolvedValue({
          getPayload: jest.fn().mockImplementationOnce(() => ({
            sub: 'abcdefg123456',
            name: 'Fred Spanner',
            hd: 'kyan.com'
          }))
        })
      }
    })
    jest.spyOn(User, 'findOneAndUpdate').mockRejectedValue(new Error('bang'))
    AuthenticateHandler(payload, wsMock)

    return new Promise((resolve) => {
      setTimeout(() => {
        expect(mockUserFindOneAndUpdate.mock.calls[0]).toEqual([
          { _id: 'abcdefg123456' },
          { _id: 'abcdefg123456', fullname: 'Fred Spanner' },
          { new: true, setDefaultsOnInsert: true, upsert: true }
        ])
        expect(Broadcaster.toClient).not.toHaveBeenCalled()
        expect(mockLoggerError.mock.calls).toEqual([
          ['Error checking user', { error: 'bang' }]
        ])
        resolve(null)
      }, 0)
    })
  })
})
