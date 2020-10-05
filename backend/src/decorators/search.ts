import SearchConst from '../constants/search'
import DecorateSearchResults from '../decorators/result'
import Payload from '../utils/payload'
import { JBTrack } from '../models/track'

interface JBSearchResults {
  limit: number
  offset: number
  total: number
  tracks: JBTrack[]
}

const SearchDecorator = {
  parse: (
    headers: Payload,
    data: SpotifyApi.SearchResponse
  ): Promise<JBSearchResults | string> =>
    new Promise((resolve) => {
      const { key } = headers

      switch (key) {
        case SearchConst.SEARCH_GET_TRACKS: {
          return DecorateSearchResults(data.tracks.items).then((tracks) => {
            const results = {
              limit: data.tracks.limit,
              offset: data.tracks.offset,
              total: data.tracks.total,
              tracks: tracks
            }

            resolve(results)
          })
        }
        default: {
          resolve(`skippedSearchDecoratorDecoration: ${key}`)
        }
      }
    })
}

export default SearchDecorator
