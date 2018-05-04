import mockingoose from 'mockingoose'
import HandshakeHandler from './index'
import AuthConstants from '../../constants/auth'

describe('HandshakeHandler', () => {
  const ws = jest.fn()
  const broadcastMock = jest.fn()
  const broadcasterMock = {
    to: broadcastMock
  }

  beforeEach(() => {
    mockingoose.resetAll()
    jest.clearAllMocks()
  })

  it('only works with auth::authenticateUser event', () => {
    const payload = {
      encoded_key: 'auth::letmein',
      key: 'letmein',
      service: 'auth',
      data: { data: { username: 'foobar' } }
    }
    HandshakeHandler(payload, ws, broadcasterMock)
    expect(broadcastMock.mock.calls.length).toEqual(0)
  })

  it('authorizes a valid user', async () => {
    const payload = {
      encoded_key: 'auth::authenticateUser',
      key: 'authenticateUser',
      service: 'auth',
      data: { data: { username: 'foobar' } }
    }
    const user = {
      _id: '507f191e810c19729de860ea',
      fullname: 'name',
      username: 'foobar'
    }
    mockingoose.User.toReturn(user, 'findOne')
    payload.encoded_key = AuthConstants.AUTHENTICATE_USER
    await HandshakeHandler(payload, ws, broadcasterMock)
    expect(broadcastMock.mock.calls.length).toEqual(1)
    expect(broadcastMock.mock.calls[0][0]).toEqual(ws)
    expect(broadcastMock.mock.calls[0][1]).toEqual({
      data: { data: { username: 'foobar' } },
      encoded_key: 'auth::authenticateUser',
      key: 'authenticateUser',
      service: 'auth'
    })
    expect(broadcastMock.mock.calls[0][2]).toMatchObject({
      token: 'eyJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1MDdmMTkxZTgxMGMxOTcyOWRlODYwZWEiLCJ1c2VybmFtZSI6ImZvb2JhciJ9.pAR_AFyMMGGaQS3KUPET4klnLtDzbpL0dlOfXjoaYsg',
      user: { _id: '507f191e810c19729de860ea', fullname: 'name', username: 'foobar' }
    })
  })

  it('does not authorize an invalid user', async () => {
    const payload = {
      encoded_key: 'auth::authenticateUser',
      key: 'authenticateUser',
      service: 'auth',
      data: { data: { username: 'madeup' } }
    }
    mockingoose.User.toReturn(null, 'findOne')
    payload.encoded_key = AuthConstants.AUTHENTICATE_USER
    await HandshakeHandler(payload, ws, broadcasterMock)
    expect(broadcastMock.mock.calls.length).toEqual(1)
    expect(broadcastMock.mock.calls[0][0]).toEqual(ws)
    expect(broadcastMock.mock.calls[0][1]).toEqual({
      data: { data: { username: 'madeup' } },
      encoded_key: 'auth::authenticateUser',
      key: 'authenticateUser',
      service: 'auth'
    })
    expect(broadcastMock.mock.calls[0][2]).toMatchObject({
      token: null,
      user: {}
    })
  })
})
