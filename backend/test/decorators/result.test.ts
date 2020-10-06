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
      expect(transformedPayload).toMatchSnapshot()
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
      expect(transformedPayload).toMatchSnapshot()
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
      expect(transformedPayload).toMatchSnapshot()
    })
  })

  describe('when passed no results', () => {
    it('renders', async () => {
      mockFindTracks.mockResolvedValue([])

      const transformedPayload = await DecorateSearchResults(payload.tracks.items)
      expect(transformedPayload).toMatchSnapshot()
    })
  })
})
