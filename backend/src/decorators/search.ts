import SearchConst from '../constants/search'
import DecorateSearchResults from '../decorators/result'
import { PayloadInterface } from '../utils/payload'
import { JBTrackInterface, JBTrackPayloadInterface } from '../models/track'

const SearchDecorator = {
  parse: (
    headers: PayloadInterface,
    data: SpotifyApi.SearchResponse
  ): Promise<SpotifyApi.PagingObject<JBTrackPayloadInterface> | string> =>
    new Promise((resolve) => {
      const { key } = headers
      const searchResults = data as any

      switch (key) {
        case SearchConst.SEARCH_GET_TRACKS: {
          const tracks = searchResults.tracks.items as JBTrackInterface[]

          return DecorateSearchResults(tracks).then((data_1) => {
            searchResults.tracks.items = data_1
            resolve(searchResults as SpotifyApi.PagingObject<JBTrackPayloadInterface>)
          })
        }
        default: {
          resolve(`skippedSearchDecoratorDecoration: ${key}`)
        }
      }
    })
}

export default SearchDecorator
