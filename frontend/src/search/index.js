import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as mopidyActions from 'actions'
import * as searchActions from 'search/actions'
import SearchSidebar from 'search/components/sidebar'

export const SearchContainer = props => {
  const search = useSelector(state => state.search)
  const curatedList = useSelector(state => state.curatedList)
  const dispatch = useDispatch()

  const onAddTrack = uri => {
    dispatch(searchActions.removeFromSearchResults([uri]))
    dispatch(mopidyActions.addNewTrack(uri))
  }

  const onAddTracks = uris => {
    dispatch(mopidyActions.addNewTracks(uris))
    dispatch(searchActions.clearMix())
  }

  const onAddTrackToMix = track => {
    if (curatedList.tracks.length < 5) {
      dispatch(searchActions.removeFromSearchResults([track.uri]))
      dispatch(searchActions.addTrackToMix(track))
    }
  }

  const onRemoveFromMix = uri => {
    dispatch(searchActions.removeFromMix(uri))
    onSearch()
  }

  const onSwapTracks = (a, b) => {
    dispatch(searchActions.swapTracks(a, b))
  }

  const onSearch = (params = { activePage: 1 }) => {
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
      onSubmit={() => onSearch()}
      onSwapTracks={(a, b) => onSwapTracks(a, b)}
      onAddTrack={uri => onAddTrack(uri)}
      onAddTracks={uris => onAddTracks(uris)}
      onAddTrackToMix={track => onAddTrackToMix(track)}
      onRemoveFromMix={uri => onRemoveFromMix(uri)}
      onQueryChange={evt => dispatch(searchActions.storeSearchQuery(evt.target.value))}
      onPageChange={(_, data) => onSearch(data)}
      results={search.results}
      curatedList={curatedList.tracks}
      totalPages={Math.round(search.total / search.limit)}
      query={search.query}
    >
      {props.children}
    </SearchSidebar>
  )
}

export default SearchContainer
