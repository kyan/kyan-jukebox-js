import Setting from '../../src/models/setting'
import Track, { DBTrackInterface } from '../../src/models/track'
import SpotifyService from '../../src/services/spotify'
import Recommend, { SuitableDataInterface } from '../../src/utils/recommendations'
jest.mock('../../src/models/track')
jest.mock('../../src/models/setting')
jest.mock('../../src/services/spotify')

describe('Recommend', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getImageFromSpotifyTracks', () => {
    it('should fetch image data from tracks', () => {
      const tracks = [
        { uri: 'track1', album: { uri: 'uri1', images: [{ url: 'image1' }] } },
        { uri: 'track2', album: { uri: 'uri2', images: [{ url: 'image2' }] } }
      ] as SpotifyApi.TrackObjectFull[]
      expect(Recommend.getImageFromSpotifyTracks(tracks)).toEqual({
        track1: 'image1',
        track2: 'image2'
      })
    })

    it('should handle tracks with linked_from', () => {
      const tracks = [
        {
          uri: 'track1',
          album: { uri: 'uri1', images: [{ url: 'image1' }] },
          linked_from: { type: 'track', uri: 'linked1' }
        },
        { uri: 'track2', album: { uri: 'uri2', images: [{ url: 'image2' }] } }
      ] as SpotifyApi.TrackObjectFull[]
      expect(Recommend.getImageFromSpotifyTracks(tracks)).toEqual({
        linked1: 'image1',
        track1: 'image1',
        track2: 'image2'
      })
    })
  })

  describe('extractSuitableData', () => {
    it('should extract image and uris from tracks', async () => {
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
      const resultsToIgnore = [{ _id: 'track1' }] as DBTrackInterface[]
      const tracksPlayedToday = [{ _id: 'track2' }] as DBTrackInterface[]
      const mockedTrackFind = Track.find as jest.Mock<any>
      const mockedGetTracklist = Setting.getTracklist as jest.Mock<any>

      mockedTrackFind
        .mockImplementationOnce(() => ({
          select: jest.fn().mockResolvedValue(resultsToIgnore)
        }))
        .mockImplementationOnce(() => ({
          select: jest.fn().mockResolvedValue(tracksPlayedToday)
        }))
      mockedGetTracklist.mockResolvedValue(currentUrisToIgnore)

      const data = await Recommend.extractSuitableData(tracks)
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
    it('should not add random data if not required', async () => {
      expect.assertions(1)
      const initialData = {
        uris: ['uris'],
        images: { image: 'foo' }
      }
      const response = {} as SpotifyApi.MultipleTracksResponse
      const mockedGetTracks = SpotifyService.getTracks as jest.Mock<any>
      mockedGetTracks.mockResolvedValue(response)

      const data = await Recommend.enrichWithPopularTracksIfNeeded(initialData)
      expect(data).toEqual(initialData)
    })

    it('should add random data if required', async () => {
      expect.assertions(1)
      const initialData: SuitableDataInterface = {
        uris: [],
        images: { image: 'foo' }
      }
      const results = [{ _id: 'track1' }, { _id: 'track2' }, { _id: 'track3' }]
      const currentUrisToIgnore = ['track3'] as string[]
      const mockedGetTracks = SpotifyService.getTracks as jest.Mock<any>
      const mockedTrackAggregate = Track.aggregate as jest.Mock<any>
      const mockedGetTracklist = Setting.getTracklist as jest.Mock<any>

      mockedGetTracks.mockResolvedValue({} as SpotifyApi.MultipleTracksResponse)
      mockedTrackAggregate.mockResolvedValue(results)
      mockedGetTracklist.mockResolvedValue(currentUrisToIgnore)

      const data = await Recommend.enrichWithPopularTracksIfNeeded(initialData)
      expect(data).toEqual({ images: { image: 'foo' }, uris: ['track1', 'track2'] })
    })
  })
})
