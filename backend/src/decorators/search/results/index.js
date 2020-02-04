import TransformTrack from 'decorators/mopidy/track'

const SearchResults = (json) => {
  return json.map(track => {
    if (track.explicit) return null
    return TransformTrack(track)
  }).filter((track) => track)
}

export default SearchResults
