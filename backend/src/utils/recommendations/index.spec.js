import mockingoose from 'mockingoose'
import settings from 'utils/local-storage'
import Track from 'services/mongodb/models/track'
import Recommend from './index'
jest.mock('utils/local-storage')

describe('Recommend', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getImageFromSpotifyTracks', () => {
    it('should fetch image data from tracks', () => {
      const tracks = [
        { uri: 'track1', album: { uri: 'uri1', images: [{ url: 'image1' }] } },
        { uri: 'track2', album: { uri: 'uri2', images: [{ url: 'image2' }] } }
      ]
      expect(Recommend.getImageFromSpotifyTracks(tracks)).toEqual({ uri1: 'image1', uri2: 'image2' })
    })
  })

  describe('extractSuitableData', () => {
    it('should extract image and uris from tracks', () => {
      expect.assertions(1)
      const tracks = [
        { uri: 'track1', album: { uri: 'uri1', images: [{ url: 'image1' }] } },
        { uri: 'track2', album: { uri: 'uri2', images: [{ url: 'image2' }] } },
        { uri: 'track3', album: { uri: 'uri3', images: [{ url: 'image3' }] } }
      ]
      const resultsToIgnore = [{ _id: 'track1' }]
      const currentUrisToIgnore = ['track3']
      mockingoose(Track).toReturn(resultsToIgnore, 'find')
      settings.getItem.mockImplementation(() => currentUrisToIgnore)

      return Recommend.extractSuitableData(tracks).then((data) => {
        expect(data).toEqual({
          images: {
            uri1: 'image1',
            uri2: 'image2',
            uri3: 'image3'
          },
          uris: ['track2']
        })
      })
    })
  })

  describe('addRandomUris', () => {
    it('should not add random data if not required', () => {
      expect.assertions(1)
      const initialData = {
        uris: ['uris'],
        images: ['images']
      }

      return Recommend.addRandomUris(initialData).then((data) => {
        expect(data).toEqual(initialData)
      })
    })

    it('should add random data if required', () => {
      expect.assertions(1)
      const initialData = {
        uris: [],
        images: ['images']
      }
      const results = [
        { _id: 'track1' },
        { _id: 'track2' },
        { _id: 'track3' }
      ]
      const currentUrisToIgnore = ['track3']
      mockingoose(Track).toReturn(results, 'aggregate')
      settings.getItem.mockImplementation(() => currentUrisToIgnore)

      return Recommend.addRandomUris(initialData).then((data) => {
        expect(data).toEqual({ images: ['images'], uris: ['track1', 'track2'] })
      })
    })
  })
})
