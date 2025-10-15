import Recommendations, { SuitableExtractedData } from '../../src/utils/recommendations'
import { expect, test, describe, mock, afterEach } from 'bun:test'

// Mock SpotifyService
const mockSpotifyService = {
  getTracks: mock()
}
mock.module('../../src/services/spotify', () => ({ default: mockSpotifyService }))

// Mock database factory
mock.module('../../src/services/database/factory', () => ({
  getDatabase: mock(() => mockDatabase)
}))

// Mock database service
const mockDatabase = {
  tracks: {
    findTracksWithLowVotes: mock(),
    findTracksPlayedToday: mock(),
    findRandomTracksWithHighVotes: mock()
  },
  settings: {
    getTracklist: mock()
  }
}

// Mock variables are already defined above

describe('Recommend', () => {
  afterEach(() => {
    mockSpotifyService.getTracks.mockClear()
    mockDatabase.tracks.findTracksWithLowVotes.mockClear()
    mockDatabase.tracks.findTracksPlayedToday.mockClear()
    mockDatabase.tracks.findRandomTracksWithHighVotes.mockClear()
    mockDatabase.settings.getTracklist.mockClear()
  })

  describe('getImageFromSpotifyTracks', () => {
    test('should fetch image data from tracks', () => {
      const tracks = [
        { uri: 'track1', album: { uri: 'uri1', images: [{ url: 'image1' }] } },
        { uri: 'track2', album: { uri: 'uri2', images: [{ url: 'image2' }] } }
      ] as SpotifyApi.TrackObjectFull[]
      expect(Recommendations.getImageFromSpotifyTracks(tracks)).toEqual({
        track1: 'image1',
        track2: 'image2'
      })
    })

    test('should handle tracks with linked_from', () => {
      const tracks = [
        {
          uri: 'track1',
          album: { uri: 'uri1', images: [{ url: 'image1' }] },
          linked_from: { type: 'track', uri: 'linked1' }
        },
        { uri: 'track2', album: { uri: 'uri2', images: [{ url: 'image2' }] } }
      ] as SpotifyApi.TrackObjectFull[]
      expect(Recommendations.getImageFromSpotifyTracks(tracks)).toEqual({
        linked1: 'image1',
        track1: 'image1',
        track2: 'image2'
      })
    })
  })

  describe('extractSuitableData', () => {
    test('should extract image and uris from tracks', async () => {
      expect.assertions(1)
      const tracks = [
        {
          uri: 'track1',
          popularity: 10,
          album: { uri: 'uri1', images: [{ url: 'image1' }] }
        },
        {
          uri: 'track2',
          popularity: 50,
          album: { uri: 'uri2', images: [{ url: 'image2' }] }
        },
        {
          uri: 'track3',
          popularity: 20,
          album: { uri: 'uri3', images: [{ url: 'image3' }] }
        },
        {
          uri: 'track4',
          popularity: 99,
          album: { uri: 'uri4', images: [{ url: 'image4' }] }
        },
        {
          uri: 'track5',
          popularity: 30,
          album: { uri: 'uri5', images: [{ url: 'image5' }] }
        },
        {
          uri: 'track6',
          popularity: 70,
          album: { uri: 'uri6', images: [{ url: 'image6' }] }
        }
      ] as SpotifyApi.TrackObjectFull[]
      const currentUrisToIgnore = ['track3']
      const resultsToIgnore = ['track1']
      const tracksPlayedToday = ['track2']

      mockDatabase.tracks.findTracksWithLowVotes.mockResolvedValue(resultsToIgnore)
      mockDatabase.tracks.findTracksPlayedToday.mockResolvedValue(tracksPlayedToday)
      mockDatabase.settings.getTracklist.mockResolvedValue(currentUrisToIgnore)

      const data = await Recommendations.extractSuitableData(tracks)
      expect(data).toEqual({
        images: {
          track1: 'image1',
          track2: 'image2',
          track3: 'image3',
          track4: 'image4',
          track5: 'image5',
          track6: 'image6'
        },
        uris: ['track5', 'track6', 'track4']
      })
    })
  })

  describe('enrichWithPopularTracksIfNeeded', () => {
    test('should not add random data if not required', async () => {
      expect.assertions(1)
      const initialData = {
        uris: ['uris'],
        images: { image: 'foo' }
      }
      const response = {} as SpotifyApi.MultipleTracksResponse
      mockSpotifyService.getTracks.mockResolvedValue(response)

      const data = await Recommendations.enrichWithPopularTracksIfNeeded(initialData)
      expect(data).toEqual(initialData)
    })

    test('should add random data if required', async () => {
      expect.assertions(1)
      const initialData: SuitableExtractedData = {
        uris: [],
        images: { image: 'foo' }
      }
      const results = ['track1', 'track2', 'track3']
      const currentUrisToIgnore = ['track3'] as string[]
      mockSpotifyService.getTracks.mockResolvedValue(
        {} as SpotifyApi.MultipleTracksResponse
      )
      mockDatabase.tracks.findRandomTracksWithHighVotes.mockResolvedValue(results)
      mockDatabase.settings.getTracklist.mockResolvedValue(currentUrisToIgnore)

      const data = await Recommendations.enrichWithPopularTracksIfNeeded(initialData)
      expect(data).toEqual({ images: { image: 'foo' }, uris: ['track1', 'track2'] })
    })
  })
})
