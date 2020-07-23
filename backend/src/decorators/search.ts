import SearchConst from '../constants/search'
import DecorateSearchResults from '../decorators/result'
import { PayloadInterface } from '../utils/payload'

const SearchDecorator = {
  parse: (headers: PayloadInterface, data: any) =>
    new Promise((resolve) => {
      const { key } = headers
      const searchResults = data

      switch (key) {
        case SearchConst.SEARCH_GET_TRACKS:
          return DecorateSearchResults(data.tracks.items).then((data) => {
            searchResults.tracks.items = data
            resolve(searchResults)
          })
        default:
          resolve(`skippedSearchDecoratorDecoration: ${key}`)
      }
    })
}

export default SearchDecorator
