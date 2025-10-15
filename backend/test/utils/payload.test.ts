import Payload from '../../src/utils/payload'
import { expect, test, describe } from 'bun:test'

describe('Payload', () => {
  const key = 'letsdothis'
  const data = { wotcha: 'son' }

  test('should decode', () => {
    expect(Payload.decode('{"key":"letsdothis","data":{"wotcha":"son"}}')).toEqual({
      data: { wotcha: 'son' },
      key: 'letsdothis'
    })
  })

  test('should throw error due to missing key', () => {
    expect(function () {
      Payload.decode('{"data":{"wotcha":"son"}}')
    }).toThrow()
  })

  test('should encode to json', () => {
    expect(Payload.encodeToJson({ key, data })).toEqual(
      '{"key":"letsdothis","data":{"wotcha":"son"}}'
    )
  })
})
