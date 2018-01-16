import StringToFunction from './index'

describe('StringToFunction', () => {
  const str = 'playback.stop'
  const obj = { playback: { stop: 'stop' } }

  it('handles a correctly formatted string', () => {
    const context = StringToFunction(obj, str)
    expect(context).toEqual('stop')
  })
})
