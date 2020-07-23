import { OAuth2Client } from 'google-auth-library'
import Broadcaster from '../../src/utils/broadcaster'
import User from '../../src/models/user'
import logger from '../../src/config/logger'
import AuthenticateHandler from '../../src/handlers/authenticate'
jest.mock('google-auth-library')
jest.mock('../../src/config/logger')
jest.mock('../../src/utils/broadcaster')
jest.mock('../../src/models/user')

describe('AuthenticateHandler', () => {
  const wsMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('handles successfully request', () => {
    expect.assertions(3)

    const payload = {
      key: 'mixer.setVolume',
      data: ['12'],
      jwt: 'somevalidjwttoken'
    }

    OAuth2Client.mockImplementation(() => {
      return {
        verifyIdToken: jest.fn()
          .mockResolvedValue({
            getPayload: jest.fn().mockImplementationOnce(() => ({
              sub: 'abcdefg123456',
              name: 'Duncan Robotson',
              picture: 'a/beautiful/image',
              hd: 'kyanmedia.com'
            }))
          })
      }
    })

    User.findOneAndUpdate.mockResolvedValue(true)

    return AuthenticateHandler(payload, wsMock)
      .then((response) => {
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
        expect(User.findOneAndUpdate.mock.calls[0]).toEqual([
          { _id: 'abcdefg123456' },
          { _id: 'abcdefg123456', fullname: 'Duncan Robotson', picture: 'a/beautiful/image' },
          { new: true, setDefaultsOnInsert: true, upsert: true }])
      })
  })

  it('handles verify error', () => {
    expect.assertions(2)
    const payload = {
      key: 'mixer.setVolume',
      data: ['12'],
      jwt: 'somevalidjwttoken'
    }
    OAuth2Client.mockImplementation(() => {
      return {
        verifyIdToken: jest.fn().mockRejectedValue({ message: 'authError' })
      }
    })
    AuthenticateHandler(payload, wsMock)

    return new Promise(resolve => {
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
        resolve()
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
    OAuth2Client.mockImplementation(() => {
      return {
        verifyIdToken: jest.fn()
          .mockResolvedValue({
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

    return new Promise(resolve => {
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
        resolve()
      }, 0)
    })
  })

  it('handles non-autherised requests', () => {
    expect.assertions(2)

    const payload = {
      key: 'somenonauthtask',
      data: ['12']
    }

    return AuthenticateHandler(payload, wsMock)
      .then((response) => {
        expect(response).toEqual({
          data: ['12'],
          key: 'somenonauthtask'
        })
        expect(Broadcaster.toClient).not.toHaveBeenCalled()
      })
  })

  it('handles User.findOneAndUpdate error', () => {
    expect.assertions(3)
    const payload = {
      key: 'mixer.setVolume',
      data: ['12'],
      jwt: 'somevalidjwttoken'
    }
    OAuth2Client.mockImplementation(() => {
      return {
        verifyIdToken: jest.fn()
          .mockResolvedValue({
            getPayload: jest.fn().mockImplementationOnce(() => ({
              sub: 'abcdefg123456',
              name: 'Fred Spanner',
              hd: 'kyanmedia.com'
            }))
          })
      }
    })
    jest.spyOn(User, 'findOneAndUpdate').mockRejectedValue(new Error('bang'))
    AuthenticateHandler(payload, wsMock)

    return new Promise(resolve => {
      setTimeout(() => {
        expect(User.findOneAndUpdate.mock.calls[0]).toEqual([
          { _id: 'abcdefg123456' },
          { _id: 'abcdefg123456', 'fullname': 'Fred Spanner' },
          { new: true, 'setDefaultsOnInsert': true, 'upsert': true }])
        expect(Broadcaster.toClient).not.toHaveBeenCalled()
        expect(logger.error.mock.calls).toEqual([['Error checking user', { error: 'bang' }]])
        resolve()
      }, 0)
    })
  })
})
