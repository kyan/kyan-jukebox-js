import reducer from './index'
import Types from 'constants/common'

describe('assets', () => {
  it('handles default state', () => {
    expect(reducer(undefined, {})).toEqual({})
  })

  it('handles a resolving an image', () => {
    const assets = {
      'spotify1': 'path/to/1',
      'spotify2': 'path/to/2',
      'spotify4': 'path/to/4'
    }
    const image = {
      'spotify3': 'path/to/3'
    }

    expect(reducer(assets, {
      type: Types.RESOLVE_IMAGE,
      image
    })).toEqual({
      spotify1: 'path/to/1',
      spotify2: 'path/to/2',
      spotify3: 'path/to/3',
      spotify4: 'path/to/4'
    })
  })
})
