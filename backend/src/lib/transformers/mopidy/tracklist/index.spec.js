import TransformerTracklist from './index'
import fs from 'fs'
import lolex from 'lolex'

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
      expect(TransformerTracklist(payload)).toEqual([
        {
          track: {
            album: {
              name: 'Interstellar: Original Motion Picture Soundtrack (Deluxe Digital Version)',
              uri: 'spotify:album:5OVGwMCexoHavOar6v4al5',
              year: '2014'
            },
            artist: {
              name: 'Hans Zimmer',
              uri: 'spotify:artist:0YC192cP3KPCRWx8zr8MfZ'
            },
            length: 246000,
            start_time: 246000,
            name: 'No Time for Caution',
            uri: 'spotify:track:1yzSSn5Sj1azuo7RgwvDb3',
            year: '2014'
          }
        },
        {
          track: {
            artist: {
              name: 'Joan Baez',
              uri: 'local:artist:md5:23327ccea5c999183cc88701751f8c73'
            },
            composer: {
              name: 'Peter Schickele',
              uri: 'local:artist:md5:af20b04e7ff55f56afec2be1f36afe94'
            },
            genre: 'Soundtrack',
            length: 123973,
            start_time: 369973,
            name: 'Silent Running',
            uri: 'local:track:Soundtracks/Silent%20Running%20OST/Silent%20Running%20'
          }
        }
      ])
    })
  })
})
