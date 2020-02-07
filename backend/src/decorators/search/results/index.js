import TransformTrack from 'decorators/mopidy/track'

const SearchResults = (json) => {
  return json.map(track => {
    // You can decorate the search data here
    return TransformTrack(track)
  }).filter((track) => track)
}

export default SearchResults
