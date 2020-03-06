import Spotify from 'services/spotify'
import Broadcaster from 'utils/broadcaster'
import Decorator from 'decorators/search'
import SearchHandler from './index'
jest.mock('utils/event-logger')
jest.mock('services/spotify')
jest.mock('utils/broadcaster')
jest.mock('decorators/search')

describe('SearchHandler', () => {
  const socket = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should handle a valid search', done => {
    expect.assertions(2)
    const payload = {
      key: 'searchGetTracks',
      data: 'search'
    }
    Spotify.search.mockResolvedValue('tracks')
    Decorator.parse.mockResolvedValue('unifiedMessage')

    SearchHandler({ payload, socket })

    setTimeout(() => {
      try {
        expect(Spotify.search).toHaveBeenCalledWith('search')
        expect(Broadcaster.toClient).toHaveBeenCalledWith({
          socket,
          headers: payload,
          message: 'unifiedMessage',
          type: 'search'
        })
        done()
      } catch (err) {
        done.fail(err)
      }
    })
  })
})
