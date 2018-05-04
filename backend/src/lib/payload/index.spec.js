import Payload from './index'

describe('Payload', () => {
  const service = 'mopidy'
  const key = 'letsdothis'
  const data = { wotcha: 'son' }

  it('it should encode', () => {
    expect(Payload.encode(key, data)).toEqual({
      key,
      data
    })
  })

  it('it should encode key', () => {
    expect(Payload.encodeKey(service, key)).toEqual('mopidy::letsdothis')
  })

  it('it should decode', () => {
    expect(Payload.decode('{"key":"mopidy::letsdothis","data":{"wotcha":"son"}}'))
      .toEqual({
        service: 'mopidy',
        data: { wotcha: 'son' },
        key: 'letsdothis',
        encoded_key: 'mopidy::letsdothis',
        jwt_token: undefined
      })
  })

  it('it should throw error due to missing service key', () => {
    expect(function () {
      Payload.decode('{"key":"letsdothis","data":{"wotcha":"son"}}')
    }).toThrow()
  })

  it('it should encode to json', () => {
    expect(Payload.encodeToJson(key, data)).toEqual(
      '{"key":"letsdothis","data":{"wotcha":"son"}}'
    )
  })
})
