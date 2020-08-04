import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as mopidyActions from 'actions'
import * as searchActions from 'search/actions'
import SearchSidebar from 'search/components/sidebar'
import { SearchState } from './reducers/search'
import { CurateState } from './reducers/curated-list'

interface RootState {
  search: SearchState
  curatedList: CurateState
}

const selectSearch = (state: RootState) => state.search
const selectCuratedList = (state: RootState) => state.curatedList

export const SearchContainer: React.FC = props => {
  const search = useSelector(selectSearch)
  const curatedList = useSelector(selectCuratedList)
  const dispatch = useDispatch()

  const onAddTrack = (uri: string) => {
    dispatch(searchActions.removeFromSearchResults([uri]))
    dispatch(mopidyActions.addNewTrack(uri))
  }

  const onAddTracks = (uris: string[]) => {
    dispatch(mopidyActions.addNewTracks(uris))
    dispatch(searchActions.clearMix())
  }

  const onAddTrackToMix = (track: any) => {
    if (curatedList.tracks.length < 5) {
      dispatch(searchActions.removeFromSearchResults([track.uri]))
      dispatch(searchActions.addTrackToMix(track))
    }
  }

  const onRemoveFromMix = (uri: string) => {
    dispatch(searchActions.removeFromMix(uri))
    onSearch()
  }

  const onSwapTracks = (a: number, b: number) => {
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
      onSwapTracks={onSwapTracks}
      onAddTrack={onAddTrack}
      onAddTracks={onAddTracks}
      onAddTrackToMix={onAddTrackToMix}
      onRemoveFromMix={onRemoveFromMix}
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
