import TransformerTrack from './index'
import fs from 'fs'

describe('TransformerTrack', () => {
  const payload = JSON.parse(fs.readFileSync('./src/__mockData__/tracklist.json', 'utf8'))

  describe('when passed a Mopidy payload', () => {
    it('transforms the track', () => {
      const albumTrack = payload[0]
      albumTrack.addedBy = 'duncan'
      albumTrack.metrics = 'metrics'
      albumTrack.image = 'http://path/to/image'

      expect(TransformerTrack(albumTrack)).toEqual({
        track: {
          addedBy: 'duncan',
          metrics: 'metrics',
          album: {
            name: 'London 0 Hull 4',
            uri: 'spotify:album:13gokJcmO1Dbc9cbHM93jO',
            year: '1986'
          },
          artist: {
            name: 'The Housemartins',
            uri: 'spotify:artist:77D38RDgCtlYNLpayStftL'
          },
          image: 'http://path/to/image',
          length: 145000,
          name: 'Happy Hour',
          uri: 'spotify:track:6IZWJhXyk1Z0rtWNxIi4o7',
          year: '1986'
        }
      })
    })

    it('can handle no album', () => {
      const albumTrack = payload[0]
      albumTrack.album = undefined

      expect(TransformerTrack(albumTrack)).toEqual({
        track: {
          addedBy: 'duncan',
          metrics: 'metrics',
          artist: {
            name: 'The Housemartins',
            uri: 'spotify:artist:77D38RDgCtlYNLpayStftL'
          },
          image: 'http://path/to/image',
          length: 145000,
          name: 'Happy Hour',
          uri: 'spotify:track:6IZWJhXyk1Z0rtWNxIi4o7',
          year: '1986'
        }
      })
    })
  })

  describe('when passed a Spotify payload', () => {
    it('transforms the track', () => {
      const payload = JSON.parse(fs.readFileSync('./src/__mockData__/searchResults.json', 'utf8')).tracks.items
      const track = payload[1]

      expect(TransformerTrack(track)).toEqual({
        'track': {
          'album': {
            'name': 'Ken Dodd - His Greatest Hits',
            'uri': 'spotify:album:59TyQORxcvy9RWj7gkZMvB',
            'year': undefined
          },
          'artist': {
            'name': 'Ken Dodd',
            'uri': 'spotify:artist:76o4kCpWMmBGl8jIYfRHTk'
          },
          'image': 'https://i.scdn.co/image/ab67616d0000b27368b6e0998ac2c1726839bdcd',
          'length': 120066,
          'name':
          'Happiness',
          'uri': 'spotify:track:6idaUJ1KK1mWyxQziMefhU'
        }
      })
    })
  })

  describe('when passed no track', () => {
    it('returns an empty track', () => {
      expect(TransformerTrack(null)).toEqual({
        track: null
      })
    })
  })
})
