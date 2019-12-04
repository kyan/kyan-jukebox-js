import storage from '../../../local-storage'
import tracklistTrimmer from './index'

jest.mock('config/winston')
jest.mock('../../../local-storage')

describe('tracklistTrimmer', () => {
  const removeMock = jest.fn()
  const mopidy = {
    tracklist: {
      remove: removeMock
    }
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('when we have various track amounts', () => {
    it('returns the correct tracks pos #1', () => {
      const tracks = [
        'track1', 'track2', 'track3',
        'track4', 'track5', 'track6',
        'track7', 'track8', 'track9'
      ]
      storage.getItem
        .mockReturnValueOnce('track8')
        .mockReturnValueOnce(tracks)

      tracklistTrimmer(mopidy)
      expect(removeMock.mock.calls[0][0])
        .toEqual({uri: ['track1', 'track2', 'track3']})
    })

    it('returns the correct tracks pos #2', () => {
      const tracks = [
        'track1', 'track2', 'track3',
        'track4', 'track5', 'track6',
        'track7', 'track8', 'track9',
        'track10', 'track11', 'track12',
        'track13', 'track14', 'track15'
      ]
      storage.getItem
        .mockReturnValueOnce('track14')
        .mockReturnValueOnce(tracks)

      tracklistTrimmer(mopidy)
      expect(removeMock.mock.calls[0][0])
        .toEqual({uri: [
          'track1', 'track2', 'track3',
          'track4', 'track5', 'track6',
          'track7', 'track8', 'track9'
        ]})
    })

    it('returns the correct tracks pos #3', () => {
      const tracks = [
        'track1', 'track2', 'track3',
        'track4', 'track5', 'track6'
      ]
      storage.getItem
        .mockReturnValueOnce('track5')
        .mockReturnValueOnce(tracks)

      tracklistTrimmer(mopidy)
      expect(removeMock).not.toBeCalled()
    })

    it('returns the correct tracks pos #4', () => {
      const tracks = [
        'track1', 'track2', 'track3',
        'track4', 'track5', 'track6'
      ]
      storage.getItem
        .mockReturnValueOnce('track1')
        .mockReturnValueOnce(tracks)

      tracklistTrimmer(mopidy)
      expect(removeMock).not.toBeCalled()
    })
  })
})
