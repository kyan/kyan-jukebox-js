import { OAuth2Client } from 'google-auth-library'
import User from 'services/mongodb/models/user'
import logger from 'config/winston'
import AuthenticateHandler from './index'
jest.mock('google-auth-library')
jest.mock('config/winston')

describe('AuthenticateHandler', () => {
  const wsMock = jest.fn()
  const broadcastMock = jest.fn()
  const broadcasterMock = {
    to: broadcastMock
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('handles successfully request', done => {
    expect.assertions(3)

    const payload = {
      encoded_key: 'mopidy::mixer.setVolume',
      key: 'mixer.setVolume',
      data: ['12'],
      jwt_token: 'somevalidjwttoken'
    }

    OAuth2Client.mockImplementation(() => {
      return {
        verifyIdToken: jest.fn()
          .mockResolvedValue({
            getPayload: jest.fn().mockImplementationOnce(() => ({
              sub: 'abcdefg123456',
              name: 'Duncan Robotson',
              hd: 'kyanmedia.com'
            }))
          })
      }
    })

    jest.spyOn(User, 'findOneAndUpdate')
      .mockImplementation(() => Promise.resolve(true))

    AuthenticateHandler(payload, wsMock, broadcasterMock)
      .then((response) => {
        setTimeout(() => {
          try {
            expect(response).toEqual({
              data: ['12'],
              encoded_key: 'mopidy::mixer.setVolume',
              key: 'mixer.setVolume',
              token: 'somevalidjwttoken',
              user: {
                _id: 'abcdefg123456',
                fullname: 'Duncan Robotson'
              }
            })
            expect(broadcastMock.mock.calls.length).toBe(0)
            expect(User.findOneAndUpdate.mock.calls[0]).toEqual([
              { _id: 'abcdefg123456' },
              { _id: 'abcdefg123456', 'fullname': 'Duncan Robotson' },
              { new: true, 'setDefaultsOnInsert': true, 'upsert': true }])
            done()
          } catch (err) {
            done.fail(err)
          }
        })
      })
  })

  it('handles verify error', done => {
    expect.assertions(4)

    const payload = {
      encoded_key: 'mopidy::mixer.setVolume',
      key: 'mixer.setVolume',
      data: ['12'],
      jwt_token: 'somevalidjwttoken'
    }

    OAuth2Client.mockImplementation(() => {
      return {
        verifyIdToken: jest.fn()
          .mockRejectedValue({ message: 'authError' })
      }
    })

    AuthenticateHandler(payload, wsMock, broadcasterMock)
    setTimeout(() => {
      try {
        expect(User.findOneAndUpdate).not.toHaveBeenCalled()
        expect(broadcastMock.mock.calls[0][0]).toEqual(wsMock)
        expect(broadcastMock.mock.calls[0][1]).toEqual(payload)
        expect(broadcastMock.mock.calls[0][2]).toEqual({ error: 'authError' })
        done()
      } catch (err) {
        done.fail(err)
      }
    })
  })

  it('handles incorrect domain', done => {
    expect.assertions(4)

    const payload = {
      encoded_key: 'mopidy::mixer.setVolume',
      key: 'mixer.setVolume',
      data: ['12'],
      jwt_token: 'somevalidjwttoken'
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

    AuthenticateHandler(payload, wsMock, broadcasterMock)
    setTimeout(() => {
      try {
        expect(User.findOneAndUpdate).not.toHaveBeenCalled()
        expect(broadcastMock.mock.calls[0][0]).toEqual(wsMock)
        expect(broadcastMock.mock.calls[0][1]).toEqual(payload)
        expect(broadcastMock.mock.calls[0][2]).toEqual({ error: 'Invalid domain: madeup.com' })
        done()
      } catch (err) {
        done.fail(err)
      }
    })
  })

  it('handles non-autherised requests', () => {
    expect.assertions(2)

    const payload = {
      encoded_key: 'mopidy::somenonauthtask',
      key: 'somenonauthtask',
      data: ['12']
    }

    AuthenticateHandler(payload, wsMock, broadcasterMock)
      .then((response) => {
        expect(response).toEqual({
          data: ['12'],
          encoded_key: 'mopidy::somenonauthtask',
          key: 'somenonauthtask'
        })
        expect(broadcastMock.mock.calls.length).toBe(0)
      })
  })

  it('handles User.findOneAndUpdate error', done => {
    expect.assertions(3)

    const payload = {
      encoded_key: 'mopidy::mixer.setVolume',
      key: 'mixer.setVolume',
      data: ['12'],
      jwt_token: 'somevalidjwttoken'
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

    jest.spyOn(User, 'findOneAndUpdate')
      .mockImplementation(() => Promise.reject(new Error('bang')))

    AuthenticateHandler(payload, wsMock, broadcasterMock)
    setTimeout(() => {
      try {
        expect(User.findOneAndUpdate.mock.calls[0]).toEqual([
          { _id: 'abcdefg123456' },
          { _id: 'abcdefg123456', 'fullname': 'Fred Spanner' },
          { new: true, 'setDefaultsOnInsert': true, 'upsert': true }])
        expect(broadcastMock).not.toHaveBeenCalled()
        expect(logger.error.mock.calls).toEqual([['Error checking user', { error: 'bang' }]])
        done()
      } catch (err) {
        done.fail(err)
      }
    })
  })
})
