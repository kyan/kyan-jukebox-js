import SearchConst from 'constants/search'
import DecorateSearchResults from 'decorators/search/results'

const SearchDecorator = {
  parse: (headers, data) => {
    return new Promise((resolve) => {
      const { key } = headers

      switch (key) {
        case SearchConst.SEARCH_GET_TRACKS:
          const searchResults = data
          const searchTracks = DecorateSearchResults(data.tracks.items)
          searchResults.tracks.items = searchTracks
          return resolve(searchResults)
        default:
          return resolve(`skippedSearchDecoratorDecoration: ${key}`)
      }
    })
  }
}

export default SearchDecorator
