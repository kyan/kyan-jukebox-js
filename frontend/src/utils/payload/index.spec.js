import Payload from './index'

describe('Payload', () => {
  const jwt = 'jwt'
  const key = 'letsdothis'
  const data = { wotcha: 'son' }

  it('it should decode', () => {
    expect(Payload.decode('{"key":"letsdothis","data":{"wotcha":"son"}}'))
      .toEqual({ data: { wotcha: 'son' }, key: 'letsdothis' })
  })

  it('it should encode to json', () => {
    expect(Payload.encodeToJson(jwt, key, data)).toEqual(
      '{"jwt":"jwt","key":"letsdothis","data":{"wotcha":"son"}}'
    )
  })
})
