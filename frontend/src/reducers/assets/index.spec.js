import reducer from './index'
import Types from 'constants/common'

describe('assets', () => {
  it('handles default state', () => {
    expect(reducer(undefined, {})).toEqual([])
  })

  it('handles a new image', () => {
    expect(reducer(undefined, {
      type: Types.NEW_IMAGE,
      uri: '123456789asdfghj'
    })).toEqual([{ 'ref': '123456789asdfghj' }])
  })

  it('handles a the same image and does not add again', () => {
    expect(reducer([{ 'ref': '123456789asdfghj' }], {
      type: Types.NEW_IMAGE,
      uri: '123456789asdfghj'
    })).toEqual([{ 'ref': '123456789asdfghj' }])
  })

  it('handles a resolving an image', () => {
    const assets = [
      { 'ref': '123456789asdfghj' },
      { 'ref': 'xdskjhdskjdhskjd' }
    ]
    const imageData = {
      '123456789asdfghj': [
        { uri: 'large image' },
        { uri: 'medium image' }
      ]
    }

    expect(reducer(assets, {
      type: Types.RESOLVE_IMAGE,
      data: imageData
    })).toEqual([
      { 'ref': '123456789asdfghj', 'uri': 'large image' },
      { 'ref': 'xdskjhdskjdhskjd' }
    ])
  })
})
