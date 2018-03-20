import TransformerTrack from './index'
import fs from 'fs'

describe('TransformerTrack', () => {
  const payload = JSON.parse(fs.readFileSync('./src/__mockData__/tracklist.json', 'utf8'))

  describe('when passed the full album track', () => {
    it('transforms the track', () => {
      const albumTrack = payload[0]

      expect(TransformerTrack(albumTrack)).toEqual({
        track: {
          uri: 'spotify:track:1yzSSn5Sj1azuo7RgwvDb3',
          name: 'No Time for Caution',
          year: '2014',
          length: 246000,
          album: {
            uri: 'spotify:album:5OVGwMCexoHavOar6v4al5',
            name: 'Interstellar: Original Motion Picture Soundtrack (Deluxe Digital Version)',
            year: '2014'
          },
          artist: {
            uri: 'spotify:artist:0YC192cP3KPCRWx8zr8MfZ',
            name: 'Hans Zimmer'
          }
        }
      })
    })
  })

  describe('when passed the full composer track', () => {
    it('transforms the track', () => {
      const composerTrack = payload[1]

      expect(TransformerTrack(composerTrack)).toEqual({
        track: {
          uri: 'local:track:Soundtracks/Silent%20Running%20OST/Silent%20Running%20',
          name: 'Silent Running',
          length: 123973,
          genre: 'Soundtrack',
          composer: {
            uri: 'local:artist:md5:af20b04e7ff55f56afec2be1f36afe94',
            name: 'Peter Schickele'
          },
          artist: {
            uri: 'local:artist:md5:23327ccea5c999183cc88701751f8c73',
            name: 'Joan Baez'
          }
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
