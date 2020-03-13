import { getTracklist } from 'services/mongodb/models/setting'
import Track from 'services/mongodb/models/track'
import SpotifyService from 'services/spotify'
import Recommend from './index'
jest.mock('services/mongodb/models/track')
jest.mock('services/mongodb/models/setting')
jest.mock('services/spotify')

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
      expect(Recommend.getImageFromSpotifyTracks(tracks)).toEqual({ track1: 'image1', track2: 'image2' })
    })

    it('should handle tracks with linked_from', () => {
      const tracks = [
        { uri: 'track1', album: { uri: 'uri1', images: [{ url: 'image1' }] }, linked_from: { type: 'track', uri: 'linked1' } },
        { uri: 'track2', album: { uri: 'uri2', images: [{ url: 'image2' }] } }
      ]
      expect(Recommend.getImageFromSpotifyTracks(tracks)).toEqual({
        linked1: 'image1',
        track1: 'image1',
        track2: 'image2'
      })
    })
  })

  describe('extractSuitableData', () => {
    it('should extract image and uris from tracks', () => {
      expect.assertions(1)
      const tracks = [
        { uri: 'track1', popularity: 10, album: { uri: 'uri1', images: [{ url: 'image1' }] } },
        { uri: 'track2', popularity: 50, album: { uri: 'uri2', images: [{ url: 'image2' }] } },
        { uri: 'track3', popularity: 20, album: { uri: 'uri3', images: [{ url: 'image3' }] } },
        { uri: 'track4', popularity: 99, album: { uri: 'uri4', images: [{ url: 'image4' }] } },
        { uri: 'track5', popularity: 30, album: { uri: 'uri5', images: [{ url: 'image5' }] } },
        { uri: 'track6', popularity: 70, album: { uri: 'uri6', images: [{ url: 'image6' }] } }
      ]
      const resultsToIgnore = [{ _id: 'track1' }]
      const currentUrisToIgnore = ['track3']
      Track.find.mockImplementation(() => ({ select: jest.fn().mockResolvedValue(resultsToIgnore) }))
      getTracklist.mockResolvedValue(currentUrisToIgnore)

      return Recommend.extractSuitableData(tracks).then((data) => {
        expect(data).toEqual({
          images: {
            track1: 'image1',
            track2: 'image2',
            track3: 'image3',
            track4: 'image4',
            track5: 'image5',
            track6: 'image6'
          },
          uris: ['track2', 'track6', 'track4']
        })
      })
    })
  })

  describe('addRandomUris', () => {
    it('should not add random data if not required', () => {
      expect.assertions(1)
      const initialData = {
        uris: ['uris'],
        images: { 'image': 'foo' }
      }
      SpotifyService.getTracks.mockResolvedValue()

      return Recommend.addRandomUris(initialData).then((data) => {
        expect(data).toEqual(initialData)
      })
    })

    it('should add random data if required', () => {
      expect.assertions(1)
      const initialData = {
        uris: [],
        images: { 'image': 'foo' }
      }
      const results = [
        { _id: 'track1' },
        { _id: 'track2' },
        { _id: 'track3' }
      ]
      const currentUrisToIgnore = ['track3']
      SpotifyService.getTracks.mockResolvedValue()
      Track.aggregate.mockResolvedValue(results)
      getTracklist.mockResolvedValue(currentUrisToIgnore)

      return Recommend.addRandomUris(initialData).then((data) => {
        expect(data).toEqual({ images: { 'image': 'foo' }, uris: ['track1', 'track2'] })
      })
    })
  })
})
