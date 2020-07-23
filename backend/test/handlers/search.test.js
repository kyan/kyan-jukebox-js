import Spotify from '../../src/services/spotify'
import Broadcaster from '../../src/utils/broadcaster'
import Decorator from '../../src/decorators/search'
import SearchHandler from '../../src/handlers/search'
jest.mock('../../src/utils/event-logger')
jest.mock('../../src/services/spotify')
jest.mock('../../src/utils/broadcaster')
jest.mock('../../src/decorators/search')

describe('SearchHandler', () => {
  const socket = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should handle a valid search', () => {
    expect.assertions(2)
    const payload = {
      key: 'searchGetTracks',
      data: 'search'
    }
    Spotify.search.mockResolvedValue('tracks')
    Decorator.parse.mockResolvedValue('unifiedMessage')

    SearchHandler({ payload, socket })

    return new Promise(resolve => {
      setTimeout(() => {
        expect(Spotify.search).toHaveBeenCalledWith('search')
        expect(Broadcaster.toClient).toHaveBeenCalledWith({
          socket,
          headers: payload,
          message: 'unifiedMessage',
          type: 'search'
        })
        resolve()
      }, 0)
    })
  })
})
