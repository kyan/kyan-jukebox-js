import SearchResults from './index'
import fs from 'fs'
import lolex from 'lolex'

describe('SearchResults', () => {
  let clock
  const payload = JSON.parse(fs.readFileSync('./src/__mockData__/searchResults.json', 'utf8'))

  beforeEach(() => {
    clock = lolex.install()
  })

  afterEach(() => {
    clock = clock.uninstall()
  })

  describe('when passed a tracklist of varying data', () => {
    it('transforms it', () => {
      expect(SearchResults(payload.tracks.items)).toEqual([{ 'track': { 'album': { 'name': 'Ken Dodd', 'uri': 'spotify:album:1D7E2EHMoQM3nP9drEwv7o', 'year': undefined }, 'artist': { 'name': 'Ken Dodd', 'uri': 'spotify:artist:76o4kCpWMmBGl8jIYfRHTk' }, 'image': 'https://i.scdn.co/image/ab67616d0000b2731ea0a21d873289c511dfaf92', 'length': 120066, 'name': 'Happiness', 'uri': 'spotify:track:1WaBuuaXGwrU4sFvxAjnkf' } }, { 'track': { 'album': { 'name': 'Ken Dodd - His Greatest Hits', 'uri': 'spotify:album:59TyQORxcvy9RWj7gkZMvB', 'year': undefined }, 'artist': { 'name': 'Ken Dodd', 'uri': 'spotify:artist:76o4kCpWMmBGl8jIYfRHTk' }, 'explicit': true, 'image': 'https://i.scdn.co/image/ab67616d0000b27368b6e0998ac2c1726839bdcd', 'length': 120066, 'name': 'Happiness', 'uri': 'spotify:track:6idaUJ1KK1mWyxQziMefhU' } }, { 'track': { 'album': { 'name': 'Ken Dodd', 'uri': 'spotify:album:1D7E2EHMoQM3nP9drEwv7o', 'year': undefined }, 'artist': { 'name': 'Ken Dodd', 'uri': 'spotify:artist:76o4kCpWMmBGl8jIYfRHTk' }, 'image': 'https://i.scdn.co/image/ab67616d0000b2731ea0a21d873289c511dfaf92', 'length': 163026, 'name': 'Love Me with All Your Heart (Cuando Calienta El Sol)', 'uri': 'spotify:track:7bqfZygxuq03hqffjswjCK' } }])
    })
  })
})
