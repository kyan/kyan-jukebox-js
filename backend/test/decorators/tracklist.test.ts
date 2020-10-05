import fs from 'fs'
import TransformerTracklist from '../../src/decorators/tracklist'
import ImageCache from '../../src/utils/image-cache'
import Image from '../../src/models/image'
import Mopidy from 'mopidy'
jest.mock('../../src/config/logger')

const firstTrack = {
  _id: 'spotify:track:6IZWJhXyk1Z0rtWNxIi4o7',
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
  _id: 'spotify:track:14sOS5L36385FJ3OL8hew4',
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

jest.mock('../../src/models/track', () => ({
  findTracks: jest.fn().mockImplementation(() => Promise.resolve(mockTrackData))
}))

describe('TransformerTracklist', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  const payload = JSON.parse(
    fs.readFileSync('./test/__mockData__/tracklist.json', 'utf8')
  )
  describe('when passed a tracklist', () => {
    it('transforms it', () => {
      expect.assertions(1)
      jest.spyOn(ImageCache, 'findAll').mockResolvedValue(mockImageData as Image[])

      return TransformerTracklist(payload).then((transformedPayload) => {
        expect(transformedPayload).toMatchSnapshot()
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
