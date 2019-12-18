import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as mopidyActions from 'actions'
import * as searchActions from 'search/actions'
import SearchSidebar from 'search/components/sidebar'

export const SearchContainer = (props) => {
  const search = useSelector(state => state.search)
  const dispatch = useDispatch()

  const onAddTrack = (uri) => {
    dispatch(searchActions.removeFromSearchResults(uri))
    dispatch(mopidyActions.addNewTrack(uri))
  }

  const onSearch = (params) => {
    const searchOptions = {
      offset: (params.activePage - 1) * search.limit,
      limit: search.limit
    }
    dispatch(searchActions.search(search.query, searchOptions))
  }

  return (
    <SearchSidebar
      visible={search.searchSideBarOpen}
      onClose={() => dispatch(searchActions.toggleSearchSidebar(false))}
      onSubmit={() => onSearch({ activePage: 1 })}
      onAddTrack={(uri) => onAddTrack(uri)}
      onQueryChange={(evt) => dispatch(searchActions.storeSearchQuery(evt.target.value))}
      onPageChange={(_, data) => onSearch(data)}
      results={search.results}
      totalPages={Math.round(search.total / search.limit)}
    >
      { props.children }
    </SearchSidebar>
  )
}

export default SearchContainer
