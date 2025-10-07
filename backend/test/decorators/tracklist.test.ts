import fs from 'fs'
import TransformerTracklist from '../../src/decorators/tracklist'
import ImageCache from '../../src/utils/image-cache'
import Image from '../../src/models/image'
import Mopidy from 'mopidy'
import { getDatabase } from '../../src/services/database/factory'
jest.mock('../../src/config/logger')
jest.mock('../../src/services/database/factory')

const firstTrack = {
  uri: 'spotify:track:6IZWJhXyk1Z0rtWNxIi4o7',
  addedBy: [
    {
      user: {
        _id: '123',
        fullname: 'Big Rainbowhead'
      }
    }
  ],
  __v: 0
}
const secondTrack = {
  uri: 'spotify:track:14sOS5L36385FJ3OL8hew4',
  addedBy: [
    {
      user: {
        _id: '456',
        fullname: 'Bigger Rainbowhead'
      }
    }
  ],
  __v: 0
}
const firstImage = {
  _id: 'spotify:track:6IZWJhXyk1Z0rtWNxIi4o7',
  url: 'path/to/image/1'
}
const mockTrackData = [firstTrack, secondTrack]
const mockImageData = [firstImage]

// Mock database service
const mockDatabase = {
  tracks: {
    findByUris: jest.fn().mockResolvedValue(mockTrackData)
  }
}

const mockGetDatabase = getDatabase as jest.Mock
mockGetDatabase.mockReturnValue(mockDatabase)

describe('TransformerTracklist', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  const payload = JSON.parse(
    fs.readFileSync('./test/__mockData__/tracklist.json', 'utf8')
  )
  describe('when passed a tracklist', () => {
    it('transforms it', async () => {
      jest.spyOn(ImageCache, 'findAll').mockResolvedValue(mockImageData as Image[])

      const transformedPayload = await TransformerTracklist(payload)

      expect(transformedPayload).toHaveLength(3)

      // First track
      expect(transformedPayload[0]).toMatchObject({
        uri: 'spotify:track:6IZWJhXyk1Z0rtWNxIi4o7',
        name: 'Happy Hour',
        length: 145000,
        year: '1986',
        album: {
          name: 'London 0 Hull 4',
          uri: 'spotify:album:13gokJcmO1Dbc9cbHM93jO',
          year: '1986'
        },
        artist: {
          name: 'The Housemartins',
          uri: 'spotify:artist:77D38RDgCtlYNLpayStftL'
        },
        image: 'path/to/image/1',
        addedBy: [
          {
            user: {
              _id: '123',
              fullname: 'Big Rainbowhead'
            }
          }
        ]
      })

      // Second track
      expect(transformedPayload[1]).toMatchObject({
        uri: 'spotify:track:14sOS5L36385FJ3OL8hew4',
        name: 'Happy Now',
        length: 211000,
        year: '2018',
        album: {
          name: 'Happy Now',
          uri: 'spotify:album:6nAjd2MlBY1f1mNu6BsWLO',
          year: '2018'
        },
        artist: {
          name: 'Kygo',
          uri: 'spotify:artist:23fqKkggKUBHNkbKtXEls4'
        },
        addedBy: [
          {
            user: {
              _id: '456',
              fullname: 'Bigger Rainbowhead'
            }
          }
        ]
      })

      // Third track
      expect(transformedPayload[2]).toMatchObject({
        uri: 'spotify:track:7zkLcJktbodeRntovGdXQK',
        name: 'You Could Be Happy',
        length: 182000,
        year: '2006',
        album: {
          name: 'Eyes Open',
          uri: 'spotify:album:5PYva5C1cdwx2PAsOgZBHN',
          year: '2006'
        },
        artist: {
          name: 'Snow Patrol',
          uri: 'spotify:artist:3rIZMv9rysU7JkLzEaC5Jp'
        }
      })

      // Verify that second track doesn't have image (not in mockImageData)
      expect(transformedPayload[1].image).toBeUndefined()

      // Verify that third track has no addedBy
      expect(transformedPayload[2].addedBy).toBeUndefined()

      // Verify all tracks have the expected structure
      transformedPayload.forEach((track) => {
        expect(track).toHaveProperty('uri')
        expect(track).toHaveProperty('name')
        expect(track).toHaveProperty('length')
        expect(track).toHaveProperty('album')
        expect(track).toHaveProperty('artist')
      })
    })

    it('catches errors', () => {
      expect.assertions(1)
      const arg = 'something broke' as unknown
      return TransformerTracklist(arg as Mopidy.models.Track[]).catch((err) => {
        expect(err.message).toEqual('json.map is not a function')
      })
    })
  })
})
