import { mock } from 'bun:test'

// Mock the database factory to return mock data for result decorator tests
const mockTracks = [
  {
    _id: 'spotify:track:1WaBuuaXGwrU4sFvxAjnkf',
    uri: 'spotify:track:1WaBuuaXGwrU4sFvxAjnkf',
    name: 'Happiness',
    length: 120066,
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
          fullname: 'Big Rainbowhead',
          email: 'test@example.com'
        },
        addedAt: new Date(),
        played: [] as any[],
        votes: [] as any[]
      }
    ],
    artist: {
      uri: 'spotify:artist:test',
      name: 'Ken Dodd'
    },
    album: {
      uri: 'spotify:album:test',
      name: 'Ken Dodd',
      year: '1991'
    }
  },
  {
    _id: 'spotify:track:6idaUJ1KK1mWyxQziMefhU',
    uri: 'spotify:track:6idaUJ1KK1mWyxQziMefhU',
    name: 'Happiness',
    length: 120066,
    addedBy: [
      {
        user: {
          _id: '456',
          fullname: 'Bigger Rainbowhead',
          email: 'test2@example.com'
        },
        addedAt: new Date(),
        played: [],
        votes: []
      }
    ],
    metrics: {
      plays: 10,
      votes: 10,
      votesTotal: 10,
      votesAverage: 60
    },
    artist: {
      uri: 'spotify:artist:test',
      name: 'Ken Dodd'
    },
    album: {
      uri: 'spotify:album:test',
      name: 'Ken Dodd - His Greatest Hits',
      year: '1988'
    }
  },
  {
    _id: 'spotify:track:7bqfZygxuq03hqffjswjCK',
    uri: 'spotify:track:7bqfZygxuq03hqffjswjCK',
    name: 'Love Me with All Your Heart',
    length: 163026,
    addedBy: [
      {
        user: {
          _id: '456',
          fullname: 'Bigger Rainbowhead',
          email: 'test2@example.com'
        },
        addedAt: new Date(),
        played: [],
        votes: []
      }
    ],
    metrics: {
      plays: 5,
      votes: 5,
      votesTotal: 5,
      votesAverage: 50
    },
    artist: {
      uri: 'spotify:artist:test',
      name: 'Ken Dodd'
    },
    album: {
      uri: 'spotify:album:test',
      name: 'Ken Dodd',
      year: '1991'
    }
  }
]

// Store the mock function so it can be accessed in tests
const mockFindByUris = mock(() => Promise.resolve(mockTracks))

// Export the mock database
export const mockDatabase = {
  tracks: {
    findByUris: mockFindByUris
  }
}

export { mockTracks }

export {}
