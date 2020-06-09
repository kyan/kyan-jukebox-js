import { OAuth2Client } from 'google-auth-library'
import Broadcaster from 'utils/broadcaster'
import User from 'services/mongodb/models/user'
import logger from 'config/logger'
import AuthenticateHandler from './index'
jest.mock('google-auth-library')
jest.mock('config/logger')
jest.mock('utils/broadcaster')
jest.mock('services/mongodb/models/user')

describe('AuthenticateHandler', () => {
  const wsMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('handles successfully request', done => {
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

    AuthenticateHandler(payload, wsMock)
      .then((response) => {
        setTimeout(() => {
          try {
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
            done()
          } catch (err) {
            done.fail(err)
          }
        })
      })
  })

  it('handles verify error', done => {
    expect.assertions(2)

    const payload = {
      key: 'mixer.setVolume',
      data: ['12'],
      jwt: 'somevalidjwttoken'
    }

    OAuth2Client.mockImplementation(() => {
      return {
        verifyIdToken: jest.fn()
          .mockRejectedValue({ message: 'authError' })
      }
    })

    AuthenticateHandler(payload, wsMock)
    setTimeout(() => {
      try {
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
        done()
      } catch (err) {
        done.fail(err)
      }
    })
  })

  it('handles incorrect domain', done => {
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
    setTimeout(() => {
      try {
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
        done()
      } catch (err) {
        done.fail(err)
      }
    })
  })

  it('handles non-autherised requests', () => {
    expect.assertions(2)

    const payload = {
      key: 'somenonauthtask',
      data: ['12']
    }

    AuthenticateHandler(payload, wsMock)
      .then((response) => {
        expect(response).toEqual({
          data: ['12'],
          key: 'somenonauthtask'
        })
        expect(Broadcaster.toClient).not.toHaveBeenCalled()
      })
  })

  it('handles User.findOneAndUpdate error', done => {
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

    User.findOneAndUpdate.mockRejectedValue(new Error('bang'))

    AuthenticateHandler(payload, wsMock)
    setTimeout(() => {
      try {
        expect(User.findOneAndUpdate.mock.calls[0]).toEqual([
          { _id: 'abcdefg123456' },
          { _id: 'abcdefg123456', 'fullname': 'Fred Spanner' },
          { new: true, 'setDefaultsOnInsert': true, 'upsert': true }])
        expect(Broadcaster.toClient).not.toHaveBeenCalled()
        expect(logger.error.mock.calls).toEqual([['Error checking user', { error: 'bang' }]])
        done()
      } catch (err) {
        done.fail(err)
      }
    })
  })
})
