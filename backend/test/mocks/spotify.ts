import { mock } from 'bun:test'

// Preload mock for spotify-web-api-node to prevent real API calls
// This file is loaded before tests run to ensure the mock is in place
// when the SpotifyService module is imported

const tracks = [
  {
    uri: 'spotify:track:0ZUo4YjG4saFnEJhdWp9Bt',
    album: {
      uri: 'spotify:album:0ZUo4YjG4saFnEJhdWp9Bt',
      images: [
        {
          url: 'https://i.scdn.co/dfaf92'
        }
      ]
    }
  },
  {
    uri: 'spotify:track:03fT3OHB9KyMtGMt2zwqCT',
    album: {
      uri: 'spotify:album:03fT3OHB9KyMtGMt2zwqCT',
      images: [
        {
          url: 'https://i.scdn.co/1d873289c511dfaf92'
        }
      ]
    }
  },
  { uri: 'spotify:track:7LzeKqmOtpKVKJ1dmalkC0' },
  { uri: 'spotify:track:1Ut1A8UaNqGuwsHgWq75PW' }
]

mock.module('spotify-web-api-node', () => {
  // Create a mock API instance that will be returned by the constructor
  const createMockApi = () => ({
    clientCredentialsGrant: mock(() =>
      Promise.resolve({
        body: {
          access_token: 'mock_token',
          expires_in: 3600
        }
      })
    ),
    setAccessToken: mock(() => {}),
    getTracks: mock(() =>
      Promise.resolve({
        body: {
          tracks: [{ explicit: true, name: 'Naughty' }]
        }
      })
    ),
    getArtists: mock(() =>
      Promise.resolve({
        body: {
          artists: [{ name: 'Yahzoo' }]
        }
      })
    ),
    searchTracks: mock(() =>
      Promise.resolve({
        body: {
          tracks: { items: [] }
        }
      })
    ),
    getRecommendations: mock(() =>
      Promise.resolve({
        body: { tracks }
      })
    )
  })

  // Return the module with a constructor
  const MockSpotifyWebApi = mock(function (this: any) {
    const api = createMockApi()
    Object.assign(this, api)
    return this
  })

  return {
    default: MockSpotifyWebApi
  }
})

// Mock Recommendations utility
mock.module('../../src/utils/recommendations', () => ({
  default: {
    extractSuitableData: mock(() => ({
      images: {},
      uris: []
    })),
    enrichWithPopularTracksIfNeeded: mock(() =>
      Promise.resolve({
        images: {},
        uris: []
      })
    ),
    getImageFromSpotifyTracks: mock(() => ({}))
  }
}))

// Mock ImageCache utility
mock.module('../../src/utils/image-cache', () => ({
  default: {
    addAll: mock(() => Promise.resolve({})),
    findAll: mock(() => Promise.resolve([]))
  }
}))

export {}
