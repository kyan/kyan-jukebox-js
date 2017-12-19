import reducer from './index'
import Types from '../../constants'

describe('jukebox', () => {
  it('handles default state', () => {
    expect(reducer(undefined, {})).toEqual({ 'online': false })
  })

  it('handles a CONNECTED', () => {
    expect(reducer(undefined, {
      type: Types.CONNECTED
    })).toEqual({ 'online': true })
  })

  it('handles a DISCONNECTED', () => {
    expect(reducer({ 'online': true }, {
      type: Types.DISCONNECTED
    })).toEqual({ 'online': false })
  })
})
