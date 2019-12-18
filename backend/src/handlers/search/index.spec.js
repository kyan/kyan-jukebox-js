import Spotify from 'services/spotify'
import SearchHandler from './index'
jest.mock('config/winston')
jest.mock('services/spotify')
jest.mock('services/mopidy/tracklist-trimmer')

describe('SearchHandler', () => {
  const ws = jest.fn()
  const broadcastMock = jest.fn()
  const broadcasterMock = {
    to: broadcastMock
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should handle a valid search', done => {
    expect.assertions(2)
    const payload = {
      key: 'search::getTracks',
      encoded_key: 'search::search::getTracks',
      data: 'search'
    }
    Spotify.search.mockResolvedValue('tracks')

    SearchHandler(payload, ws, broadcasterMock)

    setTimeout(() => {
      try {
        expect(Spotify.search).toHaveBeenCalledWith('search')
        expect(broadcastMock).toHaveBeenCalledWith(
          ws,
          { data: 'search', encoded_key: 'search::search::getTracks', key: 'search::getTracks' },
          'tracks',
          'search'
        )
        done()
      } catch (err) {
        done.fail(err)
      }
    })
  })

  it('should handle an invalid search', done => {
    expect.assertions(2)
    const payload = {
      key: 'search::getTracks',
      encoded_key: 'search::search::getTracks',
      data: 'search'
    }
    Spotify.search.mockRejectedValue(new Error('booom'))

    SearchHandler(payload, ws, broadcasterMock)

    setTimeout(() => {
      try {
        expect(Spotify.search).toHaveBeenCalledWith('search')
        expect(broadcastMock).toHaveBeenCalledWith(
          ws,
          { data: 'search', encoded_key: 'mopidy::validationError', key: 'search::getTracks' },
          'booom',
          'search'
        )
        done()
      } catch (err) {
        done.fail(err)
      }
    })
  })
})
