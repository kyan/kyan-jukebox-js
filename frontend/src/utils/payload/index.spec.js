import Payload from './index'

describe('Payload', () => {
  const jwt = 'jwt_token'
  const key = 'letsdothis'
  const data = { wotcha: 'son' }

  it('it should encode', () => {
    expect(Payload.encode(jwt, key, data)).toEqual({
      jwt,
      key,
      data
    })
  })

  it('it should decode', () => {
    expect(Payload.decode('{"key":"letsdothis","data":{"wotcha":"son"}}'))
      .toEqual({ data: { wotcha: 'son' }, key: 'letsdothis' })
  })

  it('it should encode to json', () => {
    expect(Payload.encodeToJson(jwt, key, data)).toEqual(
      '{"jwt":"jwt_token","key":"letsdothis","data":{"wotcha":"son"}}'
    )
  })
})
