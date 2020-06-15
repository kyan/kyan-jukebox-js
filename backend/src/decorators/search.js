import SearchConst from '../constants/search'
import DecorateSearchResults from '../decorators/result'

const SearchDecorator = {
  parse: (headers, data) => {
    return new Promise((resolve) => {
      const { key } = headers

      switch (key) {
        case SearchConst.SEARCH_GET_TRACKS:
          const searchResults = data

          return DecorateSearchResults(data.tracks.items)
            .then((data) => {
              searchResults.tracks.items = data
              return resolve(searchResults)
            })
        default:
          return resolve(`skippedSearchDecoratorDecoration: ${key}`)
      }
    })
  }
}

export default SearchDecorator
