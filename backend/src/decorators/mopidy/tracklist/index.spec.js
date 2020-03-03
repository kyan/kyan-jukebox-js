import TransformerTracklist from './index'
import ImageCache from 'utils/image-cache'
import fs from 'fs'
import lolex from 'lolex'
jest.mock('config/winston')

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

jest.mock('services/mongodb/models/track', () => ({
  findTracks: jest.fn().mockImplementation(() => Promise.resolve(mockTrackData))
}))

describe('TransformerTracklist', () => {
  let clock
  const payload = JSON.parse(fs.readFileSync('./src/__mockData__/tracklist.json', 'utf8'))

  beforeEach(() => {
    clock = lolex.install()
  })

  afterEach(() => {
    clock = clock.uninstall()
  })

  describe('when passed a tracklist', () => {
    it('transforms it', () => {
      expect.assertions(1)
      jest.spyOn(ImageCache, 'findAll').mockImplementation(() => Promise.resolve(mockImageData))

      TransformerTracklist(payload).then(transformedPayload => {
        expect(transformedPayload).toEqual([{ 'track': { 'addedBy': [{ 'user': { '_id': '123', 'fullname': 'Big Rainbowhead' } }], 'album': { 'name': 'London 0 Hull 4', 'uri': 'spotify:album:13gokJcmO1Dbc9cbHM93jO', 'year': '1986' }, 'artist': { 'name': 'The Housemartins', 'uri': 'spotify:artist:77D38RDgCtlYNLpayStftL' }, 'image': 'path/to/image/1', 'length': 145000, 'name': 'Happy Hour', 'uri': 'spotify:track:6IZWJhXyk1Z0rtWNxIi4o7', 'year': '1986' } }, { 'track': { 'addedBy': [{ 'user': { '_id': '456', 'fullname': 'Bigger Rainbowhead' } }], 'album': { 'name': 'Happy Now', 'uri': 'spotify:album:6nAjd2MlBY1f1mNu6BsWLO', 'year': '2018' }, 'artist': { 'name': 'Kygo', 'uri': 'spotify:artist:23fqKkggKUBHNkbKtXEls4' }, 'length': 211000, 'name': 'Happy Now', 'uri': 'spotify:track:14sOS5L36385FJ3OL8hew4', 'year': '2018' } }, { 'track': { 'album': { 'name': 'Eyes Open', 'uri': 'spotify:album:5PYva5C1cdwx2PAsOgZBHN', 'year': '2006' }, 'artist': { 'name': 'Snow Patrol', 'uri': 'spotify:artist:3rIZMv9rysU7JkLzEaC5Jp' }, 'length': 182000, 'name': 'You Could Be Happy', 'uri': 'spotify:track:7zkLcJktbodeRntovGdXQK', 'year': '2006' } }])
      })
    })

    it('catches errors', () => {
      expect.assertions(1)
      TransformerTracklist('something broke')
        .catch(err => {
          expect(err.message).toEqual('json.map is not a function')
        })
    })
  })
})
