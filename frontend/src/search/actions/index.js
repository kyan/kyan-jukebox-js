import Search from 'search/constants'

export const toggleSearchSidebar = (open) => {
  return {
    type: Search.TOGGLE_SEARCH_SIDEBAR,
    open
  }
}

export const storeSearchResults = (results) => {
  return {
    type: Search.STORE_SEARCH_RESULTS,
    results
  }
}

export const storeSearchQuery = (query) => {
  return {
    type: Search.STORE_SEARCH_QUERY,
    query
  }
}

export const search = (query, options) => {
  return {
    type: Search.SEARCH,
    key: Search.SEARCH_GET_TRACKS,
    params: { query, options }
  }
}

export const removeFromSearchResults = (uri) => {
  return {
    type: Search.REMOVE_FROM_SEARCH_RESULTS,
    uri
  }
}
