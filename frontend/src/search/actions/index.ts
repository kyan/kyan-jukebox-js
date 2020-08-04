import Search from 'search/constants'

export const toggleSearchSidebar = (open: boolean) => {
  return {
    type: Search.TOGGLE_SEARCH_SIDEBAR,
    open
  }
}

export const storeSearchResults = (results: any[]) => {
  return {
    type: Search.STORE_SEARCH_RESULTS,
    results
  }
}

export const storeSearchQuery = (query: string | null) => {
  return {
    type: Search.STORE_SEARCH_QUERY,
    query
  }
}

export const search = (query: string, options: any) => {
  return {
    type: Search.SEARCH,
    key: Search.SEARCH_GET_TRACKS,
    params: { query, options }
  }
}

export const removeFromSearchResults = (uris: string[]) => {
  return {
    type: Search.REMOVE_FROM_SEARCH_RESULTS,
    uris
  }
}

export const addTrackToMix = (track: any) => {
  return {
    type: Search.ADD_TRACK_TO_MIX,
    track
  }
}

export const removeFromMix = (uri: string) => {
  return {
    type: Search.REMOVE_TRACK_FROM_MIX,
    uri
  }
}

export const swapTracks = (a: number, b: number) => {
  return {
    type: Search.SWAP_TRACKS,
    a,
    b
  }
}

export const clearMix = () => {
  return {
    type: Search.CLEAR_MIX
  }
}
