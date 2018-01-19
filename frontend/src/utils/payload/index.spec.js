import Payload from './index'

describe('Payload', () => {
  const key = 'letsdothis'
  const data = { wotcha: 'son' }

  it('it should encode', () => {
    expect(Payload.encode(key, data)).toEqual({
      key,
      data
    })
  })

  it('it should decode', () => {
    expect(Payload.decode('{"key":"letsdothis","data":{"wotcha":"son"}}'))
      .toEqual({ data: { wotcha: 'son' }, key: 'letsdothis' })
  })

  it('it should encode to json', () => {
    expect(Payload.encodeToJson(key, data)).toEqual(
      '{"key":"letsdothis","data":{"wotcha":"son"}}'
    )
  })
})
