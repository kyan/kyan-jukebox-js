import fs from 'fs'
import DecorateSearchResults from '../../src/decorators/result'
import Track from '../../src/models/track'
jest.mock('../../src/models/track')

const mockFindTracks = Track.findTracks as jest.Mock

describe('SearchResults', () => {
  const payload = JSON.parse(
    fs.readFileSync('./test/__mockData__/searchResults.json', 'utf8')
  )

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('when passed search results of votes', () => {
    const tracks = [
      {
        _id: 'spotify:track:1WaBuuaXGwrU4sFvxAjnkf',
        metrics: {
          plays: 10,
          votes: 10,
          votesTotal: 10,
          votesAverage: 10
        },
        addedBy: [
          {
            user: {
              _id: '123',
              fullname: 'Big Rainbowhead'
            }
          }
        ]
      },
      {
        _id: 'spotify:track:6idaUJ1KK1mWyxQziMefhU',
        addedBy: [
          {
            user: {
              _id: '456',
              fullname: 'Bigger Rainbowhead'
            }
          }
        ],
        metrics: {
          plays: 10,
          votes: 10,
          votesTotal: 10,
          votesAverage: 60
        }
      },
      {
        _id: 'spotify:track:7bqfZygxuq03hqffjswjCK',
        addedBy: [
          {
            user: {
              _id: '456',
              fullname: 'Bigger Rainbowhead'
            }
          }
        ],
        metrics: {
          votesAverage: 50
        }
      }
    ]

    it('renders', async () => {
      mockFindTracks.mockResolvedValue(tracks)

      const transformedPayload = await DecorateSearchResults(payload.tracks.items)

      expect(transformedPayload).toHaveLength(3)

      // Results should be sorted by votesAverage descending
      expect(transformedPayload[0].uri).toBe('spotify:track:6idaUJ1KK1mWyxQziMefhU')
      expect(transformedPayload[0].metrics?.votesAverage).toBe(60)

      expect(transformedPayload[1].uri).toBe('spotify:track:7bqfZygxuq03hqffjswjCK')
      expect(transformedPayload[1].metrics?.votesAverage).toBe(50)

      expect(transformedPayload[2].uri).toBe('spotify:track:1WaBuuaXGwrU4sFvxAjnkf')
      expect(transformedPayload[2].metrics?.votesAverage).toBe(10)

      // Check that all tracks have expected properties
      transformedPayload.forEach((track) => {
        expect(track).toHaveProperty('uri')
        expect(track).toHaveProperty('name')
        expect(track).toHaveProperty('album')
        expect(track).toHaveProperty('artist')
        expect(track).toHaveProperty('addedBy')
        expect(track).toHaveProperty('metrics')
      })
    })
  })

  describe('when passed search results with deincreasing votes', () => {
    const tracks = [
      {
        _id: 'spotify:track:1WaBuuaXGwrU4sFvxAjnkf',
        addedBy: [
          {
            user: {
              _id: '123',
              fullname: 'Big Rainbowhead'
            }
          }
        ],
        metrics: {
          votesAverage: 80
        }
      },
      {
        _id: 'spotify:track:6idaUJ1KK1mWyxQziMefhU',
        addedBy: [
          {
            user: {
              _id: '456',
              fullname: 'Bigger Rainbowhead'
            }
          }
        ],
        metrics: {
          votesAverage: 50
        }
      },
      {
        _id: 'spotify:track:7bqfZygxuq03hqffjswjCK',
        addedBy: [
          {
            user: {
              _id: '456',
              fullname: 'Bigger Rainbowhead'
            }
          }
        ],
        metrics: {
          votesAverage: 30
        }
      }
    ]

    it('renders', async () => {
      mockFindTracks.mockResolvedValue(tracks)

      const transformedPayload = await DecorateSearchResults(payload.tracks.items)

      expect(transformedPayload).toHaveLength(3)

      // Results should maintain descending order
      expect(transformedPayload[0].uri).toBe('spotify:track:1WaBuuaXGwrU4sFvxAjnkf')
      expect(transformedPayload[0].metrics?.votesAverage).toBe(80)

      expect(transformedPayload[1].uri).toBe('spotify:track:6idaUJ1KK1mWyxQziMefhU')
      expect(transformedPayload[1].metrics?.votesAverage).toBe(50)

      expect(transformedPayload[2].uri).toBe('spotify:track:7bqfZygxuq03hqffjswjCK')
      expect(transformedPayload[2].metrics?.votesAverage).toBe(30)
    })
  })

  describe('when passed results with no votes', () => {
    afterEach(() => {
      process.env.EXPLICIT_CONTENT = 'true'
    })

    const tracks = [
      {
        _id: 'spotify:track:1WaBuuaXGwrU4sFvxAjnkf',
        addedBy: [
          {
            user: {
              _id: '123',
              fullname: 'Big Rainbowhead'
            }
          }
        ]
      },
      {
        _id: 'spotify:track:6idaUJ1KK1mWyxQziMefhU',
        addedBy: [
          {
            user: {
              _id: '456',
              fullname: 'Bigger Rainbowhead'
            }
          }
        ]
      },
      {
        _id: 'spotify:track:7bqfZygxuq03hqffjswjCK',
        addedBy: [
          {
            user: {
              _id: '456',
              fullname: 'Bigger Rainbowhead'
            }
          }
        ]
      }
    ]

    it('renders', async () => {
      process.env.EXPLICIT_CONTENT = 'false'
      mockFindTracks.mockResolvedValue(tracks)

      const transformedPayload = await DecorateSearchResults(payload.tracks.items)

      expect(transformedPayload).toHaveLength(3)

      // Check all tracks have basic properties
      transformedPayload.forEach((track) => {
        expect(track).toHaveProperty('uri')
        expect(track).toHaveProperty('name')
        expect(track).toHaveProperty('album')
        expect(track).toHaveProperty('artist')
        expect(track).toHaveProperty('image')
        expect(track).toHaveProperty('length')
        expect(track).toHaveProperty('addedBy')
      })

      // Verify explicit content is marked on the second track
      expect(transformedPayload[1].explicit).toBe(true)

      // Verify no explicit flag on non-explicit tracks
      expect(transformedPayload[0].explicit).toBeUndefined()
      expect(transformedPayload[2].explicit).toBeUndefined()

      // Check specific track details
      expect(transformedPayload[0].uri).toBe('spotify:track:1WaBuuaXGwrU4sFvxAjnkf')
      expect(transformedPayload[0].name).toBe('Happiness')
      expect(transformedPayload[0].artist.name).toBe('Ken Dodd')

      expect(transformedPayload[1].uri).toBe('spotify:track:6idaUJ1KK1mWyxQziMefhU')
      expect(transformedPayload[2].uri).toBe('spotify:track:7bqfZygxuq03hqffjswjCK')
    })
  })

  describe('when passed no results', () => {
    it('renders', async () => {
      mockFindTracks.mockResolvedValue([])

      const transformedPayload = await DecorateSearchResults(payload.tracks.items)

      expect(transformedPayload).toHaveLength(3)

      // All tracks should be transformed without database metrics
      transformedPayload.forEach((track) => {
        expect(track).toHaveProperty('uri')
        expect(track).toHaveProperty('name')
        expect(track).toHaveProperty('album')
        expect(track).toHaveProperty('artist')
        expect(track).toHaveProperty('image')
        expect(track).toHaveProperty('length')
        // Should not have metrics since no DB results
        expect(track.metrics).toBeUndefined()
      })

      // Verify basic track information is preserved
      expect(transformedPayload[0].name).toBe('Happiness')
      expect(transformedPayload[0].uri).toBe('spotify:track:1WaBuuaXGwrU4sFvxAjnkf')
      expect(transformedPayload[0].artist.name).toBe('Ken Dodd')
      expect(transformedPayload[0].album.name).toBe('Ken Dodd')
    })
  })
})
