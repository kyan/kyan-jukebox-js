import Payload from '../../src/utils/payload'

describe('Payload', () => {
  const key = 'letsdothis'
  const data = { wotcha: 'son' }

  it('it should decode', () => {
    expect(Payload.decode('{"key":"letsdothis","data":{"wotcha":"son"}}')).toEqual({
      data: { wotcha: 'son' },
      key: 'letsdothis',
      jwt: undefined
    })
  })

  it('it should throw error due to missing key', () => {
    expect(function () {
      Payload.decode('{"data":{"wotcha":"son"}}')
    }).toThrow()
  })

  it('it should encode to json', () => {
    expect(Payload.encodeToJson({ key, data })).toEqual(
      '{"key":"letsdothis","data":{"wotcha":"son"}}'
    )
  })
})
