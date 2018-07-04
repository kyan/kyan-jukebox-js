import jwt from 'jsonwebtoken'
import AuthenticateHandler from './index'

describe('AuthenticateHandler', () => {
  const ws = jest.fn()
  const cb = jest.fn()
  const broadcastMock = jest.fn()
  const broadcasterMock = {
    to: broadcastMock
  }

  it('handles a non authorised request ', () => {
    spyOn(jwt, 'verify')
    const payload = {
      encoded_key: 'mopidy::anonauthevent'
    }
    AuthenticateHandler(payload, ws, broadcasterMock, cb)
    expect(jwt.verify).not.toBeCalled()
    expect(cb.mock.calls.length).toEqual(1)
    expect(cb.mock.calls[0][0]).toEqual(payload)
    expect(broadcastMock.mock.calls.length).toEqual(0)
  })

  describe('With an authorised request', () => {
    it('handles a invalid JWT_TOKEN', () => {
      const payload = {
        jwt_token: 'jwt_token',
        encoded_key: 'mopidy::tracklist.add'
      }
      AuthenticateHandler(payload, ws, broadcasterMock, cb)
      expect(broadcastMock.mock.calls.length).toEqual(1)
      expect(broadcastMock.mock.calls[0][0]).toEqual(ws)
      expect(broadcastMock.mock.calls[0][1]).toEqual(payload)
      expect(broadcastMock.mock.calls[0][2]).toEqual(
        { error: 'jwt malformed' }
      )
      expect(cb.mock.calls.length).toEqual(0)
    })

    it('handles a valid JWT_TOKEN', () => {
      const data = {
        _id: 'user123',
        encoded_key: 'mopidy::tracklist.add'
      }
      const token = jwt.sign(data, process.env.JWT_SECRET)
      const payload = {
        jwt_token: token,
        encoded_key: 'mopidy::tracklist.add'
      }
      AuthenticateHandler(payload, ws, broadcasterMock, cb)
      expect(broadcastMock.mock.calls.length).toEqual(0)
      expect(cb.mock.calls.length).toEqual(1)
      expect(cb.mock.calls[0][0]).toEqual({
        jwt_token: token,
        encoded_key: 'mopidy::tracklist.add',
        user_id: data._id
      })
    })
  })
})
